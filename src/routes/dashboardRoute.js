import express from "express";
import { obtenerEstadisticas, obtenerVentasMensuales } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/estadisticas", obtenerEstadisticas);
router.get("/ventas-mensuales", obtenerVentasMensuales);

export default router;
