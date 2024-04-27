const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

// connect to database
const client = new MongoClient(process.env.DB_URI);
const db = client.db(process.env.DB_NAME);
const connect = async () => await client.connect();
connect();

// get all posts
const getAllPosts = async (req, res) => {
  const results = await db.collection("posts").find().sort({ id: 1 }).toArray();
  res.status(200).send(results);
};

// get single post by id
const getPost = async (req, res) => {
  const query = { title_slug: req.params.title_slug };
  const result = await db.collection("posts").findOne(query);

  if (!result) res.status(404).send("Not Found");
  else {
    res.status(200).send(result);
  }
};

// make new post
const createPost = async (req, res) => {
  // get request body and check if valid
  let post = req.body;
  if (!post) res.status(400).send("No data provided");
  else if (!post.title || !post.author || !post.content)
    res.status(400).send("Bad request; missing/incorrect info format");
  else {
    // check if post already exists (kind of scuffed but this is at least something)
    query = { title: post.title };
    const exists = await db.collection("posts").findOne(query);
    if (exists) res.status(400).send("Post already exists");
    else {
      // add timestamp to post
      post.timestamp = new Date();
      post.title_slug = post.title.toLowerCase().replace(/\s/g, "-");

      // insert post into database
      const results = await db.collection("posts").insertOne(post);
      res.status(201).send(results);
    }
  }
};

// update post by id
const updatePost = async (req, res) => {
  // find post to update
  const query = { title_slug: req.params.title_slug };
  const post = await db.collection("posts").findOne(query);
  if (!post) res.status(404).send("Post does not exist");
  else {
    const updatedPost = {
      $set: {
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        title_slug: req.body.title.toLowerCase().replace(/\s/g, "-"),
      },
      $currentDate: { lastUpdated: true },
    };
    if (!updatedPost) {
      res.status(400).send("No data provided");
    }
    // check missing info
    else if (
      !updatedPost.$set.title ||
      !updatedPost.$set.author ||
      !updatedPost.$set.content
    ) {
      res.status(400).send("Missing title, author, and or content");
    }

    // update post
    else {
      // update post
      db.collection("posts").updateOne(query, updatedPost);
      res.send("Post updated").status(200);
    }
  }
};

// delete post by id
const deletePost = async (req, res) => {
  // find post to delete
  const query = { title_slug: req.params.title_slug };
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
