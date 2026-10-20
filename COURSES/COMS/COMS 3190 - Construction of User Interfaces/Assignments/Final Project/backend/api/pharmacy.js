const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");
const auth = require("./auth");

const router = express.Router();

function medicationsCollection(db) {
  return db.collection(process.env.MEDICATIONS_COLLECTION || "medications");
}

function assignmentsCollection(db) {
  return db.collection(process.env.MEDICINE_ASSIGNMENTS_COLLECTION || "medicineAssignments");
}

function validObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function canManagePharmacy(user) {
  const role = auth.normalizeRole(user?.role);
  return role === "pharmacist" || role === "admin";
}

function requirePharmacyManager(req, res, next) {
  //pharmacists run this area, admins can help fix stuff too
  if (!canManagePharmacy(req.user)) {
    return res.status(403).json({ message: "Pharmacist access is required." });
  }

  next();
}

function canPrescribe(user) {
  const role = auth.normalizeRole(user?.role);
  return role === "doctor" || role === "pharmacist" || role === "admin";
}

function requirePrescriber(req, res, next) {
  // doctors can prescribe, pharmacists and admins can still help manage this data
  if (!canPrescribe(req.user)) {
    return res.status(403).json({ message: "Doctor access is required." });
  }

  next();
}

function appointmentsCollection(db) {
  return db.collection(process.env.APPOINTMENTS_COLLECTION || "appointments");
}

function notificationsCollection(db) {
  return db.collection(process.env.NOTIFICATIONS_COLLECTION || "notifications");
}

async function doctorCanTreatPatient(db, doctorId, patientId) {
  // keeps doctors from prescribing to random patients with no appointment history
  const appointment = await appointmentsCollection(db).findOne({
    doctorId,
    patientId,
    status: { $in: ["pending", "scheduled"] },
  });

  return Boolean(appointment);
}

async function notifyPrescription(db, patientId, medication, doctorName) {
  // patient dashboard already shows notifications, so prescriptions should use it too
  await notificationsCollection(db).insertOne({
    userId: patientId,
    message: `Dr. ${doctorName} prescribed ${medication.name} ${medication.strength}.`,
    type: "prescription",
    read: false,
    createdAt: new Date(),
  });
}

function cleanMedication(body) {
  //only save the fields the pharmacy page is allowed to edit
  return {
    name: String(body.name || "").trim(),
    strength: String(body.strength || "").trim(),
    dosageForm: String(body.dosageForm || "").trim(),
    directions: String(body.directions || "").trim(),
    category: String(body.category || "").trim(),
    stock: Number(body.stock || 0),
    price: Number(body.price || 0),
    isGeneric: Boolean(body.isGeneric),
    active: body.active === undefined ? true : Boolean(body.active),
  };
}

function publicMedication(medication, assignment = null) {
  return {
    id: medication._id.toString(),
    name: medication.name,
    strength: medication.strength || "",
    dosageForm: medication.dosageForm || "",
    directions: assignment?.directions || medication.directions || "",
    category: medication.category || "",
    stock: medication.stock || 0,
    price: medication.price || 0,
    isGeneric: Boolean(medication.isGeneric),
    active: medication.active !== false,
    access: assignment ? "assigned" : "generic",
    assignmentId: assignment?._id?.toString() || "",
    assignedDosage: assignment?.dosage || "",
    assignedNotes: assignment?.notes || "",
    createdAt: medication.createdAt,
    updatedAt: medication.updatedAt,
  };
}

function publicAssignment(assignment) {
  return {
    id: assignment._id.toString(),
    patientId: assignment.patientId.toString(),
    medicationId: assignment.medicationId.toString(),
    patientName: assignment.patient?.name || "",
    patientEmail: assignment.patient?.email || "",
    medicationName: assignment.medication?.name || "",
    dosage: assignment.dosage || "",
    directions: assignment.directions || "",
    notes: assignment.notes || "",
    status: assignment.status || "active",
    createdAt: assignment.createdAt,
    updatedAt: assignment.updatedAt,
  };
}

router.use(auth.requireAuth);

