const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../models/Collaborator");
// const Usuario = require("../models/Usuario");
const { generateJWT } = require("../helpers/jwt");
const { body } = require("express-validator");
const DailyCleanup = require("../models/DailyCleanUp");
const { cleanUpActions, deepCleanUpActivities } = require("../types/types");
const {
  checkIfElementExists,
  validateMaxDays,
} = require("../helpers/utilities");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const { getCollaboratorById } = require("./collaboratorsController");
const DeepCleanUp = require("../models/DeepCleanUp");
const OperatingRoomCleanUp = require("../models/OperatingRoomCleanUp");
const RFC = require("../models/RFC");
const { uncatchedError } = require("../helpers/const");
dayjs.extend(utc);

const createRFC = async (req, res = response) => {
  try {
    // get the rfc from the req
    const { rfc } = req.body;

    let usedRFC = await RFC.findOne({ rfc });

    if (usedRFC) {
      return res.status(400).json({
        ok: false,
        msg: "Ese RFC Ya está registrado",
      });
    }

    const newRfc = new RFC(req.body);
    const savedRfc = await newRfc.save();

    res.status(201).json({
      ok: true,
      message: "RFC creado con éxito",
      rfc: savedRfc,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getAllRfc = async (req, res = response) => {
  try {
    const allRfc = await RFC.find();
    res.json({
      ok: true,
      msg: "getAllRFC",
      allRfc,
    });
  } catch {
    uncatchedError(error, res);
  }
};

const updateRFC = async (req, res = response) => {
  try {
    const rfcId = req.params.rfcId;

    const rfc = await RFC.findById(rfcId);

    if (!rfc) {
      return res.status(404).json({
        ok: false,
        msg: "No existe RFC con ese id",
      });
    }

    const newRfc = {
      ...req.body,
    };

    const updatedRfc = await RFC.findByIdAndUpdate(rfcId, newRfc, {
      new: true,
    });
    res.json({
      ok: true,
      msg: "RFC actualizado",
      rfc: updatedRfc,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const deleteRFC = async (req, res = response) => {
  try {
    const rfcId = req.params.rfcId;
    const rfc = await RFC.findById(rfcId);

    if (!rfc) {
      return res.status(404).json({
        ok: false,
        msg: "No existe RFC con ese id",
      });
    }

    await RFC.findByIdAndDelete(rfcId);
    res.json({
      ok: true,
      msg: "RFC eliminado",
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

module.exports = {
  createRFC,
  updateRFC,
  getAllRfc,
  deleteRFC,
};
