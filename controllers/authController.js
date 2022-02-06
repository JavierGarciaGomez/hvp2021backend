const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../models/Collaborator");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");

// called when registering or doing login with google
const CreateUserIfNotExist = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    // get the email and check if is registered
    const email = profile.emails[0].value;
    let userToReturn = {};
    let userId;
    let usedMailByCollaborator = await Collaborator.findOne({ email });
    let usedMailByUser = await User.findOne({ email });

    // if existed, get the userdata
    if (usedMailByCollaborator) {
      userToReturn = { ...usedMailByCollaborator.toObject() };
      userId = usedMailByCollaborator.id;
    }
    if (usedMailByUser) {
      userToReturn = { ...usedMailByUser.toObject() };
      userId = usedMailByUser.id;
    }
    // if is not registered, register it and get the data
    if (!usedMailByCollaborator && !usedMailByUser) {
      const user = new User({
        col_code: profile.displayName,
        imgUrl: profile.photos[0].value,
        email: profile.emails[0].value,
      });
      const savedUser = await user.save();
      // todo save the id

      userToReturn = { ...savedUser.toObject() };
      userId = savedUser.id;
    }

    const token = await generateJWT(
      userId,
      userToReturn.col_code,
      userToReturn.role,
      userToReturn.imgUrl
    );

    // todo: delete
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);

    const { uid, col_code, role, imgUrl } = payload;

    // generate the user data that will be returned
    const userData = { ...userToReturn, token };

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
