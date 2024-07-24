"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollaboratorService = void 0;
const infrastructure_1 = require("../../infrastructure");
const services_1 = require("../services");
const createCollaboratorService = () => {
    const datasource = new infrastructure_1.CollaboratorDataSourceMongoImp();
    const repository = new infrastructure_1.CollaboratorRepositoryImpl(datasource);
    const service = new services_1.CollaboratorService(repository);
    return service;
};
exports.createCollaboratorService = createCollaboratorService;
