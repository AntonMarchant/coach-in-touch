const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const progresoController = require("../controllers/progresoController");

// @ruta    POST api/progreso
// @desc    crea nuevo registro de progreso
// @acceso  privado
router.post("/", authMiddleware, progresoController.crearRegistro);

// @ruta    GET api/progreso/historial/:deportistaId?
// @desc    ver historial, el id es opcional si eres deportista pq trae su historial
// @acceso  privado
router.get("/historial", authMiddleware, progresoController.getHistorial); //caso 1: sin id, el deportista ve el suyo
router.get(
  "/historial/:deportistaId",
  authMiddleware,
  progresoController.getHistorial
); //caso 2: con id entrenador ve el de su deportista

module.exports = router;

module.exports = router;
