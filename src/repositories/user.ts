import bcrypt from "bcryptjs";
import User from "../models/user";
import { LoginUser, PostUserData, UserResponse } from "../models/userDtos";
import { BAD_CREDENTIALS } from "../config/constants";

export const saveUser = async (user: PostUserData): Promise<UserResponse> => {
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
