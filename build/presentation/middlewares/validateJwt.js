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
exports.validateJwt = void 0;
const adapters_1 = require("../../infrastructure/adapters");
const validateJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // x-token headers
        const token = req.header("x-token");
        console.log({ token });
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: "No hay token en la petición",
            });
        }
        const payload = yield adapters_1.JwtAdapter.verifyToken(token);
        const { uid, col_code, role, imgUrl } = payload;
        req.authenticatedCollaborator = {
            uid,
            col_code,
            role,
            imgUrl,
        };
        // req.uid = uid;
        // req.col_code = col_code;
        // req.role = role;
        // req.imgUrl = imgUrl;
    }
    catch (error) {
        // console.log("ERROR", error.message);
        return res.status(401).json({
            ok: false,
            msg: "Token no válido",
        });
    }
    next();
});
exports.validateJwt = validateJwt;
module.exports = {
    validateJwt: exports.validateJwt,
};
