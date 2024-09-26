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
exports.NotificationService = void 0;
const entities_1 = require("../../domain/entities");
const base_service_1 = require("./base.service");
const create_collaborator_service_factory_1 = require("../factories/create-collaborator-service.factory");
const shared_1 = require("../../shared");
const domain_1 = require("../../domain");
class NotificationService extends base_service_1.BaseService {
    constructor(repository) {
        super(repository, entities_1.NotificationEntity);
        this.repository = repository;
        this.notifyManagers = (_a) => __awaiter(this, [_a], void 0, function* ({ message, referenceId, referenceType, actionType, title, }) {
            const collaboratorService = (0, create_collaborator_service_factory_1.createCollaboratorService)();
            const options = (0, shared_1.buildQueryOptions)({
                role: [domain_1.CollaboratorRole.admin, domain_1.CollaboratorRole.admin],
            });
            const managers = yield collaboratorService.getAll(options);
            const managerIds = managers.map((manager) => manager.id);
            return yield this.notifyCollaborators({
                message,
                referenceId,
                referenceType,
                actionType,
                collaboratorIds: managerIds,
                title,
            });
        });
    }
    notifyCollaborators(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message, referenceId, referenceType, actionType, collaboratorIds, title, }) {
            const notifications = collaboratorIds.map((collaboratorId) => {
                return new entities_1.NotificationEntity({
                    user: collaboratorId,
                    title,
                    message,
                    referenceId,
                    referenceType,
                    actionType,
                    read: false,
                });
            });
            yield this.repository.createMany(notifications);
        });
    }
    notifyCollaborator(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message, referenceId, referenceType, actionType, collaboratorId, title, }) {
            const notification = new entities_1.NotificationEntity({
                user: collaboratorId,
                title,
                message,
                referenceId,
                referenceType,
                actionType,
                read: false,
            });
            yield this.repository.create(notification);
        });
    }
    getResourceName() {
        return "notification";
    }
}
exports.NotificationService = NotificationService;
