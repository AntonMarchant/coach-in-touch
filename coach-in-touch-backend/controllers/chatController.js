const Chat = require("../models/Chat");

//inicia chat con un usuario o trae el existente
exports.iniciarChat = async (req, res) => {
  try {
    const miId = req.usuario.id;
    const { otroUsuarioId } = req.body;

    //verifica si ya existe una conversacion previa en el inbox
    let conversacion = await Chat.findConversacionEntre(miId, otroUsuarioId);

    //si no existe se crea
    if (!conversacion) {
      conversacion = await Chat.crearConversacion(miId, otroUsuarioId);
    }

    res.json(conversacion);
  } catch (error) {
    res.status(500).send("Error del Servidor");
  }
};

//obtiene el inbox
exports.getMisConversaciones = async (req, res) => {
  try {
    const conversaciones = await Chat.getMisConversaciones(req.usuario.id);
    res.json(conversaciones);
  } catch (error) {
    res.status(500).send("Error del Servidor");
  }
};

//obtiene el historial de mensajes de un chat existente
exports.getHistorial = async (req, res) => {
  try {
    const { conversacionId } = req.params;
    const mensajes = await Chat.getMensajes(conversacionId);
    res.json(mensajes);
  } catch (error) {
    res.status(500).send("Error del Servidor");
  }
};
