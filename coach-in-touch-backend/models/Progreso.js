const db = require("../config/db");

class Progreso {
  //crea nuevo registro de progreso
  static async create({ deportistaId, autorId, titulo, descripcion }) {
    const query = `
      INSERT INTO registros_progreso (deportista_id, autor_id, titulo, descripcion)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    try {
      const { rows } = await db.query(query, [
        deportistaId,
        autorId,
        titulo,
        descripcion,
      ]);
      return rows[0];
    } catch (error) {
      console.error("Error al crear registro de progreso:", error);
      throw error;
    }
  }

  //obtiene los registros de un deportista
  static async findByDeportista(deportistaId) {
    //hace JOIN con perfiles para obtener el nombre
    const query = `
      SELECT r.*, p.nombre as autor_nombre, u.rol as autor_rol
      FROM registros_progreso r
      JOIN usuarios u ON r.autor_id = u.id
      JOIN perfiles p ON u.id = p.usuario_id 
      WHERE r.deportista_id = $1
      ORDER BY r.fecha_creacion DESC
    `;
    try {
      const { rows } = await db.query(query, [deportistaId]);
      return rows;
    } catch (error) {
      console.error("Error al buscar registros de progreso:", error);
      throw error;
    }
  }
}

module.exports = Progreso;
