require("dotenv").config();

const express = require("express");
const cors = require("cors");
const adminRouter = require("./api/admin");
const authRouter = require("./api/auth");
const errorsRouter = require("./api/errors");
const pharmacyRouter = require("./api/pharmacy");
const assistantRouter = require("./api/assistant");
const { getDb } = require("./config/db");
const { logError } = require("./config/errorLog");
const { initializeDatabase } = require("./config/initDb");
const usersRouter = require("./api/users");
const appointmentsRouter = require("./api/appointments");
const notificationsRouter = require("./api/notification");

const app = express();
const port = process.env.PORT || 5050;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://127.0.0.1:5174")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    res.json({ ok: true, database: "connected" });
  } catch (error) {
    res.status(503).json({ ok: false, database: "unavailable", message: error.message });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/errors", errorsRouter);
app.use("/api/pharmacy", pharmacyRouter);
app.use("/api/assistant", assistantRouter);
app.use("/api/notifications", notificationsRouter);

app.use("/api/admin", adminRouter);

app.use("/api/users", usersRouter);
app.use("/api/appointments", appointmentsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message =
    status === 500 ? "The server could not complete the request." : error.message;

  logError({
    message: error.message,
    source: "server",
    severity: "error",
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    status,
    userAgent: req.get("user-agent"),
    userId: req.user?._id?.toString(),
    userEmail: req.user?.email,
  }).catch((logErrorFailure) => {
    console.error(`Could not write error_log entry: ${logErrorFailure.message}`);
  });

  res.status(status).json({ message });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is not set. Atlas-backed routes will fail until it is configured.");
  } else {
    const collections = await initializeDatabase();
    console.log(
      `MongoDB ready with collections: ${collections.usersCollection}, ${collections.refreshTokensCollection}, ${collections.errorLogCollection}, ${collections.medicationsCollection}, ${collections.medicineAssignmentsCollection}`
    );
  }

  if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET is not set. Using a development-only fallback secret.");
  }

  app.listen(port, () => {
    console.log(`Saint Cy's backend running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error(`Backend startup failed: ${error.message}`);
  process.exit(1);
});
