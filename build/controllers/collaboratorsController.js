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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollaborator = exports.updateCollaborator = exports.getCollaboratorById = exports.registerCollaborator = exports.createCollaborator = exports.getCollaboratorsForWeb = exports.getCollaborators = exports.collaboratorLogin = void 0;
const Collaborator_1 = __importDefault(require("../models/Collaborator"));
const { response } = require("express");
const bcrypt = require("bcryptjs");
// const Usuario = require("../models/Usuario");
const { generateJWT } = require("../helpers/jwt");
const { body } = require("express-validator");
const { roleTypes } = require("../types/types");
const { uncatchedError } = require("../helpers/const");
const { isAuthorizedByRole, isAuthorizeByRoleOrOwnership, } = require("../helpers/utilities");
// todo: Delete. Now the login is equal for colls and user
const collaboratorLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const collaborator = yield Collaborator_1.default.findOne({ email });
        let isValid = false;
        if (collaborator) {
            const validPassword = bcrypt.compareSync(password, collaborator.password);
            if (validPassword) {
                isValid = true;
            }
        }
        if (!isValid) {
            return res.status(400).json({
                ok: false,
                msg: "Email o contraseña incorrecta",
            });
        }
        // Generar JWT
        const token = yield generateJWT(collaborator._id, collaborator.col_code, collaborator.role, collaborator.imgUrl);
        res.json({
            ok: true,
            uid: collaborator.id,
            token,
            col_code: collaborator.col_code,
            role: collaborator.role,
            imgUrl: collaborator.imgUrl,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Por favor hable con el administrador",
        });
    }
});
exports.collaboratorLogin = collaboratorLogin;
const getCollaborators = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { role } = (_a = req.authenticatedCollaborator) !== null && _a !== void 0 ? _a : {};
        const isAuthorized = isAuthorizedByRole(role, roleTypes.collaborator);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado para conocer los datos",
            });
        }
        const collaborators = yield Collaborator_1.default.find();
        res.json({
            ok: true,
            msg: "getCollaborators",
            collaborators,
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            msg: "Internal Server Error",
            statusCode: 500,
            error: error.message ||
                `An error occurred while fetching getCollaborators}.`,
        });
    }
});
exports.getCollaborators = getCollaborators;
const getCollaboratorsForWeb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collaborators = yield Collaborator_1.default.find({ isDisplayedWeb: true }, {
            first_name: 1,
            last_name: 1,
            col_code: 1,
            imgUrl: 1,
            position: 1,
            textPresentation: 1,
        });
        res.json({
            ok: true,
            msg: "getCollaborators",
            collaborators,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: "false",
            msg: "Por favor, hable con el administrador",
            error,
        });
    }
});
exports.getCollaboratorsForWeb = getCollaboratorsForWeb;
const createCollaborator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { col_code } = req.body;
        // get the uid of the creator
        const { role } = (_b = req.authenticatedCollaborator) !== null && _b !== void 0 ? _b : {};
        // check if the collaborator code is not used before
        let usedColCode = yield Collaborator_1.default.findOne({ col_code });
        if (usedColCode) {
            return res.status(400).json({
                ok: false,
                msg: "Ya existen usuarios con ese código de colaborador",
            });
        }
        const collaborator = new Collaborator_1.default(req.body);
        // check if is trying to create admin or manager
        if (collaborator.role === roleTypes.admin ||
            collaborator.role === roleTypes.manager) {
            const isAuthorized = isAuthorizedByRole(role, roleTypes.admin);
            if (!isAuthorized) {
                return res.json({
                    ok: false,
                    msg: "No estás autorizado",
                });
            }
        }
        const savedCollaborator = yield collaborator.save();
        res.status(201).json({
            ok: true,
            message: "collaborador creado con éxito",
            collaborator: savedCollaborator,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
exports.createCollaborator = createCollaborator;
// Register collaborator by user
const registerCollaborator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { col_code, email, accessCode, password } = req.body;
    try {
        // check if the collaborator code is not used before
        let usedMail = yield Collaborator_1.default.findOne({ email });
        if (usedMail) {
            return res.status(400).json({
                ok: false,
                msg: "Ya existe un colaborador registrado con ese email",
            });
        }
        let collaborator = yield Collaborator_1.default.findOne({ col_code });
        if (!collaborator) {
            return res.status(404).json({
                ok: false,
                msg: "No existe colaborador con ese ese código de acceso",
            });
        }
        if (collaborator.isRegistered) {
            return res.status(400).json({
                ok: false,
                msg: `Este usuario ha sido registrado previamente por este correo: ${collaborator.email}. Si el problema persiste contacte al gerente.`,
            });
        }
        if (collaborator.accessCode !== accessCode) {
            return res.status(400).json({
                ok: false,
                msg: "El código de acceso no coincide con el del colaborador que pretende ser registrado",
            });
        }
        // encrypt pass
        const salt = bcrypt.genSaltSync();
        const cryptedPassword = bcrypt.hashSync(password, salt);
        collaborator.password = cryptedPassword;
        collaborator.email = email;
        collaborator.isRegistered = true;
        let collaboratorId = collaborator.id;
        const updatedCollaborator = yield Collaborator_1.default.findByIdAndUpdate(collaborator._id, collaborator, { new: true });
        // JWT
        const token = yield generateJWT(collaboratorId, updatedCollaborator.col_code, updatedCollaborator.role, updatedCollaborator.imgUrl);
        res.status(201).json({
            ok: true,
            message: "collaborator updated",
            collaborator: updatedCollaborator,
            token,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
exports.registerCollaborator = registerCollaborator;
const getCollaboratorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.collaboratorId;
    try {
        // check if the collaborator code is not used before
        let collaborator = yield Collaborator_1.default.findById(id);
        if (!collaborator) {
            return res.status(404).json({
                ok: false,
                msg: "No existe colaborador con ese ese código de acceso",
            });
        }
        return res.status(201).json({
            ok: true,
            msg: "get Collaborator",
            collaborator,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
exports.getCollaboratorById = getCollaboratorById;
const updateCollaborator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const uid = req.uid;
    var _c;
    try {
        const collaboratorId = req.params.collaboratorId;
        const { role, uid } = (_c = req.authenticatedCollaborator) !== null && _c !== void 0 ? _c : {};
        const collaborator = yield Collaborator_1.default.findById(collaboratorId);
        if (!collaborator) {
            return res.status(404).json({
                ok: false,
                msg: "No existe colaborador con ese ese id",
            });
        }
        const newCollaborator = Object.assign({}, req.body);
        if (newCollaborator.role === roleTypes.admin ||
            newCollaborator.role === roleTypes.manager) {
            const isAuthorized = isAuthorizeByRoleOrOwnership(role, roleTypes.admin, uid, collaboratorId);
            if (!isAuthorized) {
                return res.json({
                    ok: false,
                    msg: "No estás autorizado",
                });
            }
        }
        const updatedCollaborator = yield Collaborator_1.default.findByIdAndUpdate(collaboratorId, newCollaborator, { new: true });
        res.json({
            ok: true,
            msg: "colaborador actualizado",
            collaborator: updatedCollaborator,
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            msg: "Internal Server Error",
            statusCode: 500,
            error: error.message ||
                `An error occurred while fetching getCollaborators}.`,
        });
    }
});
exports.updateCollaborator = updateCollaborator;
const deleteCollaborator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const collaboratorId = req.params.collaboratorId;
    try {
        const { role } = (_d = req.authenticatedCollaborator) !== null && _d !== void 0 ? _d : {};
        const isAuthorized = isAuthorizedByRole(role, roleTypes.admin);
        if (!isAuthorized) {
            return res.json({
                ok: false,
                msg: "No estás autorizado para conocer los datos",
            });
        }
        yield Collaborator_1.default.findByIdAndDelete(collaboratorId);
        res.json({
            ok: true,
            msg: "colaborador eliminado",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
});
exports.deleteCollaborator = deleteCollaborator;
