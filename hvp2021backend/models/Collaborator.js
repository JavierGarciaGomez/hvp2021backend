// 339
const { Schema, model } = require("mongoose");
const { boolean } = require("webidl-conversions");

const CollaboratorSchema = Schema({
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
    require: true,
  },
  col_code: {
    type: String,
    require: true,
  },
  col_numId: {
    type: Number,
  },
  isActive: {
    type: Boolean,
  },
});

module.exports = model("Usuario", CollaboratorSchema);
