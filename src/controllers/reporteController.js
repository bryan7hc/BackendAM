// src/controllers/reporteController.js
import db from "../config/db.js";

export const generarReporteVentas = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  try {
    let query = `
      SELECT 
        p.pedido_id,
        u.nombre AS cliente,
        v.nombre AS vehiculo,
        p.total,
        p.estado,
        p.fecha_pedido
      FROM Pedidos p
      JOIN Usuarios u ON p.usuario_id = u.usuario_id
      JOIN Vehiculos v ON p.vehiculo_id = v.vehiculo_id
    `;

    const params = [];

    if (fechaInicio && fechaFin) {
      query += ` WHERE DATE(p.fecha_pedido) BETWEEN ? AND ? `;
      params.push(fechaInicio, fechaFin);
    }

    query += ` ORDER BY p.fecha_pedido DESC`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al generar reporte:", error);
    res.status(500).json({ error: "Error al generar reporte de ventas" });
  }
};
