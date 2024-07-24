"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentMexicanDate = exports.isValidDateString = exports.isValidDate = exports.formatDateWithoutTime = exports.getEarliestDate = void 0;
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
