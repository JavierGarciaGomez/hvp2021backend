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
exports.CollaboratorDataSourceMongoImp = void 0;
const domain_1 = require("../../domain");
const shared_1 = require("../../shared");
const helpers_1 = require("../../shared/helpers");
const db_1 = require("../db");
const base_datasource_mongo_1 = require("./base.datasource.mongo");
class CollaboratorDataSourceMongoImp extends base_datasource_mongo_1.BaseDatasourceMongoImp {
    constructor() {
        super(db_1.CollaboratorModel, domain_1.CollaboratorEntity);
    }
    register(collaboratorArg) {
        return __awaiter(this, void 0, void 0, function* () {
            const usedEmail = yield db_1.CollaboratorModel.findOne({
                email: collaboratorArg.email,
            });
            if (usedEmail) {
                throw shared_1.BaseError.conflict("Email already in use");
            }
            const resource = yield db_1.CollaboratorModel.findOne({
                col_code: collaboratorArg.col_code,
            });
            if (!resource) {
                throw shared_1.BaseError.notFound("Resource not found with provided collaborator code");
            }
            if (resource.isRegistered) {
                throw shared_1.BaseError.conflict("Collaborator already registered");
            }
            if (resource.accessCode !== collaboratorArg.accessCode) {
                throw shared_1.BaseError.unauthorized("Invalid access code");
            }
            resource.email = collaboratorArg.email;
            resource.isRegistered = true;
            resource.registeredDate = new Date();
            const updated = yield db_1.CollaboratorModel.findByIdAndUpdate(resource._id, resource, { new: true });
            if (!updated) {
                throw shared_1.BaseError.internalServer("Error registering collaborator");
            }
            return domain_1.CollaboratorEntity.fromDocument(updated);
        });
    }
    getAllForWeb(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, helpers_1.getAllHelper)(db_1.CollaboratorModel, options);
            return result.map((collaborator) => domain_1.CollaboratorEntity.fromDocument(collaborator).toPublicCollaborator());
        });
    }
    create(collaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCollaborator = yield this.exists({
                $or: [
                    { col_code: collaborator.col_code },
                    { email: { $exists: true, $ne: "", $eq: collaborator.email } },
                ],
            });
            if (existingCollaborator) {
                throw shared_1.BaseError.conflict("Collaborator with the same col_code or email already exists");
            }
            const newCollaborator = new db_1.CollaboratorModel(collaborator);
            yield newCollaborator.save();
            return domain_1.CollaboratorEntity.fromDocument(newCollaborator);
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.CollaboratorModel.countDocuments();
        });
    }
}
exports.CollaboratorDataSourceMongoImp = CollaboratorDataSourceMongoImp;
