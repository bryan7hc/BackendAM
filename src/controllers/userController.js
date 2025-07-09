// src/controllers/userController.js
import db from "../config/db.js";
import bcrypt from "bcrypt";

export const registrarUsuario = async (req, res) => {
  const { nombre, correo, telefono, contraseña } = req.body;

  if (!nombre || !correo || !telefono || !contraseña) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si el correo ya está registrado
    const [result] = await db.query("SELECT * FROM Usuarios WHERE correo = ?", [
      correo,
    ]);
    if (result.length > 0) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(contraseña, 10);

    // Insertar nuevo usuario
    await db.query(
      "INSERT INTO Usuarios (nombre, correo, telefono, contraseña, rol, fecha_registro) VALUES (?, ?, ?, ?, ?, NOW())",
      [nombre, correo, telefono, hash, "cliente"]
    );

    return res
      .status(201)
      .json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar:", err);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM Usuarios WHERE usuario_id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error al obtener usuario:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
};

export const actualizarInfoAdicional = async (req, res) => {
  const { usuario_id, direccion, ciudad, dni, metodo_pago } = req.body;

  try {
    await db.query(
      `UPDATE Usuarios 
       SET direccion = ?, ciudad = ?, dni = ?, metodo_pago = ? 
       WHERE usuario_id = ?`,
      [direccion, ciudad, dni, metodo_pago, usuario_id]
    );

    res
      .status(200)
      .json({ message: "Información adicional actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar información adicional:", error);
    res.status(500).json({ error: "Error al actualizar datos del usuario" });
  }
};

// controllers/userController.js
export const actualizarDatosCompraUsuario = async (req, res) => {
  const { usuario_id, direccion, ciudad, dni, metodo_pago } = req.body;

  if (!usuario_id) {
    return res.status(400).json({ error: "Falta el ID del usuario" });
  }

  try {
    await db.query(
      `UPDATE Usuarios 
       SET direccion = ?, ciudad = ?, dni = ?, metodo_pago = ?
       WHERE usuario_id = ?`,
      [direccion, ciudad, dni, metodo_pago, usuario_id]
    );

    return res.status(200).json({ message: "Datos adicionales actualizados" });
  } catch (error) {
    console.error("❌ Error al actualizar datos del usuario:", error);
    return res.status(500).json({ error: "Error al actualizar los datos" });
  }
};


// Cambiar contraseña
export const cambiarContrasena = async (req, res) => {
  const { id } = req.params;
  const { actual, nueva } = req.body;

  try {
    // Obtener contraseña actual del usuario
    const [rows] = await db.query(
      "SELECT contraseña FROM usuarios WHERE usuario_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const contrasenaHasheada = rows[0].contraseña;

    // Verificar contraseña actual
    const coincide = await bcrypt.compare(actual, contrasenaHasheada);
    if (!coincide) {
      return res.status(401).json({ error: "La contraseña actual es incorrecta" });
    }

    // Hashear nueva contraseña
    const nuevaHasheada = await bcrypt.hash(nueva, 10);

    // Actualizar contraseña
    await db.query(
      "UPDATE usuarios SET contraseña = ? WHERE usuario_id = ?",
      [nuevaHasheada, id]
    );

    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ error: "Error interno al cambiar la contraseña" });
  }
};
export const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { correo, telefono, direccion, ciudad } = req.body;

  try {
    await db.query(
      "UPDATE usuarios SET correo = ?, telefono = ?, direccion = ?, ciudad = ? WHERE usuario_id = ?",
      [correo, telefono, direccion, ciudad, id]
    );
    res.json({ mensaje: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ error: "Error interno" });
  }
};
