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
    return conn.query("SELECT * FROM carrito WHERE id_usuario = ?", [id_usuario]);
  }
};
