const Solicitud = require("../models/Solicitud");
const { Usuario } = require("../models/Usuario");

//crea nueva solicitud para un entrenador
exports.crearSolicitud = async (req, res) => {
  try {
    //verifica que usuario logueado sea deportista
    const solicitante = req.usuario; //obtiene token middleware
    if (solicitante.rol !== "deportista") {
      return res.status(403).json({
        msg: "accion no permitida, solo los deportistas pueden enviar solicitudes.",
      });
    }

    //obtiene id del entrenador de la url
    const entrenadorId = req.params.entrenadorId;
    //verifica que usuario no envie una solicitud a el mismo
    if (solicitante.id === entrenadorId) {
      return res.status(400).json({ msg: "no puedes enviarte una solicitud." });
    }
    //verifica que entrenador exista y sea realmente entrenador
    const entrenador = await Usuario.findByEmail(null, entrenadorId);
    if (!entrenador || entrenador.rol !== "entrenador") {
      return res.status(404).json({ msg: "Entrenador no encontrado." });
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

    //notificacion en tiempo real
    const io = req.app.get("socketio"); //obtiene  socket guardado en app.js
    if (io) {
      io.emit("nueva_notificacion", {
        mensaje: `🔔 ¡Tienes una nueva solicitud de ${solicitante.nombre}!`,
        tipo: "solicitud",
      });
    }

    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(500).send("Error del Servidor");
  }
};

//obtener todas las solicitudes recibidas por el entrenador logueado
exports.getMisSolicitudes = async (req, res) => {
  try {
    // req.usuario.id es el id del entrenador logueado
    if (req.usuario.rol !== "entrenador") {
      return res.status(403).json({ msg: "Accion no permitida." });
    }
    const solicitudes = await Solicitud.findRecibidasPorEntrenador(
      req.usuario.id
    );
    res.json(solicitudes);
  } catch (error) {
    res.status(500).send("Error del Servidor");
  }
};

//responder una solicitud aceptar/rechazar
exports.responderSolicitud = async (req, res) => {
  try {
    const { solicitudId } = req.params;
    const { nuevoEstado } = req.body; //espera recibir aceptada/rechazada
    if (req.usuario.rol !== "entrenador") {
      return res.status(403).json({ msg: "Accion no permitida." });
    }
    //verifica que estado sea valido
    if (nuevoEstado !== "aceptada" && nuevoEstado !== "rechazada") {
      return res.status(400).json({ msg: "Estado no valido." });
    }
    //actualiza solicitud
    const solicitudActualizada = await Solicitud.updateStatus(
      solicitudId,
      req.usuario.id,
      nuevoEstado
    );
    if (!solicitudActualizada) {
      return res.status(404).json({ msg: "Solicitud no encontrada" });
    }

    //noti en tiempo real
    const io = req.app.get("socketio");
    if (io) {
      io.emit("nueva_notificacion", {
        mensaje: `🔔 Tu solicitud ha sido ${nuevoEstado.toUpperCase()}.`,
        tipo: "respuesta",
      });
    }

    res.json(solicitudActualizada);
  } catch (error) {
    res.status(500).send("Error del Servidor");
  }
};

//obtiene solicitudes enviadas por el deportista logueado
exports.getSolicitudesEnviadas = async (req, res) => {
  try {
    //verifica que sea un deportista
    if (req.usuario.rol !== "deportista") {
      return res.status(403).json({ msg: "Accion no permitida." });
    }
    const solicitudes = await Solicitud.findEnviadasPorDeportista(
      req.usuario.id
    );
    res.json(solicitudes);
  } catch (error) {
    res.status(500).send("Error del Servidor");
  }
};
