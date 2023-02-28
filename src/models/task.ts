import mongoose, { Document } from "mongoose";
import {
  TASK_DUE_DATE_REQUIRED,
  TASK_TITLE_REQUIRED,
  TASK_TITLE_MAX_LENGTH,
  TASK_TITLE_TOO_LONG,
} from "../config/constants";
import { TaskResponse } from "../dtos/task";

export interface ITask extends Document {
  title: string;
  description?: string;
  due_at: Date;
  completed_at?: Date;
  owner: String;
  created_at: Date;
  updated_at: Date;
  toTaskResponse: () => TaskResponse;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      trim: true,
      minlength: [1, TASK_TITLE_REQUIRED],
      maxlength: [TASK_TITLE_MAX_LENGTH, TASK_TITLE_TOO_LONG],
      unique: true,
    },
    description: String,
    due_at: {
      type: Date,
      required: [true, TASK_DUE_DATE_REQUIRED],
    },
    completed_at: Date,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

taskSchema.methods.toTaskResponse = function (): TaskResponse {
  const task = this;
  return {
    _id: task._id,
    title: task.title,
    description: task.description || "",
    due_at: task.due_at,
    completed_at: task.completed_at,
    created_at: task.created_at,
    updated_at: task.updated_at,
    owner: task.owner,
  };
};

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
