export async function getPositionInfoById(session, id) {
    const token = session.user.data.token
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_AUTH_BACKEND_URL}/positions/read_one`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "7zXnBjF5PBl7EzG/WhATQw==", 
                Token: token
              },
              body: JSON.stringify({ id: id })
            }
          );          
  
      // Parsear la respuesta
      const data = await response.json();
      console.log("Información de la posicion por id:", data);
  
      return data;
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
      throw error; // Re-lanzar el error para manejarlo donde se llame la función
    }
  }