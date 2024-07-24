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
const { uncatchedError } = require("../helpers/const");
const { isAuthorizeByRoleOrOwnership, isAuthorizedByRole, registerLog, } = require("../helpers/utilities");
const { roleTypes, authTypes } = require("../types/types");
const { CollaboratorModel } = require("../../infrastructure");
const createUser = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        const { email, password } = req.body;
        // check if the collaborator code is not used before
        let usedMail = yield CollaboratorModel.findOne({ email });
        if (!usedMail) {
            usedMail = yield User.findOne({ email });
        }
        if (usedMail) {
            return res.status(400).json({
                ok: false,
                msg: "Ya existe un usuario registrado con ese email",
            });
        }
        // encrypt pass
        const salt = bcrypt.genSaltSync();
        const cryptedPassword = bcrypt.hashSync(password, salt);
        const user = new User(req.body);
        user.password = cryptedPassword;
        const savedUser = yield user.save();
        // Generate JWT
        const token = yield generateJWT(savedUser._id, savedUser.col_code, savedUser.role, savedUser.imgUrl);
        // generate the log
        registerLog("user", savedUser, authTypes.login);
        res.status(201).json({
            ok: true,
            message: "usuario creado con éxito",
            user: savedUser,
            token,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const getUsers = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
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
        const users = yield User.find().populate("linkedFcmPartners linkedDogs linkedFcmPackages linkedFcmTransfers");
        res.json({
            ok: true,
            msg: "getUsers",
            users,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const getUser = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // from token
        const { uid, role } = req;
        // from params
        const reqUserId = req.params.userId;
        // validate authorization
        const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.collaborator, uid, reqUserId);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado para conocer los datos de este usuario",
            });
        }
        let user = yield User.findById(reqUserId).populate("linkedFcmPartners linkedDogs linkedFcmPackages linkedFcmTransfers");
        res.json({
            ok: true,
            msg: "getUser",
            user,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const updateUser = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // from token
        const { uid, role } = req;
        const { password } = req.body;
        // from params
        const reqUserId = req.params.userId;
        // validate authorization
        const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.collaborator, uid, reqUserId);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado para conocer los datos de este usuario",
            });
        }
        let user = yield User.findById(reqUserId);
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: "No existe usuario con ese ese id",
            });
        }
        const tempUser = Object.assign({}, req.body);
        if (password) {
            // encrypt pass
            const salt = bcrypt.genSaltSync();
            const cryptedPassword = bcrypt.hashSync(password, salt);
            tempUser.password = cryptedPassword;
        }
        const updatedUser = yield User.findByIdAndUpdate(reqUserId, tempUser, {
            new: true,
        });
        res.json({
            ok: true,
            msg: "Usuario actualizado",
            updatedUser,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const deleteUser = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // from token
        const { uid, role } = req;
        // from params
        const reqUserId = req.params.userId;
        // validate authorization
        const isAuthorized = isAuthorizedByRole(role, roleTypes.admin);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado",
            });
        }
        yield User.findByIdAndDelete(reqUserId);
        res.json({
            ok: true,
            msg: "Usuario eliminado",
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// fcmPartner
const unlinkFcmPartner = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // from token
        const { uid, role } = req;
        // from params
        const { userId, fcmPartnerId } = req.params;
        console.log("estos son los parámetros", userId, fcmPartnerId);
        const user = yield User.findById(userId);
        // validate authorization
        const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.collaborator, uid, user.id);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado",
            });
        }
        console.log("esto es el user", user);
        // remove linkFcmPartner
        user.linkedFcmPartners = user.linkedFcmPartners.filter((element) => element.toString() !== fcmPartnerId);
        const updatedUser = yield User.findByIdAndUpdate(userId, Object.assign({}, user), {
            new: true,
        });
        res.json({
            ok: true,
            msg: "Usuario actualizado",
            updatedUser,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const linkFcmPartner = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // from token
        const { uid, role } = req;
        // from params
        const { userId, fcmPartnerId } = req.params;
        const user = yield User.findById(userId);
        // validate authorization
        const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.collaborator, uid, user.id);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado",
            });
        }
        // remove linkFcmPartner
        user.linkedFcmPartners = user.linkedFcmPartners.push(fcmPartnerId);
        const updatedUser = yield User.findByIdAndUpdate(userId, Object.assign({}, user), {
            new: true,
        });
        res.json({
            ok: true,
            msg: "Usuario actualizado",
            updatedUser,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const unlinkDog = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // from token
        const { uid, role } = req;
        // from params
        const { userId, dogId } = req.params;
        const user = yield User.findById(userId);
        // validate authorization
        const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.collaborator, uid, user.id);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado",
            });
        }
        // remove dog
        user.linkedDogs = user.linkedDogs.filter((element) => element.toString() !== dogId);
        const updatedUser = yield User.findByIdAndUpdate(userId, Object.assign({}, user), {
            new: true,
        });
        res.json({
            ok: true,
            msg: "Usuario actualizado",
            updatedUser,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const linkDog = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // from token
        const { uid, role } = req;
        // from params
        const { userId, dogId } = req.params;
        const user = yield User.findById(userId);
        // validate authorization
        const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.collaborator, uid, user.id);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado",
            });
        }
        // remove linkFcmPartner
        user.linkedDogs = user.linkedDogs.push(dogId);
        const updatedUser = yield User.findByIdAndUpdate(userId, Object.assign({}, user), {
            new: true,
        });
        res.json({
            ok: true,
            msg: "Usuario actualizado",
            updatedUser,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// FCM TRANSFERS
const unlinkFcmTransfer = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // from token
        const { uid, role } = req;
        // from params
        const { userId, fcmTransferId } = req.params;
        const user = yield User.findById(userId);
        // validate authorization
        const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.collaborator, uid, user.id);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado",
            });
        }
        // remove dog
        user.linkedFcmTransfers = user.linkedFcmTransfers.filter((element) => element.toString() !== fcmTransferId);
        const updatedUser = yield User.findByIdAndUpdate(userId, Object.assign({}, user), {
            new: true,
        });
        res.json({
            ok: true,
            msg: "Usuario actualizado",
            updatedUser,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const linkFcmTransfer = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // from token
        const { uid, role } = req;
        // from params
        const { userId, fcmtransferId } = req.params;
        const user = yield User.findById(userId);
        // validate authorization
        const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.collaborator, uid, user.id);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado",
            });
        }
        // remove linkFcmPartner
        user.linkedFcmTransfers = user.linkedFcmTransfers.push(fcmtransferId);
        const updatedUser = yield User.findByIdAndUpdate(userId, Object.assign({}, user), {
            new: true,
        });
        res.json({
            ok: true,
            msg: "Usuario actualizado",
            updatedUser,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// FCM PACKAGES
const unlinkFcmPackage = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // from token
        const { uid, role } = req;
        // from params
        const { userId, fcmPackageId } = req.params;
        const user = yield User.findById(userId);
        // validate authorization
        const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.collaborator, uid, user.id);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado",
            });
        }
        // remove fcmtransfer
        user.linkedFcmPackages = user.linkedFcmPackages.filter((element) => element.toString() !== fcmPackageId);
        const updatedUser = yield User.findByIdAndUpdate(userId, Object.assign({}, user), {
            new: true,
        });
        res.json({
            ok: true,
            msg: "Usuario actualizado",
            updatedUser,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const linkFcmPackage = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // from token
        const { uid, role } = req;
        // from params
        const { userId, fcmPackageId } = req.params;
        const user = yield User.findById(userId);
        // validate authorization
        const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.collaborator, uid, user.id);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado",
            });
        }
        // remove linkFcmPartner
        user.linkedFcmPackages = user.linkedFcmPackages.push(fcmPackageId);
        const updatedUser = yield User.findByIdAndUpdate(userId, Object.assign({}, user), {
            new: true,
        });
        res.json({
            ok: true,
            msg: "Usuario actualizado",
            updatedUser,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
module.exports = {
    // userLogin,
    // userRenewToken,
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    unlinkFcmPartner,
    linkFcmPartner,
    linkDog,
    unlinkDog,
    linkFcmTransfer,
    unlinkFcmTransfer,
    linkFcmPackage,
    unlinkFcmPackage,
};
