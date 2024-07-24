"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffStatus = exports.TimeOffType = void 0;
var TimeOffType;
(function (TimeOffType) {
    TimeOffType["partialPermission"] = "Permission";
    TimeOffType["simulatedAbsence"] = "Simulated Absence";
    TimeOffType["vacation"] = "Vacation";
    TimeOffType["sickLeaveIMSSUnpaid"] = "IMSS Disability (Unpaid)";
    TimeOffType["sickLeaveIMSSPaid"] = "IMSS Paid Disability";
    TimeOffType["sickLeaveJustifiedByCompany"] = "Justified by Company";
    TimeOffType["dayLeave"] = "Permission Day (Deducted)";
})(TimeOffType || (exports.TimeOffType = TimeOffType = {}));
var TimeOffStatus;
(function (TimeOffStatus) {
    TimeOffStatus["pending"] = "Pending";
    TimeOffStatus["approved"] = "Approved";
    TimeOffStatus["rejected"] = "Rejected";
    TimeOffStatus["canceled"] = "Canceled";
})(TimeOffStatus || (exports.TimeOffStatus = TimeOffStatus = {}));
