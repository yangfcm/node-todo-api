import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./mongoDB/connect";
import userRouter from "./routers/user";

dotenv.config();
const MONGODB_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI || "";

connectDB(MONGODB_CONNECTION_URI); // Connect DB.

const app = express(); // Start server.

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("App is running");
});
app.use("/users", userRouter);

export default app;
