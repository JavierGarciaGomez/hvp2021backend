// 339
const { Schema, model } = require("mongoose");
const { authEnum } = require("../types/types");

// TODO
const collaboratorLogSchema = Schema({
  date: {
    type: Date,
    required: true,
  },
  action: {
    type: String,
    enum: authEnum,
  },
  collaborator: { type: Schema.Types.ObjectId, ref: "Collaborator" },
});

module.exports = model("CollaboratorLog", collaboratorLogSchema);
