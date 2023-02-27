import { Error } from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { LoginUser, PostUserData, UserResponse } from "../dtos/user";
import {
  BAD_CREDENTIALS,
  EMAIL_EXISTS,
  USERNAME_EXISTS,
} from "../config/constants";

export const saveUser = async (user: PostUserData): Promise<UserResponse> => {
  const { email, username } = user;
  const sameEmailUser = await User.findOne({ email });
  const sameUsernameUser = await User.findOne({ username });

  const validationError = new Error.ValidationError();
  if (sameEmailUser) {
    validationError.addError("email", {
      path: "email",
      value: email,
      message: EMAIL_EXISTS,
    } as Error.ValidatorError);
    throw validationError;
  }

  if (sameUsernameUser) {
    validationError.addError("username", {
      path: "username",
      value: username,
      message: USERNAME_EXISTS,
    } as Error.ValidatorError);
    throw validationError;
  }

  const newUser = new User(user);
  await newUser.save();

  return newUser.toUserResponse();
};

export const findUserByCredentials = async (
  loginUser: LoginUser
): Promise<UserResponse> => {
  const { email, password } = loginUser;
  const user = await User.findOne({ email });
  if (!user) throw new Error(BAD_CREDENTIALS);
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw new Error(BAD_CREDENTIALS);
  return user.toUserResponse();
};
