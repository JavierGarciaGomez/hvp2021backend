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
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { uncatchedError } = require("../helpers/const");
const FcmPartner = require("../models/FcmPartner");
const FcmTransfer = require("../models/FcmTransfer.js");
const FcmPackage = require("../models/FcmPackage");
const FcmDog = require("../models/FcmDog");
/************ CRUD ALL********* */
const getAllFcm = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get partners
        let allFcmPartners = yield FcmPartner.find().populate("creator", "col_code");
        let allFcmDogs = yield FcmDog.find().populate("creator", "col_code");
        let allFcmTransfers = yield FcmTransfer.find()
            .populate("newOwner")
            .populate("dog");
        let allFcmPackages = yield FcmPackage.find().populate("creator", "col_code email");
        res.json({
            ok: true,
            msg: "generado",
            allFcm: {
                allFcmPartners,
                allFcmDogs,
                allFcmTransfers,
                allFcmPackages,
            },
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
    // get dogs
    // get packages
    // get transfers
});
// todo
// create new fcmPartner
const createFcmPartner = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check who is doing the register
        const { uid } = req;
        const { partnerNum } = req.body;
        if (partnerNum !== "") {
            const foundObject = yield FcmPartner.findOne({ partnerNum });
            if (foundObject) {
                return res.status(500).json({
                    ok: false,
                    msg: "El número de socio que quiere registrar ha sido ya registrado previamente, si lo necesita, vincúlelo a su cuenta.",
                });
            }
        }
        const data = Object.assign({}, req.body);
        data.creator = uid;
        const fcmPartner = new FcmPartner(Object.assign({}, data));
        const saved = yield fcmPartner.save();
        // save it in the user fcmpartner
        const user = yield User.findById(uid);
        // just if is a user create fcmPartners
        if (user) {
            if (!user.linkedFcmPartners) {
                user.linkedFcmPartners = [];
            }
            user.linkedFcmPartners.push(saved._id);
            yield User.findByIdAndUpdate(uid, user);
        }
        res.status(201).json({
            ok: true,
            msg: "Creado con éxito",
            saved,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// get all
const getAllFcmPartner = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allFcmPartners = yield FcmPartner.find().populate("creator", "col_code");
        res.json({
            ok: true,
            msg: "generado",
            allFcmPartners,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const getFcmPartner = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the id
        const id = req.params.id;
        console.log("getfcm", id);
        let fcmPartner = yield FcmPartner.findById(id);
        res.json({
            ok: true,
            msg: "generado",
            fcmPartner,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const getFcmPartnerByPartnerNum = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the id
        const { partnerNum } = req.params;
        let fcmPartner = yield FcmPartner.findOne({
            partnerNum,
        });
        if (!fcmPartner) {
            return res.status(500).json({
                ok: false,
                msg: "No existe un socio registrado con ese número en esta base de datos, favor de registrarlo.",
            });
        }
        res.json({
            ok: true,
            msg: "generado",
            fcmPartner,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// get from a user
const updateFcmPartner = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req;
        // get the id
        const id = req.params.id;
        // get the original data
        let fcmPartner = yield FcmPartner.findById(id);
        if (!fcmPartner) {
            return res.status(404).json({
                ok: false,
                msg: "No existe data con ese ese id",
            });
        }
        // get the new data and add the creator
        const updateData = Object.assign({}, req.body);
        // Save the update
        const updatedData = yield FcmPartner.findByIdAndUpdate(id, updateData, {
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
const deleteFcmPartner = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the id
        const id = req.params.id;
        let fcmPartner = yield FcmPartner.findById(id);
        if (!fcmPartner) {
            return res.status(404).json({
                ok: false,
                msg: "No existe data con ese ese id",
            });
        }
        yield FcmPartner.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: "Éxito",
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
/************ CRUD DOGS********* */
const createDog = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check who is doing the register
        const { uid } = req;
        const data = Object.assign({}, req.body);
        const { registerNum } = data;
        const foundObject = yield FcmDog.findOne({ registerNum });
        if (foundObject) {
            return res.status(500).json({
                ok: false,
                msg: "El número de registro que quiere registrar ha sido ya registrado previamente, si lo necesita, vincúlelo a su cuenta.",
            });
        }
        data.creator = uid;
        const dog = new FcmDog(Object.assign({}, data));
        const saved = yield dog.save();
        // save it in the user dog
        const user = yield User.findById(uid);
        // just if is a user create fcmPartners
        if (user) {
            if (!user.linkedDogs) {
                user.linkedDogs = [];
            }
            user.linkedDogs.push(saved._id);
            yield User.findByIdAndUpdate(uid, user);
        }
        res.status(201).json({
            ok: true,
            msg: "Creado con éxito",
            saved,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// get all
const getAllDogs = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allDogs = yield FcmDog.find().populate("creator", "col_code");
        res.json({
            ok: true,
            msg: "generado",
            allDogs,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const getDog = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the id
        const id = req.params.id;
        console.log("getfcm", id);
        let dog = yield FcmDog.findById(id);
        res.json({
            ok: true,
            msg: "generado",
            dog,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const updateDog = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req;
        // get the id
        const id = req.params.id;
        // get the original data
        let dog = yield FcmDog.findById(id);
        if (!dog) {
            return res.status(404).json({
                ok: false,
                msg: "No existe data con ese ese id",
            });
        }
        // get the new data and add the creator
        const updateData = Object.assign({}, req.body);
        // Save the update
        const updatedData = yield FcmDog.findByIdAndUpdate(id, updateData, {
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
const deleteDog = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the id
        const id = req.params.id;
        let dog = yield FcmDog.findById(id);
        if (!dog) {
            return res.status(404).json({
                ok: false,
                msg: "No existe data con ese ese id",
            });
        }
        yield FcmDog.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: "Éxito",
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
/************ FCMTRANSFER ********* */
const createFcmTransfer = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check who is doing the register
        const { uid } = req;
        const data = Object.assign({}, req.body);
        data.creator = uid;
        const fcmTransfer = new FcmTransfer(Object.assign({}, data));
        const saved = yield fcmTransfer.save();
        // save it in the user fcmTransfer
        const user = yield User.findById(uid);
        // just if is a user create fcmPartners
        if (user) {
            if (!user.linkedFcmTransfers) {
                user.linkedFcmTransfers = [];
            }
            user.linkedFcmTransfers.push(saved._id);
            yield User.findByIdAndUpdate(uid, user);
        }
        res.status(201).json({
            ok: true,
            msg: "Creado con éxito",
            saved,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// get all
const getAllFcmTransfers = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allFcmTransfers = yield FcmTransfer.find().populate("creator", "col_code");
        res.json({
            ok: true,
            msg: "generado",
            allFcmTransfers,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const getFcmTransfer = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the id
        const id = req.params.id;
        console.log("getfcm", id);
        let fcmTransfer = yield FcmTransfer.findById(id);
        res.json({
            ok: true,
            msg: "generado",
            fcmTransfer,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const updateFcmTransfer = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req;
        // get the id
        const id = req.params.id;
        console.log(Object.assign({}, req.body));
        // get the original data
        let fcmTransfer = yield FcmTransfer.findById(id);
        if (!fcmTransfer) {
            return res.status(404).json({
                ok: false,
                msg: "No existe data con ese ese id",
            });
        }
        // get the new data and add the creator
        const updateData = Object.assign({}, req.body);
        // Save the update
        const updatedData = yield FcmTransfer.findByIdAndUpdate(id, updateData, {
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
const deleteFcmTransfer = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the id
        const id = req.params.id;
        let fcmTransfer = yield FcmTransfer.findById(id);
        if (!fcmTransfer) {
            return res.status(404).json({
                ok: false,
                msg: "No existe data con ese ese id",
            });
        }
        yield FcmTransfer.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: "Éxito",
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
/************ PACKAGES ********* */
const createFcmPackage = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check who is doing the register
        const { uid } = req;
        const data = Object.assign({}, req.body);
        data.creator = uid;
        const myPackage = new FcmPackage(Object.assign({}, data));
        const saved = yield myPackage.save();
        // save it in the user package
        const user = yield User.findById(uid);
        // just if is a user create fcmPartners
        if (user) {
            if (!user.linkedFcmPackages) {
                user.linkedFcmPackages = [];
            }
            user.linkedFcmPackages.push(saved._id);
            console.log("este es el user", user);
            yield User.findByIdAndUpdate(uid, user);
            console.log("llegué acá");
        }
        res.status(201).json({
            ok: true,
            msg: "Creado con éxito",
            saved,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
// get all
const getAllFcmPackages = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allPackages = yield FcmPackage.find().populate("creator", "col_code");
        res.json({
            ok: true,
            msg: "generado",
            allPackages,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const getFcmPackage = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the id
        const id = req.params.id;
        console.log("getfcm", id);
        let data = yield FcmPackage.findById(id);
        res.json({
            ok: true,
            msg: "generado",
            data,
        });
    }
    catch (error) {
        uncatchedError(error, res);
    }
});
const updateFcmPackage = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the id
        const id = req.params.id;
        console.log("este es el puto id", id);
        // get the original data
        let myPackage = yield FcmPackage.findById(id);
        if (!myPackage) {
            return res.status(404).json({
                ok: false,
                msg: "No existe data con ese ese id",
            });
        }
        // get the new data and add the creator
        const updateData = Object.assign({}, req.body);
        updateData.creator = myPackage.creator;
        console.log("esta es la updateddata", updateData);
        // Save the update
        const updatedData = yield FcmPackage.findByIdAndUpdate(id, updateData, {
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
const deleteFcmPackage = (req, res = response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the id
        const id = req.params.id;
        let myPackage = yield FcmPackage.findById(id);
        if (!myPackage) {
            return res.status(404).json({
                ok: false,
                msg: "No existe data con ese ese id",
            });
        }
        yield FcmPackage.findByIdAndDelete(id);
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
    getAllFcm,
    createFcmPartner,
    getAllFcmPartner,
    getFcmPartner,
    updateFcmPartner,
    deleteFcmPartner,
    getFcmPartnerByPartnerNum,
    createDog,
    getAllDogs,
    getDog,
    updateDog,
    deleteDog,
    createFcmTransfer,
    getAllFcmTransfers,
    getFcmTransfer,
    updateFcmTransfer,
    deleteFcmTransfer,
    createFcmPackage,
    getAllFcmPackages,
    getFcmPackage,
    updateFcmPackage,
    deleteFcmPackage,
};
