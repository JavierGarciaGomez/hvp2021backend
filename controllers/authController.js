const { response } = require("express");
const bcrypt = require("bcryptjs");
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

const userCreate = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    /*
    let user = await Usuario.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    }

    user = new Usuario(req.body);

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

module.exports = {
  // userLogin,
  // userRenewToken,
  userCreate,
};
