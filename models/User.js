// 339
const { Schema, model } = require("mongoose");
const { roles } = require("../types/types");

// TODO
const UserSchema = Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
  },
  // todo: fix this and use displayname instead
  col_code: {
    type: String,
    require: true,
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
});

module.exports = model("User", UserSchema);
