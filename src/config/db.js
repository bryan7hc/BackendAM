import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456789",
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
