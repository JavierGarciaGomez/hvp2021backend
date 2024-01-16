"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDto = void 0;
const taskTypes_1 = require("../../../data/types/taskTypes");
class TaskDto {
    constructor(data) {
        this.data = data;
    }
    static create(data) {
        return this.createOrUpdate(data);
    }
    static update(data) {
        return this.createOrUpdate(data);
    }
    static createOrUpdate(data) {
        const validationError = this.validateOptions(data);
        if (validationError)
            return [validationError];
        let { status, activities, completedAt } = data;
        if (activities) {
            for (const activity of activities) {
                activity.registeredAt = new Date(activity.registeredAt);
            }
        }
        status = status ? status : taskTypes_1.TaskStatus.Backlog;
        if (completedAt) {
            status = taskTypes_1.TaskStatus.Completed;
        }
        return [undefined, new TaskDto(Object.assign(Object.assign({}, data), { status, activities }))];
    }
    static validateOptions(data) {
        return undefined;
    }
}
exports.TaskDto = TaskDto;
