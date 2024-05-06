const { MongoClient } = require("mongodb");

// connect to database
const client = new MongoClient(process.env.DB_URI);
const db = client.db(process.env.DB_NAME);
const connect = async () => await client.connect();
connect();
console.log("Connected to database");

export default db;
