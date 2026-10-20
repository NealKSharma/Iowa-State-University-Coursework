const bcrypt = require("bcryptjs");
const { getDb } = require("./db");
const { errorLogCollectionName } = require("./errorLog");

function usersCollectionName() {
  return process.env.USERS_COLLECTION || "users";
}

function refreshTokensCollectionName() {
  return process.env.REFRESH_TOKENS_COLLECTION || "refreshTokens";
}

function medicationsCollectionName() {
  return process.env.MEDICATIONS_COLLECTION || "medications";
}

function medicineAssignmentsCollectionName() {
  return process.env.MEDICINE_ASSIGNMENTS_COLLECTION || "medicineAssignments";
}

function notificationsCollectionName() {
  return process.env.NOTIFICATIONS_COLLECTION || "notifications";
}

function appointmentsCollectionName() {
  return process.env.APPOINTMENTS_COLLECTION || "appointments";
}

function doctorAvailabilityCollectionName() {
  return process.env.DOCTOR_AVAILABILITY_COLLECTION || "doctorAvailability";
}

async function ensureCollection(db, name, validator) {
  const exists = await db.listCollections({ name }).hasNext();

  if (!exists) {
    await db.createCollection(name, {
      validator,
      validationLevel: "moderate",
    });
    return;
  }

  await db.command({
    collMod: name,
    validator,
    validationLevel: "moderate",
  });
}

