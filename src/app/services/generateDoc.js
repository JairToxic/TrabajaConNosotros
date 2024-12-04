// pages/api/generateDoc.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        // Realiza la solicitud al servidor Flask para obtener los datos
        const response = await fetch('http://127.0.0.1:5000/generate-doc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body), // Enviar el cuerpo recibido en la solicitud
        });
  
        const data = await response.json();
  
        // Si la respuesta es exitosa, devolver la data
        if (response.ok) {
          res.status(200).json(data);
        } else {
          res.status(response.status).json({ error: data.error || 'Error al generar el documento.' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al conectar con el servidor Flask.' });
      }
    } else {
      // Respuesta para métodos no permitidos
      res.status(405).json({ error: 'Método no permitido' });
    }
  }
  