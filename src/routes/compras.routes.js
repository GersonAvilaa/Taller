import { Router } from "express";
import { methodHTTP as compraController } from "../controllers/compras.controller.js";

const router = Router();

router.post("/", compraController.realizarCompra);
router.get("/historial/:id_usuario", compraController.historialCompras);

export default router;
