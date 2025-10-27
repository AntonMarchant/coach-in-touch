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
}

module.exports = Feedback;
