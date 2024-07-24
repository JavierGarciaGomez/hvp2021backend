"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDto = void 0;
const BaseError_1 = require("../../../shared/errors/BaseError");
// todo I want that default pagination is all
class PaginationDto {
    constructor(page, limit) {
        this.page = page;
        this.limit = limit;
    }
    static create(page, limit) {
        if ((page && isNaN(page)) || (limit && isNaN(limit))) {
            throw BaseError_1.BaseError.badRequest("Page and Limit must be numbers");
        }
        return new PaginationDto(page, limit);
    }
}
exports.PaginationDto = PaginationDto;
