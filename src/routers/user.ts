import { Router, Request, Response } from "express";
import processError, { AppError } from "../utils/processError";
import { PostUserData, UserResponse } from "../models/user";
import { saveUser } from "../repositories/user";
import generateAuthToken from "../utils/generateAuthToken";

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
      const token = generateAuthToken({
        _id: newUser._id.toString(),
        email: newUser.email,
        username: newUser.username,
      });
      res.header("X-Auth", token).json(newUser);
    } catch (e: any) {
      res.status(400).send(processError(e));
    }
  }
);

export default router;
