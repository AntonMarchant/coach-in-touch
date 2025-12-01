const Progreso = require("../models/Progreso");

//crea nuevo registro
exports.crearRegistro = async (req, res) => {
  try {
    const autorId = req.usuario.id;
    const { titulo, descripcion, deportistaId } = req.body;

    //determina de quien es el progreso
    let targetDeportistaId = deportistaId;

    //si es deportista el registro es para el mismo
    if (req.usuario.rol === "deportista") {
      targetDeportistaId = req.usuario.id;
    }
    //si es entrenador debe saber a que deportista le escribe
    else if (req.usuario.rol === "entrenador" && !deportistaId) {
      return res
        .status(400)
        .json({ msg: "El entrenador debe especificar el id del deportista." });
    }

    const nuevoRegistro = await Progreso.create({
      deportistaId: targetDeportistaId,
      autorId,
      titulo,
      descripcion,
    });

    res.status(201).json(nuevoRegistro);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del Servidor");
  }
};

//obtiene historial del deportista
exports.getHistorial = async (req, res) => {
  try {
    let targetDeportistaId;

    //si es deportista le da su historial
    if (req.usuario.rol === "deportista") {
      targetDeportistaId = req.usuario.id;
    }
    //si es entrenador recibe historial del deportista que especifique
    else {
      targetDeportistaId = req.params.deportistaId;
    }

    if (!targetDeportistaId) {
      return res.status(400).json({ msg: "ID de deportista no especificado." });
    }

    const registros = await Progreso.findByDeportista(targetDeportistaId);
    res.json(registros);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del Servidor");
  }
};
