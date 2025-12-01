const Feedback = require("../models/Feedback");
const Solicitud = require("../models/Solicitud");

//crea nuevo feedback
exports.crearFeedback = async (req, res) => {
  try {
    const deportistaId = req.usuario.id; //id deportista logueado
    const { entrenadorId } = req.params; //id entrenador a valorar
    const { puntuacion, comentario } = req.body;

    //solo los deportistas pueden valorar
    if (req.usuario.rol !== "deportista") {
      return res
        .status(403)
        .json({ msg: "solo los deportistas pueden dejar valoraciones." });
    }

    //verifica que deportista ya ha sido aceptado por entrenador
    const solicitud = await Solicitud.findByDeportistaAndEntrenador(
      deportistaId,
      entrenadorId
    );
    if (!solicitud || solicitud.estado !== "aceptada") {
      return res.status(403).json({
        msg: "solo puedes valorar a entrenadores cuya solicitud ha sido aceptada.",
      });
    }

    //verifica que no haya dejado un feedback antes
    const feedbackExistente = await Feedback.findByDeportistaAndEntrenador(
      deportistaId,
      entrenadorId
    );
    if (feedbackExistente) {
      return res
        .status(400)
        .json({ msg: "ya has valorado a este entrenador." });
    }

    //verifica que puntuación sea 1-5
    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return res
        .status(400)
        .json({ msg: "la puntuacion debe ser un numero entre 1 y 5." });
    }

    //crea feeedback
    const nuevoFeedback = await Feedback.create({
      deportistaId,
      entrenadorId,
      puntuacion,
      comentario,
    });

    res.status(201).json(nuevoFeedback);
  } catch (error) {
    res.status(500).send("error del Servidor");
  }
};

//obtiene las valoraciones de entrenadores
exports.getMisFeedbacks = async (req, res) => {
  try {
    if (req.usuario.rol !== "entrenador") {
      return res.status(403).json({ msg: "Accion no permitida." });
    }
    const feedbacks = await Feedback.findByEntrenador(req.usuario.id);
    res.json(feedbacks);
  } catch (error) {
    res.status(500).send("Error del Servidor");
  }
};
