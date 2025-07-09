import express from "express";
import {
  getVehiculoResena,
  addVehiculoResena,
} from "../controllers/resenaController.js";

import {
  getResenas,
  deleteResena,
} from "../controllers/adminController.js"

const router = express.Router();

// Cliente
router.get("/vehiculo/:id", getVehiculoResena);
router.post("/vehiculo/:id", addVehiculoResena);

// Admin
router.get("/", getResenas);
router.delete("/:id", deleteResena);

export default router;
