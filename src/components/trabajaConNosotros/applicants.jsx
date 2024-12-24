import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaExclamationCircle } from 'react-icons/fa';

const Applicants = ({ idProcess }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Headers comunes para todas las solicitudes fetch
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': '7zXnBjF5PBl7EzG/WhATQw==',
  };

  // Obtener datos desde el endpoint al montar el componente
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`http://51.222.110.107:5012/applicant/by_process/${idProcess}`, {
          headers,
        });

        if (response.status === 200) {
          const data = await response.json();
          setApplicants(data || []); // Ensure applicants is an array
        } else if (response.status === 404) {
          setApplicants(null); // Set applicants to null to trigger the no applicants message
        } else {
          throw new Error('Error al obtener los datos.');
        }
      } catch (err) {
        console.error('Error fetching applicants:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [idProcess]);

  // Función para manejar la actualización del progreso de la etapa
  const handleStageUpdate = async (id, newStage) => {
    try {
      const response = await fetch(`http://51.222.110.107:5012/applicant/update_stage/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ stage_progress: newStage }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado.');
      }

      // Actualizar el estado local para reflejar el cambio
      setApplicants(prevApplicants =>
        prevApplicants.map(applicant =>
          applicant.applicant_data_id === id
            ? { ...applicant, stage_progress: newStage }
            : applicant
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      alert('Ocurrió un error al actualizar el estado. Por favor, intenta nuevamente.');
    }
  };

  if (loading) return <p className="message">Cargando...</p>;
  if (error) return <p className="error">Ocurrió un error al cargar los datos.</p>;

  // Display message if no applicants exist
  if (applicants === null) {
    return (
        <div>
            <button className="return-button" onClick={() => window.location.href = '/admin/trabaja-con-nosotros/vacantes'}>Regresar</button>
            <div className="no-applicants-message">
                <FaExclamationCircle style={{ color: '#b91c1c', paddingRight: '10px', fontSize: '40px' }}  />
                <p>No Existen Aplicantes Aún</p>
        </div>
        <style jsx>{`
        .return-button{
            background-color: #21498e;
            color: white;
            border: none;
            border-radius: 10px;
            padding: 10px;
            margin-bottom:10px;
            cursor: pointer;
            width: 10%;
            @media (max-width: 768px) {
                width: 86%;
            }
        }
        .no-applicants-message {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 16px;
            background-color: #fecaca; /* Soft red background */
            color: #b91c1c; /* Dark red text */
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .no-applicants-message p {
            font-size: 1.25rem; /* Larger text */
            font-weight: 600; /* Semi-bold text */
        }
      `}</style>
      </div>      
    );
  }
  

  return (
    <div className="container">
      <button className="return-button" onClick={() => window.location.href = '/admin/trabaja-con-nosotros/vacantes'}>Regresar</button>
      <h1 className="title">Lista de Candidatos</h1>
      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th className="th">Nombre</th>
              <th className="th">Tipo</th>
              <th className="th">Progreso de la Etapa</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(applicant => (
              <tr key={applicant.applicant_data_id} className="tr">
                <td className="td">{applicant.user_name}</td>
                <td className="td">{applicant.type}</td>
                <td className="td">
                  <select
                    value={applicant.stage_progress}
                    onChange={(e) => handleStageUpdate(applicant.applicant_data_id, e.target.value)}
                    className="select"
                  >
                    <option value="Reclutamiento">Reclutamiento</option>
                    <option value="Entrevista">Entrevista</option>
                    <option value="Oferta">Oferta</option>
                    <option value="Contratado">Contratado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </td>
                <td className="td">
                  <div className="buttonContainer">
                    <Link href={`/admin/trabaja-con-nosotros/vacantes/postulantes/cv-postulante/${applicant.applicant_data_id}`} className="butto">
                      Ver CV
                    </Link>
                    <a
                      href={applicant.cv_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button originalCvButton" >
                      Ver CV Original
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estilos CSS Mejorados */}
      <style jsx>{`
        /* Contenedor principal */
        .container {
          padding: 40px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
          min-height: 100vh;
          box-sizing: border-box;
        }

        /* Título */
        .title {
          margin-bottom: 30px;
          text-align: center;
          font-size: 2.5rem;
          color: #333;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        .return-button{
            background-color: #21498e;
            color: white;
            border: none;
            border-radius: 10px;
            padding: 10px;
            margin-bottom:10px;
            cursor: pointer;
            width: 10%;
            @media (max-width: 768px) {
                width: 86%;
            }
        }

        /* Contenedor de la tabla con scroll */
        .tableContainer {
          overflow-x: auto;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          background-color: #fff;
          padding: 20px;
        }

        /* Tabla */
        .table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        /* Encabezados de tabla */
        .th {
          padding: 15px;
          background-color: #264b8b;
          color: #fff;
          text-align: left;
          font-size: 1rem;
          position: sticky;
          top: 0;
          z-index: 2;
          border-bottom: 2px solid #3b7dd8;
        }

        /* Filas de la tabla */
        .tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .tr:hover {
          background-color: #f1f5f9;
          transition: background-color 0.3s ease;
        }

        /* Celdas de la tabla */
        .td {
          padding: 15px;
          border-bottom: 1px solid #e2e8f0;
          color: #555;
          font-size: 0.95rem;
        }

        /* Select */
        .select {
          padding: 10px;
          width: 100%;
          border: 1px solid #cbd5e0;
          border-radius: 8px;
          background-color: #f7fafc;
          font-size: 0.95rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .select:focus {
          border-color: #4a90e2;
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
          outline: none;
        }

        /* Contenedor de botones */
        .buttonContainer {
          display: flex;
          gap: 10px;
        }

        /* Botones */
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
          text-align: center;
          text-decoration: none;
          color: #fff;
          min-width: 120px;
        }

        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }

        /* Botón Ver CV */
        .cvButton {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        }

        .cvButton:hover {
          background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
        }

        /* Botón Ver CV Original */
        .originalCvButton {
          background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
        }

        .originalCvButton:hover {
          background: linear-gradient(135deg, #feb47b 0%, #ff7e5f 100%);
        }

        /* Mensajes */
        .message {
          padding: 40px;
          text-align: center font-size: 1.5rem;
          color: #555;
        }

        .error {
          padding: 40px;
          text-align: center;
          font-size: 1.5rem;
          color: #e53e3e;
        }

        /* Responsividad */
        @media (max-width: 768px) {
          .title {
            font-size: 2rem;
          }

          .th,
          .td {
            padding: 10px;
            font-size: 0.9rem;
          }

          .button {
            padding: 8px 16px;
            font-size: 0.8rem;
            min-width: 100px;
          }
        }
      `}</style>
    </div>
  );
};

export default Applicants;