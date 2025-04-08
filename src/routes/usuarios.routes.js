import { Router } from "express";
import { methodHTTP as usuarioController } from "../controllers/usuario.controllers.js";
const router = Router();

router.get("/",usuarioController.getUsuarios)

export default router;