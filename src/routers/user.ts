import { Router, Request, Response } from "express";
import processError, { AppError } from "../utils/processError";
import { LoginUser, PostUserData, UserResponse } from "../models/userDtos";
import { findUserByCredentials, saveUser } from "../repositories/user";
import generateAuthToken from "../utils/generateAuthToken";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.get("/test", (req, res) => {
  res.send("User router is working.");
});

router.post(
  "/",
  async (
    req: Request<unknown, unknown, PostUserData>,
    res: Response<AppError | UserResponse>
  ) => {
    try {
      const newUser = await saveUser(req.body);
      const token = generateAuthToken(newUser);
      res.header("X-Auth", token).json(newUser);
    } catch (e: any) {
      res.status(400).send(processError(e));
    }
  }
);

router.get(
  "/auth",
  checkAuth,
  (req: Request<any, any, { authUser?: UserResponse }>, res) => {
    res.json(req.body.authUser);
  }
);

router.post(
  "/login",
  async (
    req: Request<any, any, LoginUser>,
    res: Response<AppError | UserResponse>
  ) => {
    try {
      const user = await findUserByCredentials(req.body);
      const token = generateAuthToken(user);
      return res.header("X-Auth", token).json(user);
    } catch (e: any) {
      res.status(400).send(processError(e));
    }
  }
);

export default router;
