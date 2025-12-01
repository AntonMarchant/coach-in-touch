const db = require("../config/db");

class Solicitud {
  //crea una nueva solicitud de deportista a entrenador - sprint 3
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
      console.error("Error al crear la solicitud:", error);
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
      console.error("Error al buscar solicitud:", error);
      throw error;
    }
  }

  //busca todas las solicitudes recibidas del entrenador
  static async findRecibidasPorEntrenador(entrenadorId) {
    const query = `
      SELECT 
        s.id, 
        s.deportista_id,
        p.nombre AS deportista_nombre, 
        s.estado, 
        s.mensaje,
        s.fecha_solicitud
      FROM solicitudes s
      LEFT JOIN perfiles p ON s.deportista_id = p.usuario_id
      WHERE s.entrenador_id = $1
      ORDER BY s.fecha_solicitud DESC
    `;
    try {
      console.log("Buscando solicitudes para entrenador ID:", entrenadorId);
      const { rows } = await db.query(query, [entrenadorId]);
      console.log("Resultados encontrados:", rows);
      return rows;
    } catch (error) {
      console.error("Error al buscar solicitudes recibidas:", error);
      throw error;
    }
  }
  //cubre errores de nombres antiguos usando alias por si acaso
  static async findByEntrenador(id) {
    return this.findRecibidasPorEntrenador(id);
  }

  //actualiza estado de solicitud aceptada/rechazada
  static async updateStatus(solicitudId, entrenadorId, nuevoEstado) {
    const query = `
      UPDATE solicitudes SET estado = $1 WHERE id = $2 AND entrenador_id = $3 RETURNING *
    `;
    try {
      const { rows } = await db.query(query, [
        nuevoEstado,
        solicitudId,
        entrenadorId,
      ]);
      return rows[0];
    } catch (error) {
      console.error("Error status:", error);
      throw error;
    }
  }

  //busca todas las solicitudes enviadas por un deportista - sprint 4
  static async findEnviadasPorDeportista(deportistaId) {
    const query = `
      SELECT s.id, s.entrenador_id, p.nombre AS entrenador_nombre, s.estado, s.mensaje
      FROM solicitudes s
      LEFT JOIN perfiles p ON s.entrenador_id = p.usuario_id
      WHERE s.deportista_id = $1
      ORDER BY s.fecha_solicitud DESC
    `;
    try {
      const { rows } = await db.query(query, [deportistaId]);
      return rows;
    } catch (error) {
      console.error("Error enviadas:", error);
      throw error;
    }
  }
}

module.exports = Solicitud;
