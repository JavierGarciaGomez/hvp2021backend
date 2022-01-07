/* Users routes:
    host/api/collaborator
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  createCollaborator,
  getCollaborators,
  getCollaboratorById,
} = require("../controllers/collaboratorsController");
const { fieldValidator } = require("../middlewares/fieldValidator");

// TODO
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

router.get("/", getCollaborators);

router.get("/:collaboratorId", getCollaboratorById);

// create new user
router.post(
  "/create",
  [
    check("first_name", "El nombre (s) es obligatorio").not().isEmpty(),
    check("last_name", "Los apellidos son obligatorios").not().isEmpty(),
    check(
      "col_code",
      "El código de colaborador es obligatorio y debe contener tres letras"
    ).isLength({ min: 3, max: 3 }),

    fieldValidator,
  ],
  createCollaborator
);

// renew token
// router.get("/renew", validarJWT, userRenewToken);

module.exports = router;
