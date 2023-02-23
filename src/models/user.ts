import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    trim: true,
    required: [true, "User name is required!"],
    unique: true,
  },
  password: String,
});

const User = mongoose.model("User", userSchema);

export default User;
