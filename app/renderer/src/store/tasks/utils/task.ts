import { v4 as uuid } from "uuid";
import type { Task } from "../types";

type CreateTaskParams = Pick<Task, "text"> &
  Partial<Pick<Task, "description">> &
  Partial<Pick<Task, "pomodoroCount">>;
type EditableTaskParams = Partial<Omit<Task, "_id">>;

export const createTask = ({
  text,
  description = "",
  pomodoroCount = 0,
}: CreateTaskParams): Task => {
  return {
    _id: uuid(),
    text,
    description,
    done: false,
    pomodoroCount,
  };
};

const assignPomodoro = (task: Task, pomodoroCount: number): Task => {
  return { ...task, pomodoroCount };
};

export const editTask = (
  task: Task,
  changedFields: EditableTaskParams
): Task => {
  return { ...task, ...changedFields };
};
