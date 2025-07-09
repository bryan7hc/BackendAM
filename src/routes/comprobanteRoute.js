import express from "express";
import db from "../config/db.js";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/:pedidoId", async (req, res) => {
  const { pedidoId } = req.params;

  try {
    // Buscar la ruta del archivo en la base de datos
    const [rows] = await db.query(
      "SELECT archivo_url FROM Comprobantes WHERE pedido_id = ?",
      [pedidoId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Comprobante no encontrado" });
    }

    const rutaRelativa = rows[0].archivo_url;
    const rutaAbsoluta = path.resolve(rutaRelativa);

    // Verificar que el archivo existe
    if (!fs.existsSync(rutaAbsoluta)) {
      return res.status(404).json({ error: "Archivo no disponible" });
    }

    // Enviar el PDF como archivo descargable
    res.sendFile(rutaAbsoluta);
  } catch (err) {
    console.error("❌ Error al obtener comprobante:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
