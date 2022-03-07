// 339
const { Schema, model } = require("mongoose");

const DogSchema = Schema({
  petName: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  registerNum: {
    type: String,
    required: true,
  },
  registerType: {
    type: String,
    required: true,
  },
  urlFront: {
    type: String,
    required: true,
  },
  urlBack: {
    type: String,
    required: true,
  },
  owner: { type: Schema.Types.ObjectId, ref: "FcmPartner" },

  creator: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Dog", DogSchema);
