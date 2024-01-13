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
        const { status, activities } = data;
        return [undefined, new TaskDto(Object.assign(Object.assign({}, data), { status, activities }))];
    }
    static validateOptions(data) {
        let { status, activities } = data;
        if (activities) {
            for (const activity of activities) {
                activity.registeredAt = new Date(activity.registeredAt);
            }
        }
        status = status ? status : taskTypes_1.TaskStatus.Backlog;
        return undefined;
    }
}
exports.TaskDto = TaskDto;
