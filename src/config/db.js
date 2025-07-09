import mysql from "mysql2/promise";

// Crear la conexión a la base de datos con los valores directamente en el archivo
let db;

async function initializeDatabase() {
  try {
    db = mysql.createPool({
      host: "automundo.mysql.database.azure.com", // Host de tu base de datos en Azure
      user: "superadmin", // Usuario de MySQL
      password: "Admin123", // Contraseña de MySQL
      database: "automundoDB2", // Nombre de tu base de datos
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: true, // Azure requiere SSL
      },
    });

    // Probar la conexión a la base de datos
    const connection = await db.getConnection();
    console.log("✅ Conexión a MySQL en Azure establecida");
    connection.release(); // Liberar la conexión
  } catch (err) {
    console.error("❌ Error conectando a MySQL:", err);
  }
}

await initializeDatabase();
export default db;
