const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../models/Collaborator");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

// called when registering or doing login with google
const CreateUserIfNotExist = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    // get the email and check if is registered
    console.log("CreateUserIfNotExist");
    const email = profile.emails[0].value;
    let userToReturn = {};
    let usedMailByCollaborator = await Collaborator.findOne({ email });
    let usedMailByUser = await User.findOne({ email });

    // if existed, get the userdata
    if (usedMailByCollaborator) {
      userToReturn = { ...usedMailByCollaborator };
    }
    if (usedMailByUser) {
      userToReturn = { ...usedMailByUser };
    }
    // if is not registered, register it and get the data
    if (!usedMailByCollaborator && !usedMailByUser) {
      const user = new User({
        col_code: profile.displayName,
        imgUrl: profile.photos[0].value,
        email: profile.emails[0].value,
      });
      const savedUser = user.save();

      userToReturn = { ...savedUser };
    }

    const token = await generateJWT(
      userToReturn._id,
      userToReturn.col_code,
      userToReturn.role,
      userToReturn.imgUrl
    );

    // generate the user data that will be returned
    const userData = { ...userToReturn, token };
    console.log("user data", userData);
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

module.exports = {
  // userLogin,
  // userRenewToken,
  CreateUserIfNotExist,
};
