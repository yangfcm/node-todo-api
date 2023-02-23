import { Router, Request } from "express";
import User from "../models/user";
import processError from "../utils/processError";

const router = Router();

router.get("/test", (req, res) => {
  res.send("User router is working.");
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await user.save();
    res.send("ok");
  } catch (e: any) {
    res.status(400).send(processError(e));
  }
});

export default router;
