import { Router, Request, Response } from "express";
import User from "../models/user";
import processError, { AppError } from "../utils/processError";
import { PostUserData, UserResponse } from "../models/user";
import { saveUser } from "../repositories/user";

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
      res.json(newUser);
    } catch (e: any) {
      res.status(400).send(processError(e));
    }
  }
);

export default router;
