import { getConnection } from "../db/database.js";


export const methodDB = {
  getAll: async () => {
    const conn = await getConnection();
    return conn.query("SELECT * FROM productos");
  },
  getById: async (id) => {
    const conn    = await getConnection();
    const result  = await conn.query("SELECT * FROM productos WHERE id = ?", [id]);
    return result[0];
  }
};
