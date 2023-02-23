import mongoose from "mongoose";

const MONGODB_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI;

const connect = async () => {
  if (!MONGODB_CONNECTION_URI)
    throw new Error("Failed to connect DB - Connection URI is not specified");
  mongoose.set("strictQuery", false);
  await mongoose.connect(MONGODB_CONNECTION_URI);
  console.log("Database is connected.");
};

connect().catch((err) => console.log(err));
