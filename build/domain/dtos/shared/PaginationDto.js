"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDto = void 0;
class PaginationDto {
    constructor(page, limit, all) {
        this.page = page;
        this.limit = limit;
        this.all = all;
    }
    static create(page = 1, limit = 10, all) {
        if (isNaN(page) || isNaN(limit))
            return ["Page and Limit must be numbers"];
        if (page <= 0)
            return ["Page must be greater than 0"];
        if (limit <= 0)
            return ["Limit must be greater than 0"];
        return [undefined, new PaginationDto(page, limit, all)];
    }
}
exports.PaginationDto = PaginationDto;
