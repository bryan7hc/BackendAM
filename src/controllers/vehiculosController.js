// backend/src/controllers/vehiculosController.js
import db from "../config/db.js";

// Obtener vehículos por categoría
export const getVehiculosPorCategoria = async (req, res) => {
  const { categoria } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM Vehiculos WHERE categoria = ? AND estado = 'activo'",
      [categoria.toLowerCase()] // Normalizando la categoría a minúsculas
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener vehículos por categoría:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener un vehículo por su slug
export const getVehiculoPorSlug = async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ error: "Slug no proporcionado" });
  }

  try {
    const [rows] = await db.query(
      `SELECT v.*, m.nombre AS nombre_marca
       FROM Vehiculos v
       JOIN Marcas m ON v.marca_id = m.marca_id
       WHERE v.slug = ? AND v.estado = 'activo'`,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error buscando por slug:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

// Obtener vehículos destacados
export const getAutosDestacados = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        v.vehiculo_id,
        v.nombre,
        v.slug,
        v.imagen,
        v.precio,
        v.destacado,
        m.nombre AS nombre_marca
      FROM Vehiculos v
      JOIN Marcas m ON v.marca_id = m.marca_id
      WHERE v.destacado = 1 AND v.estado = 'activo';
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener autos destacados:", error);
    res.status(500).json({ error: "Error al obtener autos destacados" });
  }
};
