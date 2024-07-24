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
const Misc = require("../models/Misc");
const { uncatchedError } = require("../helpers/const");
// todo
// create new activity register
const createMisc = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        const { key, data } = req.body;
        const foundData = yield Misc.findOne({ key });
        if (foundData) {
            return res.status(201).json({
                ok: false,
                message: "Ya existe esa key",
                foundData,
            });
        }
        const misc = new Misc(Object.assign({}, req.body));
        const saved = yield misc.save();
        res.status(201).json({
            ok: true,
            message: "Creado con éxito",
            saved,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// get all
const getAllMisc = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        let allMisc = yield Misc.find();
        res.json({
            ok: true,
            msg: "generado",
            allMisc,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const getMiscByKey = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // get the key
        const key = req.params.key;
        let misc = yield Misc.findOne({
            key,
        });
        res.json({
            ok: true,
            msg: "generado",
            misc,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// get from a user
const updateMisc = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // get the key
        const key = req.params.key;
        let misc = yield Misc.findOne({
            key,
        });
        if (!misc) {
            return res.status(404).json({
                ok: false,
                msg: "No existe data con ese ese id",
            });
        }
        const updateData = Object.assign({}, req.body);
        const updatedData = yield Misc.findByIdAndUpdate(misc.id, updateData, {
            new: true,
        });
        res.json({
            ok: true,
            msg: "Éxito",
            updatedData,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const deleteMisc = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, res = response) {
    try {
        // get the key
        const key = req.params.key;
        let misc = yield Misc.findOne({
            key,
        });
        if (!misc) {
            return res.status(404).json({
                ok: false,
                msg: "No existe data con ese ese id",
            });
        }
        yield Misc.findByIdAndDelete(misc.id);
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
    createMisc,
    getAllMisc,
    getMiscByKey,
    updateMisc,
    deleteMisc,
};
