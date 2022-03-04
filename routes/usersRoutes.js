const { Router } = require("express");
const { check } = require("express-validator");
const passport = require("passport");

const {
  googleAuth,
  userLogin,
  userRenewToken,
} = require("../controllers/authController");
const { fieldValidator } = require("../middlewares/fieldValidator");
const { validateJwt } = require("../middlewares/validateJwt");
const router = Router();

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  unlinkFcmPartner,
  linkFcmPartner,
} = require("../controllers/userController");

// GET ALL USERS
router.get("/", validateJwt, getUsers);

// GET USER
router.get("/:userId", validateJwt, getUser);

// Update
router.put(
  "/:userId",
  [
    check("email", "No es una forma correcta de email").isEmail(),
    check("password", "El password debe contener al menos seis carácteres")
      .isLength({ min: 6 })
      .optional(),
    validateJwt,
    fieldValidator,
  ],
  updateUser
);

// CREATE
router.post(
  "/create",
  [
    check("email", "No es una forma correcta de email").isEmail(),
    check(
      "password",
      "El password es obligatorio y debe contener al menos seis carácteres"
    ).isLength({ min: 6 }),
    check("col_code", "El nombre de usuario es obligatorio").not().isEmpty(),
    fieldValidator,
  ],
  createUser
);

// Delete
router.delete("/:userId", validateJwt, deleteUser);

// FCMPARTNER
router.patch(
  "/:userId/fcmPartner/unlink/:fcmPartnerId",
  validateJwt,
  unlinkFcmPartner
);

// FCMPARTNER
router.patch(
  "/:userId/fcmPartner/link/:fcmPartnerId",
  validateJwt,
  linkFcmPartner
);

module.exports = router;
