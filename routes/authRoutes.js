/* Users routes:
    host/api/auth
*/

const { Router } = require("express");
const passport = require("passport");

const {} = require("../controllers/authController");

const router = Router();

const CLIENT_URL = "http://localhost:3001/";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: CLIENT_URL,
    failureRedirect: "/api/auth/googleLogin/failed",
    // successRedirect: "/api/auth/googleLogin/success",
  }),
  function (req, res) {
    console.log("llegué  acá");
    console.log(req.user);

    res.redirect(`${process.env.CLIENT_URL}#/auth?token=${req.user.token}`);
  }
);

// TODO: DELETE
// route called by the callback if its a success
router.get("/googleLogin/success", (req, res) => {
  console.log("SUCCESS *************************** im here");
  console.log(req.user);
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
