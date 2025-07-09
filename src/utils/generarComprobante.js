import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generarComprobantePDF = (pedido, comprador, cantidad) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ compress: false });

    const nombreArchivo = `comprobante_${pedido.pedido_id}.pdf`;
    const rutaArchivo = path.resolve("comprobantes", nombreArchivo);

    // Crear carpeta si no existe
    if (!fs.existsSync("comprobantes")) {
      fs.mkdirSync("comprobantes");
    }

    // ✅ Cargar fuente personalizada (UTF-8)
    const fontPath = path.resolve("fonts", "Roboto-Regular.ttf");
    doc.registerFont("Roboto", fontPath);
    doc.font("Roboto");

    const stream = fs.createWriteStream(rutaArchivo);
    doc.pipe(stream);

    // 📝 Contenido del PDF
    doc
      .fontSize(20)
      .text("Comprobante de Pago - Automundo", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Pedido N°: ${pedido.pedido_id}`);
    doc.text(`Fecha: ${new Date(pedido.fecha).toLocaleString()}`);
    doc.moveDown();

    doc.text("Datos del cliente", { underline: true });
    doc.moveDown();
    doc.text(`Nombre: ${comprador.nombre}`);
    doc.text(`Correo: ${comprador.correo}`);
    doc.text(`DNI/RUC: ${comprador.dni}`);
    doc.text(`Dirección: ${comprador.direccion}`);
    doc.text(`Ciudad: ${comprador.ciudad}`);
    doc.moveDown();

    doc.moveDown();
    doc.fontSize(14).text("Detalles de la compra", { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Vehículo: ${pedido.vehiculo.nombre}`);
    doc.text(
      `Descripción: ${pedido.vehiculo.descripcion || "Sin descripción"}`
    );
    doc.text(`Cantidad: ${cantidad}`);
    doc.text(`Total pagado: S/. ${pedido.total.toFixed(2)}`);
    doc.moveDown();
    doc.text("Gracias por confiar en Automundo.", { align: "center" });

    doc.end();

    stream.on("finish", () => resolve(rutaArchivo));
    stream.on("error", reject);
  });
};
