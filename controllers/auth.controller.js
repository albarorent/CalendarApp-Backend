const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.schema.js");
const { generarJWT } = require("../helpers/jwt.js");

const crearUsuario = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await User.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario ya existe con ese correo",
      });
    }
    usuario = new User(req.body);

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    //Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      msg: "registro",
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario y contraseña no son correctos",
      });
    }

    //Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    //Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(200).json({
      ok: true,
      msg: "login",
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const autenticated = async (req = request, res = response) => {
  const { uid, name } = req.user;

  //generar un nuevo JWT y retornarlo en esta petición

  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    uid,
    name,
    token
  });
};

module.exports = { crearUsuario, login, autenticated };
