const Perfil = require("../models/Perfil");

//obtener perfil del usuario logueado
exports.getMiPerfil = async (req, res) => {
  try {
    //req.usuario.id viene del middleware (no olvidar)
    const perfil = await Perfil.findByUserId(req.usuario.id);
    if (!perfil) {
      return res.status(404).json({ msg: "perfil no encontrado." });
    }
    res.json(perfil);
  } catch (error) {
    res.status(500).send("error del Servidor");
  }
};

//actualizar perfil del usuario logueado
exports.updateMiPerfil = async (req, res) => {
  try {
    //busca perfil existente
    const perfilExistente = await Perfil.findByUserId(req.usuario.id);

    //crea el objeto con los datos actualizados y ademas manteniene los existentes si no se suben nuevos (importantisimo)
    const datosActualizados = {
      nombre: req.body.nombre || perfilExistente.nombre,
      foto_url: req.body.foto_url || perfilExistente.foto_url,
      biografia: req.body.biografia || perfilExistente.biografia,
      deporte_id: req.body.deporte_id || perfilExistente.deporte_id,
      objetivos: req.body.objetivos || perfilExistente.objetivos,
      experiencia: req.body.experiencia || perfilExistente.experiencia,
      certificaciones:
        req.body.certificaciones || perfilExistente.certificaciones,
    };

    const perfil = await Perfil.update(req.usuario.id, datosActualizados);
    res.json(perfil);
  } catch (error) {
    res.status(500).send("error del Servidor");
  }
};
