// frontend/src/services/clientes.js
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000/api" });

export const registrarCliente = (datos) => API.post("/clientes/registro", datos);
