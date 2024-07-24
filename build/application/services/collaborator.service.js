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
exports.CollaboratorService = void 0;
const entities_1 = require("../../domain/entities");
const adapters_1 = require("../../infrastructure/adapters");
const base_service_1 = require("./base.service");
class CollaboratorService extends base_service_1.BaseService {
    constructor(repository) {
        super(repository, entities_1.CollaboratorEntity);
        this.repository = repository;
        this.count = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.count();
        });
        this.getAllPublic = (options) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getAllForWeb(options);
        });
        this.register = (dto) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.register(dto);
        });
        this.update = (id, dto) => __awaiter(this, void 0, void 0, function* () {
            if (dto.password)
                dto.password = adapters_1.bcryptAdapter.hash(dto.password);
            const collaborator = new entities_1.CollaboratorEntity(dto);
            return yield this.repository.update(id, collaborator);
        });
    }
}
exports.CollaboratorService = CollaboratorService;
