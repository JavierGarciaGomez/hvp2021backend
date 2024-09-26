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
__exportStar(require("./activity-register-type.datasource.mongo-imp"), exports);
__exportStar(require("./activity-register.datasource.mongo-imp"), exports);
__exportStar(require("./base.datasource.mongo-imp"), exports);
__exportStar(require("./collaborator.datasource.mongo-imp"), exports);
__exportStar(require("./controlled-prescription.datasource.mongo-imp"), exports);
__exportStar(require("./notification.datasource.mongo-imp"), exports);
__exportStar(require("./product.datasource.mongo-imp"), exports);
__exportStar(require("./supplier.datasource.mongo-imp"), exports);
__exportStar(require("./missing-product.datasource.mongo-imp"), exports);
