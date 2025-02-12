"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintRouteMiddleware = void 0;
class PrintRouteMiddleware {
    static print(req, res, next) {
        console.log(`Method: ${req.method}, Path: ${req.path}, IP: ${req.ip}, Query: ${JSON.stringify(req.query)}`);
        next();
    }
}
exports.PrintRouteMiddleware = PrintRouteMiddleware;
