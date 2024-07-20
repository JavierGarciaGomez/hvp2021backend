// 336
const { response } = require("express");
const { validationResult } = require("express-validator");

// this method
const fieldValidator = (req, res = response, next) => {
  // 335 error handling
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let msg = "";
    errors.errors.forEach((error) => {
      msg = msg.concat(" ", error.msg);
    });

    return res.status(400).json({
      ok: false,
      errors,
      msg,
    });
  }

  next();
};

module.exports = { fieldValidator };
