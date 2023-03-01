import { PostTaskData, TaskResponse, PutTaskData } from "../dtos/task";
import { UserResponse } from "../dtos/user";
import Task from "../models/task";
import { isValidId } from "../utils/validators";

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
  if (!isValidId(id)) return;
  const task = await Task.findOne({
    _id: id,
  });
  return task?.toTaskResponse();
};

export const updateTask = async (
  id: string,
  task: PutTaskData
): Promise<TaskResponse | undefined> => {
  if (!isValidId(id)) return;
  const taskToUpdate = await Task.findOne({
    _id: id,
  });
  if (!taskToUpdate) return;

  // @TODO: Update task.
  // for (const [key, value] of Object.entries(task)) {
  //   console.log(taskToUpdate[key]);
  // }

  const updatedTask = await taskToUpdate.save();

  return updatedTask.toTaskResponse();
};
