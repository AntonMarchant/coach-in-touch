const { Usuario } = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//registro de usuario
exports.register = async (req, res) => {
  //validacion simple
  const { nombre, correo, contrasena, rol, deporte_id, ...detallesPerfil } =
    req.body;

  if (!nombre || !correo || !contrasena || !rol) {
    return res
      .status(400)
      .json({
        msg: "por favor, incluye todos los campos requeridos: nombre, correo, contraseña y rol.",
      });
  }

  try {
    const usuarioExistente = await Usuario.findByEmail(correo);
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ msg: "el correo electrónico ya esta registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const contrasena_hash = await bcrypt.hash(contrasena, salt);

    const nuevoUsuarioData = {
      nombre,
      correo,
      contrasena_hash,
      rol,
      deporte_id,
      ...detallesPerfil,
    };

    const usuarioCreado = await Usuario.create(nuevoUsuarioData);

    res.status(201).json({
      msg: "usuario registrado exitosamente.",
      usuario: usuarioCreado,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "error del servidor al registrar el usuario." });
  }
};

//login
exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    //verificar si el usuario existe o no
    const usuario = await Usuario.findByEmail(correo);
    if (!usuario) {
      return res.status(400).json({ msg: "credenciales invalidas." });
    }

    //comparar contraseña ingresada con la de la bbdd
    const esCorrecta = await bcrypt.compare(
      contrasena,
      usuario.contrasena_hash
    );
    if (!esCorrecta) {
      return res.status(400).json({ msg: "credenciales invalidas." });
    }

    //si todo esta bien crear y firmar el json web token
    const payload = {
      usuario: {
        id: usuario.id,
        rol: usuario.rol,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "error del servidor." });
  }
};
