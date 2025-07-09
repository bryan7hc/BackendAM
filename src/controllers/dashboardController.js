import db from "../config/db.js";

export const obtenerEstadisticas = async (req, res) => {
  try {
    const [[{ totalVentas }]] = await db.query(`SELECT SUM(total) AS totalVentas FROM Pedidos`);
    const [[{ totalPedidos }]] = await db.query(`SELECT COUNT(*) AS totalPedidos FROM Pedidos`);
    const [[{ vehiculosStock }]] = await db.query(`SELECT SUM(stock) AS vehiculosStock FROM Vehiculos`);
    const [[{ totalUsuarios }]] = await db.query(`SELECT COUNT(*) AS totalUsuarios FROM Usuarios`);

    res.json({ totalVentas, totalPedidos, vehiculosStock, totalUsuarios });
  } catch (error) {
    console.error("❌ Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};

export const obtenerVentasMensuales = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DATE_FORMAT(fecha_pedido, '%Y-%m') AS mes, SUM(total) AS total
      FROM Pedidos
      GROUP BY mes
      ORDER BY mes ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener ventas mensuales:", error);
    res.status(500).json({ error: "Error al obtener ventas mensuales" });
  }
};
