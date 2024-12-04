// services/uploadCv.js

export async function uploadCV(file) {
    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append("file", file);
  
      // Enviar solicitud POST a tu backend de Flask
      const res = await fetch("http://localhost:5000/upload_cv", {
        method: "POST",
        body: formData,
      });
  
      // Comprobar si la respuesta es correcta
      if (!res.ok) {
        throw new Error("Error al subir el archivo");
      }
  
      // Obtener el JSON de la respuesta
      const data = await res.json();
      console.log("Respuesta del servidor:", data); // Mostrar el JSON devuelto
      return data; // Retorna el JSON para que se pueda usar en otros lugares
    } catch (error) {
      console.error("Error en el servicio de carga:", error);
      throw error;
    }
  }
  