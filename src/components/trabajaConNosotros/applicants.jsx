import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaExclamationCircle, FaCheck } from 'react-icons/fa';

const Applicants = ({ idProcess }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': '7zXnBjF5PBl7EzG/WhATQw==',
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`http://51.222.110.107:5012/applicant/by_process/${idProcess}`, {
          headers,
        });

        if (response.status === 200) {
          const data = await response.json();
          setApplicants(data || []);
        } else if (response.status === 404) {
          setApplicants(null);
        } else {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.message || 'Error al obtener los datos.';
          throw new Error(errorMessage);
        }
      } catch (err) {
        console.error('Error al obtener los postulantes:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [idProcess]);

  const handleStageUpdate = async (id, newStage) => {
    // Mapeo de los valores de stage_progress del cliente a los esperados por el servidor
    const stageMapping = {
      preseleccionar: 'Preseleccionado',
      descartar: 'Descartado',
      no_elegible: 'No Elegible',
    };

    const stageToSend = stageMapping[newStage] || newStage;

    try {
      const response = await fetch(`http://51.222.110.107:5012/applicant/14`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          stage_progress: stageToSend, // Solo enviamos el campo requerido
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || 'Error al actualizar el estado.';
        throw new Error(errorMessage);
      }

      // Actualizar el estado local para reflejar el cambio
      setApplicants(prevApplicants =>
        prevApplicants.map(applicant =>
          applicant.applicant_data_id === id
            ? { ...applicant, stage_progress: stageToSend }
            : applicant
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      alert(`Ocurrió un error al actualizar el estado: ${error.message}. Por favor, intenta nuevamente.`);
    }
  };

  if (loading) return <p className="message">Cargando...</p>;
  if (error) return <p className="error">Ocurrió un error al cargar los datos.</p>;

  if (applicants === null) {
    return (
      <div>
        <button 
          className="return-button" 
          onClick={() => window.location.href = '/admin/trabaja-con-nosotros/vacantes'}
        >
          Regresar
        </button>
        <div className="no-applicants-message">
          <FaExclamationCircle style={{ color: '#b91c1c', paddingRight: '10px', fontSize: '40px' }} />
          <p>No Existen Aplicantes Aún</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button 
        className="return-button" 
        onClick={() => window.location.href = '/admin/trabaja-con-nosotros/vacantes'}
      >
        Regresar
      </button>
      <h1 className="title">Lista de Candidatos</h1>
      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th className="th">Nombre</th>
              <th className="th">Brecha Requisitos</th>
              <th className="th">Preseleccionar</th>
              <th className="th">Descartar</th>
              <th className="th">No elegible</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(applicant => (
              <tr key={applicant.applicant_data_id} className="tr">
                <td className="td">{applicant.user_name}</td>
                <td className="td">{applicant.requirements_percentages || '0'}%</td>
                <td className="td checkbox-cell">
                  {applicant.stage_progress === 'Preseleccionado' && (
                    <div className="check-circle">
                      <FaCheck className="check-icon" />
                    </div>
                  )}
                  <div 
                    className="checkbox-area"
                    onClick={() => handleStageUpdate(applicant.applicant_data_id, 'preseleccionar')}
                  />
                </td>
                <td className="td checkbox-cell">
                  {applicant.stage_progress === 'Descartado' && (
                    <div className="check-circle">
                      <FaCheck className="check-icon" />
                    </div>
                  )}
                  <div 
                    className="checkbox-area"
                    onClick={() => handleStageUpdate(applicant.applicant_data_id, 'descartar')}
                  />
                </td>
                <td className="td checkbox-cell">
                  {applicant.stage_progress === 'No Elegible' && (
                    <div className="check-circle">
                      <FaCheck className="check-icon" />
                    </div>
                  )}
                  <div 
                    className="checkbox-area"
                    onClick={() => handleStageUpdate(applicant.applicant_data_id, 'no_elegible')}
                  />
                </td>
                <td className="td">
                  <div className="buttonContainer">
                    <Link 
                      href={`/admin/trabaja-con-nosotros/vacantes/postulantes/cv-postulante/${applicant.applicant_data_id}`} 
                      className="button cvButton"
                    >
                      Ver CV
                    </Link>
                    <a
                      href={applicant.cv_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button originalCvButton"
                    >
                      Ver CV Original
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .container {
          padding: 40px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
          min-height: 100vh;
          box-sizing: border-box;
        }

        .title {
          margin-bottom: 30px;
          text-align: center;
          font-size: 2.5rem;
          color: #333;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        .return-button {
          background-color: #21498e;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 10px;
          cursor: pointer;
          width: 10%;
          @media (max-width: 768px) {
            width: 86%;
          }
        }

        .tableContainer {
          overflow-x: auto;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          background-color: #fff;
          padding: 20px;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .th {
          padding: 15px;
          background-color: #264b8b;
          color: #fff;
          text-align: center;
          font-size: 1rem;
          position: sticky;
          top: 0;
          z-index: 2;
          border-bottom: 2px solid #3b7dd8;
        }

        .tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .tr:hover {
          background-color: #f1f5f9;
          transition: background-color 0.3s ease;
        }

        .td {
          padding: 15px;
          border-bottom: 1px solid #e2e8f0;
          color: #555;
          font-size: 0.95rem;
          text-align: center;
        }

        .checkbox-cell {
          position: relative;
          cursor: pointer;
          min-width: 100px;
        }

        .checkbox-area {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          cursor: pointer;
        }

        .check-circle {
          width: 24px;
          height: 24px;
          background-color: #4CAF50;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .check-icon {
          color: white;
          font-size: 14px;
        }

        .buttonContainer {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

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

        .cvButton {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        }

        .cvButton:hover {
          background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
        }

        .originalCvButton {
          background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
        }

        .originalCvButton:hover {
          background: linear-gradient(135deg, #feb47b 0%, #ff7e5f 100%);
        }

        .no-applicants-message {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px;
          background-color: #fecaca;
          color: #b91c1c;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .no-applicants-message p {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .message {
          padding: 40px;
          text-align: center;
          font-size: 1.5rem;
          color: #555;
        }

        .error {
          padding: 40px;
          text-align: center;
          font-size: 1.5rem;
          color: #e53e3e;
        }

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
