const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/api/health", async (req, res) => {
  let redisStatus = "disconnected";
  let databaseStatus = "disconnected";

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    await redisClient.ping();
    redisStatus = "connected";
  } catch (error) {
    console.error("Redis health check failed:", error.message);
  }

  try {
    await pool.query("SELECT 1");
    databaseStatus = "connected";
  } catch (error) {
    console.error("Database health check failed:", error.message);
  }

  res.json({
    status: "ok",
    application: "Progree DevOps Task 2",
    redis: redisStatus,
    database: databaseStatus,
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Progree DevOps API is running",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
});