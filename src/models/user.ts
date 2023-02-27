import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { USERNAME_IS_REQUIRED, EMAIL_IS_REQUIRED } from "../config/constants";
import { isValidEmail } from "../utils/validators";
import { UserResponse } from "../dtos/user";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  tasks: string[];
  toUserResponse: () => UserResponse;
}

const userSchema = new mongoose.Schema<IUser>(
  {
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
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

userSchema.methods.toUserResponse = function (): UserResponse {
  const user = this;
  return {
    _id: user._id,
    email: user.email,
    username: user.username,
  };
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
