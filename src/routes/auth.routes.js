import { Router } from "express";
import { methodHTTP as authController } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/login", authController.loginUsuario);
router.post("/register", authController.registrarUsuario);

export default router;
