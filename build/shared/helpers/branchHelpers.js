"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidBranch = void 0;
const interfaces_1 = require("../interfaces");
const isValidBranch = (branch) => {
    return Object.values(interfaces_1.Branch).includes(branch);
};
exports.isValidBranch = isValidBranch;
