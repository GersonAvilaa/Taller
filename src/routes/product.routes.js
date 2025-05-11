import { Router } from "express";
import { methodHTTP as productController } from "../controllers/product.controllers.js";
const router = Router();

router.get("/",         productController.listarProductos);
router.get("/:id",      productController.obtenerProducto);

export default router;
