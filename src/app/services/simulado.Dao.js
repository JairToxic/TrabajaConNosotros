export async function obtenerPersona() {
    try {
      const res = await fetch("http://localhost:5000/persona");
      if (!res.ok) {
        throw new Error("No se pudo obtener la persona");
      }
      const data = await res.json();
      console.log("Datos obtenidos:", data); // <-- Verifica aquí
      return data;
    } catch (err) {
      console.error("Error al obtener la persona", err);
      throw err;
    }
  }
  