"use strict";
// 339
const { Schema, model } = require("mongoose");
const { roles } = require("../types/types");
// TODO
const UserSchema = Schema({
    name: { type: String },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    // todo: fix this and use displayname instead
    col_code: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    imgUrl: {
        type: String,
    },
    role: {
        type: String,
        enum: roles,
        default: roles[3],
    },
    registeredDate: {
        type: Date,
        default: Date.now,
        require: true,
    },
    lastLogin: {
        type: Date,
    },
    linkedFcmPartners: [{ type: Schema.Types.ObjectId, ref: "FcmPartner" }],
    linkedDogs: [{ type: Schema.Types.ObjectId, ref: "FcmDog" }],
    linkedFcmPackages: [{ type: Schema.Types.ObjectId, ref: "FcmPackage" }],
    linkedFcmTransfers: [{ type: Schema.Types.ObjectId, ref: "FcmTransfer" }],
});
module.exports = model("User", UserSchema);
