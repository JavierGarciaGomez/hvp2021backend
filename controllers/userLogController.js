const { response } = require("express");
const { uncatchedError } = require("../helpers/const");
const { roleTypes } = require("../types/types");
const { isAuthorizedByRole } = require("../helpers/utilities");
const UserLog = require("../models/UserLog");

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

    const authLogs = await UserLog.find().populate(
      "collaborator",
      "imgUrl col_code"
    );
    res.json({
      ok: true,
      msg: "getUsers",
      authLogs,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

module.exports = {
  getLogs,
};
