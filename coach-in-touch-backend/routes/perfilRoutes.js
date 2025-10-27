const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const perfilController = require("../controllers/perfilController");

// @ruta    GET api/perfil/me
// @desc    obtener mi perfil de usuario
// @acceso  privado (necesita token)
router.get("/me", authMiddleware, perfilController.getMiPerfil);

// @ruta    PUT api/perfil/me
// @desc    actualizar mi perfil de usuario
// @acceso  privado (necesita token)
router.put("/me", authMiddleware, perfilController.updateMiPerfil);

//basicamente guardia de seguridad
module.exports = router;
