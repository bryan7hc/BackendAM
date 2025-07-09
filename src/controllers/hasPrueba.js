import bcrypt from "bcrypt";

const hashNuevo = await bcrypt.hash("admin2025", 10);
console.log("Nuevo hash:", hashNuevo);
