// 339
const { Schema, model } = require("mongoose");

const FcmPartnerSchema = Schema({
  first_name: {
    type: String,
    required: true,
  },
  paternalSurname: {
    type: String,
    required: true,
  },
  maternalSurname: {
    type: String,
  },
  partnerNum: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  address: {
    street: {
      type: String,
    },
    number: {
      type: String,
    },
    suburb: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  homePhone: {
    type: String,
  },
  mobilePhone: {
    type: String,
  },
  email: {
    type: String,
  },
});

module.exports = model("FcmPartner", FcmPartnerSchema);
