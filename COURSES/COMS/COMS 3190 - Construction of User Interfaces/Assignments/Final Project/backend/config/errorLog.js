const { ObjectId } = require("mongodb");
const { getDb } = require("./db");

function errorLogCollectionName() {
  return process.env.ERROR_LOG_COLLECTION || "error_log";
}

function cleanText(value, fallback = "") {
  return String(value || fallback).slice(0, 2000);
}

async function logError(entry) {
  const db = await getDb();
  const document = {
    message: cleanText(entry.message, "Unknown error"),
    source: cleanText(entry.source, "server"),
    severity: cleanText(entry.severity, "error"),
    stack: cleanText(entry.stack),
    url: cleanText(entry.url),
    method: cleanText(entry.method),
    status: Number(entry.status || 500),
    userAgent: cleanText(entry.userAgent),
    userId: ObjectId.isValid(entry.userId) ? new ObjectId(entry.userId) : null,
    userEmail: cleanText(entry.userEmail),
    context: entry.context && typeof entry.context === "object" ? entry.context : {},
    createdAt: new Date(),
  };

  await db.collection(errorLogCollectionName()).insertOne(document);
  return document;
}

module.exports = { errorLogCollectionName, logError };
