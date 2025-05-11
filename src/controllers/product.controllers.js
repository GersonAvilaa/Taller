import { methodDB as productModel } from "../models/product.model.js";

export const methodHTTP = {
  listarProductos: async (req, res) => {
    try {
      const productos = await productModel.getAll();
      res.status(200).json(productos);
    } catch (err) {
      res.status(500).json({ mensaje: "Error al listar productos", error: err.message });
    }
  },
  obtenerProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await productModel.getById(id);
      if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
      }
      res.status(200).json(producto);
    } catch (err) {
      res.status(500).json({ mensaje: "Error al obtener producto", error: err.message });
    }
  }
};
