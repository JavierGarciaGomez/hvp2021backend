"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateYears = exports.calculateVacationsForYearAfter2022 = exports.calculateVacationsForFullYearsAfter2022 = exports.calculateVacationsAfter2022 = exports.calculateVacationDaysForYearBefore2023 = exports.calculateVacationsForFullYearsBefore2023 = exports.calculateVacationDaysBefore2023 = exports.calculateTotalVacationDays = exports.getPendingVacations = exports.getApprovedVacations = exports.getNotRejectedTimeOffsByType = exports.getCollaboratorTimeOffOverviewDetails = void 0;
const dayjsConfig_1 = __importDefault(require("../config/dayjsConfig"));
const Collaborator_1 = __importDefault(require("../models/Collaborator"));
const timeOffTypes_1 = require("../data/types/timeOffTypes");
const TimeOffRequestModel_1 = __importDefault(require("../data/models/TimeOffRequestModel"));
/*
Vacations

Artículo 76.- Las personas trabajadoras que tengan más de un año de servicios disfrutarán de un
periodo anual de vacaciones pagadas, que en ningún caso podrá ser inferior a doce días laborables, y
que aumentará en dos días laborables, hasta llegar a veinte, por cada año subsecuente de servicios.
A partir del sexto año, el periodo de vacaciones aumentará en dos días por cada cinco de servicios

1st year 12
2nd year 14
3rd year 16
4th year 18
5th year 20
6th year 22
7th year 22
8th year 22
9th year 22
10th year 22
11th year 24
12th year 24
13th year 24
14th year 24
15th year 24
16th year 26
*/
const getCollaboratorTimeOffOverviewDetails = (collaboratorId, endDate = new Date(), excludedTimeOffRequestId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let collaboratorTimeOffRequests = yield TimeOffRequestModel_1.default.find({
        collaborator: collaboratorId,
    });
    if (excludedTimeOffRequestId) {
        collaboratorTimeOffRequests = collaboratorTimeOffRequests.filter((timeOffRequest) => timeOffRequest._id.toString() !== excludedTimeOffRequestId);
    }
    const collaborator = yield Collaborator_1.default.findById(collaboratorId);
    const totalVacationDays = (0, exports.calculateTotalVacationDays)(collaborator === null || collaborator === void 0 ? void 0 : collaborator.startDate, endDate);
    const vacationsTaken = (0, exports.getApprovedVacations)(collaboratorTimeOffRequests);
    const vacationsRequested = (0, exports.getPendingVacations)(collaboratorTimeOffRequests);
    const dateTimeOffRequests = [];
    collaboratorTimeOffRequests
        .filter((collaboratorTimeOffRequest) => collaboratorTimeOffRequest.status !== timeOffTypes_1.TimeOffStatus.rejected)
        .forEach((collaboratorTimeOffRequest) => {
        const { collaborator, timeOffType, status } = collaboratorTimeOffRequest;
        collaboratorTimeOffRequest.requestedDays.forEach((date) => {
            dateTimeOffRequests.push({
                date,
                id: `${collaboratorTimeOffRequest._id}-${date
                    .getTime()
                    .toString()}-${collaborator}}`,
                timeOffType,
                status,
                collaborator,
            });
        });
    });
    const remainingVacationDays = totalVacationDays -
        vacationsTaken.length -
        vacationsRequested.length -
        ((_a = collaborator === null || collaborator === void 0 ? void 0 : collaborator.vacationsTakenBefore2021) !== null && _a !== void 0 ? _a : 0);
    const data = {
        collaboratorId,
        totalVacationDays,
        vacationsTaken,
        vacationsRequested: vacationsRequested,
        remainingVacationDays,
        dateTimeOffRequests,
    };
    return data;
});
exports.getCollaboratorTimeOffOverviewDetails = getCollaboratorTimeOffOverviewDetails;
const getNotRejectedTimeOffsByType = (timeOffRequests, timeOffType) => {
    const filteredTimeOffs = timeOffRequests.filter((timeOffRequest) => timeOffRequest.timeOffType === timeOffType &&
        (timeOffRequest.status === timeOffTypes_1.TimeOffStatus.approved ||
            timeOffRequest.status === timeOffTypes_1.TimeOffStatus.pending));
    const filteredDays = [];
    filteredTimeOffs.forEach((vacations) => {
        vacations.requestedDays.forEach((day) => {
            filteredDays.push(day);
        });
    });
    return filteredDays;
};
exports.getNotRejectedTimeOffsByType = getNotRejectedTimeOffsByType;
const getApprovedVacations = (timeOffRequests) => {
    //get vacations taken
    const timeOffVacationsRequestsApproved = timeOffRequests.filter((timeOffRequest) => timeOffRequest.timeOffType === timeOffTypes_1.TimeOffType.vacation &&
        timeOffRequest.status === timeOffTypes_1.TimeOffStatus.approved);
    const vacationsDaysApproved = [];
    timeOffVacationsRequestsApproved.forEach((vacations) => {
        vacations.requestedDays.forEach((day) => {
            vacationsDaysApproved.push(day);
        });
    });
    return vacationsDaysApproved;
};
exports.getApprovedVacations = getApprovedVacations;
const getPendingVacations = (timeOffRequests) => {
    //get vacations taken
    const filteredTimeOffVacations = timeOffRequests.filter((timeOffRequest) => timeOffRequest.timeOffType === timeOffTypes_1.TimeOffType.vacation &&
        timeOffRequest.status === timeOffTypes_1.TimeOffStatus.pending);
    const filteredDates = [];
    filteredTimeOffVacations.forEach((vacations) => {
        vacations.requestedDays.forEach((day) => {
            filteredDates.push(day);
        });
    });
    return filteredDates;
};
exports.getPendingVacations = getPendingVacations;
const calculateTotalVacationDays = (employmentStartDate, endDate = new Date()) => {
    const vacationsBefore2023 = (0, exports.calculateVacationDaysBefore2023)(employmentStartDate, endDate);
    const vacationsAfter2022 = (0, exports.calculateVacationsAfter2022)(employmentStartDate, endDate);
    return vacationsBefore2023 + vacationsAfter2022;
};
exports.calculateTotalVacationDays = calculateTotalVacationDays;
const calculateVacationDaysBefore2023 = (employmentStartDate, endDate = new Date()) => {
    const isStartDateBefore2023 = (0, dayjsConfig_1.default)(employmentStartDate).isAfter((0, dayjsConfig_1.default)("2022-12-31"));
    if (isStartDateBefore2023) {
        return 0;
    }
    const itEndsAtDec2022 = (0, dayjsConfig_1.default)(endDate).isSame((0, dayjsConfig_1.default)("2022-12-31"), "day");
    const workedYears = Math.floor((0, exports.calculateYears)(employmentStartDate, new Date("2022-12-31"), itEndsAtDec2022));
    return (0, exports.calculateVacationsForFullYearsBefore2023)(workedYears);
};
exports.calculateVacationDaysBefore2023 = calculateVacationDaysBefore2023;
const calculateVacationsForFullYearsBefore2023 = (yearsOfWorking) => {
    if (yearsOfWorking <= 0) {
        return 0;
    }
    let totalDays = 0;
    for (let i = 1; i <= yearsOfWorking; i++) {
        totalDays += (0, exports.calculateVacationDaysForYearBefore2023)(i);
    }
    return totalDays;
};
exports.calculateVacationsForFullYearsBefore2023 = calculateVacationsForFullYearsBefore2023;
const calculateVacationDaysForYearBefore2023 = (yearsOfWorking) => {
    if (yearsOfWorking >= 1 && yearsOfWorking < 6) {
        // 1 to 5 years
        return 6 + (yearsOfWorking - 1) * 2;
    }
    else if (yearsOfWorking >= 6 && yearsOfWorking <= 10) {
        // 6 to 10 years
        return 16;
    }
    else if (yearsOfWorking >= 11 && yearsOfWorking <= 15) {
        // 11 to 15 years
        return 18;
    }
    else if (yearsOfWorking >= 16 && yearsOfWorking <= 20) {
        // 16 to 20 years
        return 20;
    }
    else if (yearsOfWorking >= 21 && yearsOfWorking <= 25) {
        // 21 to 25 years
        return 22;
    }
    else if (yearsOfWorking >= 26 && yearsOfWorking <= 30) {
        // 26 to 30 years
        return 24;
    }
    else {
        // Default case for other values
        return 0; // You may want to handle this case differently based on your requirements
    }
};
exports.calculateVacationDaysForYearBefore2023 = calculateVacationDaysForYearBefore2023;
const calculateVacationsAfter2022 = (startDate, endDate = new Date()) => {
    const itEndedBefore2023 = (0, dayjsConfig_1.default)(endDate).isSameOrBefore((0, dayjsConfig_1.default)("2022-12-31"), "day");
    if (itEndedBefore2023) {
        return 0;
    }
    const startDateForCalculationAfter2022 = (0, dayjsConfig_1.default)(startDate).isSameOrBefore((0, dayjsConfig_1.default)("2023-01-01"))
        ? (0, dayjsConfig_1.default)(startDate).set("year", 2022).toDate()
        : (0, dayjsConfig_1.default)(startDate).startOf("day").toDate();
    const fullyWorkedYearsBefore2023 = Math.floor((0, exports.calculateYears)(startDate, new Date("2022-12-31"), false));
    const fullyWorkedYearsAfter2022 = (0, exports.calculateYears)(startDateForCalculationAfter2022, endDate);
    const vacationsForFullYearsAfter2022 = (0, exports.calculateVacationsForFullYearsAfter2022)(fullyWorkedYearsBefore2023, fullyWorkedYearsAfter2022);
    const remainingOfTheLastYear = fullyWorkedYearsAfter2022 % 1;
    const totalWorkedYears = Math.floor(fullyWorkedYearsBefore2023) +
        Math.floor(fullyWorkedYearsAfter2022);
    const vacationsForPartialYearAfter2022 = Math.floor((0, exports.calculateVacationsForYearAfter2022)(totalWorkedYears + 1) *
        remainingOfTheLastYear);
    return vacationsForFullYearsAfter2022 + vacationsForPartialYearAfter2022;
};
exports.calculateVacationsAfter2022 = calculateVacationsAfter2022;
const calculateVacationsForFullYearsAfter2022 = (yearsWorkedBefore2023, yearsAfter2022) => {
    let totalDays = 0;
    const startingYear = Math.floor(yearsWorkedBefore2023) + 1;
    const lastYear = Math.floor(yearsWorkedBefore2023 + yearsAfter2022);
    for (let i = startingYear; i <= lastYear; i++) {
        const daysForYear = (0, exports.calculateVacationsForYearAfter2022)(i);
        totalDays += daysForYear;
    }
    return totalDays;
};
exports.calculateVacationsForFullYearsAfter2022 = calculateVacationsForFullYearsAfter2022;
const calculateVacationsForYearAfter2022 = (yearsOfWorking) => {
    if (yearsOfWorking >= 1 && yearsOfWorking < 6) {
        // 1 to 5 years
        return 12 + (yearsOfWorking - 1) * 2;
    }
    else if (yearsOfWorking >= 6 && yearsOfWorking <= 10) {
        // 6 to 10 years
        return 22;
    }
    else if (yearsOfWorking >= 11 && yearsOfWorking <= 15) {
        // 11 to 15 years
        return 24;
    }
    else if (yearsOfWorking >= 16 && yearsOfWorking <= 20) {
        // 16 to 20 years
        return 26;
    }
    else if (yearsOfWorking >= 21 && yearsOfWorking <= 25) {
        // 21 to 25 years
        return 28;
    }
    else if (yearsOfWorking >= 26 && yearsOfWorking <= 30) {
        // 26 to 30 years
        return 30;
    }
    else {
        // Default case for other values
        return 0; // You may want to handle this case differently based on your requirements
    }
};
exports.calculateVacationsForYearAfter2022 = calculateVacationsForYearAfter2022;
const calculateYears = (startDate, endDate = new Date(), includeEndDate = true) => {
    const newEndDate = includeEndDate
        ? (0, dayjsConfig_1.default)(endDate).add(1, "day")
        : (0, dayjsConfig_1.default)(endDate);
    if (startDate > endDate)
        return 0;
    const years = newEndDate.diff((0, dayjsConfig_1.default)(startDate), "year", true);
    return years;
};
exports.calculateYears = calculateYears;
