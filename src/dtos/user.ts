import mongoose, { Types } from "mongoose";
import { IUser } from "../models/user";

export type PostUserData = {
  email: IUser["email"];
  username: IUser["username"];
  password: IUser["password"];
};

export type UserResponse = {
  _id: IUser["_id"];
  username: IUser["username"];
  email: IUser["email"];
};

export type LoginUser = {
  email: IUser["email"];
  password: IUser["password"];
};
