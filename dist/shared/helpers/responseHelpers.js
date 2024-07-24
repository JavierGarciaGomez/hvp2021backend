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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchById = exports.fetchStaticList = exports.fetchList = exports.handleError = void 0;
const SuccessResponseFormatter_1 = require("../../presentation/services/SuccessResponseFormatter");
const BaseError_1 = require("../errors/BaseError");
const handleError = (error, res, next) => {
    next(error);
};
exports.handleError = handleError;
const fetchList = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { model, query, paginationDto, all, path, resourceName, sortingDto, populateOptions = [], } = params;
    const { page, limit } = paginationDto;
    try {
        let data;
        let total;
        // Prepare sorting options if provided
        const sortOptions = {};
        if (sortingDto && sortingDto.sort_by) {
            sortOptions[sortingDto.sort_by] =
                sortingDto.direction === "desc" ? -1 : 1;
        }
        // Check if 'all' is true or if page and limit are not provided
        if (all || page === undefined || limit === undefined) {
            data = yield model.find(query);
            total = data.length;
        }
        else {
            // Fetch paginated data
            total = yield model.countDocuments(query);
            data = yield model
                .find(query)
                .sort(sortOptions)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate(populateOptions);
        }
        const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatListResponse({
            data,
            page: page !== null && page !== void 0 ? page : 1,
            limit: limit !== null && limit !== void 0 ? limit : data.length,
            total,
            path,
            resource: resourceName,
        });
        return response;
    }
    catch (error) {
        throw BaseError_1.BaseError.internalServer("Internal Server Error");
    }
});
exports.fetchList = fetchList;
const fetchStaticList = ({ data, paginationDto, path, resourceName, }) => {
    const { page = 1, limit = data.length } = paginationDto;
    let paginatedData;
    if (!page || !limit) {
        paginatedData = data;
    }
    else {
        paginatedData = data.slice((page - 1) * limit, page * limit);
    }
    return SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatListResponse({
        data: paginatedData,
        page,
        limit,
        total: data.length,
        path,
        resource: resourceName,
    });
};
exports.fetchStaticList = fetchStaticList;
const fetchById = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { model, id, resourceName } = params;
    const data = yield model.findById(id);
    if (!data) {
        throw BaseError_1.BaseError.notFound(`${resourceName} not found`);
    }
    return SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
        data,
        resource: resourceName,
    });
});
exports.fetchById = fetchById;
