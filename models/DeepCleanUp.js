// 339
const { Schema, model } = require("mongoose");

const DeepCleanUpSchema = Schema({
  branch: {
    type: String,
    require: true,
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
  activities: {
    correctOrder: {
      type: Boolean,
      default: false,
    },
    wasteDisposal: {
      type: Boolean,
      default: false,
    },
    cleanedEquipment: {
      type: Boolean,
      default: false,
    },
    cleanedCages: {
      type: Boolean,
      default: false,
    },
    cleanedDrawers: {
      type: Boolean,
      default: false,
    },
    cleanedRefrigerator: {
      type: Boolean,
      default: false,
    },
    everyAreaCleaned: {
      type: Boolean,
      default: false,
    },
  },
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
});

module.exports = model("DeepCleanUp", DeepCleanUpSchema);
