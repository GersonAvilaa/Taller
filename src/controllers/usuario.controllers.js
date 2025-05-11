import { methodDB as usuarioModel } from "../models/usuario.model.js";

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioModel.getUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_completo,
      cedula,
      correo_electronico,
      numero_telefono,
      direccion,
      contrasena
    } = req.body;

    // Validación de campos requeridos
    if (
      !nombre_completo || !cedula || !correo_electronico ||
      !numero_telefono || !direccion || !contrasena
    ) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Validar que cedula y número de teléfono sean numéricos
    if (isNaN(cedula) || isNaN(numero_telefono)) {
      return res.status(400).json({ mensaje: "Cédula y número de teléfono deben ser numéricos" });
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo_electronico)) {
      return res.status(400).json({ mensaje: "Correo electrónico no tiene un formato válido" });
    }

    // Validar longitud mínima de la contraseña
    if (contrasena.length < 5) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 5 caracteres" });
    }

    const datos = {
      nombre_completo,
      cedula,
      correo_electronico,
      numero_telefono,
      direccion,
      contrasena
    };

    await usuarioModel.updateUsuario(id, datos);

    res.status(200).json({ mensaje: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar usuario", error: error.message });
  }
};



const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await usuarioModel.deleteUsuario(id);
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario", error: error.message });
  }
};

export const methodHTTP = {
  getUsuarios,
  updateUsuario,
  deleteUsuario
};
