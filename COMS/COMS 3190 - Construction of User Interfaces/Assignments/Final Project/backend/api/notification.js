const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");
const auth = require("./auth");

const router = express.Router();

function notificationsCollection(db) {
  return db.collection(process.env.NOTIFICATIONS_COLLECTION || "notifications");
}

function validObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

router.use(auth.requireAuth);

// user recieves all notifications on the patient dashboard.
// user will get notifications like if their appointment is approved, TODO: Add more stuff here as we add it.
router.get("/", async (req, res, next) => {
  try {
    const db = await getDb();
    const notifications = await notificationsCollection(db)
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    res.json({
      notifications: notifications.map((n) => ({
        id: n._id.toString(),
        message: n.message,
        type: n.type,
        read: n.read,
        createdAt: n.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id/read", async (req, res, next) => {
  try {
    const notifId = validObjectId(req.params.id);

    if (!notifId) {
      return res.status(400).json({ message: "Invalid notification id." });
    }

    const db = await getDb();
    const result = await notificationsCollection(db).updateOne(
      { _id: notifId, userId: req.user._id },
      { $set: { read: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.put("/read-all", async (req, res, next) => {
  try {
    const db = await getDb();
    await notificationsCollection(db).updateMany(
      { userId: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;