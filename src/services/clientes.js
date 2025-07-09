// frontend/src/services/clientes.js
import axios from "axios";

// Asegúrate de utilizar la URL correcta de tu backend en Azure
const API = axios.create({ baseURL: "https://automundo-aqarbhcmbteegrcv.canadacentral-01.azurewebsites.net/api" });

export const registrarCliente = (datos) => API.post("/clientes/registro", datos);
