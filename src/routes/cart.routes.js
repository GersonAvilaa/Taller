import { Router } from "express";
import { methodHTTP as cartController } from "../controllers/cart.controllers.js";
const router = Router();

router.post("/",               cartController.agregarAlCarrito);
router.get("/:id_usuario",     cartController.verCarrito);

export default router;
