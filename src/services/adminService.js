import axios from "axios";
const API_URL = "automundo-aqarbhcmbteegrcv.canadacentral-01.azurewebsites.net";

// ==================== USUARIOS ====================

export const getUsuarios = async () => {
  const res = await axios.get(`${API_URL}/usuarios`);
  return res.data;
};

export const updateUsuario = async (id, data) => {
  const res = await axios.put(`${API_URL}/usuarios/${id}`, data);
  return res.data;
};

export const deleteUsuario = async (id) => {
  const res = await axios.delete(`${API_URL}/usuarios/${id}`);
  return res.data;
};

// ==================== VEHICULOS ====================

export const getVehiculos = async () => {
  const res = await axios.get(`${API_URL}/vehiculos`);
  return res.data;
};

export const addVehiculo = async (data) => {
  const res = await axios.post(`${API_URL}/vehiculos`, data);
  return res.data;
};

export const updateVehiculo = async (id, data) => {
  const res = await axios.put(`${API_URL}/vehiculos/${id}`, data);
  return res.data;
};

export const deleteVehiculo = async (id) => {
  const res = await axios.delete(`${API_URL}/vehiculos/${id}`);
  return res.data;
};

// ==================== PROVEEDORES ====================

export const getProveedores = async () => {
  const res = await axios.get(`${API_URL}/proveedores`);
  return res.data;
};

export const addProveedor = async (data) => {
  const res = await axios.post(`${API_URL}/proveedores`, data);
  return res.data;
};

export const updateProveedor = async (id, data) => {
  const res = await axios.put(`${API_URL}/proveedores/${id}`, data);
  return res.data;
};

export const deleteProveedor = async (id) => {
  const res = await axios.delete(`${API_URL}/proveedores/${id}`);
  return res.data;
};

// ==================== RESEÑAS ====================

// Obtener todas las reseñas
export const getResenas = async () => {
  const res = await axios.get(`${API_URL}/resenas`);
  return res.data;
};

// Eliminar una reseña
export const deleteResena = async (id) => {
  const res = await axios.delete(`${API_URL}/resenas/${id}`);
  return res.data;
};

// Eliminar una reseña
export const generarReporteVentas = async (id) => {
  const res = await axios.delete(`${API_URL}/reportes/${id}`);
  return res.data;
};
