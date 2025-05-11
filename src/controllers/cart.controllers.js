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
      const { id_usuario } = req.params;
      const items = await cartModel.getByUser(id_usuario);
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ mensaje: "Error al obtener carrito", error: err.message });
    }
  }
};
