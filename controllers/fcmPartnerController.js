const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../models/Collaborator");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { uncatchedError } = require("../helpers/const");

const FcmPartner = require("../models/FcmPartner");

// todo
// create new fcmPartner
const createFcmPartner = async (req, res = response) => {
  try {
    // check who is doing the register
    const { uid } = req;

    const { partnerNum } = req.body;
    const foundObject = await FcmPartner.findOne({ partnerNum });
    if (foundObject) {
      return res.status(500).json({
        ok: false,
        msg: "El número de socio que quiere registrar ha sido ya registrado previamente, si lo necesita, vincúlelo a su cuenta.",
      });
    }

    const data = { ...req.body };
    data.creator = uid;

    const fcmPartner = new FcmPartner({ ...data });

    const saved = await fcmPartner.save();
    // save it in the user fcmpartner
    const user = await User.findById(uid);
    user.linkedFcmPartners.push(saved._id);
    await User.findByIdAndUpdate(uid, user);

    res.status(201).json({
      ok: true,
      msg: "Creado con éxito",
      saved,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get all
const getAllFcmPartner = async (req, res = response) => {
  try {
    let allFcmPartners = await FcmPartner.find().populate(
      "creator",
      "col_code"
    );

    res.json({
      ok: true,
      msg: "generado",
      allFcmPartners,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getFcmPartner = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;
    console.log("getfcm", id);

    let fcmPartner = await FcmPartner.findById(id);

    res.json({
      ok: true,
      msg: "generado",
      fcmPartner,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getFcmPartnerByPartnerNum = async (req, res = response) => {
  try {
    // get the id
    const { partnerNum } = req.params;

    let fcmPartner = await FcmPartner.findOne({
      partnerNum,
    });

    if (!fcmPartner) {
      return res.status(500).json({
        ok: false,
        msg: "No existe un socio registrado con ese número en esta base de datos, favor de registrarlo.",
      });
    }

    res.json({
      ok: true,
      msg: "generado",
      fcmPartner,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get from a user
const updateFcmPartner = async (req, res = response) => {
  try {
    const { uid } = req;
    // get the id
    const id = req.params.id;

    // get the original data
    let fcmPartner = await FcmPartner.findById(id);
    if (!fcmPartner) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    // get the new data and add the creator
    const updateData = { ...req.body };
    updateData.creator = uid;

    // Save the update
    const updatedData = await FcmPartner.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({
      ok: true,
      msg: "Éxito",
      updatedData,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const deleteFcmPartner = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;
    let fcmPartner = await FcmPartner.findById(id);

    if (!fcmPartner) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    await FcmPartner.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Éxito",
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

module.exports = {
  createFcmPartner,
  getAllFcmPartner,
  getFcmPartner,
  updateFcmPartner,
  deleteFcmPartner,
  getFcmPartnerByPartnerNum,
};
