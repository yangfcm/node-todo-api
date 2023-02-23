import express from "express";
import dotenv from "dotenv";
import connectDB from "./mongoDB/connect";

dotenv.config();
const MONGODB_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI || "";

connectDB(MONGODB_CONNECTION_URI); // Connect DB.

const app = express(); // Start server.

app.get("/", (req, res) => {
  res.send("App is running");
});

export default app;
