import { getConnection } from "../db/database.js";

export const methodDB = {
  addItem: async ({ id_usuario, id_producto, cantidad, precio }) => {
    const conn  = await getConnection();
    const total = cantidad * precio;
    const result = await conn.query(
      `INSERT INTO carrito (id_usuario, id_producto, cantidad, precio, total)
       VALUES (?, ?, ?, ?, ?)`,
      [id_usuario, id_producto, cantidad, precio, total]
    );
    return { id: result.insertId, id_usuario, id_producto, cantidad, precio, total };
  },

  getByUser: async (id_usuario) => {
    const conn = await getConnection();
    const [items] = await conn.query(
      "SELECT * FROM carrito WHERE id_usuario = ?",
      [id_usuario]
    );
    return items;
  },

  getCartWithDiscount: async (id_usuario) => {
    const conn = await getConnection();

    // Obtener productos del carrito
    const [items] = await conn.query(
      "SELECT * FROM carrito WHERE id_usuario = ?",
      [id_usuario]
    );

    // Calcular subtotal
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);

    // Buscar el descuento
    const [descuentos] = await conn.query(
      "SELECT * FROM descuentos WHERE valor_minimo <= ? ORDER BY porcentaje DESC",
      [subtotal]
    );

    let descuento = 0;
    if (descuentos.length > 0) {
      descuento = (subtotal * descuentos[0].porcentaje) / 100;
    }

    const totalFinal = subtotal - descuento;

    return {
      productos: items,
      subtotal,
      descuento_aplicado: descuento,
      total: totalFinal
    };
  }
};
