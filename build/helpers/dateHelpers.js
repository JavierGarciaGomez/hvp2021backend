"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateWithoutTime = exports.getEarliestDate = void 0;
const getEarliestDate = (dates) => {
    const earliestDate = new Date(Math.min(...dates.map((date) => date.getTime())));
    return earliestDate;
};
exports.getEarliestDate = getEarliestDate;
const formatDateWithoutTime = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
exports.formatDateWithoutTime = formatDateWithoutTime;
