/* global process */
import dotenv from "dotenv";
dotenv.config();

import mercadopago from "../config/mercadopago.js";
import db from "../config/db.js";
import { generarComprobantePDF } from "../utils/generarComprobante.js";
import path from "path";
import fs from "fs";

// URLs de entorno para producción
const BASE_URL = process.env.BASE_URL || "https://automundo-aqarbhcmbteegrcv.canadacentral-01.azurewebsites.net";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://mango-island-0c7d57410.2.azurestaticapps.net";

// ✅ CREAR PREFERENCIA DE MERCADOPAGO
export const crearPreferencia = async (req, res) => {
  try {
    const { vehiculo, comprador } = req.body;

    if (!vehiculo || !comprador) {
      return res.status(400).json({ error: "Faltan datos: vehículo o comprador" });
    }

    const { nombre, descripcion, precio, vehiculo_id } = vehiculo;
    const {
      nombre: nombreComprador,
      correo,
      telefono,
      direccion,
      ciudad,
      dni,
      usuario_id,
    } = comprador;

    const cantidad = 1;

    if (!nombre || !precio || !vehiculo_id || !usuario_id) {
      return res.status(400).json({ error: "Datos incompletos para generar la preferencia" });
    }

    const preference = {
      items: [
        {
          title: nombre,
          description: descripcion || "Compra desde Automundo",
          unit_price: parseFloat(precio),
          quantity: cantidad,
          currency_id: "PEN",
        },
      ],
      back_urls: {
        success: `${BASE_URL}/api/pago/pago-exitoso?userId=${usuario_id}&idVehiculo=${vehiculo_id}&cantidad=${cantidad}`,
        failure: `${FRONTEND_URL}/pago-fallido`,
        pending: `${FRONTEND_URL}/pago-pendiente`,
      },
      auto_return: "approved",
      metadata: {
        userId: usuario_id,
        idVehiculo: vehiculo_id,
        cantidad,
        comprador: {
          nombre: nombreComprador,
          correo,
          telefono,
          direccion,
          ciudad,
          dni,
        },
      },
    };

    const response = await mercadopago.preferences.create(preference);
    return res.status(200).json({ init_point: response.body.init_point });

  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    return res.status(500).json({ error: "Error interno al crear la preferencia" });
  }
};

// ✅ REGISTRAR VENTA EXITOSA
export const registrarVentaExitosa = async (req, res) => {
  try {
    const { userId, idVehiculo, cantidad, payment_id } = req.query;

    if (!userId || !idVehiculo || !cantidad || !payment_id) {
      return res.redirect(`${FRONTEND_URL}/pago-exitoso?error=missing_params`);
    }

    const pago = await mercadopago.payment.findById(payment_id);
    const metadata = pago.body.metadata?.comprador || {};

    const [vehiculoRows] = await db.query(
      "SELECT nombre, descripcion, precio, stock FROM vehiculos WHERE vehiculo_id = ?",
      [idVehiculo]
    );

    if (vehiculoRows.length === 0) {
      return res.redirect(`${FRONTEND_URL}/pago-exitoso?error=vehiculo_no_encontrado`);
    }

    const vehiculo = vehiculoRows[0];

    if (vehiculo.stock < Number(cantidad)) {
      return res.redirect(`${FRONTEND_URL}/pago-exitoso?error=stock_insuficiente`);
    }

    const total = vehiculo.precio * Number(cantidad);

    // 1. Registrar pedido
    const [resultado] = await db.query(
      `INSERT INTO Pedidos 
       (usuario_id, total, estado, fecha_pedido, vehiculo_id)
       VALUES (?, ?, 'confirmado', NOW(), ?)`,
      [userId, total, idVehiculo]
    );

    const pedido_id = resultado.insertId;

    // 2. Actualizar stock
    await db.query(
      "UPDATE vehiculos SET stock = stock - ? WHERE vehiculo_id = ?",
      [cantidad, idVehiculo]
    );

    // 3. Generar PDF
    const pedido = {
      pedido_id,
      total,
      fecha: new Date(),
      vehiculo: {
        nombre: vehiculo.nombre,
        descripcion: vehiculo.descripcion,
        precio: vehiculo.precio,
      },
      cantidad,
    };

    const rutaPDF = await generarComprobantePDF(pedido, metadata, cantidad);

    // 4. Guardar comprobante
    await db.query(
      `INSERT INTO Comprobantes 
       (pedido_id, archivo_url, correo_destino, estado_envio) 
       VALUES (?, ?, ?, ?)`,
      [pedido_id, rutaPDF, metadata.correo, "enviado"]
    );

    console.log("✅ Comprobante generado y enviado correctamente");

    // 5. Redirigir al frontend
    return res.redirect(
      `${FRONTEND_URL}/pago-exitoso?estado=confirmado&vehiculoId=${idVehiculo}&userId=${userId}&cantidad=${cantidad}&payment_id=${payment_id}`
    );

  } catch (error) {
    console.error("❌ Error al registrar la venta:", error);
    return res.redirect(`${FRONTEND_URL}/pago-exitoso?error=server`);
  }
};

// ✅ VER COMPROBANTE
export const verComprobante = async (req, res) => {
  const { pedido_id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT archivo_url FROM Comprobantes WHERE pedido_id = ?",
      [pedido_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Comprobante no encontrado" });
    }

    const ruta = rows[0].archivo_url;

    if (!fs.existsSync(ruta)) {
      return res.status(404).json({ error: "Archivo PDF no encontrado" });
    }

    return res.sendFile(path.resolve(ruta));

  } catch (error) {
    console.error("❌ Error al obtener el comprobante:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
