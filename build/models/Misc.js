"use strict";
// 339
const { Schema, model } = require("mongoose");
const { authEnum } = require("../types/types");
// TODO
const MiscSchema = Schema({
    key: {
        type: String,
        required: true,
    },
    data: [
        {
            type: Object,
        },
    ],
});
module.exports = model("Misc", MiscSchema);
