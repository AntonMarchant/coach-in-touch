const Post = require("../models/Post");

exports.crearPost = async (req, res) => {
  try {
    const { titulo, contenido } = req.body;
    const nuevoPost = await Post.create({
      autorId: req.usuario.id,
      titulo,
      contenido,
    });

    //futuras versiones: emitir notificacion de nuevo evento via socket

    res.status(201).json(nuevoPost);
  } catch (error) {
    res.status(500).send("Error del Servidor");
  }
};

exports.obtenerPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).send("Error del Servidor");
  }
};
