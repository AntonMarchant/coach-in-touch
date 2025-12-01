const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const chatController = require("../controllers/chatController");

// @ruta    POST api/chat/iniciar
// @desc    inicia o retoma una conversacion con otro usuario
// @acceso  privado
router.post("/iniciar", authMiddleware, chatController.iniciarChat);

// @ruta    GET api/chat
// @desc    obtiene el inbox
// @acceso  Privado
router.get("/", authMiddleware, chatController.getMisConversaciones);

// @ruta    GET api/chat/:conversacionId
// @desc    obtiene el historial de una conversacion existente
// @acceso  Privado
router.get("/:conversacionId", authMiddleware, chatController.getHistorial);

module.exports = router;
