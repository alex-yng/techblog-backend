const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

// connect to database
const client = new MongoClient(process.env.DB_URI);
const db = client.db(process.env.DB_NAME);

// get all posts
const getAllPosts = async (req, res) => {
  await client.connect();

  const results = await db.collection("posts").find().sort({ id: 1 }).toArray();
  console.log("Results: ", results);

  res.status(200).send(results);
};

// get single post by id
const getPost = async (req, res) => {
  await client.connect();

  const query = { id: Number(req.params.id) };
  const result = await db.collection("posts").findOne(query);

  if (!result) res.status(404).send("Not Found");
  else {
    console.log(result);
    console.log(typeof result.id);
    res.status(200).send(result);
  }
};

// make new post
const createPost = async (req, res) => {
  await client.connect();

  // get request body and check if valid
  const post = req.body;
  console.log(post);
  if (!post) res.status(400).send("No data provided");
  else if (
    !post.id ||
    typeof post.id !== "number" ||
    !post.title ||
    !post.author ||
    !post.content
  )
    res.status(400).send("Bad request; missing/incorret info format");
  else {
    // check if post already exists (kind of scuffed but this is at least something)
    query = { id: post.id };
    const exists = await db.collection("posts").findOne(query);
    if (exists) res.status(400).send("Post already exists");
    else {
      // add timestamp to post
      post.timestamp = new Date();

      // insert post into database
      const results = await db.collection("posts").insertOne(post);
      res.status(201).send(results);
    }
  }
};

// update post by id
const updatePost = async (req, res) => {
  await client.connect();

  // find post to update
  const query = { id: Number(req.params.id) };
  const post = await db.collection("posts").findOne(query);
  if (!post) res.send("Post does not exist").status(404);
  else {
    const newPost = { $set: { ...req.body, id: post.id } };
    if (!post) res.send("No data provided").status(400);
    // check missing info
    else if (!post.title || !post.author || !post.content) {
      res.send("Missing title, author, and or content").status(400);
    }

    // update post
    else {
      // update post
      db.collection("posts").updateOne(query, newPost);
      res.send("Post updated").status(200);
    }
  }
};

// delete post by id
const deletePost = async (req, res) => {
  await client.connect();

  // find post to delete
  const query = { id: Number(req.params.id) };
  const post = await db.collection("posts").findOne(query);
  if (!post) res.status(404).send("Post does not exist");
  else {
    // delete post
    db.collection("posts").deleteOne(query);
    res.send("Post deleted").status(200);
  }
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
