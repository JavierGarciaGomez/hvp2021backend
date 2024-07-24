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
exports.AttachBaseUrlMiddleware = void 0;
class AttachBaseUrlMiddleware {
    static attachBaseUrl(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine if the standard ports are being used
            const isStandardPort = (req.protocol === "http" && req.socket.localPort === 80) ||
                (req.protocol === "https" && req.socket.localPort === 443);
            // Construct baseUrl with or without port based on environment
            const baseUrl = isStandardPort
                ? `${req.protocol}://${req.hostname}/api/v1`
                : `${req.protocol}://${req.hostname}:${req.socket.localPort}/api/v1`;
            req.reqUrl = baseUrl;
            next();
        });
    }
}
exports.AttachBaseUrlMiddleware = AttachBaseUrlMiddleware;
