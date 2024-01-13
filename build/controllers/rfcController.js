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
const Collaborator = require("../models/Collaborator");
// const Usuario = require("../models/Usuario");
const { generateJWT } = require("../helpers/jwt");
const { body } = require("express-validator");
const DailyCleanup = require("../models/DailyCleanUp");
const { cleanUpActions, deepCleanUpActivities } = require("../types/types");
const { checkIfElementExists, validateMaxDays, } = require("../helpers/utilities");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const { getCollaboratorById } = require("./collaboratorsController");
const DeepCleanUp = require("../models/DeepCleanUp");
const OperatingRoomCleanUp = require("../models/OperatingRoomCleanUp");
const RFC = require("../models/RFC");
const { uncatchedError } = require("../helpers/const");
dayjs.extend(utc);
const createRFC = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the rfc from the req
        const { rfc } = req.body;
        let usedRFC = yield RFC.findOne({ rfc });
        if (usedRFC) {
            return res.status(400).json({
                ok: false,
                msg: "Ese RFC Ya está registrado",
            });
        }
        const newRfc = new RFC(req.body);
        const savedRfc = yield newRfc.save();
        res.status(201).json({
            ok: true,
            message: "RFC creado con éxito",
            rfc: savedRfc,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const getAllRfc = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allRfc = yield RFC.find();
        res.json({
            ok: true,
            msg: "getAllRFC",
            allRfc,
        });
    }
    catch (_a) {
        uncatchedError(error, res);
    }
});
const updateRFC = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rfcId = req.params.rfcId;
        console.log("this is the id", rfcId);
        const rfc = yield RFC.findById(rfcId);
        if (!rfc) {
            return res.status(404).json({
                ok: false,
                msg: "No existe RFC con ese id",
            });
        }
        const newRfc = Object.assign({}, req.body);
        const updatedRfc = yield RFC.findByIdAndUpdate(rfcId, newRfc, {
            new: true,
        });
        res.json({
            ok: true,
            msg: "RFC actualizado",
            rfc: updatedRfc,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const deleteRFC = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rfcId = req.params.rfcId;
        const rfc = yield RFC.findById(rfcId);
        if (!rfc) {
            return res.status(404).json({
                ok: false,
                msg: "No existe RFC con ese id",
            });
        }
        yield RFC.findByIdAndDelete(rfcId);
        res.json({
            ok: true,
            msg: "RFC eliminado",
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
module.exports = {
    createRFC,
    updateRFC,
    getAllRfc,
    deleteRFC,
};
