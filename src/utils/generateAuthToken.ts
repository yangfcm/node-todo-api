import jwt from "jsonwebtoken";
import { DEFAULT_JWT_TOKEN } from "../config/constants";
import { UserResponse } from "../dtos/user";

function generateAuthToken(user: UserResponse) {
  const token = jwt.sign(user, process.env.JWT_SECRET || DEFAULT_JWT_TOKEN, {
    expiresIn: "7 days",
  });
  return token;
}

export default generateAuthToken;
