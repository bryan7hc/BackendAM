import db from "../config/db.js";
import bcrypt from "bcrypt";

export const loginUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;
  console.log("Recibido login:", correo, contraseña);

  try {
    const [results] = await db.query(
      "SELECT * FROM Usuarios WHERE correo = ?",
      [correo]
    );

    if (results.length === 0) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = results[0];

    // ✅ Validar que el usuario no esté eliminado
    if (usuario.estado && usuario.estado.toLowerCase() === "eliminado") {
      console.log("Usuario eliminado intentando iniciar sesión");
      return res
        .status(403)
        .json({ error: "Este usuario ha sido eliminado y no puede iniciar sesión." });
    }

    const hash = usuario["contraseña"];

    console.log("Comparando hash con contraseña...");

    const isMatch = await bcrypt.compare(contraseña, hash);

    if (!isMatch) {
      console.log("Contraseña incorrecta");
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    console.log("Login exitoso");
    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};
