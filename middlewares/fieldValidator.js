// 336
const { response } = require("express");
const { validationResult } = require("express-validator");

// this method
const fieldValidator = (req, res = response, next) => {
  // 335 error handling
  const errors = validationResult(req);
  console.log("this are the errors", errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: "ERROR",
      errors,
    });
  }

  console.log("there arent errors, so i go to next");

  next();
};

module.exports = { fieldValidator };
