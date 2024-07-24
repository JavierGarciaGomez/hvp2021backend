"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskStatus = void 0;
const interfaces_1 = require("../interfaces");
const getTaskStatus = (status) => {
    switch (status) {
        case interfaces_1.TaskStatus.Backlog:
        case interfaces_1.TaskStatus.OnHold:
        case interfaces_1.TaskStatus.Next:
        case interfaces_1.TaskStatus.InProgress:
            return interfaces_1.TaskStatus.InProgress;
        case interfaces_1.TaskStatus.InReview:
            return interfaces_1.TaskStatus.InReview;
        case interfaces_1.TaskStatus.Completed:
            return interfaces_1.TaskStatus.Completed;
        case interfaces_1.TaskStatus.Canceled:
            return interfaces_1.TaskStatus.Canceled;
        default:
            return status;
    }
};
exports.getTaskStatus = getTaskStatus;
