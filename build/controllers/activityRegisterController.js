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
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { uncatchedError } = require("../helpers/const");
const { roleTypes, authTypes } = require("../types/types");
const { registerLog, isAuthorizeByRoleOrOwnership, convertMongooseObjectIdToString, } = require("../helpers/utilities");
const ActivityRegister = require("../models/ActivityRegister");
const { default: CollaboratorModel } = require("../models/Collaborator");
// create new activity register
// todo: don't create if there is an open one of the same user
const createActivityRegister = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get uid from jwt
        const { uid } = req;
        // get body
        const { startingTime, endingTime, activity, comments } = req.body;
        if (!startingTime) {
            req.body.startingTime = new Date();
        }
        const collaborator = yield CollaboratorModel.findById(uid);
        console.log("este es el req.body", req.body);
        // remove id
        delete req.body._id;
        const activityRegister = new ActivityRegister(Object.assign(Object.assign({}, req.body), { collaborator }));
        const savedActivityRegister = yield activityRegister.save();
        res.status(201).json({
            ok: true,
            msg: "Creado con éxito",
            savedActivityRegister,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// get all
const getAllActivityRegisters = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allActivityRegisters = yield ActivityRegister.find().populate("collaborator", "imgUrl col_code");
        res.json({
            ok: true,
            msg: "generado",
            allActivityRegisters,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// get single
const getActiviyRegister = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the collaboratorId
        const id = req.params.activityRegister;
        let activityRegister = yield ActivityRegister.findById(id);
        res.json({
            ok: true,
            msg: "generado",
            activityRegister,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// get from a user
const getActiviyRegistersByCol = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the collaboratorId
        const id = req.params.collaboratorId;
        let activityRegisters = yield ActivityRegister.find({
            collaborator: id,
        });
        res.json({
            ok: true,
            msg: "generado",
            activityRegisters,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// get from a user
const updateActiviyRegister = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the activity register id
        const id = req.params.activityRegisterId;
        // get the data of the updater
        const { role, uid } = req;
        const activityRegister = yield ActivityRegister.findById(id);
        if (!activityRegister) {
            return res.status(404).json({
                ok: false,
                msg: "No existe data con ese id",
            });
        }
        const updateData = Object.assign({}, req.body);
        console.log(updateData);
        const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.admin, uid, convertMongooseObjectIdToString(activityRegister.collaborator._id));
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado",
            });
        }
        const updatedActivityRegister = yield ActivityRegister.findByIdAndUpdate(id, updateData, { new: true });
        res.json({
            ok: true,
            msg: "Éxito",
            updatedActivityRegister,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const deleteActivityRegister = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the activity register id
        const id = req.params.activityRegisterId;
        // get the data of the fetcher
        const { role, uid } = req;
        const activityRegister = yield ActivityRegister.findById(id);
        if (!activityRegister) {
            return res.status(404).json({
                ok: false,
                msg: "No existe data con ese ese id",
            });
        }
        const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.admin, uid, convertMongooseObjectIdToString(activityRegister.collaborator._id));
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado",
            });
        }
        yield ActivityRegister.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: "Éxito",
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
module.exports = {
    // userLogin,
    // userRenewToken,
    createActivityRegister,
    getAllActivityRegisters,
    getActiviyRegistersByCol,
    updateActiviyRegister,
    deleteActivityRegister,
    getActiviyRegister,
};
