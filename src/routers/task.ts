import { Router, Request, Response } from "express";
import { UserResponse } from "../dtos/user";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.get("/test", (req, res) => {
  res.send("Task router is working.");
});

router.get(
  "/",
  checkAuth,
  (req: Request<any, any, { authUser?: UserResponse }>, res) => {
    // res.json(req.body.authUser);
  }
);

export default router;
