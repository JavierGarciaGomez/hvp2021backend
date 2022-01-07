/* Users routes:
    host/api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  //   userLogin,
  userCreate,
  //   userRenewToken,
} = require("../controllers/authController");
// const { fieldValidator } = require("../middlewares/fieldValidator");
// const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

// login
// router.post(
//   "/",
//   [
//     check("email", "no es una forma de email correcta").isEmail(),

//     check("password", "el password debe ser de al menos 6 carácteres").isLength(
//       { min: 6 }
//     ),
//     fieldValidator,
//   ],
//   userLogin
// );

// create new user

router.post(
  "/create",
  [
    check("name", "el nombre es obligatorio").not().isEmpty(),
    check("email", "no es una forma de email correcta").isEmail(),
    check("password", "el password debe ser de al menos 6 carácteres").isLength(
      { min: 6 }
    ),
    // fieldValidator,
  ],
  userCreate
);

// renew token
// router.get("/renew", validarJWT, userRenewToken);

module.exports = router;
