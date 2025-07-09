import { Router } from "express";
import {
  crearPreferencia,
  registrarVentaExitosa,
} from "../controllers/pagoController.js";

const router = Router();

// Crear preferencia de pago
router.post("/crear-preferencia", crearPreferencia);

// Ruta que registra la venta al volver de Mercado Pago (GET desde back_url)
router.get("/pago-exitoso", registrarVentaExitosa);
router.get("/registrar-venta", registrarVentaExitosa);

export default router;
