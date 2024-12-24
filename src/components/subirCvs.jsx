// components/UploadCV.js
import { useState } from 'react';
import { uploadCV } from '../app/(content)/services/SubirCv.Dao';
import EditCV from './EditCV'; // Importa el componente EditCV

const UploadCV = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cvData, setCvData] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await uploadCV(file);
      setCvData(data); // Guardar los datos en el estado local
    } catch (err) {
      setError('Hubo un error al subir el archivo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Subir CV</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isLoading}>
        {isLoading ? 'Subiendo...' : 'Subir CV'}
      </button>
      {error && <p>{error}</p>}

      {cvData && <EditCV cvData={cvData} />} {/* Muestra el formulario de edición solo cuando se reciben los datos */}
    </div>
  );
};

export default UploadCV;
