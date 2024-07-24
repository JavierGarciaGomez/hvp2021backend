"use strict";
const { Schema, model } = require("mongoose");
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
