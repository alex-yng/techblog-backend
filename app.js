const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const controller = require("./controllers");

// initialize app and middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());

// crud endpoints
app.get("/posts", controller.getAllPosts);
app.get("/posts/:title_slug", controller.getPost);
app.post("/posts", controller.createPost);
app.put("/posts/:title_slug", controller.updatePost);
app.delete("/posts/:title_slug", controller.deletePost);

module.exports = app;
