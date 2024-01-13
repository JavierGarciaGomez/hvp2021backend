"use strict";
// 339
const { Schema, model } = require("mongoose");
const { authEnum } = require("../types/types");
// TODO
const userLogSchema = Schema({
    date: {
        type: Date,
        required: true,
    },
    action: {
        type: String,
        enum: authEnum,
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
});
module.exports = model("UserLog", userLogSchema);
