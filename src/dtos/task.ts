import { ITask } from "../models/task";

export type PostTaskData = {
  title: ITask["title"];
  description?: ITask["description"];
  due_at: ITask["due_at"];
};

export type TaskResponse = {
  _id: ITask["_id"];
  title: ITask["title"];
  description: ITask["description"];
  owner: ITask["owner"];
  due_at: ITask["due_at"];
  completed_at: ITask["completed_at"];
  completed: ITask["completed"];
  created_at: ITask["created_at"];
  updated_at: ITask["updated_at"];
};

export type PutTaskData = {
  title?: ITask["title"];
  description?: ITask["description"];
  due_at?: ITask["due_at"];
  completed_at?: ITask["completed_at"];
  completed?: ITask["completed"];
};
