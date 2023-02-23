import mongoose from "mongoose";
import { USERNAME_IS_REQUIRED, EMAIL_IS_REQUIRED } from "../config/constants";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: [true, EMAIL_IS_REQUIRED],
    unique: true,
  },
  username: {
    type: String,
    trim: true,
    required: [true, USERNAME_IS_REQUIRED],
    unique: true,
  },
  password: String,
});

const User = mongoose.model("User", userSchema);

export default User;