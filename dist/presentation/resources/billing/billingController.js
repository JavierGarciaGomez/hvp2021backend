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
exports.BillingController = void 0;
const domain_1 = require("../../../domain");
const BaseError_1 = require("../../../shared/errors/BaseError");
class BillingController {
    constructor(service) {
        this.service = service;
        this.handleError = (error, res, next) => {
            next(error);
        };
        this.getCustomerRFCs = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = req.query;
                const paginationDto = domain_1.PaginationDto.create(Number(page), Number(limit));
                const response = yield this.service.getCustomerRFCs(paginationDto);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getRecordById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const response = yield this.service.getRecordById(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.createCustomerRFC = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { authUser } = req;
                const body = req.body;
                const [error, dto] = domain_1.CustomerRFCDTO.create(body);
                if (error)
                    throw BaseError_1.BaseError.badRequest("Invalid data", error);
                const response = yield this.service.createCustomerRFC(dto, authUser);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.updateCustomerRFC = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { authUser } = req;
                const body = req.body;
                const [error, dto] = domain_1.CustomerRFCDTO.update(body);
                if (error)
                    throw BaseError_1.BaseError.badRequest("Invalid request data", error);
                const response = yield this.service.updateCustomerRFC(id, dto, authUser);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.deleteCustomerRFC = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this.service.deleteRecord(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.getFiscalRegimes = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = req.query;
                const paginationDto = domain_1.PaginationDto.create(Number(page), Number(limit));
                const response = yield this.service.getFiscalRegimes(paginationDto);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getInvoiceUsages = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = req.query;
                const paginationDto = domain_1.PaginationDto.create(Number(page), Number(limit));
                const response = yield this.service.getInvoiceUsages(paginationDto);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getPaymentMethods = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = req.query;
                const paginationDto = domain_1.PaginationDto.create(Number(page), Number(limit));
                const response = yield this.service.getPaymentMethods(paginationDto);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.createBillCreationInfo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { authUser } = req;
                const body = req.body;
                const [error, dto] = domain_1.BillCreationInfoDTO.create(body);
                if (error)
                    throw BaseError_1.BaseError.badRequest("Invalid data", error);
                const response = yield this.service.createBillCreationInfo(dto, authUser);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getBillCreationInfoList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = req.query;
                const paginationDto = domain_1.PaginationDto.create(Number(page), Number(limit));
                const response = yield this.service.getBillCreationInfoList(paginationDto);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getBillCreationInfoById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const response = yield this.service.getBillCreationInfoById(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.updateBillCreationInfo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const { authUser } = req;
                const body = req.body;
                const [error, dto] = domain_1.BillCreationInfoDTO.update(body);
                if (error)
                    throw BaseError_1.BaseError.badRequest("Invalid request data", error);
                const response = yield this.service.updateBillCreationInfo(id, dto, authUser);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.deleteBillCreationInfo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this.service.deleteBillCreationInfo(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.BillingController = BillingController;
