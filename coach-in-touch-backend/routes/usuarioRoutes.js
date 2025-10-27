const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// @ruta    GET api/usuarios/entrenadores
// @desc    obtener todos los perfiles de entrenadores
// @acceso  publico
router.get("/entrenadores", usuarioController.getEntrenadores);

module.exports = router;
