import getConnection from "../db/database.js";

const buscarUsuarioPorCorreo = async (correo_electronico) => {
    const conn = await getConnection();
    const result = await conn.query(
      "SELECT * FROM usuarios WHERE correo_electronico = ?",
      [correo_electronico]
    );
    return result[0];
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
  };
  
  export const methodDB = {
    buscarUsuarioPorCorreo,
    insertarUsuario
  };
  