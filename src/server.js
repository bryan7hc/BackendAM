import dotenv from 'dotenv';
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
const PORT = process.env.PORT || 8080;

// Necesario para usar __dirname con ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//RUTAS
app.use("/api/auth", authRoute);

// Ruta base
app.use("/api/usuarios", userRoute);

//CATEGORIAS DE VEHICULOS
app.use("/api/vehiculos", vehiculosRoute);

//Admin
app.use("/api/admin", adminRoutes); //

// Pedido
app.use("/api/pedidos", pedidosRoute);

//reporte VENTA
app.use("/api/reportes", reporteRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/comprobantes", comprobantesRoutes);

//Comprobantes
app.use(
  "/comprobantes",
  express.static(path.join(__dirname, "src/public/comprobantes"))
);

//PROVEEDOR
app.use("/api/proveedores", proveedorRoutes);

//RESEÑAS
app.use("/api/resenas", resenaRoute); // 👈 habilita el endpoint

//MERCADOPAGO
app.use("/api/pago", pagoRoute);




app.use("/imagenes", express.static(path.join(__dirname, "public/imagenes")));
//Accesible la carpeta desde el naveador
app.use(express.static(path.join(__dirname, "public")));

//INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
