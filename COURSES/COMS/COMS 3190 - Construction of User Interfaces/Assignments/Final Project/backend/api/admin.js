const express = require("express");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");
const { errorLogCollectionName } = require("../config/errorLog");
const auth = require("./auth");

const router = express.Router();
const roles = ["patient", "doctor", "pharmacist", "admin"];

function requireAdmin(req, res, next) {
  //admin panel api should only run for users with admin role.
  if (auth.normalizeRole(req.user?.role) !== "admin") {
    return res.status(403).json({ message: "Admin access is required." });
  }

  next();
}

function cleanUserUpdate(body) {
  //this only grabs the fields admins are allowed to edit
  const update = {};

  if (body.name !== undefined) {
    update.name = String(body.name).trim();
  }

  if (body.email !== undefined) {
    update.email = auth.normalizeEmail(body.email);
  }

  if (body.role !== undefined) {
    update.role = auth.normalizeRole(body.role);
  }

  return update;
}

function validObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

router.use(auth.requireAuth, requireAdmin);

router.get("/users", async (req, res, next) => {
  try {
    const db = await getDb();
    const users = await auth
      .usersCollection(db)
      .find({}, { projection: { passwordHash: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ users: users.map(auth.publicUser) });
  } catch (error) {
    next(error);
  }
});

router.post("/users", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = auth.normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const role = auth.normalizeRole(req.body.role);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const db = await getDb();
    const collection = auth.usersCollection(db);
    const existingUser = await collection.findOne(
      { email },
      { collation: { locale: "en", strength: 2 } }
    );

    if (existingUser) {
      return res.status(409).json({ message: "A user with that email already exists." });
    }

    const now = new Date();
    const userDocument = {
      name,
      email,
      role,
      //same password hashing as signup so no plain passwords sit in mongodb
      passwordHash: await bcrypt.hash(password, 12),
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(userDocument);
    res.status(201).json({ user: auth.publicUser({ ...userDocument, _id: result.insertedId }) });
  } catch (error) {
    next(error);
  }
});

router.put("/users/:id", async (req, res, next) => {
  try {
    const userId = validObjectId(req.params.id);

    if (!userId) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const update = cleanUserUpdate(req.body);

    if (update.name === "" || update.email === "") {
      return res.status(400).json({ message: "Name and email cannot be blank." });
    }

    if (req.body.password) {
      const password = String(req.body.password);

      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters." });
      }

      update.passwordHash = await bcrypt.hash(password, 12);
    }

    update.updatedAt = new Date();

    const db = await getDb();
    const collection = auth.usersCollection(db);

    if (update.email) {
      const existingUser = await collection.findOne(
        { email: update.email, _id: { $ne: userId } },
        { collation: { locale: "en", strength: 2 } }
      );

      if (existingUser) {
        return res.status(409).json({ message: "A user with that email already exists." });
      }
    }

    const result = await collection.findOneAndUpdate(
      { _id: userId },
      { $set: update },
      { returnDocument: "after", projection: { passwordHash: 0 } }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ user: auth.publicUser(result) });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", async (req, res, next) => {
  try {
    const userId = validObjectId(req.params.id);

    if (!userId) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    if (req.user._id.equals(userId)) {
      return res.status(400).json({ message: "You cannot delete your own admin account." });
    }

    const db = await getDb();
    const result = await auth.usersCollection(db).deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    //delete their sessions too so a removed user cannot stay logged in
    await auth.refreshTokensCollection(db).deleteMany({ userId });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/errors", async (req, res, next) => {
  try {
    const db = await getDb();
    const errors = await db
      .collection(errorLogCollectionName())
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    res.json({
      errors: errors.map((error) => ({
        id: error._id.toString(),
        message: error.message,
        source: error.source,
        severity: error.severity,
        stack: error.stack,
        url: error.url,
        method: error.method,
        status: error.status,
        userEmail: error.userEmail,
        userAgent: error.userAgent,
        context: error.context,
        createdAt: error.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/errors/:id", async (req, res, next) => {
  try {
    const errorId = validObjectId(req.params.id);

    if (!errorId) {
      return res.status(400).json({ message: "Invalid error id." });
    }

    const db = await getDb();
    await db.collection(errorLogCollectionName()).deleteOne({ _id: errorId });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
