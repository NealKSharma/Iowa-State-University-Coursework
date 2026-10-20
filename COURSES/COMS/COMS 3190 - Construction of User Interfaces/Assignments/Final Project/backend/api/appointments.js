const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");
const auth = require("./auth");

const router = express.Router();

// this file handles the patient appointments page and the doctor portal
function appointmentsCollection(db) {
  return db.collection(process.env.APPOINTMENTS_COLLECTION || "appointments");
}

function availabilityCollection(db) {
  return db.collection(process.env.DOCTOR_AVAILABILITY_COLLECTION || "doctorAvailability");
}

function notificationsCollection(db) {
  return db.collection(process.env.NOTIFICATIONS_COLLECTION || "notifications");
}

function usersCollection(db) {
  return db.collection(process.env.USERS_COLLECTION || "users");
}

function validObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function isDoctor(user) {
  return auth.normalizeRole(user?.role) === "doctor";
}

function isPatient(user) {
  return auth.normalizeRole(user?.role) === "patient";
}

// converts mongodb appointment docs into normal objects for React
function cleanAppointment(appointment) {
  return {
    id: appointment._id.toString(),
    patientId: appointment.patientId.toString(),
    doctorId: appointment.doctorId.toString(),
    patientName: appointment.patientName || "",
    patientEmail: appointment.patientEmail || "",
    doctorName: appointment.doctorName || "",
    doctorEmail: appointment.doctorEmail || "",
    specialization: appointment.specialization || "",
    slotId: appointment.slotId ? appointment.slotId.toString() : "",
    date: appointment.date || "",
    time: appointment.time || "",
    type: appointment.type || "in-person",
    reason: appointment.reason || "",
    comments: appointment.comments || "",
    status: appointment.status || "pending",
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };
}

function cleanDoctor(doctor) {
  return {
    id: doctor._id.toString(),
    name: doctor.name || "Doctor",
    email: doctor.email || "",
    specialization: doctor.specialization || "General Medicine",
  };
}

function cleanSlot(slot) {
  return {
    id: slot._id.toString(),
    doctorId: slot.doctorId.toString(),
    date: slot.date || "",
    time: slot.time || "",
    active: slot.active !== false,
    createdAt: slot.createdAt,
    updatedAt: slot.updatedAt,
  };
}

function cleanPatient(patient) {
  return {
    id: patient._id.toString(),
    name: patient.name || "",
    email: patient.email || "",
    phone: patient.phone || "",
    height: patient.height || "",
    weight: patient.weight || "",
    allergies: patient.allergies || "",
    doctorNotes: patient.doctorNotes || "",
  };
}

// creates the message that shows up on the patient's dashboard
async function createPatientNotification(db, appointment, status) {
  const message =
    status === "scheduled"
      ? `Your appointment with Dr. ${appointment.doctorName} has been scheduled for ${appointment.date} at ${appointment.time}.`
      : `Your appointment request with Dr. ${appointment.doctorName} was rejected.`;

  await notificationsCollection(db).insertOne({
    userId: appointment.patientId,
    message,
    type: "appointment",
    read: false,
    createdAt: new Date(),
  });
}

router.use(auth.requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const db = await getDb();
    const role = auth.normalizeRole(req.user.role);

    // patients see their own visits and doctors see their requests
    const query = role === "doctor" ? { doctorId: req.user._id } : { patientId: req.user._id };

    const appointments = await appointmentsCollection(db)
      .find(query)
      .sort({ date: 1, time: 1 })
      .toArray();

    res.json({ appointments: appointments.map(cleanAppointment) });
  } catch (error) {
    next(error);
  }
});

router.get("/doctors", async (req, res, next) => {
  try {
    const db = await getDb();

    // the appointment page uses this to show all doctors in the system
    const doctors = await usersCollection(db)
      .find({ role: "doctor" }, { projection: { passwordHash: 0 } })
      .sort({ name: 1 })
      .toArray();

    res.json({ doctors: doctors.map(cleanDoctor) });
  } catch (error) {
    next(error);
  }
});

router.get("/availability", async (req, res, next) => {
  try {
    if (!isDoctor(req.user)) {
      return res.status(403).json({ message: "Doctor access is required." });
    }

    const db = await getDb();
    const slots = await availabilityCollection(db)
      .find({ doctorId: req.user._id, active: true })
      .sort({ date: 1, time: 1 })
      .toArray();

    res.json({ slots: slots.map(cleanSlot) });
  } catch (error) {
    next(error);
  }
});

