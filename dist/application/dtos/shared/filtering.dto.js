"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilteringDto = void 0;
const BaseError_1 = require("../../../shared/errors/BaseError");
class FilteringDto {
    // [key: string]: string | undefined;
    static create(params) {
        const instance = new FilteringDto();
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                if (key.startsWith("$")) {
                    const field = key.substring(1);
                    const colonIndex = params[key].indexOf(":");
                    const operator = params[key].substring(0, colonIndex);
                    const value = params[key].substring(colonIndex + 1).trim();
                    // Parse value based on operator and expected type
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
                        case "$regex":
                            instance[field] = { $regex: value, $options: "i" };
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
