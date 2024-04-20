const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient } = require("mongodb");

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8081;
const client = new MongoClient(process.env.DB_HOST);
const db = client.db(process.env.DB_NAME);

// Get all posts
app.get("/posts", async (req, res) => {
  await client.connect();
  console.log("Connected to the server");

  const query = {};

  const results = await db.collection("posts").find(query);
  console.log("Results: ", results);
  res.send(results).status(200);
});

app.get("/posts/:id", async (req, res) => {
  await client.connect();

  const query = { id: req.params.id };
  const result = await db.collection("posts").findOne(query);

  if (!result) res.send("Not Found").status(404);
  else {
    console.log(result);
    res.send(result).status(200);
  }
});

app.post("/posts", async (req, res) => {
  await client.connect();

  const post = req.body;
  if (!post) res.send("No data provided").status(400);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