router.post("/availability", async (req, res, next) => {
  try {
    if (!isDoctor(req.user)) {
      return res.status(403).json({ message: "Doctor access is required." });
    }

    const date = String(req.body.date || "").trim();
    const time = String(req.body.time || "").trim();

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required." });
    }

    const db = await getDb();

    // stops duplicate slots like two 9 AM slots on the same day
    const existingSlot = await availabilityCollection(db).findOne({
      doctorId: req.user._id,
      date,
      time,
      active: true,
    });

    if (existingSlot) {
      return res.status(409).json({ message: "That slot already exists." });
    }

    const now = new Date();
    const slot = {
      doctorId: req.user._id,
      doctorName: req.user.name || "",
      date,
      time,
      active: true,
      createdAt: now,
      updatedAt: now,
    };

    const result = await availabilityCollection(db).insertOne(slot);

    res.status(201).json({
      slot: cleanSlot({ ...slot, _id: result.insertedId }),
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/availability/:id", async (req, res, next) => {
  try {
    if (!isDoctor(req.user)) {
      return res.status(403).json({ message: "Doctor access is required." });
    }

    const slotId = validObjectId(req.params.id);

    if (!slotId) {
      return res.status(400).json({ message: "Invalid slot id." });
    }

    const db = await getDb();

    // do not remove a slot if a patient already requested it
    const existingAppointment = await appointmentsCollection(db).findOne({
      slotId,
      status: { $in: ["pending", "scheduled"] },
    });

    if (existingAppointment) {
      return res.status(409).json({ message: "This slot has an appointment request." });
    }

    const result = await availabilityCollection(db).updateOne(
      { _id: slotId, doctorId: req.user._id },
      { $set: { active: false, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Slot not found." });
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/slots/:doctorId", async (req, res, next) => {
  try {
    const doctorId = validObjectId(req.params.doctorId);
    const date = String(req.query.date || "").trim();

    if (!doctorId || !date) {
      return res.status(400).json({ message: "Doctor and date are required." });
    }

    const db = await getDb();
    const doctor = await usersCollection(db).findOne({ _id: doctorId, role: "doctor" });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const slots = await availabilityCollection(db)
      .find({ doctorId, date, active: true })
      .sort({ time: 1 })
      .toArray();

    const slotIds = slots.map((slot) => slot._id);

    // pending and scheduled requests block the slot from other patients
    const bookedAppointments = await appointmentsCollection(db)
      .find({
        slotId: { $in: slotIds },
        status: { $in: ["pending", "scheduled"] },
      })
      .toArray();

    const bookedSlotIds = new Set(bookedAppointments.map((appointment) => appointment.slotId.toString()));

    res.json({
      slots: slots.map((slot) => ({
        id: slot._id.toString(),
        time: slot.time,
        available: !bookedSlotIds.has(slot._id.toString()),
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/patients", async (req, res, next) => {
  try {
    if (!isDoctor(req.user)) {
      return res.status(403).json({ message: "Doctor access is required." });
    }

    const db = await getDb();
    const appointments = await appointmentsCollection(db)
      .find({ doctorId: req.user._id, status: { $in: ["pending", "scheduled"] } })
      .toArray();

    // patients list is based on people who requested or have appointments
    const patientIds = [...new Set(appointments.map((appointment) => appointment.patientId.toString()))]
      .map((id) => new ObjectId(id));

    const patients = patientIds.length
      ? await usersCollection(db)
          .find({ _id: { $in: patientIds }, role: "patient" }, { projection: { passwordHash: 0 } })
          .sort({ name: 1 })
          .toArray()
      : [];

    res.json({ patients: patients.map(cleanPatient) });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!isPatient(req.user)) {
      return res.status(403).json({ message: "Only patients can book appointments." });
    }

    const doctorId = validObjectId(req.body.doctorId);
    const slotId = validObjectId(req.body.slotId);
    const type = String(req.body.type || "in-person").trim();
    const reason = String(req.body.reason || "").trim();
    const comments = String(req.body.comments || "").trim();

    if (!doctorId || !slotId || !reason) {
      return res.status(400).json({ message: "Doctor, time, and reason are required." });
    }

    if (type !== "virtual" && type !== "in-person") {
      return res.status(400).json({ message: "Appointment type must be virtual or in-person." });
    }

    const db = await getDb();
    const doctor = await usersCollection(db).findOne({ _id: doctorId, role: "doctor" });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // patient can only book a slot the doctor actually created
    const slot = await availabilityCollection(db).findOne({
      _id: slotId,
      doctorId,
      active: true,
    });

    if (!slot) {
      return res.status(404).json({ message: "Selected time slot was not found." });
    }

    const taken = await appointmentsCollection(db).findOne({
      slotId,
      status: { $in: ["pending", "scheduled"] },
    });

    if (taken) {
      return res.status(409).json({ message: "That time is no longer available." });
    }

    const now = new Date();
    const appointment = {
      patientId: req.user._id,
      doctorId,
      slotId,
      patientName: req.user.name || "",
      patientEmail: req.user.email || "",
      doctorName: doctor.name || "",
      doctorEmail: doctor.email || "",
      specialization: doctor.specialization || "General Medicine",
      date: slot.date,
      time: slot.time,
      type,
      reason,
      comments,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    const result = await appointmentsCollection(db).insertOne(appointment);

    res.status(201).json({
      appointment: cleanAppointment({ ...appointment, _id: result.insertedId }),
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const appointmentId = validObjectId(req.params.id);
    const status = String(req.body.status || "").trim();

    if (!appointmentId) {
      return res.status(400).json({ message: "Invalid appointment id." });
    }

    if (status !== "scheduled" && status !== "rejected" && status !== "cancelled") {
      return res.status(400).json({ message: "Invalid appointment status." });
    }

    const db = await getDb();
    const appointment = await appointmentsCollection(db).findOne({ _id: appointmentId });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const role = auth.normalizeRole(req.user.role);
    const doctorCanUpdate = role === "doctor" && appointment.doctorId.equals(req.user._id);
    const patientCanCancel = role === "patient" && appointment.patientId.equals(req.user._id) && status === "cancelled";

    if (!doctorCanUpdate && !patientCanCancel) {
      return res.status(403).json({ message: "You cannot update this appointment." });
    }

    if (doctorCanUpdate && appointment.status !== "pending") {
      return res.status(409).json({ message: "Only pending appointments can be approved or rejected." });
    }

    const updatedAt = new Date();

    await appointmentsCollection(db).updateOne(
      { _id: appointmentId },
      { $set: { status, updatedAt } }
    );

    // this is what connects doctor approval to patient dashboard notifications
    if (doctorCanUpdate && (status === "scheduled" || status === "rejected")) {
      await createPatientNotification(db, appointment, status);
    }

    const updated = await appointmentsCollection(db).findOne({ _id: appointmentId });
    res.json({ appointment: cleanAppointment(updated) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;