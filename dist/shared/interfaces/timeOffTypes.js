"use strict";
// todo: DELETE THIS
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffStatus = exports.TimeOffType = void 0;
var TimeOffType;
(function (TimeOffType) {
    TimeOffType["partialPermission"] = "Permission";
    TimeOffType["simulatedAbsence"] = "Simulated Absence";
    TimeOffType["Vacation"] = "Vacation";
    TimeOffType["sickLeaveIMSSUnpaid"] = "IMSS Disability (Unpaid)";
    TimeOffType["sickLeaveIMSSPaid"] = "IMSS Paid Disability";
    TimeOffType["sickLeaveJustifiedByCompany"] = "Justified by Company";
    TimeOffType["dayLeave"] = "Permission Day (Deducted)";
})(TimeOffType || (exports.TimeOffType = TimeOffType = {}));
var TimeOffStatus;
(function (TimeOffStatus) {
    TimeOffStatus["Pending"] = "Pending";
    TimeOffStatus["Approved"] = "Approved";
    TimeOffStatus["Rejected"] = "Rejected";
    TimeOffStatus["Canceled"] = "Canceled";
})(TimeOffStatus || (exports.TimeOffStatus = TimeOffStatus = {}));
