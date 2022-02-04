// 339
const { Schema, model } = require("mongoose");
const { roles } = require("../types/types");

const RFCSchema = Schema({
  rfc: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
});

module.exports = model("RFC", RFCSchema);
