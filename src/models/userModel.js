// backend/models/clientes.model.js
import { pool } from "../config/db.js";

export const registrarUsuarioCliente = async (usuario, cliente) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insertar en tabla Usuarios
    const [resultUsuario] = await connection.query(
      `INSERT INTO Usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, 'cliente')`,
      [usuario.nombre, usuario.correo, usuario.contraseña]
    );

    const usuario_id = resultUsuario.insertId;

    // Insertar en tabla Clientes
    await connection.query(
      `INSERT INTO Clientes (usuario_id, telefono, direccion) VALUES (?, ?, ?)`,
      [usuario_id, cliente.telefono, cliente.direccion]
    );

    await connection.commit();
    return { success: true, usuario_id };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
