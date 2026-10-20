// Author: Neal Kaushik Sharma
// ISU Netid: nea1@iastate.edu
// Date: Apr 25th, 2026

var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const port = "8080";
const host = "localhost";

const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms319";
const client = new MongoClient(url);
const db = client.db(dbName);

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});

app.get("/listRobots", async (req, res) => {
  await client.connect();
  console.log("Node connected successfully to GET MongoDB");
  const query = {};
  const results = await db
    .collection("robot")
    .find(query)
    .limit(100)
    .toArray();
  console.log(results);
  res.status(200);
  res.send(results);
});

app.get("/:id", async (req, res) => {
  await client.connect();
  const id = Number(req.params.id);
  const query = { id: id };
  const results = await db.collection("robot").findOne(query);
  if (!results) {
    res.status(404).send("Robot Not Found");
  } else {
    res.status(200);
    res.send(results);
  }
});

app.post("/addRobots", async (req, res) => {
  try {
    await client.connect();
    const newDocument = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    };
    const result = await db.collection("robot").insertOne(newDocument);
    res.status(200);
    res.send(result);
  } catch (error) {
    console.error("Could not add the new Robot" + error);
    res.status(500);
    res.send("Error adding new robot");
  } finally {
    await client.close();
  }
});

app.put("/updateRobot/:id", async (req, res) => {
  const id = Number(req.params.id);
  const query = { id: id };
  await client.connect();
  console.log("Robot to Update :", id);
  console.log(req.body);
  const updateData = {
    $set: {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    },
  };
  const options = {};
  const results = await db
    .collection("robot")
    .updateOne(query, updateData, options);
  if (results.matchedCount === 0) {
    return res.status(404).send({ message: "Robot not found" });
  }
  const robotUpdated = await db.collection("robot").findOne(query);
  res.status(200);
  res.send(robotUpdated);
});

app.delete("/deleteRobot/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await client.connect();
    console.log("Robot to delete :", id);
    const query = { id: id };
    const robotDeleted = await db.collection("robot").findOne(query);
    if (robotDeleted) {
      const results = await db.collection("robot").deleteOne(query);
      res.status(200);
      res.send(results);
    } else {
      res.status(404);
      res.send("Robot Not Found");
    }
  } catch (error) {
    console.error("Error deleting robot:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});