async function initializeDatabase() {
  //this makes the basic mongodb collections when the backend starts.
  const db = await getDb();
  const usersName = usersCollectionName();
  const refreshTokensName = refreshTokensCollectionName();
  const errorLogName = errorLogCollectionName();
  const medicationsName = medicationsCollectionName();
  const medicineAssignmentsName = medicineAssignmentsCollectionName();
  const appointmentsName = appointmentsCollectionName();
  const notificationsName = notificationsCollectionName();
  const doctorAvailabilityName = doctorAvailabilityCollectionName();

  await ensureCollection(db, usersName, {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "role", "passwordHash", "createdAt"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string" },
        role: { enum: ["patient", "doctor", "pharmacist", "admin"] },
        passwordHash: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        height: { bsonType: "string" },
        weight: { bsonType: "string" },
        allergies: { bsonType: "string" },
        doctorNotes: { bsonType: "string" },
        phone: { bsonType: "string" },
        specialization: { bsonType: "string" },
      },
    },
  });

  await ensureCollection(db, refreshTokensName, {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "tokenHash", "createdAt", "expiresAt"],
      properties: {
        userId: { bsonType: "objectId" },
        tokenHash: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        expiresAt: { bsonType: "date" },
      },
    },
  });

  await ensureCollection(db, errorLogName, {
    $jsonSchema: {
      bsonType: "object",
      required: ["message", "source", "severity", "createdAt"],
      properties: {
        message: { bsonType: "string" },
        source: { bsonType: "string" },
        severity: { bsonType: "string" },
        stack: { bsonType: "string" },
        url: { bsonType: "string" },
        method: { bsonType: "string" },
        status: { bsonType: "number" },
        userAgent: { bsonType: "string" },
        userId: { bsonType: ["objectId", "null"] },
        userEmail: { bsonType: "string" },
        context: { bsonType: "object" },
        createdAt: { bsonType: "date" },
      },
    },
  });

  await ensureCollection(db, medicationsName, {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "strength", "dosageForm", "isGeneric", "active", "stock", "price", "createdAt"],
      properties: {
        name: { bsonType: "string" },
        strength: { bsonType: "string" },
        dosageForm: { bsonType: "string" },
        directions: { bsonType: "string" },
        category: { bsonType: "string" },
        stock: { bsonType: "number" },
        price: { bsonType: "number" },
        isGeneric: { bsonType: "bool" },
        active: { bsonType: "bool" },
        createdBy: { bsonType: "objectId" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  });

  await ensureCollection(db, medicineAssignmentsName, {
    $jsonSchema: {
      bsonType: "object",
      required: ["patientId", "medicationId", "assignedBy", "status", "createdAt"],
      properties: {
        patientId: { bsonType: "objectId" },
        medicationId: { bsonType: "objectId" },
        assignedBy: { bsonType: "objectId" },
        dosage: { bsonType: "string" },
        directions: { bsonType: "string" },
        notes: { bsonType: "string" },
        status: { enum: ["active", "inactive"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  });

  await ensureCollection(db, notificationsName, {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "message", "type", "read", "createdAt"],
      properties: {
        userId: { bsonType: "objectId" },
        message: { bsonType: "string" },
        type: { bsonType: "string" },
        read: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
      },
    },
  });

  await ensureCollection(db, appointmentsName, {
    $jsonSchema: {
      bsonType: "object",
      required: ["patientId", "doctorId", "slotId", "date", "time", "type", "reason", "status", "createdAt"],
      properties: {
        patientId: { bsonType: "objectId" },
        doctorId: { bsonType: "objectId" },
        slotId: { bsonType: "objectId" },
        patientName: { bsonType: "string" },
        patientEmail: { bsonType: "string" },
        doctorName: { bsonType: "string" },
        doctorEmail: { bsonType: "string" },
        specialization: { bsonType: "string" },
        date: { bsonType: "string" },
        time: { bsonType: "string" },
        type: { enum: ["virtual", "in-person"] },
        reason: { bsonType: "string" },
        comments: { bsonType: "string" },
        status: { enum: ["pending", "scheduled", "rejected", "cancelled"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  });

  await ensureCollection(db, doctorAvailabilityName, {
    $jsonSchema: {
      bsonType: "object",
      required: ["doctorId", "date", "time", "active", "createdAt"],
      properties: {
        doctorId: { bsonType: "objectId" },
        doctorName: { bsonType: "string" },
        date: { bsonType: "string" },
        time: { bsonType: "string" },
        active: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  });

  //email should be unique even if capitalization is different.
  await db.collection(usersName).createIndex(
    { email: 1 },
    {
      unique: true,
      collation: { locale: "en", strength: 2 },
    }
  );

  await db.collection(usersName).createIndex({ role: 1 });

  await db.collection(refreshTokensName).createIndex({ tokenHash: 1 }, { unique: true });
  await db.collection(refreshTokensName).createIndex({ userId: 1 });

  //mongodb will automatically remove old refresh tokens after expiresAt.
  await db.collection(refreshTokensName).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await db.collection(errorLogName).createIndex({ createdAt: -1 });
  await db.collection(errorLogName).createIndex({ source: 1 });
  await db.collection(errorLogName).createIndex({ severity: 1 });
  await db.collection(medicationsName).createIndex({ active: 1, isGeneric: 1, name: 1 });
  await db.collection(medicationsName).createIndex({ name: 1 });
  await db.collection(medicineAssignmentsName).createIndex({ patientId: 1, status: 1 });
  await db.collection(medicineAssignmentsName).createIndex({ medicationId: 1, status: 1 });

  await db.collection(notificationsName).createIndex({ userId: 1, read: 1 });
  await db.collection(notificationsName).createIndex({ createdAt: -1 });
  await db.collection(appointmentsName).createIndex({ patientId: 1, status: 1, date: 1 });
  await db.collection(appointmentsName).createIndex({ doctorId: 1, status: 1, date: 1 });
  await db.collection(appointmentsName).createIndex({ slotId: 1, status: 1 });
  await db.collection(doctorAvailabilityName).createIndex({ doctorId: 1, date: 1, time: 1 });
  await db.collection(doctorAvailabilityName).createIndex({ doctorId: 1, active: 1, date: 1 });

  await ensureDefaultAdmin(db.collection(usersName));

  return {
    usersCollection: usersName,
    refreshTokensCollection: refreshTokensName,
    errorLogCollection: errorLogName,
    medicationsCollection: medicationsName,
    medicineAssignmentsCollection: medicineAssignmentsName,
    notificationsCollection: notificationsName,
    appointmentsCollection: appointmentsName,
    doctorAvailabilityCollection: doctorAvailabilityName,
  };
}

async function ensureDefaultAdmin(usersCollection) {
  //this creates one basic admin user if there are no admins yet.
  const existingAdmin = await usersCollection.findOne({ role: "admin" });

  if (existingAdmin) {
    return;
  }

  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin1234";

  if (adminPassword.length < 8) {
    throw new Error("DEFAULT_ADMIN_PASSWORD must be at least 8 characters");
  }

  const now = new Date();
  const adminUser = {
    name: process.env.DEFAULT_ADMIN_NAME || "Admin",
    email: (process.env.DEFAULT_ADMIN_EMAIL || "admin@test.com").trim().toLowerCase(),
    role: "admin",
    passwordHash: await bcrypt.hash(adminPassword, 12),
    createdAt: now,
    updatedAt: now,
  };

  await usersCollection.insertOne(adminUser);
  console.log(`Default admin ready: ${adminUser.email}`);
}

module.exports = { initializeDatabase };