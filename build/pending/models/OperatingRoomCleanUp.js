"use strict";
// 339
const { Schema, model } = require("mongoose");
const OperatingRoomCleanUpSchema = Schema({
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
module.exports = model("OperatingRoomCleanUp", OperatingRoomCleanUpSchema);
