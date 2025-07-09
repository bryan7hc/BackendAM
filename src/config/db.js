import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "automundo.mysql.database.azure.com",
  user: "superadmin",
  password: "Admin123",
  database: "automundoDB2",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error de conexión con MySQL:", err);
  } else {
    console.log("Conexión a la base de datos MySQL establecida (con pool)");
    connection.release();
  }
});
export default db;
