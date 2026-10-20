const express = require("express");
const { logError } = require("../config/errorLog");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    //frontend sends errors here so admins can see what broke
    await logError({
      message: req.body.message,
      source: req.body.source || "frontend",
      severity: req.body.severity || "error",
      stack: req.body.stack,
      url: req.body.url,
      userAgent: req.get("user-agent"),
      context: req.body.context,
      status: req.body.status || 0,
    });

    res.status(201).json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
