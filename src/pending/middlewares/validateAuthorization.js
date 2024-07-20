// 344
const { response } = require("express");
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const {
  isAuthorizedByRole: checkAutorization,
} = require("../helpers/utilities");
const { roles, roleTypes } = require("../types/types");

const validateAuthorization = (
  req,
  res = response,
  next,
  requiredAuthorization
) => {
  try {
    // check if there is a token. If not, return error
    const token = req.header("x-token");
    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: "No hay token en la petición",
      });
    }

    // get the payload
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const { uid, col_code, role, imgUrl } = payload;

    // check if is authorized. if not, return
    const isAuthorized = checkAutorization(role, requiredAuthorization);
    if (!isAuthorized) {
      return res.status(401).json({
        ok: false,
        msg: "No tienes autorización para realizar esta acción",
      });
    }

    // put the payload in the request
    req.uid = uid;
    req.col_code = col_code;
    req.role = role;
    req.imgUrl = imgUrl;
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }

  next();
};

module.exports = {
  validateAuthorization,
  checkAutorization,
};
