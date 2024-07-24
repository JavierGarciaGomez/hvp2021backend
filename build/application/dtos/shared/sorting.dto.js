"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortingDto = void 0;
const BaseError_1 = require("../../../shared/errors/BaseError");
class SortingDto {
    // Private constructor to prevent instantiation from outside
    constructor(sort_by, direction) {
        this.sort_by = sort_by;
        this.direction = direction;
    }
    static create(sort_by, direction) {
        if (sort_by !== undefined && typeof sort_by !== "string") {
            throw BaseError_1.BaseError.badRequest("sort_by must be a string");
        }
        if (direction && direction !== "asc" && direction !== "desc") {
            throw BaseError_1.BaseError.badRequest("Direction must be asc or desc");
        }
        return new SortingDto(sort_by, direction);
    }
}
exports.SortingDto = SortingDto;
