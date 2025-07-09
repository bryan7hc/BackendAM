// backend/src/controllers/reseñaController.js
import db from "../config/db.js";

// Obtener reseñas de un vehículo
export const getVehiculoResena = async (req, res) => {
  const vehiculoId = req.params.id;
  try {
    const [rows] = await db.query(
      `SELECT 
         r.reseña_id, 
         r.usuario_id, 
         u.nombre, 
         r.comentario, 
         r.calificacion,
         r.fecha 
       FROM Reseñas r 
       JOIN Usuarios u ON r.usuario_id = u.usuario_id 
       WHERE r.vehiculo_id = ? 
       ORDER BY r.fecha DESC`,
      [vehiculoId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ error: "Error al obtener reseñas" });
  }
};

// Agregar nueva reseña
export const addVehiculoResena = async (req, res) => {
  const vehiculoId = req.params.id;
  const { usuario_id, comentario, calificacion } = req.body;

  if (!usuario_id || !comentario || !calificacion) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    await db.query(
      `INSERT INTO Reseñas (vehiculo_id, usuario_id, comentario, calificacion, fecha) 
       VALUES (?, ?, ?, ?, NOW())`,
      [vehiculoId, usuario_id, comentario, calificacion]
    );
    res.status(201).json({ mensaje: "Reseña registrada exitosamente" });
  } catch (error) {
    console.error("Error al crear reseña:", error);
    res.status(500).json({ error: "Error al guardar reseña" });
  }
};
