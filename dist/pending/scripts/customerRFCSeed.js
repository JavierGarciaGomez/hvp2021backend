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
require("dotenv").config();
const { dbConnection } = require("../database/config");
function seedCustomerRFC() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            dbConnection();
            // Clear existing records
            yield infrastructure_1.CustomerRFCModel.deleteMany({});
            const collaborators = yield infrastructure_1.CollaboratorModel.find().select("_id").exec();
            const customerRFCs = [];
            // Create 100 customer RFC records
            for (let i = 0; i < 100; i++) {
                const collaborator = collaborators[Math.floor(Math.random() * collaborators.length)]._id;
                const name = `Customer ${i + 1}`;
                const rfc = `RFC${String(i + 1).padStart(10, "0")}`;
                const invoiceUsage = ["G01", "G02", "G03", "P01"][i % 4];
                const fiscalRegime = [
                    "601",
                    "603",
                    "605",
                    "606",
                    "607",
                    "608",
                    "610",
                    "611",
                    "612",
                    "614",
                    "615",
                    "616",
                    "620",
                    "621",
                    "622",
                    "623",
                    "624",
                    "625",
                    "626",
                ][i % 19];
                const postalCode = String(97000 + (i % 100)).padStart(5, "0");
                const isValidated = i % 2 === 0;
                const createdAt = new Date(Date.now() - Math.floor(Math.random() * 1000000000));
                const updatedAt = new Date();
                customerRFCs.push({
                    name,
                    rfc,
                    invoice_usage: invoiceUsage,
                    fiscal_regime: fiscalRegime,
                    postal_code: postalCode,
                    isValidated,
                    createdBy: collaborator,
                    updatedBy: collaborator,
                    createdAt,
                    updatedAt,
                });
            }
            // Save all records
            yield infrastructure_1.CustomerRFCModel.insertMany(customerRFCs);
            console.log("CustomerRFC collection has been seeded with 100 elements.");
            yield mongoose_1.default.disconnect();
        }
        catch (error) {
            console.error("Error seeding data:", error);
            yield mongoose_1.default.disconnect();
        }
    });
}
seedCustomerRFC();
