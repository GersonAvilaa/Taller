import { Router } from "express";
import { methodHTTP as comprasController } from "../controllers/compras.controllers.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarToken, comprasController.realizarCompra);
router.get("/historial", verificarToken, comprasController.historialCompras);

export default router;
