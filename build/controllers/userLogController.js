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
const { response } = require("express");
const { uncatchedError } = require("../helpers/const");
const { roleTypes } = require("../types/types");
const { isAuthorizedByRole } = require("../helpers/utilities");
const UserLog = require("../models/UserLog");
const getLogs = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // from token
        const { role } = req;
        const isAuthorized = isAuthorizedByRole(role, roleTypes.collaborator);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado para conocer los datos",
            });
        }
        const authLogs = yield UserLog.find().populate("user", "imgUrl col_code");
        res.json({
            ok: true,
            msg: "user logs",
            authLogs,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
module.exports = {
    getLogs,
};
