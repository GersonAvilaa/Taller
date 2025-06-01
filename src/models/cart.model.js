import { getConnection } from "../db/database.js";

export const methodDB = {
  addItem: async ({ id_usuario, id_producto, cantidad, precio }) => {
    const conn = await getConnection();
    const total = cantidad * precio;
    const result = await conn.query(
      `INSERT INTO carrito (id_usuario, id_producto, cantidad, precio, total)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE cantidad = VALUES(cantidad), total = VALUES(total)`,
      [id_usuario, id_producto, cantidad, precio, total]
    );
    return { id: result.insertId, id_usuario, id_producto, cantidad, precio, total };
  },

  getByUser: async (id_usuario) => {
    const conn = await getConnection();
    const [rows] = await conn.query(`
      SELECT c.*, p.nombre AS nombre_producto
      FROM carrito c
      JOIN productos p ON c.id_producto = p.id
      WHERE c.id_usuario = ?`, [id_usuario]);
    return rows;
  },

  getCartWithDiscount: async (id_usuario) => {
    const conn = await getConnection();
    const [productos] = await conn.query(`
      SELECT c.*, p.nombre AS nombre_producto
      FROM carrito c
      JOIN productos p ON c.id_producto = p.id
      WHERE c.id_usuario = ?`, [id_usuario]);

    const subtotal = productos.reduce((sum, item) => sum + item.total, 0);

    const [descuentoRow] = await conn.query(
      "SELECT valor FROM descuentos WHERE ? >= minimo ORDER BY minimo DESC LIMIT 1",
      [subtotal]
    );

    const descuento = descuentoRow.length ? descuentoRow[0].valor : 0;
    const total = subtotal - descuento;

    return {
      productos,
      subtotal: Math.round(subtotal),
      descuento_aplicado: descuento,
      total: Math.round(total)
    };
  },

  actualizarCantidad: async ({ id_usuario, id_producto, cantidad }) => {
    const conn = await getConnection();
    await conn.query(
      `UPDATE carrito SET cantidad = ?, total = cantidad * precio
       WHERE id_usuario = ? AND id_producto = ?`,
      [cantidad, id_usuario, id_producto]
    );
  },

  eliminarItem: async ({ id_usuario, id_producto }) => {
    const conn = await getConnection();
    await conn.query(
      `DELETE FROM carrito WHERE id_usuario = ? AND id_producto = ?`,
      [id_usuario, id_producto]
    );
  }
};
