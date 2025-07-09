import mysql from "mysql2/promise";

let db; // Declarar el pool de conexiones fuera de la función

async function initializeDatabase() {
  db = mysql.createPool({
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
    connection.release(); // Libera la conexión
  } catch (err) {
    console.error("Error de conexión con MySQL:", err);
  }
}

initializeDatabase(); // Ejecutar la inicialización

export default db; // Exportar db después de la inicialización
