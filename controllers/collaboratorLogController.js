const { response } = require("express");
const { uncatchedError } = require("../helpers/const");
const { roleTypes } = require("../types/types");
const { isAuthorizedByRole } = require("../helpers/utilities");
const CollaboratorLog = require("../models/CollaboratorLog");

const getLogs = async (req, res = response) => {
  try {
    // from token
    const { role } = req;
    const isAuthorized = isAuthorizedByRole(role, roleTypes.collaborator);
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado para conocer los datos",
      });
    }

    const authLogs = await CollaboratorLog.find().populate(
      "collaborator",
      "imgUrl col_code"
    );
    res.json({
      ok: true,
      msg: "collaborator logs",
      authLogs,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

module.exports = {
  getLogs,
};
