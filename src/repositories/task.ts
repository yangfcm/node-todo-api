import { ObjectId } from "mongodb";
import { PostTaskData, TaskResponse } from "../dtos/task";
import { UserResponse } from "../dtos/user";
import Task from "../models/task";

export const saveTask = async (
  task: PostTaskData,
  user: UserResponse
): Promise<TaskResponse> => {
  const newTask = new Task({ ...task, owner: user._id.toString() });
  await newTask.save();
  return newTask.toTaskResponse();
};

export const getTasks = async (
  options: {
    userId?: string;
    completed?: string;
  } = {}
): Promise<TaskResponse[]> => {
  const { userId, completed } = options;
  const match: Record<string, string | number | boolean> = {};
  if (userId) match.owner = userId;
  if (completed === "1") match.completed = true;
  if (completed === "0") match.completed = false;
  const tasks = await Task.find(match);
  return tasks.map((task) => task.toTaskResponse());
};

export const getTaskById = async (
  id: string
): Promise<TaskResponse | undefined> => {
  if (!ObjectId.isValid(id)) return;
  const task = await Task.findOne({
    _id: id,
  });
  return task?.toTaskResponse();
};
