// 339
const { Schema, model } = require("mongoose");
const { boolean } = require("webidl-conversions");
const { roles } = require("../types/types");

const DailyCleanUpSchema = Schema({
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
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
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
    type: String,
  },
});

module.exports = model("DailyCleanUp", DailyCleanUpSchema);
