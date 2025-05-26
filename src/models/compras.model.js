import { getConnection } from "../db/database.js";

export const methodDB = {
  registrarCompra: async ({ usuario_id, total }) => {
    const conn = await getConnection();
    try {
      const [result] = await conn.query(
        "INSERT INTO compras (id_usuario, total_pagado) VALUES (?, ?)",
        [usuario_id, total]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  },

  limpiarCarrito: async (usuario_id) => {
    const conn = await getConnection();
    try {
      await conn.query("DELETE FROM carrito WHERE id_usuario = ?", [usuario_id]);
    } finally {
      conn.release();
    }
  }
};
