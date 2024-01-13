"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponseFormatter = void 0;
const BaseError_1 = require("../../domain/errors/BaseError");
class SuccessResponseFormatter {
    static formatListResponse(options) {
        const { data, page, limit, total, path, resource } = options;
        return {
            status_code: BaseError_1.HttpStatusCode.OK,
            ok: true,
            status: BaseError_1.HttpStatusCode[BaseError_1.HttpStatusCode.OK],
            resource: resource,
            operation: "all",
            data: data,
            meta: {
                total,
                itemsOnPage: data.length,
                page,
                limit,
            },
            links: {
                next: page * limit < total
                    ? `${path}?page=${page + 1}&limit=${limit}`
                    : undefined,
                prev: page - 1 > 0 ? `${path}?page=${page - 1}&limit=${limit}` : undefined,
                current: `${path}?page=${page}&limit=${limit}`,
            },
        };
    }
    static formatGetOneResponse(options) {
        const { data, resource } = options;
        return {
            ok: true,
            status_code: BaseError_1.HttpStatusCode.OK,
            status: BaseError_1.HttpStatusCode[BaseError_1.HttpStatusCode.OK],
            resource: resource,
            operation: "one",
            data: data,
        };
    }
    static fortmatCreateResponse(options) {
        const { data, resource } = options;
        return {
            ok: true,
            status_code: BaseError_1.HttpStatusCode.CREATED,
            status: BaseError_1.HttpStatusCode[BaseError_1.HttpStatusCode.CREATED],
            resource: resource,
            operation: "add",
            data: data,
        };
    }
    static formatUpdateResponse(options) {
        const { data, resource } = options;
        return {
            ok: true,
            status_code: BaseError_1.HttpStatusCode.OK,
            status: BaseError_1.HttpStatusCode[BaseError_1.HttpStatusCode.OK],
            resource: resource,
            operation: "update",
            data: data,
        };
    }
    static formatDeleteResponse(options) {
        const { data, resource } = options;
        return {
            ok: true,
            status_code: BaseError_1.HttpStatusCode.OK,
            status: BaseError_1.HttpStatusCode[BaseError_1.HttpStatusCode.OK],
            resource: resource,
            operation: "delete",
            data: data,
        };
    }
}
exports.SuccessResponseFormatter = SuccessResponseFormatter;
