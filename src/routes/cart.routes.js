import { Router } from "express";
import { methodHTTP as cartController } from "../controllers/cart.controllers.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarToken, cartController.agregarAlCarrito);
router.get("/", verificarToken, cartController.verCarrito);

export default router;
