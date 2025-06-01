import { methodDB as usuarioModel } from "../models/usuario.model.js";

export const methodHTTP = {
  getUsuarios: async (req, res) => {
    try {
      const usuarios = await usuarioModel.getUsuarios();
      res.status(200).json(usuarios);
    } catch (err) {
      res.status(500).json({ mensaje: "Error al obtener usuarios", error: err.message });
    }
  },

  updateUsuario: async (req, res) => {
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

      if (![nombre_completo, cedula, correo_electronico, numero_telefono, direccion, contrasena].every(Boolean)) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
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
    } catch (err) {
      res.status(500).json({ mensaje: "Error al actualizar usuario", error: err.message });
    }
  },

  deleteUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      await usuarioModel.deleteUsuario(id);
      res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ mensaje: "Error al eliminar usuario", error: err.message });
    }
  }
};
