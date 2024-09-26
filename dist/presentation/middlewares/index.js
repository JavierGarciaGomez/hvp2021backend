"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = exports.AttachBaseUrlMiddleware = void 0;
var attachBaseUrl_middleware_1 = require("./attachBaseUrl.middleware");
Object.defineProperty(exports, "AttachBaseUrlMiddleware", { enumerable: true, get: function () { return attachBaseUrl_middleware_1.AttachBaseUrlMiddleware; } });
var auth_middleware_1 = require("./auth.middleware");
Object.defineProperty(exports, "AuthMiddleware", { enumerable: true, get: function () { return auth_middleware_1.AuthMiddleware; } });
__exportStar(require("./owner-or-admin.middleare"), exports);
