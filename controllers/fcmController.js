const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../models/Collaborator");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { uncatchedError } = require("../helpers/const");

const FcmPartner = require("../models/FcmPartner");
const Dog = require("../models/Dog");
const FcmTransfer = require("../models/FcmTransfer.js");
const Package = require("../models/Package");

/************ CRUD ALL********* */
const getAllFcm = async (req, res = response) => {
  try {
    // get partners
    let allFcmPartners = await FcmPartner.find().populate(
      "creator",
      "col_code"
    );
    let allDogs = await Dog.find().populate("creator", "col_code");
    let allFcmTransfers = await FcmTransfer.find().populate(
      "creator",
      "col_code"
    );
    let allPackages = await Package.find().populate("creator", "col_code");

    res.json({
      ok: true,
      msg: "generado",
      allFcmPartners,
      allDogs,
      allFcmTransfers,
      allPackages,
    });
  } catch (error) {
    uncatchedError(error, res);
  }

  // get dogs
  // get packages
  // get transfers
};

// todo
// create new fcmPartner
const createFcmPartner = async (req, res = response) => {
  try {
    // check who is doing the register
    const { uid } = req;

    const { partnerNum } = req.body;
    if (partnerNum !== "") {
      const foundObject = await FcmPartner.findOne({ partnerNum });
      if (foundObject) {
        return res.status(500).json({
          ok: false,
          msg: "El número de socio que quiere registrar ha sido ya registrado previamente, si lo necesita, vincúlelo a su cuenta.",
        });
      }
    }

    const data = { ...req.body };
    data.creator = uid;

    const fcmPartner = new FcmPartner({ ...data });

    const saved = await fcmPartner.save();
    // save it in the user fcmpartner
    const user = await User.findById(uid);
    // just if is a user create fcmPartners
    if (user) {
      if (!user.linkedFcmPartners) {
        user.linkedFcmPartners = [];
      }
      user.linkedFcmPartners.push(saved._id);
      await User.findByIdAndUpdate(uid, user);
    }

    res.status(201).json({
      ok: true,
      msg: "Creado con éxito",
      saved,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get all
const getAllFcmPartner = async (req, res = response) => {
  try {
    let allFcmPartners = await FcmPartner.find().populate(
      "creator",
      "col_code"
    );

    res.json({
      ok: true,
      msg: "generado",
      allFcmPartners,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getFcmPartner = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;
    console.log("getfcm", id);

    let fcmPartner = await FcmPartner.findById(id);

    res.json({
      ok: true,
      msg: "generado",
      fcmPartner,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getFcmPartnerByPartnerNum = async (req, res = response) => {
  try {
    // get the id
    const { partnerNum } = req.params;

    let fcmPartner = await FcmPartner.findOne({
      partnerNum,
    });

    if (!fcmPartner) {
      return res.status(500).json({
        ok: false,
        msg: "No existe un socio registrado con ese número en esta base de datos, favor de registrarlo.",
      });
    }

    res.json({
      ok: true,
      msg: "generado",
      fcmPartner,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get from a user
const updateFcmPartner = async (req, res = response) => {
  try {
    const { uid } = req;
    // get the id
    const id = req.params.id;

    // get the original data
    let fcmPartner = await FcmPartner.findById(id);
    if (!fcmPartner) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    // get the new data and add the creator
    const updateData = { ...req.body };

    // Save the update
    const updatedData = await FcmPartner.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({
      ok: true,
      msg: "Éxito",
      updatedData,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const deleteFcmPartner = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;
    let fcmPartner = await FcmPartner.findById(id);

    if (!fcmPartner) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    await FcmPartner.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Éxito",
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

/************ CRUD DOGS********* */
const createDog = async (req, res = response) => {
  try {
    // check who is doing the register
    const { uid } = req;

    const data = { ...req.body };

    const { registerNum } = data;
    const foundObject = await Dog.findOne({ registerNum });
    if (foundObject) {
      return res.status(500).json({
        ok: false,
        msg: "El número de registro que quiere registrar ha sido ya registrado previamente, si lo necesita, vincúlelo a su cuenta.",
      });
    }

    data.creator = uid;

    const dog = new Dog({ ...data });

    const saved = await dog.save();
    // save it in the user dog
    const user = await User.findById(uid);
    // just if is a user create fcmPartners
    if (user) {
      if (!user.linkedDogs) {
        user.linkedDogs = [];
      }
      user.linkedDogs.push(saved._id);
      await User.findByIdAndUpdate(uid, user);
    }

    res.status(201).json({
      ok: true,
      msg: "Creado con éxito",
      saved,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get all
const getAllDogs = async (req, res = response) => {
  try {
    let allDogs = await Dog.find().populate("creator", "col_code");

    res.json({
      ok: true,
      msg: "generado",
      allDogs,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getDog = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;
    console.log("getfcm", id);

    let dog = await Dog.findById(id);

    res.json({
      ok: true,
      msg: "generado",
      dog,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const updateDog = async (req, res = response) => {
  try {
    const { uid } = req;
    // get the id
    const id = req.params.id;

    // get the original data
    let dog = await Dog.findById(id);
    if (!dog) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    // get the new data and add the creator
    const updateData = { ...req.body };

    // Save the update
    const updatedData = await Dog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({
      ok: true,
      msg: "Éxito",
      updatedData,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const deleteDog = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;
    let dog = await Dog.findById(id);

    if (!dog) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    await Dog.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Éxito",
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

/************ FCMTRANSFER ********* */
const createFcmTransfer = async (req, res = response) => {
  try {
    // check who is doing the register
    const { uid } = req;
    const data = { ...req.body };
    data.creator = uid;
    const fcmTransfer = new FcmTransfer({ ...data });

    const saved = await fcmTransfer.save();
    // save it in the user fcmTransfer
    const user = await User.findById(uid);
    // just if is a user create fcmPartners
    if (user) {
      if (!user.linkedFcmTransfers) {
        user.linkedFcmTransfers = [];
      }
      user.linkedFcmTransfers.push(saved._id);
      await User.findByIdAndUpdate(uid, user);
    }

    res.status(201).json({
      ok: true,
      msg: "Creado con éxito",
      saved,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get all
const getAllFcmTransfers = async (req, res = response) => {
  try {
    let allFcmTransfers = await FcmTransfer.find().populate(
      "creator",
      "col_code"
    );

    res.json({
      ok: true,
      msg: "generado",
      allFcmTransfers,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getFcmTransfer = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;
    console.log("getfcm", id);

    let fcmTransfer = await FcmTransfer.findById(id);

    res.json({
      ok: true,
      msg: "generado",
      fcmTransfer,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const updateFcmTransfer = async (req, res = response) => {
  try {
    const { uid } = req;
    // get the id
    const id = req.params.id;

    // get the original data
    let fcmTransfer = await FcmTransfer.findById(id);
    if (!fcmTransfer) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    // get the new data and add the creator
    const updateData = { ...req.body };

    // Save the update
    const updatedData = await FcmTransfer.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({
      ok: true,
      msg: "Éxito",
      updatedData,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const deleteFcmTransfer = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;
    let fcmTransfer = await FcmTransfer.findById(id);

    if (!fcmTransfer) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    await FcmTransfer.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Éxito",
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

/************ PACKAGES ********* */
const createFcmPackage = async (req, res = response) => {
  try {
    // check who is doing the register
    const { uid } = req;

    const data = { ...req.body };

    data.creator = uid;

    const package = new Package({ ...data });

    const saved = await package.save();
    // save it in the user package
    const user = await User.findById(uid);
    // just if is a user create fcmPartners

    if (user) {
      if (!user.linkedFcmPackages) {
        user.linkedFcmPackages = [];
      }
      user.linkedFcmPackages.push(saved._id);
      console.log("este es el user", user);
      await User.findByIdAndUpdate(uid, user);
      console.log("llegué acá");
    }

    res.status(201).json({
      ok: true,
      msg: "Creado con éxito",
      saved,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// get all
const getAllFcmPackages = async (req, res = response) => {
  try {
    let allPackages = await Package.find().populate("creator", "col_code");

    res.json({
      ok: true,
      msg: "generado",
      allPackages,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getFcmPackage = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;
    console.log("getfcm", id);

    let data = await Package.findById(id);

    res.json({
      ok: true,
      msg: "generado",
      data,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const updateFcmPackage = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;
    console.lo;

    // get the original data
    let package = await Package.findById(id);
    if (!package) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    // get the new data and add the creator
    const updateData = { ...req.body };

    // Save the update
    const updatedData = await Package.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({
      ok: true,
      msg: "Éxito",
      updatedData,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const deleteFcmPackage = async (req, res = response) => {
  try {
    // get the id
    const id = req.params.id;
    let package = await Package.findById(id);

    if (!package) {
      return res.status(404).json({
        ok: false,
        msg: "No existe data con ese ese id",
      });
    }

    await Package.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Éxito",
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

module.exports = {
  getAllFcm,
  createFcmPartner,
  getAllFcmPartner,
  getFcmPartner,
  updateFcmPartner,
  deleteFcmPartner,
  getFcmPartnerByPartnerNum,
  createDog,
  getAllDogs,
  getDog,
  updateDog,
  deleteDog,
  createFcmTransfer,
  getAllFcmTransfers,
  getFcmTransfer,
  updateFcmTransfer,
  deleteFcmTransfer,
  createFcmPackage,
  getAllFcmPackages,
  getFcmPackage,
  updateFcmPackage,
  deleteFcmPackage,
};
