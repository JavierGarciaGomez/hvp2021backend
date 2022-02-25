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
// create new activity register
const createFcmPartner = async (req, res = response) => {
  try {
    const { partnerNum } = req.body;
    const foundObject = await FcmPartner.findOne({ partnerNum });
    if (foundObject) {
      return res.status(500).json({
        ok: false,
        msg: "El número de socio que quiere registrar ha sido ya registrado previamente, si lo necesita, vincúlelo a su cuenta.",
      });
    }

    const fcmPartner = new FcmPartner({
      ...req.body,
    });

    const saved = await fcmPartner.save();

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
    let allFcmPartner = await FcmPartner.find();

    res.json({
      ok: true,
      msg: "generado",
      allFcmPartner,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getFcmPartner = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;

    let fcmPartner = await FcmPartner.findById({
      id,
    });

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
    // get the id
    const id = req.params.id;

    let fcmPartner = await FcmPartner.findById(id);
    if (!fcmPartner) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    const updateData = { ...req.body };

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
