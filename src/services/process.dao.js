export async function getProcessById(id) {
  
    try {
      const response = await fetch(
        `${process.env.NEXT_CV_URL}/process/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "7zXnBjF5PBl7EzG/WhATQw==", // API Key fija
          },
        }
      );
  
      // Parsear la respuesta
      const data = await response.json();
      console.log("Información del proceso por id:", data);
  
      return data;
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
      throw error; // Re-lanzar el error para manejarlo donde se llame la función
    }
  }