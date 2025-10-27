const db = require("../config/db");
const pool = db.pool;

class Usuario {
  //crea un nuevo usuario y su perfil asociado, si algo falla se deshacen todos los cambios para mantener la integridad funcional
  static async create({
    nombre,
    correo,
    contrasena_hash,
    rol,
    deporte_id,
    ...detallesPerfil
  }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      //insert en la tabla usuarios
      const usuarioQuery = `
        INSERT INTO usuarios (correo, contrasena_hash, rol)
        VALUES ($1, $2, $3)
        RETURNING id, correo, rol, fecha_registro
      `;
      const usuarioResult = await client.query(usuarioQuery, [
        correo,
        contrasena_hash,
        rol,
      ]);
      const nuevoUsuario = usuarioResult.rows[0];

      //insert en la tabla perfiles usando el ID del usuario recién creado
      const perfilQuery = `
        INSERT INTO perfiles (usuario_id, nombre, deporte_id, objetivos, experiencia, certificaciones)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await client.query(perfilQuery, [
        nuevoUsuario.id,
        nombre,
        deporte_id || null,
        detallesPerfil.objetivos || null,
        detallesPerfil.experiencia || null,
        detallesPerfil.certificaciones || null,
      ]);

      //si todo esta bien confirma el proceso
      await client.query("COMMIT");
      return nuevoUsuario;
    } catch (error) {
      //si algo sale mal deshace todo lo realizado
      await client.query("ROLLBACK");
      console.error("error en la transaccion de creacion de usuario:", error);
      throw error;
    } finally {
      //ocurra un error o no libera al cliente
      client.release();
    }
  }

  //busca usuario por su correo electrónico
  static async findByEmail(correo, id = null) {
    let query;
    let values;

    if (id) {
      query = "SELECT * FROM usuarios WHERE id = $1";
      values = [id];
    } else {
      query = "SELECT * FROM usuarios WHERE correo = $1";
      values = [correo];
    }

    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("error al buscar usuario:", error);
      throw error;
    }
  }
}

//exporta clase usuario para usarla con controladores
module.exports = { Usuario };
