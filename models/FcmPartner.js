// 339
const { Schema, model } = require("mongoose");

const FcmPartnerSchema = Schema({
  firstName: {
    type: String,
    // required: true,
  },
  paternalSurname: {
    type: String,
    // required: true,
  },
  maternalSurname: {
    type: String,
  },
  partnerNum: {
    type: String,
    // required: true,
  },
  expirationDate: {
    type: Date,
    // required: true,
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
  urlPartnerCard: {
    type: String,
  },
  urlProofOfResidency: {
    type: String,
  },
  urlFrontIne: {
    type: String,
  },
  urlBackIne: {
    type: String,
  },

  // pending is first register
  isPending: {
    type: Boolean,
  },
  isCardLost: {
    type: Boolean,
    default: false,
  },

  creator: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("FcmPartner", FcmPartnerSchema);
