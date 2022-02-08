/* Users routes:
    host/api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");
const passport = require("passport");

const {
  googleAuth,
  createUser,
  userLogin,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const { fieldValidator } = require("../middlewares/fieldValidator");
const { validateJwt } = require("../middlewares/validateJwt");
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
    successRedirect: `${process.env.CLIENT_URL}/#/auth`,
  })
  // googleAuth
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

// TODO: XXXX
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(`${process.env.CLIENT_URL}`);
});

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
// Delete
router.delete("/:userId", validateJwt, deleteUser);

// TODO: DELETE
// route called by the callback if its a success
router.get("/googleLogin/success", (req, res) => {
  console.log("success", req.user, req);
  if (req.user) {
    res.status(200).json({
      success: true,

      message: "successfull",
      user: req.user,
      token: req.user.token,
      //   cookies: req.cookies
    });
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
