const Solicitud = require("../models/Solicitud");
const { Usuario } = require("../models/Usuario"); //importante para validacion correcta

//Crear una nueva solicitud para un entrenador
exports.crearSolicitud = async (req, res) => {
  try {
    //verifica que usuario logueado sea deportista
    const solicitante = req.usuario; //obtiene token middleware
    if (solicitante.rol !== "deportista") {
      return res
        .status(403)
        .json({
          msg: "accion no permitida, solo los deportistas pueden enviar solicitudes.",
        });
    }

    //obtiene id del entrenador de la url
    const entrenadorId = req.params.entrenadorId;

    //verifica que usuario no envie una solicitud a el mismo
    if (solicitante.id === entrenadorId) {
      return res.status(400).json({ msg: "no puedes enviarte una solicitud." });
    }

    //verificamos que entrenador exista y sea realmente entrenador
    const entrenador = await Usuario.findByEmail(null, entrenadorId);
    if (!entrenador || entrenador.rol !== "entrenador") {
      return res.status(404).json({ msg: "entrenador no encontrado." });
    }

    //verifica si ya existe solicitud previa
    const solicitudExistente = await Solicitud.findByDeportistaAndEntrenador(
      solicitante.id,
      entrenadorId
    );
    if (solicitudExistente) {
      return res
        .status(400)
        .json({ msg: "ya has enviado una solicitud previamente." });
    }

    //crea nueva solicitud
    const { mensaje } = req.body;
    const nuevaSolicitud = await Solicitud.create({
      deportistaId: solicitante.id,
      entrenadorId: entrenadorId,
      mensaje: mensaje || null,
    });

    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(500).send("error del Servidor");
  }
};

//Obtener todas las solicitudes recibidas por el entrenador logueado
exports.getMisSolicitudes = async (req, res) => {
  try {
    //verificaque sea un entrenador
    if (req.usuario.rol !== "entrenador") {
      return res.status(403).json({ msg: "accion no permitida." });
    }

    const solicitudes = await Solicitud.findByEntrenador(req.usuario.id);
    res.json(solicitudes);
  } catch (error) {
    res.status(500).send("error del Servidor");
  }
};

//Responder una solicitud aceptada o rechazada

exports.responderSolicitud = async (req, res) => {
  try {
    const { solicitudId } = req.params;
    const { nuevoEstado } = req.body; //espera recibir aceptada/rechazada

    //verifica que sea entrenador
    if (req.usuario.rol !== "entrenador") {
      return res.status(403).json({ msg: "accion no permitida." });
    }

    //valida el estado
    if (nuevoEstado !== "aceptada" && nuevoEstado !== "rechazada") {
      return res.status(400).json({ msg: "estado no valido." });
    }

    // El método del modelo se asegura de que solo el entrenador correcto pueda modificarla
    const solicitudActualizada = await Solicitud.updateStatus(
      solicitudId,
      req.usuario.id,
      nuevoEstado
    );

    if (!solicitudActualizada) {
      return res
        .status(404)
        .json({ msg: "solicitud no encontrada o no te pertenece." });
    }

    res.json(solicitudActualizada);
  } catch (error) {
    res.status(500).send("error del Servidor");
  }
};
