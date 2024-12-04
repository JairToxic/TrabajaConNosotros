// src/utils/wordHelper.js

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

// Función para reemplazar los datos en el documento Word
const fillWordTemplate = async (data) => {
  try {
    // Cargar la plantilla desde el directorio public
    const response = await fetch("/template.docx");
    if (!response.ok) {
      console.error("Error al cargar la plantilla:", response.statusText);
      return null; // Si no se puede cargar la plantilla, retorna null
    }

    // Convertir el archivo descargado en un ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Crear una instancia de PizZip para manejar el archivo .docx
    const zip = new PizZip(arrayBuffer);

    // Crear una instancia de Docxtemplater con el archivo zip
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Reemplazar los placeholders con los datos del formulario
    doc.setData({
      nomb: data.nomb,
      mbre: data.mbre,
    });

    // Intentar renderizar el documento
    doc.render();

    // Generar el archivo .docx con los datos reemplazados
    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    return blob;  // Retornar el Blob generado
  } catch (error) {
    console.error("Error al generar el documento:", error);
    return null; // Si ocurre un error, retornar null
  }
};

export default fillWordTemplate;
