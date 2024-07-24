"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffRequestEntity = void 0;
class TimeOffRequestEntity {
    constructor(id, collaboratorId, startDate, endDate, status) {
        this.id = id;
        this.collaboratorId = collaboratorId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}
exports.TimeOffRequestEntity = TimeOffRequestEntity;
