import { getConnection } from "../db/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "clave_super_secreta";

const loginUsuario = async (req, res) => {
  try {
    const { correo_electronico, contrasena } = req.body;
    if (!correo_electronico || !contrasena) {
      return res.status(400).json({ mensaje: "Correo y contraseña obligatorios" });
    }

    const conn = await getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT * FROM usuarios WHERE correo_electronico = ?",
        [correo_electronico]
      );

      if (!rows.length) {
        return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
      }

      const usuario = rows[0];
      const passwordCorrecta = await bcrypt.compare(contrasena, usuario.contrasena);
      if (!passwordCorrecta) {
        return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          nombre_completo: usuario.nombre_completo,
          correo_electronico: usuario.correo_electronico
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.status(200).json({ mensaje: "Inicio de sesión exitoso", token });
    } finally {
      conn.release();
    }
  } catch (err) {
    res.status(500).json({ mensaje: "Error del servidor", error: err.message });
  }
};

const registrarUsuario = async (req, res) => {
  let conn;
  try {
    const {
      nombre_completo, cedula, correo_electronico,
      numero_telefono, direccion, contrasena
    } = req.body;

    if (![nombre_completo, cedula, correo_electronico, numero_telefono, direccion, contrasena].every(Boolean)) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    if (isNaN(cedula) || isNaN(numero_telefono)) {
      return res.status(400).json({ mensaje: "Cédula y teléfono deben ser numéricos" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo_electronico)) {
      return res.status(400).json({ mensaje: "Correo inválido" });
    }

    if (contrasena.length < 5) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 5 caracteres" });
    }

    conn = await getConnection();

    const [existe] = await conn.query(
      "SELECT * FROM usuarios WHERE correo_electronico = ?",
      [correo_electronico]
    );

    if (existe.length > 0) {
      return res.status(409).json({ mensaje: "Correo ya registrado" });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await conn.query(
      "INSERT INTO usuarios (nombre_completo, cedula, correo_electronico, numero_telefono, direccion, contrasena) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre_completo, cedula, correo_electronico, numero_telefono, direccion, hashedPassword]
    );

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al registrar", error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

export const methodHTTP = {
  loginUsuario,
  registrarUsuario
};
