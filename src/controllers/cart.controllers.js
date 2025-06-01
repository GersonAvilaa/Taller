import { methodDB as cartModel } from "../models/cart.model.js";

export const methodHTTP = {
  agregarAlCarrito: async (req, res) => {
    try {
      const { id_usuario, id_producto, cantidad, precio } = req.body;
      if (![id_usuario, id_producto, cantidad, precio].every(Boolean)) {
        return res.status(400).json({ mensaje: "Datos incompletos" });
      }
      const item = await cartModel.addItem({ id_usuario, id_producto, cantidad, precio });
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ mensaje: "Error al agregar al carrito", error: err.message });
    }
  },

  verCarrito: async (req, res) => {
    try {
     const id_usuario = req.usuarioId; 
      const data = await cartModel.getCartWithDiscount(id_usuario);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ mensaje: "Error al obtener carrito", error: err.message });
    }
  },

  actualizarCantidad: async (req, res) => {
    try {
      const { id_usuario, id_producto, cantidad } = req.body;
      if (![id_usuario, id_producto, cantidad].every(Boolean)) {
        return res.status(400).json({ mensaje: "Datos incompletos" });
      }
      await cartModel.actualizarCantidad({ id_usuario, id_producto, cantidad });
      res.status(200).json({ mensaje: "Cantidad actualizada" });
    } catch (err) {
      res.status(500).json({ mensaje: "Error al actualizar cantidad", error: err.message });
    }
  },

  eliminarDelCarrito: async (req, res) => {
    try {
      const { id_usuario, id_producto } = req.body;
      if (!id_usuario || !id_producto) {
        return res.status(400).json({ mensaje: "Datos incompletos" });
      }
      await cartModel.eliminarItem({ id_usuario, id_producto });
      res.status(200).json({ mensaje: "Producto eliminado del carrito" });
    } catch (err) {
      res.status(500).json({ mensaje: "Error al eliminar producto", error: err.message });
    }
  }
};
