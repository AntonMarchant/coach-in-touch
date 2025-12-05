const db = require("../config/db");

class Post {
  // Crear una publicación
  static async create({ autorId, titulo, contenido }) {
    const query = `
      INSERT INTO posts (autor_id, titulo, contenido)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    try {
      const { rows } = await db.query(query, [autorId, titulo, contenido]);
      return rows[0];
    } catch (error) {
      console.error("Error al crear post:", error);
      throw error;
    }
  }

  // Obtener todas las publicaciones (CORREGIDO)
  static async findAll() {
    // CORRECCIÓN: Hacemos JOIN con 'perfiles' (perf) para obtener el nombre
    // y con 'usuarios' (u) para obtener el rol.
    const query = `
      SELECT 
        p.id, 
        p.titulo, 
        p.contenido, 
        p.fecha_creacion,
        perf.nombre as autor_nombre, 
        u.rol as autor_rol
      FROM posts p
      JOIN usuarios u ON p.autor_id = u.id
      LEFT JOIN perfiles perf ON u.id = perf.usuario_id 
      ORDER BY p.fecha_creacion DESC
    `;
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error al buscar posts:", error);
      throw error;
    }
  }
}

module.exports = Post;
