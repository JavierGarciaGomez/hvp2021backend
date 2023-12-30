/* Users routes:
    host/api/auth
*/

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

/************PASSPORT********* */

// route called by the callback if its a success
router.get("/googleLogin/success", (req, res) => {
  console.log("success", req.user);
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
    // successRedirect: `${process.env.CLIENT_URL}/#/auth`,
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

// TODO: XXXX
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(`${process.env.CLIENT_URL}`);
});

// renew token
router.get("/renew", validateJwt, userRenewToken);

router.get("test", (req, res) => {});
module.exports = router;
