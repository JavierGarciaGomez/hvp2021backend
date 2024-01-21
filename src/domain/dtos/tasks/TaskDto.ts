import {
  TaskActivity,
  TaskPriority,
  TaskStatus,
  TaskTag,
} from "../../../data/types/taskTypes";

interface Options {
  _id?: string;
  activities?: TaskActivity[];
  assignees?: string[];
  author: string;
  completedAt?: string;
  completionCriteria?: string[];
  createdAt?: string;
  createdBy?: string;
  description?: string;
  dueDate?: string;
  notes?: string;
  number?: number;
  priority: TaskPriority;
  requestedAt?: string;
  status: TaskStatus;
  tags?: TaskTag[];
  title: string;
  updatedAt?: string;
  updatedBy?: string;
}
export class TaskDto {
  private constructor(public readonly data: Readonly<Options>) {}

  static create(data: Options): [string?, TaskDto?] {
    return this.createOrUpdate(data);
  }

  static update(data: Options): [string?, TaskDto?] {
    return this.createOrUpdate(data);
  }

  private static createOrUpdate(data: Options): [string?, TaskDto?] {
    const validationError = this.validateOptions(data);
    if (validationError) return [validationError];

    let { status, activities, completedAt } = data;

    if (activities) {
      for (const activity of activities) {
        activity.registeredAt = new Date(activity.registeredAt);
      }
    }

    status = status ? status : TaskStatus.Backlog;

    if (completedAt) {
      if (status !== TaskStatus.Canceled) status = TaskStatus.Completed;
    }

    return [undefined, new TaskDto({ ...data, status, activities })];
  }

  private static validateOptions(data: Options): string | undefined {
    return undefined;
  }
}