router.get("/medications", async (req, res, next) => {
  try {
    const db = await getDb();
    const meds = medicationsCollection(db);

    if (canManagePharmacy(req.user)) {
      const medications = await meds.find({}).sort({ name: 1 }).toArray();
      return res.json({ medications: medications.map((medication) => publicMedication(medication)) });
    }

    if (auth.normalizeRole(req.user?.role) !== "patient") {
      return res.status(403).json({ message: "Patient or pharmacist access is required." });
    }

    const patientId = req.user._id;
    const assignments = await assignmentsCollection(db)
      .find({ patientId, status: "active" })
      .toArray();
    const assignedIds = assignments.map((assignment) => assignment.medicationId);
    const assignmentByMedicationId = new Map(
      assignments.map((assignment) => [assignment.medicationId.toString(), assignment])
    );

    const medications = await meds
      .find({
        active: true,
        $or: [{ isGeneric: true }, { _id: { $in: assignedIds } }],
      })
      .sort({ isGeneric: -1, name: 1 })
      .toArray();

    res.json({
      medications: medications.map((medication) =>
        publicMedication(medication, assignmentByMedicationId.get(medication._id.toString()))
      ),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/medications", requirePharmacyManager, async (req, res, next) => {
  try {
    const medication = cleanMedication(req.body);

    if (!medication.name || !medication.strength || !medication.dosageForm) {
      return res.status(400).json({ message: "Name, strength, and form are required." });
    }

    if (!Number.isFinite(medication.stock) || medication.stock < 0) {
      return res.status(400).json({ message: "Stock must be zero or higher." });
    }

    if (!Number.isFinite(medication.price) || medication.price < 0) {
      return res.status(400).json({ message: "Price must be zero or higher." });
    }

    const now = new Date();
    const document = {
      ...medication,
      createdBy: req.user._id,
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDb();
    const result = await medicationsCollection(db).insertOne(document);
    res.status(201).json({ medication: publicMedication({ ...document, _id: result.insertedId }) });
  } catch (error) {
    next(error);
  }
});

router.put("/medications/:id", requirePharmacyManager, async (req, res, next) => {
  try {
    const medicationId = validObjectId(req.params.id);

    if (!medicationId) {
      return res.status(400).json({ message: "Invalid medication id." });
    }

    const update = cleanMedication(req.body);

    if (!update.name || !update.strength || !update.dosageForm) {
      return res.status(400).json({ message: "Name, strength, and form are required." });
    }

    if (!Number.isFinite(update.stock) || update.stock < 0) {
      return res.status(400).json({ message: "Stock must be zero or higher." });
    }

    if (!Number.isFinite(update.price) || update.price < 0) {
      return res.status(400).json({ message: "Price must be zero or higher." });
    }

    update.updatedAt = new Date();

    const db = await getDb();
    const medication = await medicationsCollection(db).findOneAndUpdate(
      { _id: medicationId },
      { $set: update },
      { returnDocument: "after" }
    );

    if (!medication) {
      return res.status(404).json({ message: "Medication not found." });
    }

    res.json({ medication: publicMedication(medication) });
  } catch (error) {
    next(error);
  }
});

router.delete("/medications/:id", requirePharmacyManager, async (req, res, next) => {
  try {
    const medicationId = validObjectId(req.params.id);

    if (!medicationId) {
      return res.status(400).json({ message: "Invalid medication id." });
    }

    const db = await getDb();
    const result = await medicationsCollection(db).updateOne(
      { _id: medicationId },
      { $set: { active: false, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Medication not found." });
    }

    await assignmentsCollection(db).updateMany(
      { medicationId },
      { $set: { status: "inactive", updatedAt: new Date() } }
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/patients", requirePharmacyManager, async (req, res, next) => {
  try {
    const db = await getDb();
    const patients = await auth
      .usersCollection(db)
      .find({ role: "patient" }, { projection: { passwordHash: 0 } })
      .sort({ name: 1 })
      .toArray();

    res.json({ patients: patients.map(auth.publicUser) });
  } catch (error) {
    next(error);
  }
});

router.get("/assignments", requirePharmacyManager, async (req, res, next) => {
  try {
    const db = await getDb();
    const assignments = await assignmentsCollection(db)
      .aggregate([
        { $match: { status: "active" } },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: process.env.USERS_COLLECTION || "users",
            localField: "patientId",
            foreignField: "_id",
            as: "patient",
          },
        },
        {
          $lookup: {
            from: process.env.MEDICATIONS_COLLECTION || "medications",
            localField: "medicationId",
            foreignField: "_id",
            as: "medication",
          },
        },
        { $unwind: "$patient" },
        { $unwind: "$medication" },
      ])
      .toArray();

    res.json({ assignments: assignments.map(publicAssignment) });
  } catch (error) {
    next(error);
  }
});

router.post("/assignments", requirePharmacyManager, async (req, res, next) => {
  try {
    const patientId = validObjectId(req.body.patientId);
    const medicationId = validObjectId(req.body.medicationId);

    if (!patientId || !medicationId) {
      return res.status(400).json({ message: "Patient and medication are required." });
    }

    const dosage = String(req.body.dosage || "").trim();
    const directions = String(req.body.directions || "").trim();
    const notes = String(req.body.notes || "").trim();

    if (!dosage || !directions) {
      return res.status(400).json({ message: "Dosage and directions are required." });
    }

    const db = await getDb();
    const patient = await auth.usersCollection(db).findOne({ _id: patientId, role: "patient" });
    const medication = await medicationsCollection(db).findOne({ _id: medicationId, active: true });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    if (!medication) {
      return res.status(404).json({ message: "Medication not found." });
    }

    const now = new Date();
    const document = {
      patientId,
      medicationId,
      assignedBy: req.user._id,
      dosage,
      directions,
      notes,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    await assignmentsCollection(db).updateMany(
      { patientId, medicationId, status: "active" },
      { $set: { status: "inactive", updatedAt: now } }
    );

    const result = await assignmentsCollection(db).insertOne(document);
    res.status(201).json({
      assignment: publicAssignment({
        ...document,
        _id: result.insertedId,
        patient,
        medication,
      }),
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/assignments/:id", requirePharmacyManager, async (req, res, next) => {
  try {
    const assignmentId = validObjectId(req.params.id);

    if (!assignmentId) {
      return res.status(400).json({ message: "Invalid assignment id." });
    }

    const db = await getDb();
    const result = await assignmentsCollection(db).updateOne(
      { _id: assignmentId },
      { $set: { status: "inactive", updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/prescription-medications", requirePrescriber, async (req, res, next) => {
  try {
    const db = await getDb();

    // doctors prescribe from the active medication list that pharmacy manages
    const medications = await medicationsCollection(db)
      .find({ active: true })
      .sort({ name: 1 })
      .toArray();

    res.json({ medications: medications.map((medication) => publicMedication(medication)) });
  } catch (error) {
    next(error);
  }
});

router.get("/prescriptions", requirePrescriber, async (req, res, next) => {
  try {
    const db = await getDb();
    const role = auth.normalizeRole(req.user.role);

    // doctors only see prescriptions they wrote, pharmacy managers can see all
    const match = role === "doctor"
      ? { assignedBy: req.user._id, status: "active" }
      : { status: "active" };

    const prescriptions = await assignmentsCollection(db)
      .aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: process.env.USERS_COLLECTION || "users",
            localField: "patientId",
            foreignField: "_id",
            as: "patient",
          },
        },
        {
          $lookup: {
            from: process.env.MEDICATIONS_COLLECTION || "medications",
            localField: "medicationId",
            foreignField: "_id",
            as: "medication",
          },
        },
        { $unwind: "$patient" },
        { $unwind: "$medication" },
      ])
      .toArray();

    res.json({ prescriptions: prescriptions.map(publicAssignment) });
  } catch (error) {
    next(error);
  }
});

router.post("/prescriptions", requirePrescriber, async (req, res, next) => {
  try {
    const patientId = validObjectId(req.body.patientId);
    const medicationId = validObjectId(req.body.medicationId);
    const dosage = String(req.body.dosage || "").trim();
    const directions = String(req.body.directions || "").trim();
    const notes = String(req.body.notes || "").trim();

    if (!patientId || !medicationId) {
      return res.status(400).json({ message: "Patient and medication are required." });
    }

    if (!dosage || !directions) {
      return res.status(400).json({ message: "Dosage and directions are required." });
    }

    const db = await getDb();
    const role = auth.normalizeRole(req.user.role);
    const patient = await auth.usersCollection(db).findOne({ _id: patientId, role: "patient" });
    const medication = await medicationsCollection(db).findOne({ _id: medicationId, active: true });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    if (!medication) {
      return res.status(404).json({ message: "Medication not found." });
    }

    if (role === "doctor") {
      const allowed = await doctorCanTreatPatient(db, req.user._id, patientId);

      if (!allowed) {
        return res.status(403).json({ message: "You can only prescribe to your own patients." });
      }
    }

    const now = new Date();
    const document = {
      patientId,
      medicationId,
      assignedBy: req.user._id,
      dosage,
      directions,
      notes,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    // replace an older active prescription for the same patient and medication
    await assignmentsCollection(db).updateMany(
      { patientId, medicationId, status: "active" },
      { $set: { status: "inactive", updatedAt: now } }
    );

    const result = await assignmentsCollection(db).insertOne(document);
    await notifyPrescription(db, patientId, medication, req.user.name || "Your doctor");

    res.status(201).json({
      prescription: publicAssignment({
        ...document,
        _id: result.insertedId,
        patient,
        medication,
      }),
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/prescriptions/:id", requirePrescriber, async (req, res, next) => {
  try {
    const prescriptionId = validObjectId(req.params.id);

    if (!prescriptionId) {
      return res.status(400).json({ message: "Invalid prescription id." });
    }

    const db = await getDb();
    const role = auth.normalizeRole(req.user.role);
    const query = role === "doctor"
      ? { _id: prescriptionId, assignedBy: req.user._id }
      : { _id: prescriptionId };

    const result = await assignmentsCollection(db).updateOne(
      query,
      { $set: { status: "inactive", updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;