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

  // Obtener productos del carrito con nombre del producto
  const [items] = await conn.query(
    `SELECT c.*, p.nombre AS nombre_producto 
     FROM carrito c
     JOIN productos p ON c.id_producto = p.id
     WHERE c.id_usuario = ?`,
    [id_usuario]
  );

  // Calcular subtotal como entero
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.total), 0);

  // Buscar el mejor descuento
  const [descuentos] = await conn.query(
    "SELECT * FROM descuentos WHERE valor_minimo <= ? ORDER BY porcentaje DESC",
    [subtotal]
  );

  let descuento = 0;
  if (descuentos.length > 0) {
    descuento = Math.round((subtotal * descuentos[0].porcentaje) / 100);
  }

  const totalFinal = Math.round(subtotal - descuento);

  return {
    productos: items.map(item => ({
      ...item,
      precio: Math.round(parseFloat(item.precio)),
      total: Math.round(parseFloat(item.total))
    })),
    subtotal: Math.round(subtotal),
    descuento_aplicado: descuento,
    total: totalFinal
  };
}
};
