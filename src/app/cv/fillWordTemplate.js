// src/utils/wordHelper.js

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const fillWordTemplate = async (data) => {
  try {
    // Cargar la plantilla desde la carpeta 'public'
    const response = await fetch("/template.docx");
    if (!response.ok) {
      console.error("Error al cargar la plantilla:", response.statusText);
      return null;  // Si no se puede cargar la plantilla, retorna null
    }

    // Convertir el archivo en un ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Crear una instancia de PizZip con el ArrayBuffer
    const zip = new PizZip(arrayBuffer);

    // Crear una instancia de Docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Reemplazar los placeholders con los datos del formulario
    doc.setData({
      nombre: data.nombre,
      id: data.id,
      cumpleaños: data.cumpleaños,
      direccion: data.direccion,
      Nacionalidad: data.Nacionalidad,
    });

    // Intentar renderizar el documento
    doc.render();

    // Generar el archivo Word como un Blob
    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    return blob;  // Retornar el Blob generado
  } catch (error) {
    console.error("Error al generar el documento:", error);
    return null;  // Si ocurre cualquier error, retornar null
  }
};

export default fillWordTemplate;
