import { getConnection } from "../db/database.js";

export const methodDB = {
  getUsuarios: async () => {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query("SELECT * FROM usuarios");
      return rows;
    } finally {
      conn.release();
    }
  },

  updateUsuario: async (id, datos) => {
    const conn = await getConnection();
    try {
      const { nombre_completo, cedula, correo_electronico, numero_telefono, direccion, contrasena } = datos;
      await conn.query(
        "UPDATE usuarios SET nombre_completo=?, cedula=?, correo_electronico=?, numero_telefono=?, direccion=?, contrasena=? WHERE id=?",
        [nombre_completo, cedula, correo_electronico, numero_telefono, direccion, contrasena, id]
      );
    } finally {
      conn.release();
    }
  },

  deleteUsuario: async (id) => {
    const conn = await getConnection();
    try {
      await conn.query("DELETE FROM usuarios WHERE id=?", [id]);
    } finally {
      conn.release();
    }
  }
};
