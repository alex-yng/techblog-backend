// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const postController = require("./postControllers");
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as postController from "./controllers/postControllers";
import * as eventController from "./controllers/eventControllers";

// initialize app and middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());

// post crud endpoints
app.get("/posts", postController.getAllPosts);
app.get("/posts/:title_slug", postController.getPost);
app.post("/posts", postController.createPost);
app.put("/posts/:title_slug", postController.updatePost);
app.delete("/posts/:title_slug", postController.deletePost);

// events crud endpoints
app.get("/events", eventController.getAllEvents);
app.get("/events/:title_slug", eventController.getEvent);
app.post("/events", eventController.createEvent);
app.put("/events/:title_slug", eventController.updateEvent);
app.delete("/events/:title_slug", eventController.deleteEvent);

export default app;
