import { getConnection } from "../db/database.js";

export const methodDB = {
  addItem: async ({ id_usuario, id_producto, cantidad, precio }) => {
    const conn = await getConnection();
    try {
      const total = cantidad * precio;

      const [exist] = await conn.query(
        "SELECT * FROM carrito WHERE id_usuario=? AND id_producto=?",
        [id_usuario, id_producto]
      );

      if (exist.length > 0) {
        await conn.query(
          "UPDATE carrito SET cantidad = cantidad + ?, total = total + ? WHERE id_usuario = ? AND id_producto = ?",
          [cantidad, total, id_usuario, id_producto]
        );
      } else {
        await conn.query(
          "INSERT INTO carrito (id_usuario, id_producto, cantidad, precio, total) VALUES (?, ?, ?, ?, ?)",
          [id_usuario, id_producto, cantidad, precio, total]
        );
      }

      return { mensaje: "Producto agregado correctamente" };
    } finally {
      conn.release();
    }
  },

  getCartWithDiscount: async (id_usuario) => {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query(
        `SELECT c.*, p.nombre FROM carrito c
         JOIN productos p ON c.id_producto = p.id
         WHERE c.id_usuario = ?`,
        [id_usuario]
      );

      const subtotal = rows.reduce((sum, item) => sum + item.total, 0);

      let descuento = 0;
      if (subtotal >= 50000) descuento = 5000;
      else if (subtotal >= 40000) descuento = 4000;
      else if (subtotal >= 30000) descuento = 3000;
      else if (subtotal >= 20000) descuento = 2000;

      return {
        productos: rows.map(r => ({
          ...r,
          precio: Math.round(r.precio),
          total: Math.round(r.total)
        })),
        subtotal: Math.round(subtotal),
        descuento_aplicado: descuento,
        total: Math.round(subtotal - descuento)
      };
    } finally {
      conn.release();
    }
  },

  actualizarCantidad: async ({ id_usuario, id_producto, cantidad }) => {
    const conn = await getConnection();
    try {
      const [result] = await conn.query(
        "SELECT precio FROM carrito WHERE id_usuario = ? AND id_producto = ?",
        [id_usuario, id_producto]
      );

      const precio = result[0]?.precio || 0;
      const total = precio * cantidad;

      await conn.query(
        "UPDATE carrito SET cantidad = ?, total = ? WHERE id_usuario = ? AND id_producto = ?",
        [cantidad, total, id_usuario, id_producto]
      );
    } finally {
      conn.release();
    }
  },

  eliminarItem: async ({ id_usuario, id_producto }) => {
    const conn = await getConnection();
    try {
      await conn.query("DELETE FROM carrito WHERE id_usuario=? AND id_producto=?", [id_usuario, id_producto]);
    } finally {
      conn.release();
    }
  }
};
