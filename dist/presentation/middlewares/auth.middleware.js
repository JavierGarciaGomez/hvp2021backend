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
exports.AuthMiddleware = void 0;
const shared_1 = require("../../shared");
const adapters_1 = require("../../infrastructure/adapters");
const infrastructure_1 = require("../../infrastructure");
class AuthMiddleware {
    static validateJWT(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authorization = req.header("Authorization");
                if (!authorization)
                    throw shared_1.BaseError.unauthorized("Authorization header not found");
                if (!authorization.startsWith("Bearer "))
                    return shared_1.BaseError.unauthorized("Invalid token format");
                const token = authorization.split(" ").at(1) || "";
                const payload = yield adapters_1.JwtAdapter.verifyToken(token);
                if (!payload)
                    return res.status(401).json({ error: "Invalid token" });
                const user = yield infrastructure_1.CollaboratorModel.findById(payload.uid);
                if (!user)
                    return res.status(401).json({ error: "Invalid token - user" });
                // todo: validar si el usuario está activo
                req.authUser = {
                    uid: user._id,
                    col_code: user.col_code,
                    role: user.role,
                    imgUrl: user.imgUrl,
                };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
