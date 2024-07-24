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
const mongoose_1 = __importDefault(require("mongoose"));
const infrastructure_1 = require("../../infrastructure");
const BillCreationInfoModel_1 = __importDefault(require("../../infrastructure/db/mongo/models/BillCreationInfoModel"));
require("dotenv").config();
const { dbConnection } = require("../database/config");
function customSeed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            dbConnection();
            // Clear existing records
            yield infrastructure_1.CustomerRFCModel.deleteMany({});
            yield BillCreationInfoModel_1.default.deleteMany({});
            console.log("CustomerRFC collection has been seeded with 100 elements.");
            yield mongoose_1.default.disconnect();
        }
        catch (error) {
            console.error("Error seeding data:", error);
            yield mongoose_1.default.disconnect();
        }
    });
}
customSeed();
