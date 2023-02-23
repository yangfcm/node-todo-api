import User, { PostUserData, UserResponse } from "../models/user";

export const saveUser = async (user: PostUserData): Promise<UserResponse> => {
  const newUser = new User(user);
  await newUser.save();

  return {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
  };
};
