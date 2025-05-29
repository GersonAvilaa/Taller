import { methodDB as cartModel } from "../models/cart.model.js";


export const methodHTTP = {
  verCarrito: async (req, res) => {
  try {
    const { usuarioId } = req; // extraído del token
    const data = await cartModel.getCartWithDiscount(usuarioId);

      const productos = carrito;
      const subtotal = productos.reduce((sum, item) => sum + item.total, 0);

      // Aplicar descuento (ejemplo)
      let descuento = 0;
      if (subtotal >= 50000) descuento = 5000;
      else if (subtotal >= 40000) descuento = 4000;
      else if (subtotal >= 30000) descuento = 3000;
      else if (subtotal >= 20000) descuento = 2000;

      const total = subtotal - descuento;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener carrito", error: err.message });
  }
}
};
