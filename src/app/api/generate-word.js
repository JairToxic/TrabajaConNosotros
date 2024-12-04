import JSZip from "jszip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const formData = req.body;

    // Ruta de la plantilla
    const templatePath = path.resolve("./public/template.docx");

    try {
      // Leer el archivo de plantilla
      const content = fs.readFileSync(templatePath, "binary");

      const zip = new JSZip();
      await zip.loadAsync(content);

      // Crear una instancia de Docxtemplater
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Rellenar la plantilla con los datos del formulario
      doc.setData(formData);

      // Generar el archivo
      doc.render();
      const outputBuffer = doc.getZip().generate({ type: "nodebuffer" });

      // Enviar el archivo generado como respuesta
      res.setHeader("Content-Disposition", "attachment; filename=output.docx");
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.send(outputBuffer);
    } catch (error) {
      console.error("Error en la generación del documento:", error);
      res.status(500).json({ error: "Error al generar el documento", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
