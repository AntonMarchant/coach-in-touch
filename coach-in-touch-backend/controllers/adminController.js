const Perfil = require("../models/Perfil");

//obtiene entrenadores que no han sido validados aun
exports.getEntrenadoresPendientes = async (req, res) => {
  try {
    const perfiles = await Perfil.findPendientesDeValidacion();
    res.json(perfiles);
  } catch (error) {
    res.status(500).send("Error del Servidor");
  }
};

//valida un entrenador especifico
exports.validarEntrenador = async (req, res) => {
  try {
    const { entrenadorId } = req.params; //obtiene id del entrenador de la url

    //valida el perfil
    const perfilActualizado = await Perfil.validar(entrenadorId);

    if (!perfilActualizado) {
      return res
        .status(404)
        .json({ msg: "Perfil de entrenador no encontrado." });
    }

    //envia perfil con validado=true
    res.json(perfilActualizado);
  } catch (error) {
    res.status(500).send("Error del Servidor");
  }
};
