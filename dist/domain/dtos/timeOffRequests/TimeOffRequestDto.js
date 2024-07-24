"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffRequestDto = void 0;
const shared_1 = require("../../../shared");
class TimeOffRequestDto {
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
        const { collaborator, requestedDays, timeOffType, status, collaboratorNote, } = data;
        return [
            undefined,
            new TimeOffRequestDto({
                collaborator,
                requestedDays,
                timeOffType,
                status,
                collaboratorNote,
            }),
        ];
    }
    static validateOptions(data) {
        let { collaborator, requestedDays, timeOffType, status } = data;
        status = status ? status : shared_1.TimeOffStatus.pending;
        if (!collaborator)
            return "Collaborator ID is missing";
        if (!requestedDays || requestedDays.length === 0)
            return "Requested days are missing";
        if (!Object.values(shared_1.TimeOffType).includes(timeOffType))
            return "Invalid time off type";
        if (!Object.values(shared_1.TimeOffStatus).includes(status))
            return "Invalid time off status";
        return undefined;
    }
}
exports.TimeOffRequestDto = TimeOffRequestDto;
