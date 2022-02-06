/* Users routes:
    host/api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");
const passport = require("passport");

const {
  passportAuthenticate,
  googleAuth,
  createUser,
  userLogin,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const { fieldValidator } = require("../middlewares/fieldValidator");
const {
  validateAuthorization,
} = require("../middlewares/validateAuthorization");
const { validateJwt } = require("../middlewares/validateJwt");
const { roleTypes } = require("../types/types");

const router = Router();

/************PASSPORT********* */
// first call from client, it triggers passport to very google account
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback from google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/googleLogin/failed",
  }),
  googleAuth
);

/************USERS CRUD********* */
// LOGIN
router.post(
  "/",
  [
    check("email", "no es una forma de email correcta").isEmail(),
    fieldValidator,
  ],
  userLogin
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

// GET ALL USERS
router.get("/", validateJwt, getUsers);

// GET USER
router.get("/:userId", validateJwt, getUser);

// TODO: UPDATE
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
// TODO: DELETE
router.delete("/:userId", validateJwt, deleteUser);

// TODO: DELETE
// route called by the callback if its a success
router.get("/googleLogin/success", (req, res) => {
  if (req.user) {
    res.redirect(`${process.env.CLIENT_URL}${user.displayName}`);
    res.status(200).json({
      success: true,

      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
    res.redirect(CLIENT_URL);
  }
});

// route called by the callback if its a failure
router.get("/googleLogin/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("test", (req, res) => {});
module.exports = router;
