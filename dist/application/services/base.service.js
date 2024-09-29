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
exports.BaseService = void 0;
const shared_1 = require("../../shared");
class BaseService {
    constructor(repository, entityClass) {
        this.repository = repository;
        this.entityClass = entityClass;
        this.create = (dto) => __awaiter(this, void 0, void 0, function* () {
            const entity = new this.entityClass(dto);
            const result = yield this.repository.create(entity);
            return this.transformToResponse(result);
        });
        this.transformToResponse = (entity) => __awaiter(this, void 0, void 0, function* () {
            return entity;
        });
    }
    getAll(queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repository.getAll(queryOptions);
            return yield Promise.all(data.map(this.transformToResponse));
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.repository.getById(id);
            if (!entity) {
                throw shared_1.BaseError.notFound(`${this.getResourceName()} not found`);
            }
            return this.transformToResponse(entity);
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = new this.entityClass(dto);
            const result = yield this.repository.update(id, entity);
            return this.transformToResponse(result);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.delete(id);
        });
    }
    count(queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.count(queryOptions);
        });
    }
    updateMany(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.updateMany(entities);
            return yield Promise.all(result.map(this.transformToResponse));
        });
    }
    createMany(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.createMany(entities);
            return yield Promise.all(result.map(this.transformToResponse));
        });
    }
}
exports.BaseService = BaseService;
