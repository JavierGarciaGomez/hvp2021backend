"use strict";
// 339
const { Schema, model } = require("mongoose");
const FcmDogSchema = Schema({
    petName: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    registerNum: {
        type: String,
        required: true,
    },
    registerType: {
        type: String,
        required: true,
    },
    urlFront: {
        type: String,
    },
    urlBack: {
        type: String,
    },
    isRegisterPending: {
        type: Boolean,
        required: true,
        default: false,
    },
    isTransferPending: {
        type: Boolean,
        required: true,
        default: false,
    },
    owner: { type: Schema.Types.ObjectId, ref: "FcmPartner" },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
});
module.exports = model("FcmDog", FcmDogSchema);
