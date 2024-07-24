"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFormatterService = void 0;
const adapters_1 = require("../../infrastructure/adapters");
const enums_1 = require("../../shared/enums");
class ResponseFormatterService {
    static formatListResponse(options) {
        const { data, page, limit, total, path, resource } = options;
        const fullPath = adapters_1.envsPlugin.BASE_URL + path;
        return {
            status_code: enums_1.HttpStatusCode.OK,
            ok: true,
            status: enums_1.HttpStatusCode[enums_1.HttpStatusCode.OK],
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
                    ? `${fullPath}?page=${page + 1}&limit=${limit}`
                    : undefined,
                prev: page - 1 > 0
                    ? `${fullPath}?page=${page - 1}&limit=${limit}`
                    : undefined,
                current: `${fullPath}?page=${page}&limit=${limit}`,
            },
        };
    }
    static formatGetOneResponse(options) {
        const { data, resource } = options;
        return {
            ok: true,
            status_code: enums_1.HttpStatusCode.OK,
            status: enums_1.HttpStatusCode[enums_1.HttpStatusCode.OK],
            resource: resource,
            operation: "one",
            data: data,
        };
    }
    static formatCreateResponse(options) {
        const { data, resource } = options;
        return {
            ok: true,
            status_code: enums_1.HttpStatusCode.CREATED,
            status: enums_1.HttpStatusCode[enums_1.HttpStatusCode.CREATED],
            resource: resource,
            operation: "add",
            data: data,
        };
    }
    static formatUpdateResponse(options) {
        const { data, resource } = options;
        return {
            ok: true,
            status_code: enums_1.HttpStatusCode.OK,
            status: enums_1.HttpStatusCode[enums_1.HttpStatusCode.OK],
            resource: resource,
            operation: "update",
            data: data,
        };
    }
    static formatDeleteResponse(options) {
        const { data, resource } = options;
        return {
            ok: true,
            status_code: enums_1.HttpStatusCode.OK,
            status: enums_1.HttpStatusCode[enums_1.HttpStatusCode.OK],
            resource: resource,
            operation: "delete",
            data: data,
        };
    }
}
exports.ResponseFormatterService = ResponseFormatterService;
