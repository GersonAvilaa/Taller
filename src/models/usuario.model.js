import getConnection from "../db/database.js";

export const methodDB = {
  getUsuarios: async () => {
    const conn = await getConnection();
    return await conn.query("SELECT id, nombre_completo, cedula, correo_electronico, numero_telefono, direccion, contrasena FROM usuarios");
  },

  updateUsuario: async (id, datos) => {
    const conn = await getConnection();
    const { nombre_completo, cedula, correo_electronico, numero_telefono, direccion, contrasena } = datos;
    return await conn.query(
      "UPDATE usuarios SET nombre_completo = ?, cedula = ?, correo_electronico = ?, numero_telefono = ?, direccion = ?, contrasena = ? WHERE id = ?",
      [nombre_completo, cedula, correo_electronico, numero_telefono, direccion, contrasena, id]
    );
  },

  deleteUsuario: async (id) => {
    const conn = await getConnection();
    return await conn.query("DELETE FROM usuarios WHERE id = ?", [id]);
  }
};
