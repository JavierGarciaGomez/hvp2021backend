// 339
const { Schema, model } = require("mongoose");

const FcmTransferSchema = Schema({
  prevOwner: {
    firstName: {
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
    urlFrontIne: {
      type: String,
    },
    urlBackIne: {
      type: String,
    },
  },

  newOwner: { type: Schema.Types.ObjectId, ref: "FcmPartner" },
  dog: { type: Schema.Types.ObjectId, ref: "FcmDog" },

  creator: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("FcmTransfer", FcmTransferSchema);
