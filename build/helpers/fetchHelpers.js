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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResource = void 0;
const TaskModel_1 = __importDefault(require("../data/models/TaskModel"));
const TimeOffRequestModel_1 = __importDefault(require("../data/models/TimeOffRequestModel"));
const Collaborator_1 = __importDefault(require("../models/Collaborator"));
const getResource = (baseUrl, resourceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        switch (baseUrl) {
            case "/api/time-off-requests":
                return (yield TimeOffRequestModel_1.default.findById(resourceId));
            case "/api/tasks":
                return (yield TaskModel_1.default.findById(resourceId));
            // Add more cases for other routes
            default:
                return (yield Collaborator_1.default.findById(resourceId));
        }
    }
    catch (error) {
        throw new Error(error.message || `An error occurred while fetching `);
    }
});
exports.getResource = getResource;
