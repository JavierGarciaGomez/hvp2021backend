// 339
const { Schema, model } = require("mongoose");
const { roles } = require("../types/types");

// TODO
const UserSchema = Schema({
  name: { type: String },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  // todo: fix this and use displayname instead
  col_code: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  imgUrl: {
    type: String,
  },
  role: {
    type: String,
    enum: roles,
    default: roles[3],
  },
  registeredDate: {
    type: Date,
    default: Date.now,
    require: true,
  },
  lastLogin: {
    type: Date,
  },
});

module.exports = model("User", UserSchema);
