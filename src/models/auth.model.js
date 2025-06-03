import { getConnection } from "../db/database.js";

const buscarUsuarioPorCorreo = async (correo_electronico) => {
  const conn = await getConnection();
  try {
    const [result] = await conn.query(
      "SELECT * FROM usuarios WHERE correo_electronico = ?",
      [correo_electronico]
    );
    return result[0];
  } finally {
    conn.release(); // ✅ liberamos la conexión
  }
};

const insertarUsuario = async ({
  nombre_completo,
  cedula,
  correo_electronico,
  numero_telefono,
  direccion,
  contrasena
}) => {
  const conn = await getConnection();
  try {
    await conn.query(
      `INSERT INTO usuarios 
      (nombre_completo, cedula, correo_electronico, numero_telefono, direccion, contrasena) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre_completo,
        cedula,
        correo_electronico,
        numero_telefono,
        direccion,
        contrasena
      ]
    );
  } finally {
    conn.release(); // ✅ aquí también
  }
};

export const methodDB = {
  buscarUsuarioPorCorreo,
  insertarUsuario
};
