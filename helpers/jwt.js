// 343
const jwt = require("jsonwebtoken");

const generateJWT = (uid, col_code, role) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, col_code, role };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "24h",
      },
      (err, token) => {
        if (err) {
          reject("No se pudo generar el token");
        }

        resolve(token);
      }
    );
  });
};

module.exports = {
  generateJWT,
};