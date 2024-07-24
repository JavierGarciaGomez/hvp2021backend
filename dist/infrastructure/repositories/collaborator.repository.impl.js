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
exports.CollaboratorRepositoryImpl = void 0;
const base_repository_imp_1 = require("./base.repository.imp");
class CollaboratorRepositoryImpl extends base_repository_imp_1.BaseRepositoryImpl {
    constructor(datasource) {
        super(datasource);
        this.datasource = datasource;
    }
    register(collaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.datasource.register(collaborator);
        });
    }
    getAllForWeb(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.datasource.getAllForWeb(options);
        });
    }
}
exports.CollaboratorRepositoryImpl = CollaboratorRepositoryImpl;
