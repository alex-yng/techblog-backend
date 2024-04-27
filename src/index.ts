// const app = require("./app");
// const dotenv = require("dotenv");
import app from "./app";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 8081;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
