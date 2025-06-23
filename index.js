const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();
    res.status(200).send("OK");
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).send("Database connection failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
