"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcryptAdapter = void 0;
const bcryptjs_1 = require("bcryptjs");
exports.bcryptAdapter = {
    hash: (password) => {
        const salt = (0, bcryptjs_1.genSaltSync)();
        return (0, bcryptjs_1.hashSync)(password, salt);
    },
    compare: (password, hashed) => {
        return (0, bcryptjs_1.compareSync)(password, hashed);
    },
};
