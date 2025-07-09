import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import vehiculosRoute from "./routes/vehiculosRoute.js";
import pedidosRoute from "./routes/pedidosRoute.js";
import proveedorRoutes from "./routes/proveedorRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import resenaRoute from "./routes/resenaRoute.js";
import reporteRoutes from "./routes/reporteRoute.js";
import pagoRoute from "./routes/pagoRoute.js";
import dashboardRoutes from "./routes/dashboardRoute.js";
import comprobantesRoutes from "./routes/comprobanteRoute.js";

dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 443; // Usar el puerto 443 en producción

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Redirigir HTTP a HTTPS en producción
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// Middleware
app.use(
  cors({
    origin: "https://mango-island-0c7d57410.2.azurestaticapps.net", // Cambia esta URL por tu frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// Rutas
app.use("/api/auth", authRoute);
app.use("/api/usuarios", userRoute);
app.use("/api/vehiculos", vehiculosRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/pedidos", pedidosRoute);
app.use("/api/reportes", reporteRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/comprobantes", comprobantesRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/resenas", resenaRoute);
app.use("/api/pago", pagoRoute);

// Rutas estáticas
app.use("/imagenes", express.static(path.join(__dirname, "public/imagenes")));
app.use(express.static(path.join(__dirname, "public")));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en https://localhost:${PORT}`);
});
