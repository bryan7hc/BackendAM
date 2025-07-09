import mysql from "mysql2/promise";

let db;

async function initializeDatabase() {
  db = mysql.createPool({
    host: "automundo.mysql.database.azure.com", // Reemplaza con tu host de MySQL en Azure
    user: "superadmin", // Reemplaza con tu usuario de MySQL
    password: "Admin123", // Reemplaza con tu contraseña de MySQL
    database: "automundoDB2", // Reemplaza con tu nombre de base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
      rejectUnauthorized: true, // Azure requiere SSL
    },
  });

  try {
    const connection = await db.getConnection();
    console.log("✅ Conexión a MySQL en Azure establecida");
    connection.release();
  } catch (err) {
    console.error("❌ Error conectando a MySQL:", err);
  }
}

await initializeDatabase();
export default db;
