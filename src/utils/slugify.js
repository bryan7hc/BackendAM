// src/utils/slugify.js
export default function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Elimina acentos
    .replace(/[\u0300-\u036f]/g, "") // Elimina tildes
    .replace(/\s+/g, "-") // Reemplaza espacios por guiones
    .replace(/[^\w-]+/g, "") // Elimina caracteres especiales excepto guion
    .replace(/--+/g, "-") // Reemplaza múltiples guiones por uno
    .replace(/^-+|-+$/g, ""); // Elimina guiones al inicio y al final
}
