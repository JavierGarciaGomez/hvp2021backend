import { TaskStatus } from "../data/types/taskTypes";

export const getTaskStatus = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.Backlog:
    case TaskStatus.OnHold:
    case TaskStatus.Next:
    case TaskStatus.InProgress:
      return TaskStatus.InProgress;
    case TaskStatus.InReview:
      return TaskStatus.InReview;
    case TaskStatus.Completed:
      return TaskStatus.Completed;
    case TaskStatus.Canceled:
      return TaskStatus.Canceled;
    default:
      return status;
  }
};
