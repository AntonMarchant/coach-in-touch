const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const solicitudController = require("../controllers/solicitudController");

// @ruta    GET api/solicitudes/recibidas
// @desc    ver todas las solicitudes recibidas por el entrenador
// @acceso  Privado (Entrenador)
router.get("/recibidas", authMiddleware, solicitudController.getMisSolicitudes);

// @ruta    GET api/solicitudes/enviadas
// @desc    ver las solicitudes enviadas por un deportista
// @acceso  Privado (Deportista)
router.get(
  "/enviadas",
  authMiddleware,
  solicitudController.getSolicitudesEnviadas
); // <-- AÑADE ESTA RUTA

// @ruta    POST api/solicitudes/:entrenadorId
// @desc    crea nueva solicitud para un entrenador
// @acceso  Privado (Deportista)
router.post(
  "/:entrenadorId",
  authMiddleware,
  solicitudController.crearSolicitud
);

// @ruta    PUT api/solicitudes/responder/:solicitudId
// @desc    aceptar/rechazar solicitud
// @acceso  Privado (entrenador)
router.put(
  "/responder/:solicitudId",
  authMiddleware,
  solicitudController.responderSolicitud
);

module.exports = router;
