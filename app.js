const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const controller = require("./controllers");

// initialize app and middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());

// endpoints
app.get("/posts", controller.getAllPosts);
app.get("/posts/:id", controller.getPost);
app.post("/posts", controller.createPost);
app.put("/posts/:id", controller.updatePost);
app.delete("/posts/:id", controller.deletePost);

module.exports = app;
