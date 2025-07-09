import express from "express";
import {
  getUsuarios,
  updateUsuario,
  deleteUsuario,
  getVehiculos,
  addVehiculo,
  updateVehiculo,
  deleteVehiculo,
  getResenas,
  deleteResena,
} from "../controllers/adminController.js";

const router = express.Router();

// ========== USUARIOS ==========
router.get("/usuarios", getUsuarios);
router.put("/usuarios/:id", updateUsuario);
router.put("/usuarios/:id/eliminar", deleteUsuario);

// ========== VEHICULOS ==========
router.get("/vehiculos", getVehiculos);
router.post("/vehiculos", addVehiculo);
router.put("/vehiculos/:id", updateVehiculo);
router.delete("/vehiculos/:id", deleteVehiculo);

// ========== RESEÑAS ==========
router.get("/resenas", getResenas);
router.delete("/resenas/:id", deleteResena);

export default router;
