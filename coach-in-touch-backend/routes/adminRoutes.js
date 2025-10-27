const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// @ruta    GET api/admin/pendientes
// @desc    ver todos los entrenadores sin validar
// @acceso  privado (solo admin)
router.get(
  "/pendientes",
  [authMiddleware, adminMiddleware], //usa los 2 middlewares (epico)
  adminController.getEntrenadoresPendientes
);

// @ruta    PUT api/admin/validar/:entrenadorId
// @desc    valida un entrenador
// @acceso  privado (solo admin)
router.put(
  "/validar/:entrenadorId",
  [authMiddleware, adminMiddleware], //proteje la ruta
  adminController.validarEntrenador
);

module.exports = router;
