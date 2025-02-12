"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreviousSunday = exports.isDatetimeBefore = exports.isDatetimeAfter = exports.minutesBetweenDatetimes = exports.calculateProportionalHours = exports.getDayjsRangeFromDates = exports.toMexicoStartOfDay = exports.getMxDayjsDatetimeByDateAndTime = exports.convertUtcDateToMexicoTimeStartOfDay = exports.transformMxDateTimeToEsStartOfDay = exports.transformMxDateTimeToUtcStartOfDay = exports.getLastSundayOfExtendedHalfWeek = exports.getFirstMondayOfExtendedHalfWeek = exports.getLatestDate = exports.sortDates = exports.checkIsSunday = exports.checkIsMonday = exports.validateDateDay = exports.getCurrentMexicanDate = exports.isValidDateString = exports.isValidDate = exports.formatDateWithoutTime = exports.getEarliestDate = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const isSameOrBefore_1 = __importDefault(require("dayjs/plugin/isSameOrBefore"));
const isSameOrAfter_1 = __importDefault(require("dayjs/plugin/isSameOrAfter"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.extend(isSameOrBefore_1.default);
dayjs_1.default.extend(isSameOrAfter_1.default);
const getEarliestDate = (dates) => {
    const earliestDate = new Date(Math.min(...dates.map((date) => date.getTime())));
    return earliestDate;
};
exports.getEarliestDate = getEarliestDate;
const formatDateWithoutTime = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
exports.formatDateWithoutTime = formatDateWithoutTime;
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};
exports.isValidDate = isValidDate;
const isValidDateString = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
        return false;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return false;
    }
    // Ensure the date string matches the ISO format to avoid invalid months or days
    return date.toISOString().slice(0, 10) === dateString;
};
exports.isValidDateString = isValidDateString;
const getCurrentMexicanDate = () => {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    const date = new Date().toLocaleDateString("es-MX", options);
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
};
exports.getCurrentMexicanDate = getCurrentMexicanDate;
const validateDateDay = (date, day) => {
    const parsedDate = (0, dayjs_1.default)(date);
    const dayOfWeek = parsedDate.format("dddd").toLowerCase();
    return dayOfWeek === day.toLowerCase();
};
exports.validateDateDay = validateDateDay;
const checkIsMonday = (date) => (0, exports.validateDateDay)(date, "Monday");
exports.checkIsMonday = checkIsMonday;
const checkIsSunday = (date) => (0, exports.validateDateDay)(date, "Sunday");
exports.checkIsSunday = checkIsSunday;
const sortDates = (dates) => {
    return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
};
exports.sortDates = sortDates;
const getLatestDate = (dates) => {
    const date = (0, exports.sortDates)(dates)[dates.length - 1];
    return new Date(date);
};
exports.getLatestDate = getLatestDate;
const getFirstMondayOfExtendedHalfWeek = (date) => {
    const dayOfMonth = date.date();
    const targetDay = dayOfMonth <= 15 ? 1 : 16;
    const targetDate = date.date(targetDay);
    const dayOfWeek = targetDate.day();
    if (dayOfWeek === 1) {
        return targetDate;
    }
    const daysToMonday = (dayOfWeek + 6) % 7;
    const monday = targetDate.subtract(daysToMonday, "day");
    return monday;
};
exports.getFirstMondayOfExtendedHalfWeek = getFirstMondayOfExtendedHalfWeek;
const getLastSundayOfExtendedHalfWeek = (date) => {
    const dayOfMonth = date.date();
    const targetDay = dayOfMonth <= 15 ? 15 : date.daysInMonth();
    const targetDate = date.date(targetDay);
    const dayOfWeek = targetDate.day();
    if (dayOfWeek === 0) {
        return targetDate;
    }
    const daysToSunday = (7 - dayOfWeek) % 7; // Days to add to reach Sunday
    const sunday = targetDate.add(daysToSunday, "day");
    return sunday;
};
exports.getLastSundayOfExtendedHalfWeek = getLastSundayOfExtendedHalfWeek;
const transformMxDateTimeToUtcStartOfDay = (date) => {
    const utcDate = (0, dayjs_1.default)(date).utc();
    return utcDate.startOf("day");
};
exports.transformMxDateTimeToUtcStartOfDay = transformMxDateTimeToUtcStartOfDay;
const transformMxDateTimeToEsStartOfDay = (date) => {
    const madridDate = (0, dayjs_1.default)(date).tz("Europe/Madrid");
    return madridDate.startOf("day");
};
exports.transformMxDateTimeToEsStartOfDay = transformMxDateTimeToEsStartOfDay;
const convertUtcDateToMexicoTimeStartOfDay = (utcDate) => {
    const dateString = dayjs_1.default.utc(utcDate).format("YYYY-MM-DD");
    return dayjs_1.default.tz(`${dateString}T00:00:00`, "America/Mexico_City");
};
exports.convertUtcDateToMexicoTimeStartOfDay = convertUtcDateToMexicoTimeStartOfDay;
const getMxDayjsDatetimeByDateAndTime = (date, time) => {
    return dayjs_1.default.tz(`${date}T${time}`, "America/Mexico_City");
};
exports.getMxDayjsDatetimeByDateAndTime = getMxDayjsDatetimeByDateAndTime;
const toMexicoStartOfDay = (date) => {
    const inputDateTime = (0, dayjs_1.default)(date);
    // spanish
    const spanishDate = (0, dayjs_1.default)(date).tz("Europe/Madrid").format("YYYY-MM-DD");
    // utc
    const utcDate = (0, dayjs_1.default)(date).tz("UTC").format("YYYY-MM-DD");
    const mexicoStartOfDay = getStartOfDayInTimezone(date, "America/Mexico_City");
    const spanishStartOfDay = getStartOfDayInTimezone(date, "Europe/Madrid");
    const utcStartOfDay = getStartOfDayInTimezone(date, "UTC");
    if (inputDateTime.isSame(mexicoStartOfDay, "day")) {
        return mexicoStartOfDay;
    }
    if (inputDateTime.isSame(spanishStartOfDay, "day")) {
        return dayjs_1.default.tz(spanishDate, "America/Mexico_City").startOf("day");
    }
    if (inputDateTime.isSame(utcStartOfDay, "day")) {
        return dayjs_1.default.tz(utcDate, "America/Mexico_City").startOf("day");
    }
    return utcStartOfDay;
};
exports.toMexicoStartOfDay = toMexicoStartOfDay;
const getStartOfDayInTimezone = (date, timezone) => {
    const localDate = (0, dayjs_1.default)(date).tz(timezone).format("YYYY-MM-DD");
    return (0, dayjs_1.default)(`${localDate}T00:00:00`).tz(timezone).startOf("day");
};
const getDayjsRangeFromDates = (startDate, endDate) => {
    const days = [];
    for (let date = startDate; date.isSameOrBefore(endDate); date = date.add(1, "day")) {
        days.push(date);
    }
    return days;
};
exports.getDayjsRangeFromDates = getDayjsRangeFromDates;
const calculateProportionalHours = (datetime1, datetime2) => {
    return (0, dayjs_1.default)(datetime2).diff((0, dayjs_1.default)(datetime1), "minutes") / 60;
};
exports.calculateProportionalHours = calculateProportionalHours;
const minutesBetweenDatetimes = (datetime1, datetime2) => {
    return (0, dayjs_1.default)(datetime2).diff((0, dayjs_1.default)(datetime1), "minutes");
};
exports.minutesBetweenDatetimes = minutesBetweenDatetimes;
const isDatetimeAfter = (datetime1, datetime2) => {
    return (0, dayjs_1.default)(datetime1).isAfter((0, dayjs_1.default)(datetime2));
};
exports.isDatetimeAfter = isDatetimeAfter;
const isDatetimeBefore = (datetime1, datetime2) => {
    return (0, dayjs_1.default)(datetime1).isBefore((0, dayjs_1.default)(datetime2));
};
exports.isDatetimeBefore = isDatetimeBefore;
const getPreviousSunday = (date) => {
    // Si el día es domingo (0), retorna la misma fecha
    return date.day() === 0 ? date : date.subtract(date.day(), "day");
};
exports.getPreviousSunday = getPreviousSunday;
