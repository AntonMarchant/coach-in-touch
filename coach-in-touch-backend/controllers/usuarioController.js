const Perfil = require("../models/Perfil");

exports.getEntrenadores = async (req, res) => {
  try {
    //req.query contiene los parámetros de la url (importante)
    const filtros = req.query;

    const entrenadores = await Perfil.buscar(filtros);

    if (entrenadores.length === 0) {
      return res
        .status(404)
        .json({ msg: "no se encontraron entrenadores con esos criterios." });
    }

    res.json(entrenadores);
  } catch (error) {
    res.status(500).send("error del Servidor");
  }
};
