import { getConnection } from "../db/database.js";

export const methodDB = {
  getAll: async () => {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query("SELECT * FROM productos");
      return rows;
    } catch (error) {
      throw error;
    } finally {
      conn.release(); // ✅ Importante liberar conexión
    }
  },

  getById: async (id) => {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query("SELECT * FROM productos WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      conn.release(); // ✅ Importante liberar conexión
    }
  }
};
