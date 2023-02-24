import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { DEFAULT_JWT_TOKEN, INVALID_TOKEN } from "../config/constants";
import User from "../models/user";
import errorToJson from "../utils/errorToJson";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("X-Auth")?.replace("Bearer ", "");
    if (!token) throw new Error(INVALID_TOKEN); // Check if token exists.

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || DEFAULT_JWT_TOKEN
    ) as JwtPayload;
    if (decoded.exp && Date.now() > decoded.exp * 1000)
      // Check if token expires.
      throw new Error(INVALID_TOKEN);

    const user = await User.findOne({
      _id: decoded._id,
      username: decoded.username,
      email: decoded.email,
    });
    if (!user) throw new Error(INVALID_TOKEN); // Check if user matches the token.

    req.body.authUser = user;
    next();
  } catch (error: any) {
    res.status(401).json(errorToJson(error));
  }
};

export default checkAuth;
