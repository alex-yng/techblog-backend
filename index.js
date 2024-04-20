const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient } = require("mongodb");

dotenv.config();

const app = express();
app.use(cors());
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8081;
const client = new MongoClient(process.env.DB_URI);
const db = client.db(process.env.DB_NAME);

// Get all posts
app.get("/posts", async (req, res) => {
  await client.connect();

  const query = {};

  const results = await db.collection("posts").find(query).toArray();
  console.log("Results: ", results);

  res.send(results).status(200);
});

app.get("/posts/:id", async (req, res) => {
  await client.connect();

  const query = { id: Number(req.params.id) };
  const result = await db.collection("posts").findOne(query);

  if (!result) res.send("Not Found").status(404);
  else {
    console.log(result);
    res.send(result).status(200);
  }
});

app.post("/posts", async (req, res) => {
  await client.connect();

  // get request body and check if valid
  const post = req.body;
  if (!post) res.send("No data provided").status(400);
  if (!post.id || !post.title || !post.author || !post.content)
    res.send("Missing info").status(400);

  // check if post already exists (kind of scuffed but this is at least something)
  query = { id: post.id };
  const exists = await db.collection("posts").findOne(query);
  if (exists) res.send("Post already exists").status(400);

  // add timestamp to post
  post.timestamp = new Date();

  // insert post into database
  const results = await db.collection("posts").insertOne(post);
  res.send(results).status(201);
});

app.put("/posts/:id", async (req, res) => {
  await client.connect();

  // find post to update
  const query = { id: req.params.id };
  const exists = await db.collection("posts").findOne(query);
  if (!exists) res.send("Post does not exist").status(404);

  // update post
  const newPost = req.body;
  if (!post) res.send("No data provided").status(400);
  if (!post.title || !post.author || !post.content)
    res.send("Missing title, author, and or content").status(400);

  // add updated timestamp to post
  newPost.lastEdited = new Date();

  // update post
  db.collection("posts").updateOne(query, newPost);
  res.send("Post updated").status(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${HOST}:${PORT}`);
});
