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
  activities: {
    correctOrder: {
      done: {
        type: Boolean,
        default: false,
      },
      cleaner: {
        type: Schema.Types.ObjectId,
        ref: "Collaborator",
      },
      time: {
        type: Date,
      },
    },
    wasteDisposal: {
      done: {
        type: Boolean,
        default: false,
      },
      cleaner: {
        type: Schema.Types.ObjectId,
        ref: "Collaborator",
      },
      time: {
        type: Date,
      },
    },
    cleanedEquipment: {
      done: {
        type: Boolean,
        default: false,
      },
      cleaner: {
        type: Schema.Types.ObjectId,
        ref: "Collaborator",
      },
      time: {
        type: Date,
      },
    },
    cleanedCages: {
      done: {
        type: Boolean,
        default: false,
      },
      cleaner: {
        type: Schema.Types.ObjectId,
        ref: "Collaborator",
      },
      time: {
        type: Date,
      },
    },
    cleanedDrawers: {
      done: {
        type: Boolean,
        default: false,
      },
      cleaner: {
        type: Schema.Types.ObjectId,
        ref: "Collaborator",
      },
      time: {
        type: Date,
      },
    },
    cleanedRefigerator: {
      done: {
        type: Boolean,
        default: false,
      },
      cleaner: {
        type: Schema.Types.ObjectId,
        ref: "Collaborator",
      },
      time: {
        type: Date,
      },
    },
    everyAreaCleaned: {
      done: {
        type: Boolean,
        default: false,
      },
      cleaner: {
        type: Schema.Types.ObjectId,
        ref: "Collaborator",
      },
      time: {
        type: Date,
      },
    },
  },
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
});

module.exports = model("DeepCleanUp", DeepCleanUpSchema);
