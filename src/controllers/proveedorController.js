// backend/src/controllers/proveedorController.js
import db from "../config/db.js";

// Obtener todos los proveedores
export const obtenerProveedores = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM Proveedores");
    res.json(result);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    res.status(500).json({ error: "Error al obtener proveedores" });
  }
};

// Registrar proveedor
export const registrarProveedor = async (req, res) => {
  const { razon_social, ruc, correo, telefono } = req.body;

  if (!razon_social || !ruc || !correo) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO Proveedores (razon_social, ruc, correo, telefono) VALUES (?, ?, ?, ?)",
      [razon_social, ruc, correo, telefono]
    );
    res
      .status(201)
      .json({ mensaje: "Proveedor registrado", proveedor_id: result.insertId });
  } catch (error) {
    console.error("Error al registrar proveedor:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "RUC o correo ya registrado" });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar proveedor
export const actualizarProveedor = async (req, res) => {
  const { id } = req.params;
  const { razon_social, ruc, correo, telefono } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE Proveedores SET razon_social = ?, ruc = ?, correo = ?, telefono = ? WHERE proveedor_id = ?",
      [razon_social, ruc, correo, telefono, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json({ mensaje: "Proveedor actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar proveedor
export const eliminarProveedor = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM Proveedores WHERE proveedor_id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json({ mensaje: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
