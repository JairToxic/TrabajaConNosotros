
export async function getComparativa(session, employeeId, compareEmployeId) {
    // Verificar si existe el token en la sesión
    const token = session?.user?.data?.token;
    if (!token) {
      throw new Error("Token no encontrado en la sesión");
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}:5010/assigments/compare/${employeeId}/${compareEmployeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "7zXnBjF5PBl7EzG/WhATQw==", // API Key fija
            Token: token, // Usar el token de la sesión
          },
        }
      );
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error("Error al obtener la información del usuario");
      }
 
      // Parsear la respuesta
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
      throw error; // Re-lanzar el error para manejarlo donde se llame la función
    }
  }
 
 