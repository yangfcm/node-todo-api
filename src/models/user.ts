import mongoose, { Types } from "mongoose";
import { USERNAME_IS_REQUIRED, EMAIL_IS_REQUIRED } from "../config/constants";
import { isValidEmail } from "../utils/validators";

export interface IUser {
  email: string;
  username: string;
  password: string;
}

export type PostUserData = IUser;

export type UserResponse = {
  _id: Types.ObjectId;
  username: string;
  email: string;
};

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    trim: true,
    required: [true, EMAIL_IS_REQUIRED],
    unique: true,
    validate: {
      validator: (value: string) => isValidEmail(value),
      message: "{VALUE} is not a valid email.",
    },
  },
  username: {
    type: String,
    trim: true,
    required: [true, USERNAME_IS_REQUIRED],
    unique: true,
  },
  password: String,
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
