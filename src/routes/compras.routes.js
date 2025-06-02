import { Router } from "express";
import { methodHTTP as compraController } from "../controllers/compras.controllers.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarToken, compraController.realizarCompra);
router.get("/historial/:usuarioId", verificarToken, compraController.historialCompras);


export default router;
