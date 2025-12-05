const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");

// @ruta    GET api/foro
// @desc    ver todas las publicaciones
// @acceso  privado (Usuarios logueados)
router.get("/", authMiddleware, postController.obtenerPosts);

// @ruta    POST api/foro
// @desc    crea nueva publicacion
// @acceso  privado
router.post("/", authMiddleware, postController.crearPost);

module.exports = router;
