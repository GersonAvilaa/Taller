import { getConnection } from "../db/database.js";

export const methodDB = {
  addItem: async ({ id_usuario, id_producto, cantidad, precio }) => {
    const conn = await getConnection();
    try {
      const total = cantidad * precio;
      const [result] = await conn.query(
        `INSERT INTO carrito (id_usuario, id_producto, cantidad, precio, total)
         VALUES (?, ?, ?, ?, ?)`,
        [id_usuario, id_producto, cantidad, precio, total]
      );
      return { id: result.insertId, id_usuario, id_producto, cantidad, precio, total };
    } finally {
      conn.release();
    }
  },

  getByUser: async (id_usuario) => {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query("SELECT c.*, p.nombre FROM carrito c JOIN productos p ON c.id_producto = p.id WHERE c.id_usuario = ?", [id_usuario]);
      return rows;
    } finally {
      conn.release();
    }
  },

  getCartWithDiscount: async (id_usuario) => {
    const carrito = await methodDB.getByUser(id_usuario);
    const subtotal = carrito.reduce((sum, item) => sum + item.total, 0);

    let descuento = 0;
    if (subtotal >= 50000) descuento = 5000;
    else if (subtotal >= 40000) descuento = 4000;
    else if (subtotal >= 30000) descuento = 3000;
    else if (subtotal >= 20000) descuento = 2000;

    return {
      productos: carrito,
      subtotal,
      descuento_aplicado: descuento,
      total: subtotal - descuento
    };
  },

  actualizarCantidad: async ({ id_usuario, id_producto, cantidad }) => {
    const conn = await getConnection();
    try {
      await conn.query(
        `UPDATE carrito SET cantidad = ?, total = cantidad * precio 
         WHERE id_usuario = ? AND id_producto = ?`,
        [cantidad, id_usuario, id_producto]
      );
    } finally {
      conn.release();
    }
  },

  eliminarDelCarrito: async ({ id_usuario, id_producto }) => {
    const conn = await getConnection();
    try {
      await conn.query(
        "DELETE FROM carrito WHERE id_usuario = ? AND id_producto = ?",
        [id_usuario, id_producto]
      );
    } finally {
      conn.release();
    }
  }
};
