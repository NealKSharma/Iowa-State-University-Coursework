const express = require("express");
const bcrypt = require("bcryptjs");
const { getDb } = require("../config/db");
const auth = require("./auth");

const router = express.Router();

router.use(auth.requireAuth);

function cleanProfile(user) {
  return {
    name: user.name || "",
    email: user.email || "",
    role: auth.normalizeRole(user.role),
    phone: user.phone || "",
    specialization: user.specialization || "",
  };
}

router.get("/me/profile", async (req, res, next) => {
  try {
    const db = await getDb();
    const user = await auth.usersCollection(db).findOne({ _id: req.user._id });

    res.json({ profile: cleanProfile(user) });
  } catch (error) {
    next(error);
  }
});

router.put("/me/profile", async (req, res, next) => {
  try {
    const role = auth.normalizeRole(req.user.role);
    const phone = String(req.body.phone || "").trim();
    const specialization = String(req.body.specialization || "").trim();

    const update = {
      phone,
      updatedAt: new Date(),
    };

    // only doctors need specialization right now
    if (role === "doctor") {
      update.specialization = specialization;
    }

    const db = await getDb();
    const result = await auth.usersCollection(db).findOneAndUpdate(
      { _id: req.user._id },
      { $set: update },
      { returnDocument: "after", projection: { passwordHash: 0 } }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ profile: cleanProfile(result) });
  } catch (error) {
    next(error);
  }
});

router.put("/me/password", async (req, res, next) => {
  try {
    const current = String(req.body.currentPassword || "");
    const newPassword = String(req.body.newPassword || "");

    if (!current || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters." });
    }

    const match = await bcrypt.compare(current, req.user.passwordHash || "");

    if (!match) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    const db = await getDb();
    await auth.usersCollection(db).updateOne(
      { _id: req.user._id },
      { $set: { passwordHash: await bcrypt.hash(newPassword, 12), updatedAt: new Date() } }
    );

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.put("/me/health", async (req, res, next) => {
  try {
    const height = String(req.body.height || "").trim();
    const weight = String(req.body.weight || "").trim();
    const allergies = String(req.body.allergies || "").trim();
    const doctorNotes = String(req.body.doctorNotes || "").trim();
    const phone = String(req.body.phone || "").trim();

    const db = await getDb();
    await auth.usersCollection(db).updateOne(
      { _id: req.user._id },
      { $set: { height, weight, allergies, doctorNotes, phone, updatedAt: new Date() } }
    );

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/me/health", async (req, res, next) => {
  try {
    const db = await getDb();
    const user = await auth.usersCollection(db).findOne({ _id: req.user._id });

    res.json({
      height: user.height || "",
      weight: user.weight || "",
      allergies: user.allergies || "",
      doctorNotes: user.doctorNotes || "",
      phone: user.phone || "",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;