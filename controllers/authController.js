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

// googleAuth
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
    user = await Collaborator.findOne({ email });
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
  res.redirect(`${process.env.CLIENT_URL}#/auth`);
};

/********************************/
/************USERS CRUD********* */
/********************************/
const userLogin = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    let user = await Collaborator.findOne({ email });
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

const createUser = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    // check if the collaborator code is not used before
    let usedMail = await Collaborator.findOne({ email });
    if (!usedMail) {
      usedMail = await User.findOne({ email });
    }
    if (usedMail) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario registrado con ese email",
      });
    }

    // encrypt pass
    const salt = bcrypt.genSaltSync();
    const cryptedPassword = bcrypt.hashSync(password, salt);

    const user = new User(req.body);
    user.password = cryptedPassword;
    const savedUser = await user.save();

    // Generate JWT
    const token = await generateJWT(
      savedUser._id,
      savedUser.col_code,
      savedUser.role,
      savedUser.imgUrl
    );

    // generate the log
    registerLog("user", savedUser, authTypes.login);

    res.status(201).json({
      ok: true,
      message: "usuario creado con éxito",
      user: savedUser,
      token,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getUsers = async (req, res = response) => {
  try {
    // from token
    const { role } = req;
    const isAuthorized = isAuthorizedByRole(role, roleTypes.collaborator);
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado para conocer los datos",
      });
    }

    const users = await User.find();
    res.json({
      ok: true,
      msg: "getUsers",
      users,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getUser = async (req, res = response) => {
  try {
    // from token
    const { uid, role } = req;
    // from params
    const reqUserId = req.params.userId;
    // validate authorization
    const isAuthorized = isAuthorizeByRoleOrOwnership(
      role,
      roleTypes.collaborator,
      uid,
      reqUserId
    );
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado para conocer los datos de este usuario",
      });
    }
    let user = await User.findById(reqUserId);
    res.json({
      ok: true,
      msg: "getUser",
      user,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};
const updateUser = async (req, res = response) => {
  try {
    // from token
    const { uid, role } = req;
    const { password } = req.body;
    // from params
    const reqUserId = req.params.userId;
    // validate authorization

    const isAuthorized = isAuthorizeByRoleOrOwnership(
      role,
      roleTypes.collaborator,
      uid,
      reqUserId
    );
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado para conocer los datos de este usuario",
      });
    }

    let user = await User.findById(reqUserId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "No existe usuario con ese ese id",
      });
    }

    const tempUser = {
      ...req.body,
    };

    if (password) {
      // encrypt pass
      const salt = bcrypt.genSaltSync();
      const cryptedPassword = bcrypt.hashSync(password, salt);
      tempUser.password = cryptedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(reqUserId, tempUser, {
      new: true,
    });

    res.json({
      ok: true,
      msg: "Usuario actualizado",
      updatedUser,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const deleteUser = async (req, res = response) => {
  try {
    // from token
    const { uid, role } = req;
    // from params
    const reqUserId = req.params.userId;
    // validate authorization

    const isAuthorized = isAuthorizedByRole(role, roleTypes.admin);
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado",
      });
    }

    await User.findByIdAndDelete(reqUserId);
    res.json({
      ok: true,
      msg: "Usuario eliminado",
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

module.exports = {
  // userLogin,
  // userRenewToken,
  createUserIfNotExist,

  googleAuth,
  createUser,
  userLogin,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
