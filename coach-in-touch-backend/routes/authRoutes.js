const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// @ruta    POST /api/auth/register
// @desc    registrar nuevo usuario
// @acceso  publico
router.post("/register", authController.register);

// @ruta    POST /api/auth/login
// @desc    autenticar usuario y obtiene token
// @acceso  publico
router.post("/login", authController.login);

module.exports = router;
