const express = require("express");
const dotenv = require("dotenv");
const MongoClient = require("mongodb").MongoClient;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;
const client = new MongoClient(process.env.DB_HOST);

app.get("/article", async (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
