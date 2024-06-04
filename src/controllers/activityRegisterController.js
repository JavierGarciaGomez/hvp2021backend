const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { uncatchedError } = require("../helpers/const");

const { roleTypes, authTypes } = require("../types/types");
const {
  registerLog,
  isAuthorizeByRoleOrOwnership,
  convertMongooseObjectIdToString,
} = require("../helpers/utilities");

const ActivityRegister = require("../models/ActivityRegister");
const {
  default: CollaboratorModel,
} = require("../data/models/CollaboratorModel");

// create new activity register
// todo: don't create if there is an open one of the same user
const createActivityRegister = async (req, res = response) => {
  try {
    // get uid from jwt
    const { uid } = req;
    // get body
    const { startingTime, endingTime, activity, comments } = req.body;
    if (!startingTime) {
      req.body.startingTime = new Date();
    }
    const collaborator = await CollaboratorModel.findById(uid);

    console.log("este es el req.body", req.body);
    // remove id
    delete req.body._id;

    const activityRegister = new ActivityRegister({
      ...req.body,
      collaborator,
    });

    const savedActivityRegister = await activityRegister.save();

    res.status(201).json({
      ok: true,
      msg: "Creado con éxito",
      savedActivityRegister,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get all
const getAllActivityRegisters = async (req, res = response) => {
  try {
    let allActivityRegisters = await ActivityRegister.find().populate(
      "collaborator",
      "imgUrl col_code"
    );
    res.json({
      ok: true,
      msg: "generado",
      allActivityRegisters,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get single
const getActiviyRegister = async (req, res = response) => {
  try {
    // get the collaboratorId
    const id = req.params.activityRegister;

    let activityRegister = await ActivityRegister.findById(id);

    res.json({
      ok: true,
      msg: "generado",
      activityRegister,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get from a user
const getActiviyRegistersByCol = async (req, res = response) => {
  try {
    // get the collaboratorId
    const id = req.params.collaboratorId;

    let activityRegisters = await ActivityRegister.find({
      collaborator: id,
    });

    res.json({
      ok: true,
      msg: "generado",
      activityRegisters,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get from a user
const updateActiviyRegister = async (req, res = response) => {
  try {
    // get the activity register id
    const id = req.params.activityRegisterId;
    // get the data of the updater
    const { role, uid } = req;

    const activityRegister = await ActivityRegister.findById(id);
    if (!activityRegister) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese id",
      });
    }

    const updateData = { ...req.body };
    console.log(updateData);

    const isAuthorized = isAuthorizeByRoleOrOwnership(
      role,
      roleTypes.admin,
      uid,
      convertMongooseObjectIdToString(activityRegister.collaborator._id)
    );

    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado",
      });
    }

    const updatedActivityRegister = await ActivityRegister.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Éxito",
      updatedActivityRegister,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const deleteActivityRegister = async (req, res = response) => {
  try {
    // get the activity register id
    const id = req.params.activityRegisterId;
    // get the data of the fetcher
    const { role, uid } = req;

    const activityRegister = await ActivityRegister.findById(id);
    if (!activityRegister) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    const isAuthorized = isAuthorizeByRoleOrOwnership(
      role,
      roleTypes.admin,
      uid,
      convertMongooseObjectIdToString(activityRegister.collaborator._id)
    );

    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado",
      });
    }

    await ActivityRegister.findByIdAndDelete(id);

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
  createActivityRegister,
  getAllActivityRegisters,
  getActiviyRegistersByCol,
  updateActiviyRegister,
  deleteActivityRegister,
  getActiviyRegister,
};
