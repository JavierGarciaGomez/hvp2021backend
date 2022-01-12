/* Users routes:
    host/api/collaborator
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  createCollaborator,
  getCollaborators,
  getCollaboratorById,
  updateCollaborator,
  registerCollaborator,
  collaboratorLogin,
} = require("../controllers/collaboratorsController");
const { fieldValidator } = require("../middlewares/fieldValidator");

// TODO
// const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

// Login
router.post(
  "/",
  [
    check("email", "no es una forma de email correcta").isEmail(),
    fieldValidator,
  ],
  collaboratorLogin
);

router.get("/", getCollaborators);

router.get("/:collaboratorId", getCollaboratorById);

// create collaborator by manager
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

// authenticate collaborator for register
router.patch(
  "/register",
  [
    check("email", "No es una forma correcta de email").isEmail(),
    check(
      "password",
      "El password es obligatorio y debe contener al menos seis carácteres"
    ).isLength({ min: 6 }),
    check(
      "col_code",
      "El código de colaborador es obligatorio y debe contener tres letras"
    ).isLength({ min: 3, max: 3 }),
    check(
      "accessCode",
      "El código de acceso es obligatorio y debe contener 6 carácteres"
    ).isLength({ min: 6, max: 6 }),
    fieldValidator,
  ],
  registerCollaborator
);

router.put("/:collaboratorId", updateCollaborator);

// renew token
// router.get("/renew", validarJWT, userRenewToken);

module.exports = router;
