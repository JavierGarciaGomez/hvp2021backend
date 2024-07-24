"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRecordDto = void 0;
const mongodb_1 = require("mongodb");
const shared_1 = require("../../../shared");
class AttendanceRecordDto {
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
        const { action } = data;
        if (action && action === "clock_in") {
            data.startTime = new Date().toISOString();
        }
        if (action && action === "clock_out") {
            data.endTime = new Date().toISOString();
        }
        return [undefined, new AttendanceRecordDto(Object.assign({}, data))];
    }
    static validateOptions(data) {
        const { collaborator, shiftDate, startTime, endTime, branch } = data;
        if (!mongodb_1.ObjectId.isValid(collaborator)) {
            return "Collaborator id is not valid";
        }
        if (!(0, shared_1.isValidDateString)(shiftDate)) {
            return "Shift date is not valid";
        }
        if (data)
            return undefined;
    }
}
exports.AttendanceRecordDto = AttendanceRecordDto;
