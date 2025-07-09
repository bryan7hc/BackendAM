// backend/src/routes/vehiculoRoutes.js
import express from "express";
import { reducirStock } from "../controllers/vehiculosController.js";
import {
  getVehiculosPorCategoria,
  getVehiculoById,
  getVehiculoPorSlug,
  getAutosDestacados,
} from "../controllers/vehiculosController.js";

import {
  getVehiculoResena,
  addVehiculoResena,
} from "../controllers/resenaController.js";

const router = express.Router();


// 🚨 Orden correcto de rutas
router.get("/destacados", getAutosDestacados);
router.get("/slug/:slug", getVehiculoPorSlug);
router.get("/categoria/:categoria", getVehiculosPorCategoria);
router.get("/:id", getVehiculoById);

// Reseñas
router.get("/:id/resenas", getVehiculoResena);
router.post("/:id/resenas", addVehiculoResena);

// Reducir stock
router.post("/:id/reducir-stock", reducirStock);

export default router;
