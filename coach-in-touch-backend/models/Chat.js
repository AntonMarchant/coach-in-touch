const db = require("../config/db");
const pool = db.pool;

class Chat {
  //crea un chat nuevo entre dos usuarios
  static async crearConversacion(usuario1_id, usuario2_id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      //crea el chat
      const convQuery = `INSERT INTO conversaciones DEFAULT VALUES RETURNING id, fecha_creacion`;
      const convRes = await client.query(convQuery);
      const conversacion = convRes.rows[0];

      //añade a ambos usuarios al chat
      const partQuery = `INSERT INTO participantes (conversacion_id, usuario_id) VALUES ($1, $2), ($1, $3)`;
      await client.query(partQuery, [
        conversacion.id,
        usuario1_id,
        usuario2_id,
      ]);

      await client.query("COMMIT");
      return conversacion;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error al crear conversación:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  //busca si ya existio una conversacion entre dos usuarios
  static async findConversacionEntre(usuario1_id, usuario2_id) {
    const query = `
      SELECT c.id 
      FROM conversaciones c
      JOIN participantes p1 ON c.id = p1.conversacion_id
      JOIN participantes p2 ON c.id = p2.conversacion_id
      WHERE p1.usuario_id = $1 AND p2.usuario_id = $2
    `;
    try {
      const { rows } = await db.query(query, [usuario1_id, usuario2_id]);
      return rows[0]; //retorna la conversacion o un undefined
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //obtiene el inbox de un usuario
  static async getMisConversaciones(usuarioId) {
    const query = `
      SELECT c.id, c.fecha_creacion, p2.usuario_id AS otro_usuario_id, u.nombre AS otro_usuario_nombre
      FROM conversaciones c
      JOIN participantes p1 ON c.id = p1.conversacion_id
      JOIN participantes p2 ON c.id = p2.conversacion_id
      JOIN perfiles u ON p2.usuario_id = u.usuario_id
      WHERE p1.usuario_id = $1 AND p2.usuario_id != $1
      ORDER BY c.fecha_creacion DESC
    `;
    try {
      const { rows } = await db.query(query, [usuarioId]);
      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //guarda un mensaje nuevo
  static async guardarMensaje(conversacionId, emisorId, contenido) {
    const query = `
      INSERT INTO mensajes (conversacion_id, emisor_id, contenido)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    try {
      const { rows } = await db.query(query, [
        conversacionId,
        emisorId,
        contenido,
      ]);
      return rows[0];
    } catch (error) {
      console.error("Error al guardar mensaje:", error);
      throw error;
    }
  }

  //obtiene el historial de msj
  static async getMensajes(conversacionId) {
    const query = `
      SELECT m.*, p.nombre as emisor_nombre 
      FROM mensajes m
      JOIN perfiles p ON m.emisor_id = p.usuario_id
      WHERE conversacion_id = $1
      ORDER BY m.fecha_envio ASC
    `;
    try {
      const { rows } = await db.query(query, [conversacionId]);
      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = Chat;
