import mysql from "mysql2/promise";

let db;

async function initializeDatabase() {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
