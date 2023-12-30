// 344
const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJwt = (req, res = response, next) => {
  try {
    // x-token headers
    const token = req.header("x-token");
    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: "No hay token en la petición",
      });
    }
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);

    const { uid, col_code, role, imgUrl } = payload;

    req.uid = uid;
    req.col_code = col_code;
    req.role = role;
    req.imgUrl = imgUrl;
  } catch (error) {
    console.log("ERROR", error.message);
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }

  next();
};

module.exports = {
  validateJwt,
};
