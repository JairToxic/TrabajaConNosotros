'use client'
'use client'
const generateWordDocument = async () => {
    try {
      // Obtener la plantilla .docx
      const response = await fetch("/Nombre.docx");
  
      if (!response.ok) {
        throw new Error('No se pudo cargar la plantilla .docx');
      }
  
      const arrayBuffer = await response.arrayBuffer();
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  
      // Datos a insertar en el documento
      const data = {
        nomb: "Juan",   // Reemplazar {{nomb}} por "Juan"
        mbre: "Pérez"   // Reemplazar {{mbre}} por "Pérez"
      };
  
      // Establecer los datos para reemplazar en la plantilla
      doc.setData(data);
  
      // Generar el documento con los datos
      doc.render();
  
      // Obtener el documento modificado como un archivo .docx
      const buf = doc.getZip().generate({ type: "nodebuffer" });
  
      // Descargar el archivo generado
      saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), "documento_generado.docx");
  
      console.log("Documento generado exitosamente");
    } catch (error) {
      // Verifica si el error es un objeto de tipo Error y si tiene un mensaje
      if (error instanceof Error) {
        console.error("Error al generar el documento:", error.message);
      } else {
        console.error("Error desconocido al generar el documento:", error);
      }
    }
  };
  