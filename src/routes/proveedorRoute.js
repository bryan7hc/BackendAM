// backend/src/routes/proveedorRoute.js
import express from "express";
import {
  obtenerProveedores,
  registrarProveedor,
  actualizarProveedor,
  eliminarProveedor,
} from "../controllers/proveedorController.js";

const router = express.Router();

// GET - Listar todos los proveedores
router.get("/", obtenerProveedores);

// POST - Registrar nuevo proveedor
router.post("/", registrarProveedor);

// PUT - Actualizar proveedor por ID
router.put("/:id", actualizarProveedor);

// DELETE - Eliminar proveedor por ID
router.delete("/:id", eliminarProveedor);

export default router;
