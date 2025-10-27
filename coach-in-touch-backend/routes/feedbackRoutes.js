const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const feedbackController = require("../controllers/feedbackController");

// @ruta    POST api/feedback/:entrenadorId
// @desc    dejar feedback puntuacion/comentario para entrenador
// @acceso  privado (solo deportistas)
router.post(
  "/:entrenadorId",
  authMiddleware, //asegura que este logeado
  feedbackController.crearFeedback
);
module.exports = router;
