const db = require("../config/db");

class Feedback {
  //crea nuevo feedback en la bbdd
  static async create({ deportistaId, entrenadorId, puntuacion, comentario }) {
    const query = `
      INSERT INTO feedback (deportista_id, entrenador_id, puntuacion, comentario)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    try {
      const { rows } = await db.query(query, [
        deportistaId,
        entrenadorId,
        puntuacion,
        comentario,
      ]);
      return rows[0];
    } catch (error) {
      console.error("error al crear feedback:", error);
      throw error;
    }
  }

  //busca si un deportista ya ha valorado a un entrenador o no
  static async findByDeportistaAndEntrenador(deportistaId, entrenadorId) {
    const query =
      "SELECT * FROM feedback WHERE deportista_id = $1 AND entrenador_id = $2";
    try {
      const { rows } = await db.query(query, [deportistaId, entrenadorId]);
      return rows[0];
    } catch (error) {
      console.error("error al buscar feedback:", error);
      throw error;
    }
  }

  //busca el feedback recibido por el entrenador
  static async findByEntrenador(entrenadorId) {
    const query = `
      SELECT f.*, p.nombre as deportista_nombre
      FROM feedback f
      JOIN perfiles p ON f.deportista_id = p.usuario_id
      WHERE f.entrenador_id = $1
      ORDER BY f.fecha_feedback DESC
    `;
    try {
      const { rows } = await db.query(query, [entrenadorId]);
      return rows;
    } catch (error) {
      console.error("Error al buscar feedback de entrenador:", error);
      throw error;
    }
  }
}

module.exports = Feedback;
