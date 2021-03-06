const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../models/Collaborator");
// const Usuario = require("../models/Usuario");
const { generateJWT } = require("../helpers/jwt");
const { body } = require("express-validator");
const { roleTypes } = require("../types/types");
const { uncatchedError } = require("../helpers/const");
const {
  isAuthorizedByRole,
  isAuthorizeByRoleOrOwnership,
} = require("../helpers/utilities");

// todo: Delete. Now the login is equal for colls and user
const collaboratorLogin = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const collaborator = await Collaborator.findOne({ email });

    let isValid = false;

    if (collaborator) {
      const validPassword = bcrypt.compareSync(password, collaborator.password);
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

    // Generar JWT
    const token = await generateJWT(
      collaborator._id,
      collaborator.col_code,
      collaborator.role,
      collaborator.imgUrl
    );

    res.json({
      ok: true,
      uid: collaborator.id,
      token,
      col_code: collaborator.col_code,
      role: collaborator.role,
      imgUrl: collaborator.imgUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const getCollaborators = async (req, res = response) => {
  try {
    const { role } = req;
    const isAuthorized = isAuthorizedByRole(role, roleTypes.collaborator);
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado para conocer los datos",
      });
    }
    const collaborators = await Collaborator.find();
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

const getCollaboratorsForWeb = async (req, res = response) => {
  try {
    const collaborators = await Collaborator.find(
      { isDisplayedWeb: true },
      {
        first_name: 1,
        last_name: 1,
        col_code: 1,
        imgUrl: 1,
        position: 1,
        textPresentation: 1,
      }
    );
    res.json({
      ok: true,
      msg: "getCollaborators",
      collaborators,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error,
    });
  }
};

const createCollaborator = async (req, res = response) => {
  try {
    const { col_code } = req.body;
    // get the uid of the creator
    const { role } = req;
    // check if the collaborator code is not used before

    let usedColCode = await Collaborator.findOne({ col_code });

    if (usedColCode) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existen usuarios con ese código de colaborador",
      });
    }

    collaborator = new Collaborator(req.body);

    // check if is trying to create admin or manager
    if (
      collaborator.role === roleTypes.admin ||
      collaborator.role === roleTypes.manager
    ) {
      const isAuthorized = isAuthorizedByRole(role, roleTypes.admin);
      if (!isAuthorized) {
        return res.json({
          ok: false,
          msg: "No estás autorizado",
        });
      }
    }

    const savedCollaborator = await collaborator.save();

    res.status(201).json({
      ok: true,
      message: "collaborador creado con éxito",
      collaborator: savedCollaborator,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

// Register collaborator by user
const registerCollaborator = async (req, res = response) => {
  const { col_code, email, accessCode, password } = req.body;

  try {
    // check if the collaborator code is not used before
    let usedMail = await Collaborator.findOne({ email });
    if (usedMail) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un colaborador registrado con ese email",
      });
    }

    let collaborator = await Collaborator.findOne({ col_code });

    if (!collaborator) {
      return res.status(404).json({
        ok: false,
        msg: "No existe colaborador con ese ese código de acceso",
      });
    }

    if (collaborator.isRegistered) {
      return res.status(400).json({
        ok: false,
        msg: `Este usuario ha sido registrado previamente por este correo: ${collaborator.email}. Si el problema persiste contacte al gerente.`,
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

    let collaboratorId = collaborator.id;

    collaborator = {
      ...collaborator.toJSON(),
      password: cryptedPassword,
      email,
      isRegistered: true,
    };
    const updatedCollaborator = await Collaborator.findByIdAndUpdate(
      collaborator._id,
      collaborator,
      { new: true }
    );

    // JWT
    const token = await generateJWT(
      collaboratorId,
      updatedCollaborator.col_code,
      updatedCollaborator.role,
      updatedCollaborator.imgUrl
    );

    res.status(201).json({
      ok: true,
      message: "collaborator updated",
      collaborator: updatedCollaborator,
      token,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getCollaboratorById = async (req, res = response) => {
  const id = req.params.collaboratorId;
  try {
    // check if the collaborator code is not used before
    let collaborator = await Collaborator.findById(id);

    if (!collaborator) {
      return res.status(404).json({
        ok: false,
        msg: "No existe colaborador con ese ese código de acceso",
      });
    }

    return res.status(201).json({
      ok: true,
      msg: "get Collaborator",
      collaborator,
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const updateCollaborator = async (req, res = response) => {
  // const uid = req.uid;

  try {
    const collaboratorId = req.params.collaboratorId;
    const { role, uid } = req;
    const collaborator = await Collaborator.findById(collaboratorId);

    if (!collaborator) {
      return res.status(404).json({
        ok: false,
        msg: "No existe colaborador con ese ese id",
      });
    }

    const newCollaborator = {
      ...req.body,
    };

    if (
      newCollaborator.role === roleTypes.admin ||
      newCollaborator.role === roleTypes.manager
    ) {
      const isAuthorized = isAuthorizeByRoleOrOwnership(
        role,
        roleTypes.admin,
        uid,
        collaboratorId
      );
      if (!isAuthorized) {
        return res.json({
          ok: false,
          msg: "No estás autorizado",
        });
      }
    }

    const updatedCollaborator = await Collaborator.findByIdAndUpdate(
      collaboratorId,
      newCollaborator,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "colaborador actualizado",
      collaborator: updatedCollaborator,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
      error: error.msg,
    });
  }
};

const deleteCollaborator = async (req, res = response) => {
  const collaboratorId = req.params.collaboratorId;
  try {
    const { role } = req;
    const isAuthorized = isAuthorizedByRole(role, roleTypes.admin);
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado para conocer los datos",
      });
    }
    await Collaborator.findByIdAndDelete(collaboratorId);
    res.json({
      ok: true,
      msg: "colaborador eliminado",
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
  collaboratorLogin,

  createCollaborator,
  getCollaborators,
  getCollaboratorById,
  updateCollaborator,
  registerCollaborator,
  getCollaboratorsForWeb,
  deleteCollaborator,
};
