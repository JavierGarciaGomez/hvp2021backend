"use strict";
// 339
const { Schema, model } = require("mongoose");
const { boolean } = require("webidl-conversions");
const { roles } = require("../types/types");
const DailyCleanUpSchema = Schema({
    branch: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    cleaners: [
        {
            cleaner: { type: Schema.Types.ObjectId, ref: "Collaborator" },
            time: {
                type: Date,
            },
        },
    ],
    supervisors: [
        {
            supervisor: { type: Schema.Types.ObjectId, ref: "Collaborator" },
            time: {
                type: Date,
            },
        },
    ],
    comments: [
        {
            comment: {
                type: String,
            },
            creator: {
                type: Schema.Types.ObjectId,
                ref: "Collaborator",
            },
        },
    ],
    hasBeenUsed: {
        type: Boolean,
        default: false,
    },
});
module.exports = model("DailyCleanUp", DailyCleanUpSchema);
