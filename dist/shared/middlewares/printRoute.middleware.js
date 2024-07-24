"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintRouteMiddleware = void 0;
class PrintRouteMiddleware {
    static print(req, res, next) {
        console.log(`Method: ${req.method}, Path: ${req.path}, IP: ${req.ip}`);
        next();
    }
}
exports.PrintRouteMiddleware = PrintRouteMiddleware;
