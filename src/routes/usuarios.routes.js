import { Router } from "express";
import { methodHTTP as usuarioController } from "../controllers/usuario.controllers.js";

const router = Router();

router.get("/", usuarioController.getUsuarios);
router.put("/:id", usuarioController.updateUsuario);
router.delete("/:id", usuarioController.deleteUsuario);

export default router;
