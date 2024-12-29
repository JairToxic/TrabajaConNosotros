'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaExclamationCircle, FaCheck, FaAngleDown, FaAngleUp, FaInfoCircle } from 'react-icons/fa';

// Componente auxiliar para los botones de acción
const ActionButton = ({ href, children, className, external = false }) => {
  if (external) {
    return (
      <a
        href={href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={`button action-button ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href || '#'} className={`button action-button ${className}`}>
      {children}
    </Link>
  );
};

const Applicants = ({ idProcess }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  // Estados para la ordenación
  const [sortColumn, setSortColumn] = useState(null); // Columna actual para ordenar
  const [sortDirection, setSortDirection] = useState('asc'); // Dirección de ordenación: 'asc' o 'desc'

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': '7zXnBjF5PBl7EzG/WhATQw==', // Utiliza variables de entorno para mayor seguridad
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`http://51.222.110.107:5012/applicant/by_process/${idProcess}`, {
          headers,
        });

        if (response.status === 200) {
          const data = await response.json();
          // Añadir propiedades calculadas al objeto de cada candidato
          const processedData = data.map(applicant => {
            const brechaRequisitos = parseFloat(applicant.requirements_gap) || 0;
            const brechaCompetencias = parseFloat(applicant.competencies_gap) || 0;
            const brechaTotal = (brechaRequisitos + brechaCompetencias) / 2;
            const brechaFinal = brechaTotal.toFixed(2);
            const totalCandidato = (100 - parseFloat(brechaFinal)).toFixed(2);

            return {
              ...applicant,
              brechaRequisitos,
              brechaCompetencias,
              brechaFinal,
              totalCandidato,
            };
          });

          setApplicants(processedData || []);
        } else if (response.status === 404) {
          setApplicants([]); // Mantener como arreglo vacío en lugar de null
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
      const response = await fetch(`http://51.222.110.107:5012/applicant/${id}`, { // Usar ID dinámico
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

  // Función para determinar la clase CSS según la brecha final
  const getBrechaClass = (brecha) => {
    const value = parseFloat(brecha);
    if (value <= 10) return 'low-gap'; // Verde claro
    if (value <= 30) return 'medium-gap'; // Amarillo
    if (value <= 60) return 'high-gap'; // Naranja
    return 'very-high-gap'; // Rojo
  };

  // Función para manejar la expansión de filas
  const toggleRow = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter(rowId => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  // Función para manejar la ordenación
  const handleSort = (column) => {
    if (sortColumn === column) {
      // Si ya estamos ordenando por esta columna, invertir la dirección
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es una nueva columna, establecer como 'asc' por defecto
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Ordenar los datos según el estado de ordenación
  const sortedApplicants = [...applicants].sort((a, b) => {
    if (!sortColumn) return 0; // No ordenar si no se ha seleccionado una columna

    let aValue, bValue;

    switch (sortColumn) {
      case 'brechaFinal':
        aValue = parseFloat(a.brechaFinal);
        bValue = parseFloat(b.brechaFinal);
        break;
      case 'totalCandidato':
        aValue = parseFloat(a.totalCandidato);
        bValue = parseFloat(b.totalCandidato);
        break;
      case 'brechaRequisitos':
        aValue = parseFloat(a.brechaRequisitos);
        bValue = parseFloat(b.brechaRequisitos);
        break;
      case 'brechaCompetencias':
        aValue = parseFloat(a.brechaCompetencias);
        bValue = parseFloat(b.brechaCompetencias);
        break;
      case 'user_name':
        aValue = a.user_name.toLowerCase();
        bValue = b.user_name.toLowerCase();
        break;
      // Puedes añadir más casos para otras columnas si lo deseas
      default:
        aValue = a[sortColumn];
        bValue = b[sortColumn];
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) return <p className="message">Cargando...</p>;
  if (error) return <p className="error">Ocurrió un error al cargar los datos.</p>;

  if (sortedApplicants.length === 0) { // Verificar si el arreglo está vacío
    return (
      <div className="container">
        <button 
          className="button regresar-button" 
          onClick={() => window.location.href = '/admin/trabaja-con-nosotros/vacantes'}
        >
          Regresar
        </button>
        <div className="no-applicants-message">
          <FaExclamationCircle className="icon" />
          <p>No Existen Aplicantes Aún</p>
        </div>
        <style jsx>{`
          /* Puedes agregar estilos específicos aquí si lo deseas */
        `}</style>
      </div>
    );
  }

  return (
    <div className="container">
      <button 
        className="button regresar-button" 
        onClick={() => window.location.href = '/admin/trabaja-con-nosotros/vacantes'}
      >
        Regresar
      </button>
      <h1 className="title">Lista de Candidatos</h1>
      {/* Cuadro Informativo */}
      <div className="info-box">
        <FaInfoCircle className="info-icon" />
        <p>
          <strong>Nota:</strong> Haga clic en los encabezados para ordenar por esa columna. 
          Haga clic en los botones de acción para gestionar el estado de cada candidato.
        </p>
      </div>
      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th className="th" onClick={() => handleSort('user_name')}>
                Nombre {sortColumn === 'user_name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="th" onClick={() => handleSort('brechaRequisitos')}>
                Brecha Requisitos {sortColumn === 'brechaRequisitos' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="th" onClick={() => handleSort('brechaCompetencias')}>
                Brecha Competencias {sortColumn === 'brechaCompetencias' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="th" onClick={() => handleSort('totalCandidato')}>
                Total Candidato {sortColumn === 'totalCandidato' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="th" onClick={() => handleSort('brechaFinal')}>
                Brecha Final {sortColumn === 'brechaFinal' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              {/* Nuevas Columnas de Acción */}
              <th className="th">Preseleccionar</th>
              <th className="th">Descartar</th>
              <th className="th">No Elegible</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedApplicants.map(applicant => {
              const isExpanded = expandedRows.includes(applicant.applicant_data_id);

              return (
                <React.Fragment key={applicant.applicant_data_id}>
                  <tr className="tr">
                    <td className="td">{applicant.user_name}</td>
                    <td className="td">
                      {applicant.requirements_gap !== null ? `${applicant.brechaRequisitos}%` : '0%'}
                    </td>
                    <td className="td">
                      {applicant.competencies_gap !== null ? `${applicant.brechaCompetencias}%` : '0%'}
                    </td>
                    <td className="td">
                      {`${applicant.totalCandidato}%`}
                    </td>
                    <td className="td">
                      <button
                        className={`brecha-final-button ${getBrechaClass(applicant.brechaFinal)}`}
                        title={`Brecha Final: ${applicant.brechaFinal}%`}
                      >
                        {`${applicant.brechaFinal}%`}
                      </button>
                    </td>
                    {/* Preseleccionar */}
                    <td className="td checkbox-cell">
                      <button 
                        className={`checkbox-button ${applicant.stage_progress === 'Preseleccionado' ? 'active' : ''}`}
                        onClick={() => handleStageUpdate(applicant.applicant_data_id, 'preseleccionar')}
                        title="Preseleccionar"
                      >
                        {applicant.stage_progress === 'Preseleccionado' && (
                          <FaCheck className="check-icon" />
                        )}
                      </button>
                    </td>
                    {/* Descartar */}
                    <td className="td checkbox-cell">
                      <button 
                        className={`checkbox-button ${applicant.stage_progress === 'Descartado' ? 'active' : ''}`}
                        onClick={() => handleStageUpdate(applicant.applicant_data_id, 'descartar')}
                        title="Descartar"
                      >
                        {applicant.stage_progress === 'Descartado' && (
                          <FaCheck className="check-icon" />
                        )}
                      </button>
                    </td>
                    {/* No Elegible */}
                    <td className="td checkbox-cell">
                      <button 
                        className={`checkbox-button ${applicant.stage_progress === 'No Elegible' ? 'active' : ''}`}
                        onClick={() => handleStageUpdate(applicant.applicant_data_id, 'no_elegible')}
                        title="No Elegible"
                      >
                        {applicant.stage_progress === 'No Elegible' && (
                          <FaCheck className="check-icon" />
                        )}
                      </button>
                    </td>
                    {/* Acciones */}
                    <td className="td">
                      <button 
                        className="action-toggle-button" 
                        onClick={() => toggleRow(applicant.applicant_data_id)}
                        title="Ver Acciones"
                      >
                        {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="action-row">
                      <td className="action-cell" colSpan="9">
                        <div className="actionButtonsContainer">
                          <ActionButton 
                            href={`/admin/trabaja-con-nosotros/vacantes/postulantes/cv-postulante/${applicant.applicant_data_id}`} 
                            className="cvButton"
                          >
                            Ver CV
                          </ActionButton>
                          <ActionButton 
                            href={applicant.cv_link || '#'} 
                            className="originalCvButton"
                            external={true}
                          >
                            Ver CV Original
                          </ActionButton>
                          <ActionButton 
                            href={`/admin/trabaja-con-nosotros/vacantes/postulantes/brechas/${applicant.applicant_data_id}/${idProcess}`} 
                            className="brechasButton"
                          >
                            Análisis Brechas
                          </ActionButton>
                          <ActionButton 
                            href={`/admin/trabaja-con-nosotros/vacantes/postulantes/brechas-competencias/${applicant.applicant_data_id}/${idProcess}`} 
                            className="brechasCompetenciasButton"
                          >
                            Ver Brechas Competencias
                          </ActionButton>
                          <ActionButton 
                            href={`/admin/trabaja-con-nosotros/vacantes/postulantes/completo/${applicant.applicant_data_id}/${idProcess}`} 
                            className="brechasCompetenciasButton"
                          >
                            Ver Analisis Completo
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Estilos CSS */}
      <style jsx global>{`
        .container {
          padding: 40px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
          min-height: 100vh;
          box-sizing: border-box;
        }

        .title {
          margin-bottom: 15px;
          text-align: center;
          font-size: 2.5rem;
          color: #333;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        /* Estilos para el cuadro informativo */
        .info-box {
          display: flex;
          align-items: center;
          background-color: #e0f7fa; /* Azul claro */
          color: #006064; /* Azul oscuro */
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          max-width: 600px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-left: auto;
          margin-right: auto;
        }

        .info-icon {
          margin-right: 10px;
          font-size: 1.2rem;
        }

        /* Estilos para los botones */
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
          min-width: 140px;
        }

        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }

        .regresar-button {
          background: #21498e;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          margin-bottom: 20px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .regresar-button:hover {
          background: #1a3f7a;
        }

        .action-button {
          margin: 5px;
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

        .brechasButton {
          background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
        }

        .brechasButton:hover {
          background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
        }

        .brechasCompetenciasButton {
          background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
        }

        .brechasCompetenciasButton:hover {
          background: linear-gradient(135deg, #ffd200 0%, #f7971e 100%);
        }

        /* Estilos para el botón de Brecha Final */
        .brecha-final-button {
          width: 100px;
          height: 40px;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: bold;
          text-align: center;
          line-height: 40px;
          cursor: default;
          transition: background-color 0.3s ease;
        }

        .brecha-final-button.low-gap {
          background-color: #a8e6cf; /* Verde claro */
          color: #000;
        }

        .brecha-final-button.medium-gap {
          background-color: #ffeb3b; /* Amarillo */
          color: #000;
        }

        .brecha-final-button.high-gap {
          background-color: #ff9800; /* Naranja */
        }

        .brecha-final-button.very-high-gap {
          background-color: #f44336; /* Rojo */
        }

        /* Estilos para el botón de Acciones */
        .action-toggle-button {
          background: #6b7280; /* Gris */
          color: white;
          border: none;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease;
          font-size: 1rem;
        }

        .action-toggle-button:hover {
          background: #4b5563;
        }

        /* Estilos para la fila de acciones expandida */
        .action-row {
          background-color: #f9fafb;
        }

        .action-cell {
          padding: 10px 20px;
          text-align: center;
        }

        .actionButtonsContainer {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Ajustes de la tabla */
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
          min-width: 1200px;
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
          cursor: pointer; /* Cambiar el cursor para indicar que es clickable */
        }

        .th:hover {
          background-color: #1e3a8a;
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
          min-width: 100px;
        }

        .checkbox-button {
          width: 40px;
          height: 40px;
          background-color: #e2e8f0;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease;
        }

        .checkbox-button.active {
          background-color: #4CAF50;
        }

        .checkbox-button:hover {
          background-color: #cbd5e1;
        }

        .check-icon {
          color: white;
          font-size: 18px;
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
          margin-top: 20px;
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

        /* Estilos para indicar que el encabezado es clickable */
        .th:hover {
          background-color: #1e3a8a;
        }

        @media (max-width: 1024px) {
          .table {
            min-width: 1100px; /* Ajustado para acomodar nuevas columnas */
          }
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

          .regresar-button {
            width: 100%;
            margin-bottom: 20px;
          }

          .actionButtonsContainer {
            flex-direction: column;
            align-items: stretch;
          }

          .action-button {
            width: 100%;
          }

          .brecha-final-button {
            width: 80px;
            height: 35px;
            line-height: 35px;
            font-size: 0.9rem;
          }

          .action-toggle-button {
            width: 30px;
            height: 30px;
          }

          .actionButtonsContainer .button {
            min-width: 120px;
          }

          .action-row {
            padding: 10px 0;
          }

          .info-box {
            flex-direction: column;
            align-items: flex-start;
          }

          .info-icon {
            margin-bottom: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default Applicants;
