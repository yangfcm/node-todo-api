import express from "express";
import dotenv from "dotenv";

dotenv.config();

import "./mongoDB/connect";

const app = express();

app.get("/", (req, res) => {
  res.send("App is running");
});

export default app;
