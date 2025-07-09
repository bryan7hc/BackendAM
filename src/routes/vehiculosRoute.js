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

// Ruta para obtener vehículos destacados
router.get("/destacados", getAutosDestacados);

// Ruta para obtener un vehículo por su slug
router.get("/slug/:slug", getVehiculoPorSlug);

// Ruta para obtener vehículos por categoría
router.get("/categoria/:categoria", getVehiculosPorCategoria);

// Ruta para obtener un vehículo por su ID
router.get("/:id", getVehiculoById);

// Reseñas de un vehículo
router.get("/:id/resenas", getVehiculoResena); // Obtener reseñas de un vehículo
router.post("/:id/resenas", addVehiculoResena); // Agregar una reseña a un vehículo

// Ruta para reducir el stock de un vehículo
router.post("/:id/reducir-stock", reducirStock);

export default router;
