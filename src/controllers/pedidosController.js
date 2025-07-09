// backend/src/controllers/pedidoController.js
import db from "../config/db.js";

// Obtener pedidos de un usuario
export const obtenerPedidosPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const [rows] = await db.query(
      `SELECT p.pedido_id, p.fecha_pedido, p.estado, p.total, v.nombre AS vehiculo
       FROM Pedidos p
       JOIN Vehiculos v ON v.vehiculo_id = p.vehiculo_id
       WHERE p.usuario_id = ?
       ORDER BY p.fecha_pedido DESC`,
      [usuarioId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error al obtener pedidos por usuario:", error);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
};

export const cancelarPedido = async (req, res) => {
  try {
    const { pedido_id } = req.params;

    if (!pedido_id) {
      return res.status(400).json({ error: "ID del pedido requerido" });
    }

    // Actualiza el estado a "cancelado"
    await db.query(
      "UPDATE pedidos SET estado = 'cancelado' WHERE pedido_id = ?",
      [pedido_id]
    );

    res.status(200).json({ mensaje: "Pedido cancelado exitosamente" });
  } catch (error) {
    console.error("Error al cancelar el pedido:", error);
    res.status(500).json({ error: "Error al cancelar el pedido" });
  }
};

export const obtenerDetallePedido = async (req, res) => {
  try {
    const { pedido_id } = req.params;

    if (!pedido_id) {
      return res.status(400).json({ error: "ID del pedido requerido" });
    }

    const [detalle] = await db.query(
      `
      SELECT p.*, v.nombre AS vehiculo_nombre, u.nombre AS usuario_nombre
      FROM pedidos p
      JOIN vehiculos v ON p.vehiculo_id = v.vehiculo_id
      JOIN usuarios u ON p.usuario_id = u.usuario_id
      WHERE p.pedido_id = ?
    `,
      [pedido_id]
    );

    if (detalle.length === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.status(200).json(detalle[0]);
  } catch (error) {
    console.error("Error al obtener detalle del pedido:", error);
    res.status(500).json({ error: "Error al obtener detalle del pedido" });
  }
};

export const obtenerHistorialPedidos = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    if (!usuario_id) {
      return res.status(400).json({ error: "ID de usuario requerido" });
    }

    const [pedidos] = await db.query(
      `
      SELECT p.*, v.nombre AS vehiculo_nombre, v.imagen, v.precio
      FROM pedidos p
      JOIN vehiculos v ON p.vehiculo_id = v.vehiculo_id
      WHERE p.usuario_id = ?
      ORDER BY p.fecha_pedido DESC
    `,
      [usuario_id]
    );

    res.status(200).json(pedidos);
  } catch (error) {
    console.error("Error al obtener historial de pedidos:", error);
    res.status(500).json({ error: "Error al obtener historial de pedidos" });
  }
};

// ✅ Obtener resumen de estadísticas para el Dashboard
export const obtenerResumenDashboard = async (req, res) => {
  try {
    const [[{ total_ventas }]] = await db.query(
      `SELECT SUM(total) AS total_ventas FROM pedidos WHERE estado = 'confirmado'`
    );

    const [[{ pedidos_confirmados }]] = await db.query(
      `SELECT COUNT(*) AS pedidos_confirmados FROM pedidos WHERE estado = 'confirmado'`
    );

    const [[{ pedidos_pendientes }]] = await db.query(
      `SELECT COUNT(*) AS pedidos_pendientes FROM pedidos WHERE estado = 'pendiente'`
    );

    const [[{ clientes }]] = await db.query(
      `SELECT COUNT(*) AS clientes FROM usuarios WHERE rol = 'cliente'`
    );

    const [[{ stock_vehiculos }]] = await db.query(
      `SELECT COUNT(*) AS stock_vehiculos FROM vehiculos WHERE stock > 0`
    );

    const [ventasMensuales] = await db.query(
      `SELECT MONTH(fecha_pedido) AS mes, SUM(total) AS total_mes
       FROM pedidos
       WHERE estado = 'confirmado' AND YEAR(fecha_pedido) = YEAR(CURDATE())
       GROUP BY mes ORDER BY mes`
    );

    const [vehiculoTop] = await db.query(
      `SELECT v.nombre, COUNT(*) AS cantidad_vendida
       FROM pedidos p
       JOIN vehiculos v ON p.vehiculo_id = v.vehiculo_id
       WHERE p.estado = 'confirmado'
       GROUP BY p.vehiculo_id
       ORDER BY cantidad_vendida DESC
       LIMIT 1`
    );

    res.json({
      totalVentas: total_ventas || 0,
      pedidosConfirmados: pedidos_confirmados,
      pedidosPendientes: pedidos_pendientes,
      clientes,
      stockVehiculos: stock_vehiculos,
      ventasMensuales,
      mejorVehiculo: vehiculoTop[0] || null
    });
  } catch (error) {
    console.error('❌ Error al obtener resumen de dashboard:', error);
    res.status(500).json({ error: 'Error al obtener resumen del dashboard' });
  }
};

export const crearPedido = async (req, res) => {
  try {
    const {
      usuario_id,
      vehiculo_id,
      total,
      metodo_pago = "Mercado Pago",
      direccion,
      ciudad,
      dni
    } = req.body;

    if (!usuario_id || !vehiculo_id || !total || !direccion || !ciudad || !dni) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    await db.query(
      `INSERT INTO pedidos 
      (usuario_id, vehiculo_id, total, metodo_pago, direccion_envio, ciudad, dni, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuario_id, vehiculo_id, total, metodo_pago, direccion, ciudad, dni, "pendiente"]
    );

    res.status(201).json({ mensaje: "Pedido registrado correctamente" });
  } catch (error) {
    console.error("❌ Error al registrar pedido:", error);
    res.status(500).json({ error: "No se pudo registrar el pedido" });
  }
};
