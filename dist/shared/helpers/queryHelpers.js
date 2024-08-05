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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHelper = exports.buildQueryOptions = void 0;
const filtering_dto_1 = require("../../application/dtos/shared/filtering.dto");
const domain_1 = require("../../domain");
const buildQueryOptions = (queryParams) => {
    const { page, limit, sort_by, direction } = queryParams, filterParams = __rest(queryParams, ["page", "limit", "sort_by", "direction"]);
    const paginationDto = domain_1.PaginationDto.create(page, limit);
    const sortingDto = domain_1.SortingDto.create(sort_by, direction);
    const filteringDto = filtering_dto_1.FilteringDto.create(filterParams);
    return {
        paginationDto,
        sortingDto,
        filteringDto,
    };
};
exports.buildQueryOptions = buildQueryOptions;
const getAllHelper = (model, queryOptions) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { paginationDto, filteringDto, sortingDto } = queryOptions;
    const sortField = sortingDto.sort_by || "updated_at";
    const sortDirection = sortingDto.direction === "asc" ? 1 : -1;
    const page = paginationDto.page || 1; // Default to 1 if page is not provided
    const limit = (_a = paginationDto.limit) !== null && _a !== void 0 ? _a : 0;
    const result = yield model
        .find(filteringDto)
        .sort({ [sortField]: sortDirection })
        .skip((page - 1) * limit) // Correct skip calculation
        .limit(limit);
    return result;
});
exports.getAllHelper = getAllHelper;