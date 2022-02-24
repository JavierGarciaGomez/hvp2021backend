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

const Documentation = require("../models/Documentation");

// todo
// create new activity register
const createDocumentation = async (req, res = response) => {
  try {
    const { data } = req.body;

    const documentation = new Documentation({
      ...req.body,
    });

    const saved = await documentation.save();

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
const getAllDocumentation = async (req, res = response) => {
  try {
    let allDocumentation = await Documentation.find();
    res.json({
      ok: true,
      msg: "generado",
      allDocumentation,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getDocumentation = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;

    let documentation = await Documentation.findOne({
      id,
    });

    res.json({
      ok: true,
      msg: "generado",
      documentation,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get from a user
const updateDocumentation = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;

    let documentation = await Documentation.findById(id);
    if (!documentation) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    const updateData = { ...req.body };

    const updatedData = await Documentation.findByIdAndUpdate(id, updateData, {
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

const deleteDocumentation = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;

    console.log("este id se recibió", id);

    let documentation = await Documentation.findById(id);

    console.log("este documento se encontró", documentation);
    if (!documentation) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    await Documentation.findByIdAndDelete(id);

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
  createDocumentation,
  getAllDocumentation,
  getDocumentation,
  updateDocumentation,
  deleteDocumentation,
};
