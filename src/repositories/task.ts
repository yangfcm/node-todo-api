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

export const getTasksByUserId = async (
  userId: string,
  options: {
    completed?: string;
  } = {}
): Promise<TaskResponse[]> => {
  const tasks = await Task.find({
    owner: userId,
  });
  const { completed } = options;
  return tasks.map((task) => task.toTaskResponse());
};
