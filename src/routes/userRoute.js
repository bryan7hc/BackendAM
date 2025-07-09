import express from "express";
import {
  registrarUsuario,
  obtenerUsuarioPorId,
  actualizarInfoAdicional,
  actualizarDatosCompraUsuario,
  cambiarContrasena,
  actualizarPerfil,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/registro", registrarUsuario);
router.get("/:id", obtenerUsuarioPorId);
router.put("/actualizar", actualizarInfoAdicional);
router.put("/actualizar-datos-compra", actualizarDatosCompraUsuario);
router.put("/:id/cambiar-contrasena", cambiarContrasena);
router.put("/:id", actualizarPerfil); // ← esta es la ruta que da error 404

export default router;
