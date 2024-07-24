"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilteringDto = void 0;
const BaseError_1 = require("../../../shared/errors/BaseError");
class FilteringDto {
    static create(params) {
        const instance = new FilteringDto();
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                instance[key] = params[key];
            }
        }
        if (instance.created_at && isNaN(Date.parse(instance.created_at))) {
            throw BaseError_1.BaseError.badRequest("Invalid date format for created_at");
        }
        if (instance.updated_at && isNaN(Date.parse(instance.updated_at))) {
            throw BaseError_1.BaseError.badRequest("Invalid date format for updated_at");
        }
        return instance;
    }
}
exports.FilteringDto = FilteringDto;
