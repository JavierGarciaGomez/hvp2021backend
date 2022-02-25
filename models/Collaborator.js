// 339
const { Schema, model } = require("mongoose");
const { roles } = require("../types/types");

const CollaboratorSchema = Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: roles,
    default: roles[2],
  },
  col_code: {
    type: String,
    required: true,
  },
  col_numId: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  gender: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
  accessCode: {
    type: String,
  },
  isRegistered: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  position: {
    type: String,
  },
  isDisplayedWeb: {
    type: Boolean,
    default: true,
  },
  textPresentation: {
    type: String,
    defaut: "",
  },
  registeredDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  lastLogin: {
    type: Date,
  },
});

module.exports = model("Collaborator", CollaboratorSchema);
