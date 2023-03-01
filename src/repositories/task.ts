import { Error } from "mongoose";
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

export const getUserHasTask = async (
  userId: string,
  taskId: string
): Promise<boolean> => {
  if (!isValidId(userId) || !isValidId(taskId)) return false;
  const task = await Task.findOne({
    _id: taskId,
    owner: userId,
  });
  return !!task;
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

  if (task.title?.trim()) taskToUpdate.title = task.title.trim();
  if (task.description) taskToUpdate.description = task.description;
  if (task.due_at) taskToUpdate.due_at = task.due_at;

  if (task.completed === true && !task.completed_at) {
    taskToUpdate.completed = true;
    taskToUpdate.completed_at = new Date();
  }
  if (task.completed === false && !task.completed_at) {
    taskToUpdate.completed = false;
    taskToUpdate.completed_at = undefined;
  }

  if (task.completed_at) {
    taskToUpdate.completed_at = task.completed_at;
    if (task.completed === false)
      // You can's specify completed_at while setting completed at false.
      throw new Error('Invalid data: "completed_at" and "completed"');
    taskToUpdate.completed = true;
  }

  const updatedTask = await taskToUpdate.save();

  return updatedTask.toTaskResponse();
};
