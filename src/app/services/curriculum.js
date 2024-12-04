export default async function handler(req, res) {
    const { method } = req;
  
    // Manejo del método GET para obtener el CV por id
    if (method === 'GET') {
      const { id } = req.query; // Obtener el id desde la query string
  
      // Verificar que el id esté presente
      if (!id) {
        return res.status(400).json({ error: 'El id es requerido.' });
      }
  
      try {
        // Realizar la solicitud al servidor Flask para obtener el CV
        const response = await fetch(`http://127.0.0.1:5000/cvs/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
  
        // Si la respuesta es exitosa, devolver la data
        if (response.ok) {
          res.status(200).json(data);
        } else {
          res.status(response.status).json({ error: data.error || 'Error al obtener el CV.' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al conectar con el servidor.' });
      }
    }
  
    // Manejo del método POST para crear o actualizar el CV
    else if (method === 'POST') {
      try {
        // Realiza la solicitud al servidor Flask para crear o actualizar el CV
        const response = await fetch('http://127.0.0.1:5000/cvs', {
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
          res.status(response.status).json({ error: data.error || 'Error al crear o actualizar el CV.' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al conectar con el servidor.' });
      }
    }
  
    // Respuesta para métodos no permitidos
    else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  }
  