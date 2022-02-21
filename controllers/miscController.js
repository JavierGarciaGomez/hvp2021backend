const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../models/Collaborator");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { uncatchedError } = require("../helpers/const");

const { roleTypes, authTypes } = require("../types/types");
const {
  registerLog,
  isAuthorizeByRoleOrOwnership,
} = require("../helpers/utilities");

const Misc = require("../models/Misc");

// todo
// create new activity register
const createMisc = async (req, res = response) => {
  try {
    const { key, data } = req.body;

    const foundData = await Misc.findOne({ key });
    if (foundData) {
      return res.status(201).json({
        ok: false,
        message: "Ya existe esa key",
        foundData,
      });
    }

    const misc = new Misc({
      ...req.body,
    });

    const saved = await misc.save();

    res.status(201).json({
      ok: true,
      message: "Creado con éxito",
      saved,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get all
const getAllMisc = async (req, res = response) => {
  try {
    let allMisc = await Misc.find();
    res.json({
      ok: true,
      msg: "generado",
      allMisc,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getMiscByKey = async (req, res = response) => {
  try {
    // get the key
    const key = req.params.key;

    let misc = await Misc.findOne({
      key,
    });

    res.json({
      ok: true,
      msg: "generado",
      misc,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get from a user
const updateMisc = async (req, res = response) => {
  try {
    // get the key
    const key = req.params.key;

    let misc = await Misc.findOne({
      key,
    });
    if (!misc) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    const updateData = { ...req.body };

    const updatedData = await Misc.findByIdAndUpdate(misc.id, updateData, {
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

const deleteMisc = async (req, res = response) => {
  try {
    // get the key
    const key = req.params.key;

    let misc = await Misc.findOne({
      key,
    });
    if (!misc) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    await Misc.findByIdAndDelete(misc.id);

    res.json({
      ok: true,
      msg: "Éxito",
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

module.exports = {
  // userLogin,
  // userRenewToken,
  createMisc,
  getAllMisc,
  getMiscByKey,
  updateMisc,
  deleteMisc,
};
