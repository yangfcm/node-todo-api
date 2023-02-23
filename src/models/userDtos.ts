import mongoose, { Types } from "mongoose";
import { IUser } from "./user";

export type PostUserData = IUser;

export type UserResponse = {
  _id: Types.ObjectId;
  username: string;
  email: string;
};

export type LoginUser = {
  email: string;
  password: string;
};
