"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shared_1 = require("../../../../shared");
const attendanceRecordSchema = new mongoose_1.Schema({
    collaborator: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
    shiftDate: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /\d{4}-\d{2}-\d{2}/.test(value);
            },
            message: (props) => `${props.value} is not a valid date format`,
        },
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, required: false },
    clockInBranch: {
        type: String,
        enum: Object.values(shared_1.Branch),
        required: true,
    },
    clockOutBranch: {
        type: String,
        enum: Object.values(shared_1.Branch),
        required: false,
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
    startLatitude: { type: Number, required: false },
    startLongitude: { type: Number, required: false },
    endLatitude: { type: Number, required: false },
    endLongitude: { type: Number, required: false },
}, { timestamps: true });
const AttendanceRecordModel = (0, mongoose_1.model)("TimeShift", attendanceRecordSchema);
exports.default = AttendanceRecordModel;
