// 339
const { Schema, model } = require("mongoose");

const RFCSchema = Schema({
  rfc: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
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
  notes: {
    type: String,
  },
});

module.exports = model("RFC", RFCSchema);
