const db = require("../config/db");

class Solicitud {
  //crea una nueva solicitud de deportista a entrenador
  static async create({ deportistaId, entrenadorId, mensaje }) {
    const query = `
      INSERT INTO solicitudes (deportista_id, entrenador_id, mensaje)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    try {
      const { rows } = await db.query(query, [
        deportistaId,
        entrenadorId,
        mensaje,
      ]);
      return rows[0];
    } catch (error) {
      console.error("error al crear la solicitud:", error);
      throw error;
    }
  }

  //busca si ya existe una solicitud entre un deportista y un entrenador
  static async findByDeportistaAndEntrenador(deportistaId, entrenadorId) {
    const query =
      "SELECT * FROM solicitudes WHERE deportista_id = $1 AND entrenador_id = $2";
    try {
      const { rows } = await db.query(query, [deportistaId, entrenadorId]);
      return rows[0];
    } catch (error) {
      console.error("error al buscar solicitud:", error);
      throw error;
    }
  }

  //busca todas las solicitudes recibidas del entrenador

  static async findByEntrenador(entrenadorId) {
    const query = `
      SELECT s.id, s.estado, s.mensaje, s.fecha_solicitud, p.nombre AS deportista_nombre
      FROM solicitudes s
      JOIN perfiles p ON s.deportista_id = p.usuario_id
      WHERE s.entrenador_id = $1
      ORDER BY s.fecha_solicitud DESC
    `;
    try {
      const { rows } = await db.query(query, [entrenadorId]);
      return rows;
    } catch (error) {
      console.error("error al buscar solicitudes por entrenador:", error);
      throw error;
    }
  }

  //actualiza el estado de la solicitud

  static async updateStatus(solicitudId, entrenadorId, nuevoEstado) {
    const query = `
      UPDATE solicitudes
      SET estado = $1
      WHERE id = $2 AND entrenador_id = $3
      RETURNING *
    `;
    try {
      const { rows } = await db.query(query, [
        nuevoEstado,
        solicitudId,
        entrenadorId,
      ]);
      return rows[0];
    } catch (error) {
      console.error("error al actualizar estado de solicitud:", error);
      throw error;
    }
  }
}

module.exports = Solicitud;
