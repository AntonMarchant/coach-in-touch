const db = require("../config/db");

class Perfil {
  static async findByUserId(usuarioId) {
    //la query une perfiles y deportes para obtener el nombre del deporte
    const query = `
      SELECT 
      p.id, p.usuario_id, p.nombre, p.foto_url, p.biografia,
      p.objetivos, p.experiencia, p.certificaciones,
      d.nombre AS deporte,
      u.rol
      FROM perfiles p
      LEFT JOIN deportes d ON p.deporte_id = d.id
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.usuario_id = $1
    `;
    try {
      const { rows } = await db.query(query, [usuarioId]);
      return rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async update(
    usuarioId,
    {
      nombre,
      foto_url,
      biografia,
      deporte_id,
      objetivos,
      experiencia,
      certificaciones,
    }
  ) {
    const query = `
      UPDATE perfiles
      SET nombre = $1, foto_url = $2, biografia = $3, deporte_id = $4, objetivos = $5, experiencia = $6, certificaciones = $7
      WHERE usuario_id = $8
      RETURNING *
    `;
    const values = [
      nombre,
      foto_url,
      biografia,
      deporte_id,
      objetivos,
      experiencia,
      certificaciones,
      usuarioId,
    ];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async buscar(filtros = {}) {
    let query = `
      SELECT 
        u.id,
        p.nombre,
        p.foto_url,
        p.biografia,
        p.experiencia,
        p.certificaciones,
        d.nombre AS deporte 
      FROM perfiles p
      INNER JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN deportes d ON p.deporte_id = d.id
      WHERE u.rol = 'entrenador'
    `;

    const values = [];

    if (filtros.deporte) {
      values.push(filtros.deporte);
      //filtra por nombre del deporte en la tabla deportes
      query += ` AND d.nombre ILIKE $${values.length}`;
    }

    try {
      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      console.error("error en la busqueda de perfiles:", error);
      throw error;
    }
  }

  //busca los perfiles de entrenadores sin validacion
  static async findPendientesDeValidacion() {
    const query = `
      SELECT u.id, p.nombre, p.experiencia, p.certificaciones, u.correo
      FROM perfiles p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE u.rol = 'entrenador' AND p.validado = false
      ORDER BY u.fecha_registro ASC
    `;
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error al buscar perfiles pendientes:", error);
      throw error;
    }
  }

  //valida perfil de entrenador
  static async validar(entrenadorId) {
    const query = `
      UPDATE perfiles
      SET validado = true
      WHERE usuario_id = $1
      RETURNING *
    `;
    try {
      const { rows } = await db.query(query, [entrenadorId]);
      return rows[0];
    } catch (error) {
      console.error("Error al validar perfil:", error);
      throw error;
    }
  }
}

module.exports = Perfil;
