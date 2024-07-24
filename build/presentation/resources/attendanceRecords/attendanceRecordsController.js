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
exports.AttendanceRecordsController = void 0;
const domain_1 = require("../../../domain");
const BaseError_1 = require("../../../shared/errors/BaseError");
const AttendanceRecordDto_1 = require("../../../domain/dtos/attendanceRecords/AttendanceRecordDto");
class AttendanceRecordsController {
    constructor(timeAttendanceService) {
        this.timeAttendanceService = timeAttendanceService;
        this.handleError = (error, res, next) => {
            next(error);
        };
        this.getAttendanceRecords = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = req.query;
                const paginationDto = domain_1.PaginationDto.create(Number(page), Number(limit));
                const response = yield this.timeAttendanceService.getAttendanceRecords(paginationDto);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getAttendanceRecordsByCollaborator = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = req.query;
                const paginationDto = domain_1.PaginationDto.create(Number(page), Number(limit));
                const collaboratorId = req.params.collaboratorId;
                const response = yield this.timeAttendanceService.getAttendanceRecordsByCollaborator(paginationDto, collaboratorId);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getCurrentAttendanceRecords = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = req.query;
                const paginationDto = domain_1.PaginationDto.create(Number(page), Number(limit));
                const response = yield this.timeAttendanceService.getCurrentAttendanceRecords(paginationDto);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getLastAttendanceRecordByCollaborator = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const collaboratorId = req.params.collaboratorId;
                const response = yield this.timeAttendanceService.getLastAttendanceRecordByCollaborator(collaboratorId);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getAttendanceRecordById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const response = yield this.timeAttendanceService.getAttendanceRecordById(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.createAttendanceRecord = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { authUser } = req;
                const body = req.body;
                const [error, dto] = AttendanceRecordDto_1.AttendanceRecordDto.create(body);
                if (error)
                    throw BaseError_1.BaseError.badRequest("Invalid data", error);
                const response = yield this.timeAttendanceService.createAttendanceRecord(dto, authUser);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateAttendanceRecord = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { authUser } = req;
                const body = req.body;
                const [error, dto] = AttendanceRecordDto_1.AttendanceRecordDto.update(body);
                if (error)
                    throw BaseError_1.BaseError.badRequest("Invalid request data", error);
                const response = yield this.timeAttendanceService.updateAttendanceRecord(id, dto, authUser);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteAttendanceRecord = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this.timeAttendanceService.deleteWorkLog(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AttendanceRecordsController = AttendanceRecordsController;
