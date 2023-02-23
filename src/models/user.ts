import mongoose, { Types } from "mongoose";
import bcrypt from "bcryptjs";
import { USERNAME_IS_REQUIRED, EMAIL_IS_REQUIRED } from "../config/constants";
import { isValidEmail } from "../utils/validators";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  username: string;
  password: string;
}

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

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
