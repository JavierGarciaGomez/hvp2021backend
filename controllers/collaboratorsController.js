const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../models/Collaborator");
// const Usuario = require("../models/Usuario");
// const { generarJWT } = require("../helpers/jwt");

/*
const userLogin = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
*/

const getCollaborators = async (req, res = response) => {
  const collaborators = await Collaborator.find();

  try {
    res.json({
      ok: true,
      msg: "getCollaborators",
      collaborators,
    });
  } catch {
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error,
    });
  }
};

const createCollaborator = async (req, res = response) => {
  const { col_code } = req.body;

  try {
    console.log("este es el req.body", req.body);
    // check if the collaborator code is not used before
    let collaborator = await Collaborator.findOne({ col_code });

    if (collaborator) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existen usuarios con ese código de colaborador",
      });
    }

    collaborator = new Collaborator(req.body);
    console.log("grabar colaborador", collaborator);
    await collaborator.save();

    /*
    // encrypt pass
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    console.log("grabar usuario", user);

    const what = await user.save();

    // JWT
    const token = await generarJWT(user.id, user.name);
*/
    res.status(201).json({
      ok: true,
      message: "create collaborator",
      col_code: collaborator.col_code,
      first_name: collaborator.first_name,
      last_name: collaborator.last_name,
      role: collaborator.role,
      col_numId: collaborator.col_numId,
      isActive: collaborator.isActive,
      gender: collaborator.gender,
      // uid: user.id,
      // name: user.name,
      // password: user.password,
      // token,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error,
    });
  }
};

// Register collaborator by user
const registerCollaborator = async (req, res = response) => {
  const { col_code, email, accessCode, password } = req.body;

  try {
    // check if the collaborator code is not used before
    let collaborator = await Collaborator.findOne({ col_code });

    if (!collaborator) {
      return res.status(404).json({
        ok: false,
        msg: "No existe colaborador con ese ese código de acceso",
      });
    }

    if (collaborator.accessCode !== accessCode) {
      return res.status(400).json({
        ok: false,
        msg: "El código de acceso no coincide con el del colaborador que pretende ser registrado",
      });
    }

    // encrypt pass
    const salt = bcrypt.genSaltSync();
    const cryptedPassword = bcrypt.hashSync(password, salt);

    collaborator = {
      ...collaborator.toJSON(),
      password: cryptedPassword,
      email,
      registered: true,
    };
    const updatedCollaborator = await Collaborator.findByIdAndUpdate(
      collaborator._id,
      collaborator,
      { new: true }
    );

    console.log("colaborador actualizado", updatedCollaborator);

    // JWT
    // const token = await generarJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      message: "collaborator updated",
      collaborator: updatedCollaborator,

      // token,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error,
    });
  }
};

const getCollaboratorById = async (req, res = response) => {
  const id = req.params.collaboratorId;
  console.log("este es el id", id);

  try {
    // check if the collaborator code is not used before
    let collaborator = await Collaborator.findById(id);

    console.log("collaborador encontrado", collaborator);

    return res.status(201).json({
      ok: true,
      msg: "get Collaborator",
      collaborator,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error,
    });
  }
};

// ..., 344
/*
const userRenewToken = async (req, res = response) => {
  const { uid, name } = req;

  // Generar JWT
  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    token,
    uid,
    name,
  });
};
*/

const updateCollaborator = async (req, res = response) => {
  const collaboratorId = req.params.collaboratorId;

  // const uid = req.uid;

  try {
    const collaborator = await Collaborator.findById(collaboratorId);

    if (!collaborator) {
      return res.status(404).json({
        ok: false,
        msg: "No existe colaborador con ese ese id",
      });
    }

    // if (evento.user.toString() !== uid) {
    //   return res.status(401).json({
    //     ok: false,
    //     msg: "No tiene privilegio de editar este evento",
    //   });
    // }

    const newCollaborator = {
      ...req.body,
    };

    const updatedCollaborator = await Collaborator.findByIdAndUpdate(
      collaboratorId,
      newCollaborator,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "evento actualizado",
      collaborator: updatedCollaborator,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  // userLogin,
  // userRenewToken,
  createCollaborator,
  getCollaborators,
  getCollaboratorById,
  updateCollaborator,
  registerCollaborator,
};
