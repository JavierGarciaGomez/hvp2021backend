// 339
const { Schema, model } = require("mongoose");

const FcmPackageSchema = Schema({
  steps: [
    {
      type: Object,
    },
  ],
  procedures: [
    {
      type: Object,
    },
  ],
  activeStep: {
    type: Number,
  },
  medicalInspection: {
    type: Object,
  },
  completedSteps: { type: Object },
  status: { type: String },
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  creationDate: { type: Date },
  packageType: { type: String },
});

module.exports = model("FcmPackage", FcmPackageSchema);
