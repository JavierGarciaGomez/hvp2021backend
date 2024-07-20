const { response } = require("express");
const { isAuthorizedByRole } = require("../helpers/utilities");
const UserLog = require("../models/UserLog");
const { uncatchedError } = require("../helpers/const");
const { roleTypes } = require("../types/types");

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

    const authLogs = await UserLog.find().populate("user", "imgUrl col_code");
    res.json({
      ok: true,
      msg: "user logs",
      authLogs,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

module.exports = {
  getLogs,
};
