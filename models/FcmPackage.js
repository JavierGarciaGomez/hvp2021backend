// 339
const { Schema, model } = require("mongoose");

const FcmPackageSchema = Schema({
  steps: {
    type: String,
    required: true,
  },
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
  skippedSteps: { type: Object },
  completedSteps: { type: Object },
  currentProps: { type: Object },
  fatherOwnerId: "",
  motherOwnerId: "",
  dogFatherId: "",
  dogMotherId: "",
  breedingForm: { type: Object },
  extraSteps: [{ type: Object }],
  documentation: [{ type: Object }],
  status: { type: String },
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  applicationDate: { type: Date },
});

module.exports = model("FcmPackage", FcmPackageSchema);
