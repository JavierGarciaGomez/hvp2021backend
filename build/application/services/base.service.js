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
class BaseService {
    constructor(repository, entityClass) {
        this.repository = repository;
        this.entityClass = entityClass;
        this.create = (dto) => __awaiter(this, void 0, void 0, function* () {
            const entity = new this.entityClass(dto);
            return yield this.repository.create(entity);
        });
    }
    getAll(queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getAll(queryOptions);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getById(id);
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = new this.entityClass(dto);
            return yield this.repository.update(id, entity);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.delete(id);
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.count();
        });
    }
}
exports.BaseService = BaseService;
