import { RequestWithAuthCollaborator } from "../types/RequestsAndResponses";

import { Request, Response } from "express";
import CollaboratorModel from "../data/models/CollaboratorModel";
const { response } = require("express");
const bcrypt = require("bcryptjs");

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
export const collaboratorLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const collaborator = await CollaboratorModel.findOne({ email });

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
      collaborator!._id,
      collaborator!.col_code,
      collaborator!.role,
      collaborator!.imgUrl
    );

    res.json({
      ok: true,
      uid: collaborator!.id,
      token,
      col_code: collaborator!.col_code,
      role: collaborator!.role,
      imgUrl: collaborator!.imgUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

export const getCollaborators = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  try {
    const { role } = req.authenticatedCollaborator ?? {};
    const isAuthorized = isAuthorizedByRole(role, roleTypes.collaborator);
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado para conocer los datos",
      });
    }
    const collaborators = await CollaboratorModel.find();
    res.json({
      ok: true,
      msg: "getCollaborators",
      collaborators,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      statusCode: 500,
      error:
        (error as Error).message ||
        `An error occurred while fetching getCollaborators}.`,
    });
  }
};

export const getCollaboratorsForWeb = async (req: Request, res: Response) => {
  try {
    const collaborators = await CollaboratorModel.find(
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

export const createCollaborator = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  try {
    const { col_code } = req.body;
    // get the uid of the creator
    const { role } = req.authenticatedCollaborator ?? {};
    // check if the collaborator code is not used before

    let usedColCode = await CollaboratorModel.findOne({ col_code });

    if (usedColCode) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existen usuarios con ese código de colaborador",
      });
    }

    const collaborator = new CollaboratorModel(req.body);

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
export const registerCollaborator = async (req: Request, res: Response) => {
  const { col_code, email, accessCode, password } = req.body;

  try {
    // check if the collaborator code is not used before
    let usedMail = await CollaboratorModel.findOne({ email });
    if (usedMail) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un colaborador registrado con ese email",
      });
    }

    let collaborator = await CollaboratorModel.findOne({ col_code });

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

    collaborator.password = cryptedPassword;
    collaborator.email = email;
    collaborator.isRegistered = true;

    let collaboratorId = collaborator.id;

    const updatedCollaborator = await CollaboratorModel.findByIdAndUpdate(
      collaborator._id,
      collaborator,
      { new: true }
    );

    // JWT
    const token = await generateJWT(
      collaboratorId,
      updatedCollaborator!.col_code,
      updatedCollaborator!.role,
      updatedCollaborator!.imgUrl
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

export const getCollaboratorById = async (req: Request, res: Response) => {
  const id = req.params.collaboratorId;
  try {
    // check if the collaborator code is not used before
    let collaborator = await CollaboratorModel.findById(id);

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

export const updateCollaborator = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  // const uid = req.uid;

  try {
    const collaboratorId = req.params.collaboratorId;
    const { role, uid } = req.authenticatedCollaborator ?? {};
    const collaborator = await CollaboratorModel.findById(collaboratorId);

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

    const updatedCollaborator = await CollaboratorModel.findByIdAndUpdate(
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
    console.error("Error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      statusCode: 500,
      error:
        (error as Error).message ||
        `An error occurred while fetching getCollaborators}.`,
    });
  }
};

export const deleteCollaborator = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  const collaboratorId = req.params.collaboratorId;
  try {
    const { role } = req.authenticatedCollaborator ?? {};
    const isAuthorized = isAuthorizedByRole(role, roleTypes.admin);
    if (!isAuthorized) {
      return res.json({
        ok: false,
        msg: "No estás autorizado para conocer los datos",
      });
    }
    await CollaboratorModel.findByIdAndDelete(collaboratorId);
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
