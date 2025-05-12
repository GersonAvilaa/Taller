import { getConnection } from "../db/database.js"; // ✅ CORRECTO

import bcrypt from "bcrypt";

// Login
const loginUsuario = async (req, res) => {
  try {
    const { correo_electronico, contrasena } = req.body;

    // Validar que los campos estén presentes
    if (!correo_electronico || !contrasena) {
      return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
    }

    const conn = await getConnection();

    // Buscar al usuario por correo
    const [usuario] = await conn.query(
      "SELECT * FROM usuarios WHERE correo_electronico = ?",
      [correo_electronico]
    );

    if (!usuario) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    // Comparar contraseña en texto plano con la encriptada
    const passwordCorrecta = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordCorrecta) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    // solo devolver parte segura del usuario
    const usuarioSeguro = {
      id: usuario.id,
      nombre_completo: usuario.nombre_completo,
      correo_electronico: usuario.correo_electronico
    };

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: usuarioSeguro
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};


// Registro
const registrarUsuario = async (req, res) => {
  try {
    const {
      nombre_completo,
      cedula,
      correo_electronico,
      numero_telefono,
      direccion,
      contrasena
    } = req.body;

    // Validación campos obligatorios
    if (
      !nombre_completo || !cedula || !correo_electronico ||
      !numero_telefono || !direccion || !contrasena
    ) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Validar que cedula y teléfono sean numéricos
    if (isNaN(cedula) || isNaN(numero_telefono)) {
      return res.status(400).json({ mensaje: "Cédula y número de teléfono deben ser numéricos" });
    }

    // Validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo_electronico)) {
      return res.status(400).json({ mensaje: "Correo electrónico no tiene un formato válido" });
    }

    // Validar longitud mínima de la contraseña
    if (contrasena.length < 5) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 5 caracteres" });
    }

    const conn = await getConnection();

    // Verificar si el correo ya está registrado
    const [usuarioExistente] = await conn.query(
      "SELECT * FROM usuarios WHERE correo_electronico = ?",
      [correo_electronico]
    );

    if (usuarioExistente) {
      return res.status(409).json({ mensaje: "El correo electrónico ya está registrado" });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    // Insertar nuevo usuario
    await conn.query(
      "INSERT INTO usuarios (nombre_completo, cedula, correo_electronico, numero_telefono, direccion, contrasena) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre_completo, cedula, correo_electronico, numero_telefono, direccion, hashedPassword]
    );

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      usuario: {
        nombre_completo,
        correo_electronico
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};



export const methodHTTP = {
  loginUsuario,
  registrarUsuario
};
