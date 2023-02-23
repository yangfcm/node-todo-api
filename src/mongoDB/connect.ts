import mongoose from "mongoose";

const connect = async (url: string) => {
  if (!url)
    throw new Error("Failed to connect DB - Connection URI is not specified");
  mongoose.set("strictQuery", false);
  await mongoose.connect(url);
  console.log("Database is connected.");
};

export default connect;
