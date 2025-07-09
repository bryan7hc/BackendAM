// src/routes/reporteRoute.js
import { Router } from "express";
import { generarReporteVentas } from "../controllers/reporteController.js";


const router = Router();

router.get("/ventas", generarReporteVentas);


export default router;
