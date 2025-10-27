const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const solicitudController = require("../controllers/solicitudController");

// @ruta    POST api/solicitudes/:entrenadorId
// @desc    crea nueva solicitud para un entrenador
// @acceso  privado
router.post(
  "/:entrenadorId",
  authMiddleware,
  solicitudController.crearSolicitud
);

module.exports = router;
