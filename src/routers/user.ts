import { Router, Request } from "express";
import User from "../models/user";

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
    console.log(e);
    res.status(400).send({
      message: e.message,
      name: e.name,
      code: e.code,
      error: e.errors,
    });
  }
});

export default router;
