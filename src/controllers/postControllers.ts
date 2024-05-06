import dotenv from "dotenv";
dotenv.config();
import db from "../db";
import { Request, Response } from "express";
import { Post } from "../types";

// get all posts
export const getAllPosts = async (req: Request, res: Response) => {
  const results = await db
    .collection("posts")
    .find()
    .sort({ timestamp: -1 })
    .toArray();
  res.status(200).send(results as Event[]);
};

// get single post by id
export const getPost = async (req: Request, res: Response) => {
  const query = { title_slug: req.params.title_slug };
  const result = await db.collection("posts").findOne(query);

  if (!result) res.status(404).send("Not Found");
  else {
    res.status(200).send(result);
  }
};

// make new post
export const createPost = async (req: Request, res: Response) => {
  // get request body and check if valid
  let post = req.body as Post;
  if (!post) res.status(400).send("No data provided");
  else if (!post.title || !post.author || !post.description || !post.content)
    res.status(400).send("Bad request; missing/incorrect info format");
  else {
    // check if post already exists (kind of scuffed but this is at least something)
    const query = { title_slug: post.title_slug };
    const exists = await db.collection("posts").findOne(query);
    if (exists) res.status(400).send("Post already exists");
    else {
      // add timestamp to post and slug
      post.timestamp = new Date();
      post.title_slug = post.title.toLowerCase().replace(/\s/g, "-");

      // insert post into database
      const results = await db.collection("posts").insertOne(post);
      res.status(201).send(results);
    }
  }
};

// update post by id
export const updatePost = async (req: Request, res: Response) => {
  // find post to update
  const query = { title_slug: req.params.title_slug };
  const post = await db.collection("posts").findOne(query);
  if (!post) res.status(404).send("Post does not exist");
  else {
    const updatedPost = {
      $set: {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
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
      !updatedPost.$set.description ||
      !updatedPost.$set.content
    ) {
      res.status(400).send("Missing title, author, and or content");
    }

    // update post
    else {
      db.collection("posts").updateOne(query, updatedPost);
      res.send("Post updated").status(200);
    }
  }
};

// delete post by id
export const deletePost = async (req: Request, res: Response) => {
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
