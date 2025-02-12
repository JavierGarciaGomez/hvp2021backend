"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilteringDto = void 0;
const BaseError_1 = require("../../../shared/errors/BaseError");
class FilteringDto {
    static create(params) {
        const instance = new FilteringDto();
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                if (key.startsWith("$")) {
                    const field = key.substring(1);
                    const colonIndex = params[key].indexOf(":");
                    const operator = params[key].substring(0, colonIndex);
                    const value = params[key].substring(colonIndex + 1).trim();
                    switch (operator) {
                        case "$gte":
                        case "$lte":
                        case "$eq":
                            const dateValue = new Date(value);
                            if (!isNaN(dateValue.getTime())) {
                                instance[field] = Object.assign(Object.assign({}, instance[field]), { [operator]: dateValue });
                            }
                            else if (!isNaN(Number(value))) {
                                instance[field] = Object.assign(Object.assign({}, instance[field]), { [operator]: Number(value) });
                            }
                            else {
                                instance[field] = Object.assign(Object.assign({}, instance[field]), { [operator]: value });
                            }
                            break;
                        case "$range":
                            const [startDate, endDate] = value
                                .split("...")
                                .map((dateStr) => dateStr.trim());
                            const parsedStartDate = new Date(startDate);
                            const parsedEndDate = new Date(endDate);
                            if (!isNaN(parsedStartDate.getTime()) &&
                                !isNaN(parsedEndDate.getTime())) {
                                instance[field] = {
                                    $gte: parsedStartDate,
                                    $lte: parsedEndDate,
                                };
                            }
                            else {
                                throw BaseError_1.BaseError.badRequest(`Invalid date range format for ${field}`);
                            }
                            break;
                        case "$regex":
                            instance[field] = { $regex: value, $options: "i" };
                            break;
                        case "$in":
                            const parseValue = (v) => {
                                const trimmed = v.trim();
                                const num = Number(trimmed);
                                if (!isNaN(num))
                                    return num;
                                const date = new Date(trimmed);
                                if (!isNaN(date.getTime()))
                                    return date;
                                return trimmed;
                            };
                            instance[field] = {
                                $in: value.startsWith("[")
                                    ? JSON.parse(value).map(parseValue)
                                    : value.split(",").map(parseValue),
                            };
                            break;
                        default:
                            throw BaseError_1.BaseError.badRequest(`Invalid operator ${operator}`);
                    }
                }
                else {
                    instance[key] = params[key];
                }
            }
        }
        return instance;
    }
}
exports.FilteringDto = FilteringDto;
