import { getConnection } from "../db/database.js";

export const methodDB = {
  guardarDetalles: async (compra_id, productos) => {
    const conn = await getConnection();

    const values = productos.map(p => [
      compra_id,
      p.id_producto,
      p.cantidad,
      p.precio,
      p.total
    ]);

    await conn.query(
      `INSERT INTO detalle_compra 
      (compra_id, producto_id, cantidad, precio_unitario, subtotal)
      VALUES ?`,
      [values]
    );
  },

  obtenerDetallesPorUsuario: async (usuario_id) => {
    const conn = await getConnection();

    const [result] = await conn.query(
      `SELECT 
         c.id AS id_compra,
         c.fecha,
         c.total,
         dc.producto_id,
         p.nombre AS nombre_producto,
         dc.cantidad,
         dc.precio_unitario,
         dc.subtotal
       FROM compras c
       JOIN detalle_compra dc ON c.id = dc.compra_id
       JOIN productos p ON p.id = dc.producto_id
       WHERE c.usuario_id = ?
       ORDER BY c.fecha DESC`,
      [usuario_id]
    );

    // Convierte valores numéricos a enteros
    return result.map(row => ({
      ...row,
      total: Math.round(row.total),
      precio_unitario: Math.round(row.precio_unitario),
      subtotal: Math.round(row.subtotal)
    }));
  }
};
