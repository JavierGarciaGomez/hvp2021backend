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
exports.BaseRepositoryImpl = void 0;
class BaseRepositoryImpl {
    constructor(datasource) {
        this.datasource = datasource;
    }
    getAll(queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.datasource.getAll(queryOptions);
        });
    }
    create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.datasource.create(entity);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.datasource.getById(id);
        });
    }
    update(id, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.datasource.update(id, entity);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.datasource.delete(id);
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.datasource.count();
        });
    }
    exists(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.datasource.exists(query);
        });
    }
    createMany(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.datasource.createMany(entities);
        });
    }
}
exports.BaseRepositoryImpl = BaseRepositoryImpl;
