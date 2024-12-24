export async function getEmployeeByUserID(session, user_id) {
    console.log("Token:", session?.user?.data?.token);
    console.log("ID:", session?.user?.data?.id);  
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/employees/read_by_user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `7zXnBjF5PBl7EzG/WhATQw==`, // Assuming this is a fixed API key
              Token: session?.user?.data?.token, // Use the token from the session
              
            },
            body: JSON.stringify({
              user_id: user_id,
            }),
          }
        );
        return res;
      } catch (err) {
      } finally {
      }
    }

export async function getUserInfoByToken(session) {
  // Verificar si existe el token en la sesión
  const token = session?.user?.data?.token;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BACKEND_URL}/users/by_token`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "7zXnBjF5PBl7EzG/WhATQw==", // API Key fija
          Token: token, // Usar el token de la sesión
        },
      }
    );

    // Parsear la respuesta
    const data = await response.json();
    console.log("Información del usuario por token:", data);

    return data?.user; // Devolver solo la información del usuario
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error);
    throw error; // Re-lanzar el error para manejarlo donde se llame la función
  }
}