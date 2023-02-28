import { Router, Request, Response } from "express";
import { PostTaskData, TaskResponse } from "../dtos/task";
import { UserResponse } from "../dtos/user";
import checkAuth from "../middlewares/checkAuth";
import { getTasks, saveTask } from "../repositories/task";
import errorToJson, { AppError } from "../utils/errorToJson";

const router = Router();

router.get("/test", (req, res) => {
  res.send("Task router is working.");
});

router.post(
  "/",
  checkAuth,
  async (
    req: Request<any, any, { authUser: UserResponse; task: PostTaskData }>,
    res: Response<AppError | TaskResponse>
  ) => {
    try {
      const { task, authUser } = req.body;
      const newTask = await saveTask(task, authUser);
      res.json(newTask);
    } catch (e) {
      res.status(400).send(errorToJson(e));
    }
  }
);

router.get(
  "/",
  checkAuth,
  async (
    req: Request<any, any, { authUser: UserResponse }, qs.ParsedQs>,
    res: Response<AppError | TaskResponse[]>
  ) => {
    try {
      const user = req.body.authUser;
      const { completed } = req.query || {};

      const tasks = await getTasks({
        userId: user._id,
        completed: completed as string,
      });
      res.json(tasks);
    } catch (e) {
      res.status(400).send(errorToJson(e));
    }
  }
);

export default router;
