// backend/src/controllers/vehiculosController.js
import db from "../config/db.js";

// Obtener todos los vehículos

export const getVehiculosPorCategoria = async (req, res) => {
  const { categoria } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM vehiculos WHERE categoria = ?",
      [categoria]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener vehículos por categoría:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
// backend/src/controllers/vehiculosController.js
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
       WHERE v.slug = ?`,
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

// Obtener un vehículo por su ID
export const getVehiculoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM Vehiculos WHERE vehiculo_id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener vehículo por ID:", error);
    res.status(500).json({ error: "Error al obtener vehículo" });
  }
};

//reducir stock
export const reducirStock = async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.execute(
      'UPDATE vehiculos SET stock = stock - 1 WHERE id = ? AND stock > 0',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'No hay stock disponible' });
    }

    res.status(200).json({ message: 'Stock reducido correctamente' });
  } catch (error) {
    console.error('❌ Error al reducir stock:', error);
    res.status(500).json({ message: 'Error al reducir stock' });
  }
};

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
      WHERE v.destacado = 1  AND v.estado = 'activo';
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener autos destacados:", error);
    res.status(500).json({ error: "Error al obtener autos destacados" });
  }
};
