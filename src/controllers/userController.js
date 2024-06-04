const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../data/models/CollaboratorModel");
const User = require("../models/User");

const { generateJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { uncatchedError } = require("../helpers/const");
const FcmDog = require("../models/FcmDog");

const { roleTypes, authTypes } = require("../types/types");
const {
  isAuthorizeByRoleOrOwnership,
  isAuthorizedByRole,
  registerLog,
} = require("../helpers/utilities");
const AuthLog = require("../models/CollaboratorLog");
const {
  default: CollaboratorModel,
} = require("../data/models/CollaboratorModel");

const createUser = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    // check if the collaborator code is not used before
    let usedMail = await CollaboratorModel.findOne({ email });
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

    const users = await User.find().populate(
      "linkedFcmPartners linkedDogs linkedFcmPackages linkedFcmTransfers"
    );
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
    let user = await User.findById(reqUserId).populate(
      "linkedFcmPartners linkedDogs linkedFcmPackages linkedFcmTransfers"
    );
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

// fcmPartner
const unlinkFcmPartner = async (req, res = response) => {
  try {
    // from token
    const { uid, role } = req;
    // from params
    const { userId, fcmPartnerId } = req.params;

    console.log("estos son los parámetros", userId, fcmPartnerId);

    const user = await User.findById(userId);
    // validate authorization
    const isAuthorized = isAuthorizeByRoleOrOwnership(
      role,
      roleTypes.collaborator,
      uid,
      user.id
    );
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado",
      });
    }

    console.log("esto es el user", user);

    // remove linkFcmPartner
    user.linkedFcmPartners = user.linkedFcmPartners.filter(
      (element) => element.toString() !== fcmPartnerId
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...user },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      msg: "Usuario actualizado",
      updatedUser,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const linkFcmPartner = async (req, res = response) => {
  try {
    // from token
    const { uid, role } = req;
    // from params
    const { userId, fcmPartnerId } = req.params;

    const user = await User.findById(userId);
    // validate authorization
    const isAuthorized = isAuthorizeByRoleOrOwnership(
      role,
      roleTypes.collaborator,
      uid,
      user.id
    );
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado",
      });
    }

    // remove linkFcmPartner
    user.linkedFcmPartners = user.linkedFcmPartners.push(fcmPartnerId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...user },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      msg: "Usuario actualizado",
      updatedUser,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const unlinkDog = async (req, res = response) => {
  try {
    // from token
    const { uid, role } = req;
    // from params
    const { userId, dogId } = req.params;

    const user = await User.findById(userId);
    // validate authorization
    const isAuthorized = isAuthorizeByRoleOrOwnership(
      role,
      roleTypes.collaborator,
      uid,
      user.id
    );
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado",
      });
    }

    // remove dog
    user.linkedDogs = user.linkedDogs.filter(
      (element) => element.toString() !== dogId
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...user },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      msg: "Usuario actualizado",
      updatedUser,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const linkDog = async (req, res = response) => {
  try {
    // from token
    const { uid, role } = req;
    // from params
    const { userId, dogId } = req.params;

    const user = await User.findById(userId);
    // validate authorization
    const isAuthorized = isAuthorizeByRoleOrOwnership(
      role,
      roleTypes.collaborator,
      uid,
      user.id
    );
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado",
      });
    }

    // remove linkFcmPartner
    user.linkedDogs = user.linkedDogs.push(dogId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...user },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      msg: "Usuario actualizado",
      updatedUser,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// FCM TRANSFERS
const unlinkFcmTransfer = async (req, res = response) => {
  try {
    // from token
    const { uid, role } = req;
    // from params
    const { userId, fcmTransferId } = req.params;

    const user = await User.findById(userId);
    // validate authorization
    const isAuthorized = isAuthorizeByRoleOrOwnership(
      role,
      roleTypes.collaborator,
      uid,
      user.id
    );
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado",
      });
    }
    // remove dog
    user.linkedFcmTransfers = user.linkedFcmTransfers.filter(
      (element) => element.toString() !== fcmTransferId
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...user },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      msg: "Usuario actualizado",
      updatedUser,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const linkFcmTransfer = async (req, res = response) => {
  try {
    // from token
    const { uid, role } = req;
    // from params
    const { userId, fcmtransferId } = req.params;

    const user = await User.findById(userId);
    // validate authorization
    const isAuthorized = isAuthorizeByRoleOrOwnership(
      role,
      roleTypes.collaborator,
      uid,
      user.id
    );
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado",
      });
    }

    // remove linkFcmPartner
    user.linkedFcmTransfers = user.linkedFcmTransfers.push(fcmtransferId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...user },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      msg: "Usuario actualizado",
      updatedUser,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};
// FCM PACKAGES
const unlinkFcmPackage = async (req, res = response) => {
  try {
    // from token
    const { uid, role } = req;
    // from params
    const { userId, fcmPackageId } = req.params;

    const user = await User.findById(userId);
    // validate authorization
    const isAuthorized = isAuthorizeByRoleOrOwnership(
      role,
      roleTypes.collaborator,
      uid,
      user.id
    );
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado",
      });
    }

    // remove fcmtransfer
    user.linkedFcmPackages = user.linkedFcmPackages.filter(
      (element) => element.toString() !== fcmPackageId
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...user },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      msg: "Usuario actualizado",
      updatedUser,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const linkFcmPackage = async (req, res = response) => {
  try {
    // from token
    const { uid, role } = req;
    // from params
    const { userId, fcmPackageId } = req.params;

    const user = await User.findById(userId);
    // validate authorization
    const isAuthorized = isAuthorizeByRoleOrOwnership(
      role,
      roleTypes.collaborator,
      uid,
      user.id
    );
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado",
      });
    }

    // remove linkFcmPartner
    user.linkedFcmPackages = user.linkedFcmPackages.push(fcmPackageId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...user },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      msg: "Usuario actualizado",
      updatedUser,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

module.exports = {
  // userLogin,
  // userRenewToken,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  unlinkFcmPartner,
  linkFcmPartner,
  linkDog,
  unlinkDog,
  linkFcmTransfer,
  unlinkFcmTransfer,
  linkFcmPackage,
  unlinkFcmPackage,
};
