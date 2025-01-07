import { v4 as uuid } from "uuid";
import type { Task } from "../types";

type CreateTaskParams = Pick<Task, "text"> &
  Partial<Pick<Task, "description">> &
  Partial<Pick<Task, "pomodoro">>;
type EditableTaskParams = Partial<Omit<Task, "_id">>;

export const createTask = ({
  text,
  description = "",
  pomodoro = 0,
}: CreateTaskParams): Task => {
  return {
    _id: uuid(),
    text,
    description,
    done: false,
    pomodoro: 0,
  };
};

const assignPomodoro = (task: Task, pomodoro: number): Task => {
  return { ...task, pomodoro };
};

export const editTask = (
  task: Task,
  changedFields: EditableTaskParams
): Task => {
  return { ...task, ...changedFields };
};
