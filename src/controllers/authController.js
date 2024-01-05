const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../models/Collaborator");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { uncatchedError } = require("../helpers/const");

const { roleTypes, authTypes } = require("../types/types");
const {
  isAuthorizeByRoleOrOwnership,
  isAuthorizedByRole,
  registerLog,
} = require("../helpers/utilities");
const AuthLog = require("../models/CollaboratorLog");
const { default: CollaboratorModel } = require("../models/Collaborator");

// TODO: Move out the strictly user from auth

// googleAuth. This is called by passport
const createUserIfNotExist = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    // get the email and check if is registered
    const email = profile.emails[0].value;

    let user = {};
    user = await CollaboratorModel.findOne({ email });
    let userType = "collaborator";
    if (!user) {
      user = await User.findOne({ email });
      userType = "user";
    }
    if (!user) {
      user = new User({
        col_code: profile.displayName,
        imgUrl: profile.photos[0].value,
        email: profile.emails[0].value,
      });
      const savedUser = await user.save();
      user = savedUser;
      userType = "user";
    }

    const token = await generateJWT(
      user.id,
      user.col_code,
      user.role,
      user.imgUrl
    );

    // generate the user data that will be returned
    const userData = { ...user, token };

    // register the login
    registerLog(userType, user, authTypes.login);

    done(null, userData);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      ok: "false",
      msg: error.msg,
      error,
    });
  }
};

// authenticate with passport google
const googleAuth = (req, res = response) => {
  res.cookie("auth", req.user.token); // Choose whatever name you'd like for that cookie,
  res.redirect(`${process.env.CLIENT_URL}#/auth?token=${req.user.token}`);
};

const userLogin = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    // check if collaborator or user
    let user = await CollaboratorModel.findOne({ email });
    let userType = "collaborator";
    if (!user) {
      user = await User.findOne({ email });
      userType = "user";
    }

    let isValid = false;

    if (user) {
      const validPassword = bcrypt.compareSync(password, user.password);
      if (validPassword) {
        isValid = true;
      }
    }

    if (!isValid) {
      return res.status(400).json({
        ok: false,
        msg: "Email o contraseña incorrecta",
      });
    }

    // Generate JWT
    const token = await generateJWT(
      user.id,
      user.col_code,
      user.role,
      user.imgUrl
    );

    // generate the log
    registerLog(userType, user, authTypes.login);

    res.json({
      ok: true,
      uid: user.id,
      token,
      col_code: user.col_code,
      role: user.role,
      imgUrl: user.imgUrl,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const userRenewToken = async (req, res = response) => {
  console.log("user renew");
  const { uid, col_code, role, imgUrl } = req;

  // Generar JWT
  const token = await generateJWT(uid, col_code, role, imgUrl);

  res.json({
    ok: true,
    token,
    uid,
    col_code,
    role,
    imgUrl,
  });
};

/********************************/
/************USERS CRUD********* */
/********************************/

module.exports = {
  // userLogin,
  // userRenewToken,
  createUserIfNotExist,

  googleAuth,
  userLogin,
  userRenewToken,
};
