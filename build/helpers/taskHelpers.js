"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskStatus = void 0;
const taskTypes_1 = require("../data/types/taskTypes");
const getTaskStatus = (status) => {
    switch (status) {
        case taskTypes_1.TaskStatus.Backlog:
        case taskTypes_1.TaskStatus.OnHold:
        case taskTypes_1.TaskStatus.Next:
        case taskTypes_1.TaskStatus.InProgress:
            return taskTypes_1.TaskStatus.InProgress;
        case taskTypes_1.TaskStatus.InReview:
            return taskTypes_1.TaskStatus.InReview;
        case taskTypes_1.TaskStatus.Completed:
            return taskTypes_1.TaskStatus.Completed;
        case taskTypes_1.TaskStatus.Canceled:
            return taskTypes_1.TaskStatus.Canceled;
        default:
            return status;
    }
};
exports.getTaskStatus = getTaskStatus;
