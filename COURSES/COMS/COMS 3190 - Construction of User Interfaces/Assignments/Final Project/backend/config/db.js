const { MongoClient } = require("mongodb");

let clientPromise;

function getDatabaseName() {
  //this lets the .env decide which mongodb database to use.
  return process.env.MONGODB_DB || process.env.MONGODB_DATABASE || undefined;
}

async function getDb() {
  //this is the atlas connection string from backend
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!clientPromise) {
    //only connect once, then reuse the same mongodb client
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  const client = await clientPromise;
  //if no db name is set, mongodb uses the db name from the uri
  return client.db(getDatabaseName());
}

module.exports = { getDb };
