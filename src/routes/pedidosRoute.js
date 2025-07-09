import express from "express";
import {
  obtenerHistorialPedidos,
  obtenerDetallePedido,
  cancelarPedido,
  obtenerPedidosPorUsuario,
  obtenerResumenDashboard,
  crearPedido, // ✅ importar función para crear pedido
} from "../controllers/pedidosController.js";

const router = express.Router();

// 🔄 CREAR pedido
router.post("/", crearPedido); // ✅ nueva ruta para registrar pedidos

// Obtener todos los pedidos de un usuario
router.get('/usuario/:usuarioId', obtenerPedidosPorUsuario);

// Obtener historial general (para administrador)
router.get('/', obtenerHistorialPedidos);

// Obtener detalle de un pedido específico
router.get("/detalle/:pedido_id", obtenerDetallePedido);

// Cancelar un pedido
router.put("/cancelar/:pedido_id", cancelarPedido);

// Resumen de estadísticas
router.get("/resumen-dashboard", obtenerResumenDashboard);

export default router;
