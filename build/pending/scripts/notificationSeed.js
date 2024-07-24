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
const adapters_1 = require("../../infrastructure/adapters");
const shared_1 = require("../../shared");
const infrastructure_1 = require("../../infrastructure");
const domain_1 = require("../../domain");
const MONGO_URI = "your_mongo_db_connection_string";
const seedNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ envsPlugin: adapters_1.envsPlugin });
    try {
        const { MONGO_URL, MONGO_DB_NAME } = (0, shared_1.getEnvsByEnvironment)();
        yield infrastructure_1.MongoDatabase.connect({
            mongoUrl: MONGO_URL,
            dbName: MONGO_DB_NAME,
        });
        const notifications = Array.from({ length: 20 }).map((_, index) => ({
            user: new mongoose_1.default.Types.ObjectId(), // Replace with actual user IDs
            title: `Notification Title ${index + 1}`,
            message: `This is the message for notification ${index + 1}`,
            referenceId: `ref${index + 1}`,
            referenceType: domain_1.NotificationReferenceType.AUTH_ACTIVITY, // Replace with actual reference type
            actionType: domain_1.NotificationActionType.ASSIGNED, // Replace with actual action type
            read: false,
            createdBy: new mongoose_1.default.Types.ObjectId(), // Replace with actual user IDs
            updatedBy: new mongoose_1.default.Types.ObjectId(), // Replace with actual user IDs
        }));
        yield infrastructure_1.NotificationModel.insertMany(notifications);
        console.log("Seed data inserted successfully");
    }
    catch (error) {
        console.error("Error seeding data:", error);
    }
    finally {
        yield mongoose_1.default.disconnect();
    }
});
seedNotifications();
