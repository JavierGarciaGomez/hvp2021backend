// 339
const { Schema, model } = require("mongoose");
const { authEnum, roles } = require("../types/types");

// TODO
const DocumentationSchema = Schema({
  type: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },

  format: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  lastUpdateDate: {
    type: Date,
  },
  version: {
    type: Number,
    default: 0,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Collaborator",
  },
  status: {
    type: String,
    required: true,
  },
  authorization: {
    type: String,
    enum: roles,
    default: roles[2],
  },
});

module.exports = model("Documentation", DocumentationSchema);
