import { methodDB as cartModel } from "../models/cart.model.js";
import { methodDB as compraModel } from "../models/compras.model.js";
import { methodDB as detalleModel } from "../models/detalleCompra.model.js";

export const methodHTTP = {
  realizarCompra: async (req, res) => {
    try {
      const { id_usuario } = req.body;

      if (!id_usuario) {
        return res.status(400).json({ mensaje: "ID de usuario requerido" });
      }

      const carrito = await cartModel.getCartWithDiscount(id_usuario);
      if (!carrito.productos.length) {
        return res.status(400).json({ mensaje: "El carrito está vacío" });
      }

      const compraId = await compraModel.registrarCompra({
        usuario_id: id_usuario,
        total: carrito.total
      });

      await detalleModel.guardarDetalles(compraId, carrito.productos);
      await compraModel.limpiarCarrito(id_usuario);

      res.status(201).json({
        mensaje: "Compra realizada con éxito",
        id_compra: compraId,
        subtotal: carrito.subtotal,
        descuento: carrito.descuento_aplicado,
        total_pagado: carrito.total
      });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al realizar la compra", error: error.message });
    }
  },

  historialCompras: async (req, res) => {
    try {
      const { id_usuario } = req.params;

      const historial = await detalleModel.obtenerDetallesPorUsuario(id_usuario);

      res.status(200).json(historial);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener historial", error: error.message });
    }
  }
};
