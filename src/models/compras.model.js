import { getConnection } from "../db/database.js";

export const methodDB = {
  registrarCompra: async ({ usuario_id, total }) => {
    const conn = await getConnection();
    const [result] = await conn.query(
      "INSERT INTO compras (usuario_id, total) VALUES (?, ?)",
      [usuario_id, total]
    );
    return result.insertId;
  },

  limpiarCarrito: async (usuario_id) => {
    const conn = await getConnection();
    await conn.query("DELETE FROM carrito WHERE id_usuario = ?", [usuario_id]);
  }
};
