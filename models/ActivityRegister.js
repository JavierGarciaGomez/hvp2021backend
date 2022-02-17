// 339
const { Schema, model } = require("mongoose");
const { authEnum } = require("../types/types");

// TODO
const activityRegisterSchema = Schema({
  collaborator: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  startingTime: {
    type: Date,
    required: true,
  },
  endingTime: {
    type: Date,
  },
  activity: {
    type: String,
    default: "Indeterminado",
  },
  comments: {
    type: String,
  },
});

module.exports = model("ActivityRegister", activityRegisterSchema);
