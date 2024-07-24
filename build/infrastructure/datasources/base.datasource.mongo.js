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
exports.BaseDatasourceMongoImp = void 0;
const shared_1 = require("../../shared");
const helpers_1 = require("../../shared/helpers");
class BaseDatasourceMongoImp {
    constructor(model, entity) {
        this.model = model;
        this.entity = entity;
    }
    getAll(queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, helpers_1.getAllHelper)(this.model, queryOptions);
            return result.map(this.entity.fromDocument);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model.findById(id);
            if (!entity) {
                throw shared_1.BaseError.notFound("Entity not found");
            }
            return this.entity.fromDocument(entity);
        });
    }
    create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdEntity = yield this.model.create(entity);
            yield createdEntity.save();
            return this.entity.fromDocument(createdEntity);
        });
    }
    update(id, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedEntity = yield this.model.findByIdAndUpdate(id, entity, {
                new: true,
            });
            if (!updatedEntity) {
                throw shared_1.BaseError.notFound("Entity not found");
            }
            return this.entity.fromDocument(updatedEntity);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedEntity = yield this.model.findByIdAndDelete(id);
            if (!deletedEntity) {
                throw shared_1.BaseError.notFound("Entity not found");
            }
            return id;
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments();
        });
    }
    exists(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findOne(query);
            return result !== null;
        });
    }
    createMany(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdEntities = yield this.model.insertMany(entities);
            return createdEntities.map(this.entity.fromDocument);
        });
    }
    updateMany(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedEntities = yield Promise.all(entities.map((entity) => __awaiter(this, void 0, void 0, function* () {
                const updatedEntity = yield this.model.findByIdAndUpdate(entity.id, entity, {
                    new: true,
                });
                if (!updatedEntity) {
                    throw shared_1.BaseError.notFound("Entity not found");
                }
                return this.entity.fromDocument(updatedEntity);
            })));
            return updatedEntities;
        });
    }
}
exports.BaseDatasourceMongoImp = BaseDatasourceMongoImp;
