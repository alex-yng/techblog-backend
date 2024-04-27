// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const postController = require("./postControllers");
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "./controllers/postControllers";

// initialize app and middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());

// crud endpoints
// app.get("/posts", postController.getAllPosts);
// app.get("/posts/:title_slug", postController.getPost);
// app.post("/posts", postController.createPost);
// app.put("/posts/:title_slug", postController.updatePost);
// app.delete("/posts/:title_slug", postController.deletePost);
app.get("/posts", getAllPosts);
app.get("/posts/:title_slug", getPost);
app.post("/posts", createPost);
app.put("/posts/:title_slug", updatePost);
app.delete("/posts/:title_slug", deletePost);

export default app;
