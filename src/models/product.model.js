export const methodDB = {
  getAll: async () => {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query("SELECT * FROM productos");
      return rows;
    } finally {
      conn.release(); 
    }
  },
  getById: async (id) => {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query("SELECT * FROM productos WHERE id = ?", [id]);
      return rows[0];
    } finally {
      conn.release();
    }
  }
};
