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
  hasBeenUsed: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("DailyCleanUp", DailyCleanUpSchema);
