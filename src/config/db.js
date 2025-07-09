import mysql from "mysql2/promise";

async function initializeDatabase() {
  const db = await mysql.createPool({
    host: "automundo.mysql.database.azure.com",
    user: "superadmin",
    password: "Admin123",
    database: "automundoDB2",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    const connection = await db.getConnection();
    console.log("Conexión a la base de datos MySQL establecida (con pool)");
    connection.release();
  } catch (err) {
    console.error("Error de conexión con MySQL:", err);
  }
}

initializeDatabase();
export default db;
