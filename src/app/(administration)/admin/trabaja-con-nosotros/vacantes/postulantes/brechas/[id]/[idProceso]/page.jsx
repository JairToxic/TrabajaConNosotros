'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

/**
 * Convierte la experiencia laboral en meses y suma todo.
 * Devuelve un número total de meses.
 */
function getTotalMonthsExperiencia(experiencias) {
  if (!experiencias || experiencias.length === 0) return 0;

  let totalMonths = 0;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1..12

  experiencias.forEach((exp) => {
    const start = parseDate(exp.fechaInicio);
    let end = parseDate(exp.fechaFin);

    // Si no se puede parsear inicio, ignoramos esta experiencia
    if (!start) return;

    // Si no se puede parsear fin, consideramos la fecha actual
    if (!end) {
      end = { year: currentYear, month: currentMonth };
    }

    const monthsDiff = (end.year - start.year) * 12 + (end.month - start.month);
    if (monthsDiff > 0) {
      totalMonths += monthsDiff;
    }
  });

  return totalMonths;
}

/**
 * Parsea strings como "June 2024", "March2023", "Present", etc.
 * Retorna {year, month} o null.
 */
function parseDate(raw) {
  if (!raw) return null;
  const lower = raw.trim().toLowerCase();

  // "present", "actualidad", etc.
  if (lower.includes('present') || lower.includes('actualidad')) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }

  // Meses en inglés
  const monthsMap = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  const regex = /([a-z]+)\s*(\d{4})/i;
  const match = raw.match(regex);
  if (!match) return null;

  const monthStr = match[1].toLowerCase();
  const year = parseInt(match[2], 10);
  const month = monthsMap[monthStr];
  if (!month) return null;

  return { year, month };
}

/**
 * Devuelve un array con los "grados" de:
 * educacionSuperior, educacionDe4toNivel, educacionSuperiorNoUniversitaria
 */
function getAllDegrees(educacion) {
  if (!educacion) return [];

  let degrees = [];

  // educacionSuperior
  if (educacion.educacionSuperior && educacion.educacionSuperior.length > 0) {
    educacion.educacionSuperior.forEach((ed) => {
      if (ed.grado && ed.grado.trim() !== '') {
        degrees.push(ed.grado.trim());
      }
    });
  }

  // educacionDe4toNivel
  if (educacion.educacionDe4toNivel && educacion.educacionDe4toNivel.length > 0) {
    educacion.educacionDe4toNivel.forEach((ed) => {
      if (ed.grado && ed.grado.trim() !== '') {
        degrees.push(ed.grado.trim());
      }
    });
  }

  // educacionSuperiorNoUniversitaria
  if (
    educacion.educacionSuperiorNoUniversitaria &&
    educacion.educacionSuperiorNoUniversitaria.length > 0
  ) {
    educacion.educacionSuperiorNoUniversitaria.forEach((ed) => {
      if (ed.grado && ed.grado.trim() !== '') {
        degrees.push(ed.grado.trim());
      }
    });
  }

  return degrees;
}

/** Componente principal */
export default function RequisitosPage() {
  const { id, idProceso } = useParams();

  // Estados para data (requisitos) y su carga
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para CV
  const [cvData, setCvData] = useState(null);
  const [cvLoading, setCvLoading] = useState(true);
  const [cvError, setCvError] = useState(null);

  // Estados para datos del solicitante
  const [applicantData, setApplicantData] = useState(null);
  const [applicantLoading, setApplicantLoading] = useState(true);
  const [applicantError, setApplicantError] = useState(null);

  // Requisitos parseados
  const [ratingsState, setRatingsState] = useState([]);

  // IA
  const [iaResponse, setIaResponse] = useState(null);
  const [iaError, setIaError] = useState(null);
  const [iaLoading, setIaLoading] = useState(false);

  // Brecha y recomendación
  const [brecha, setBrecha] = useState(0);
  const [requirements_comment, setRequirementsComment] = useState('');

  // Estados para enviar datos
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Estado para mostrar / ocultar secciones completas del CV
  const [showAllCv, setShowAllCv] = useState(false);

  // Estado para tiempo total de experiencia
  const [totalMonths, setTotalMonths] = useState(0);

  // ------------------------------------
  // FETCH Requisitos (Process)
  // ------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://51.222.110.107:5012/process/${idProceso}`,
          {
            headers: {
              Authorization: '7zXnBjF5PBl7EzG/WhATQw==',
            },
          }
        );
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idProceso]);

  // ------------------------------------
  // FETCH CV
  // ------------------------------------
  useEffect(() => {
    const fetchCvData = async () => {
      try {
        const response = await axios.get(
          `http://51.222.110.107:5012/applicant/get_cv/${id}`,
          {
            headers: {
              Authorization: '7zXnBjF5PBl7EzG/WhATQw==',
            },
          }
        );
        setCvData(response.data);
      } catch (err) {
        setCvError(err);
      } finally {
        setCvLoading(false);
      }
    };
    fetchCvData();
  }, [id]);

  // ------------------------------------
  // FETCH Applicant Data
  // ------------------------------------
  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        const response = await axios.get(
          `http://51.222.110.107:5012/applicant/${id}`,
          {
            headers: {
              Authorization: '7zXnBjF5PBl7EzG/WhATQw==',
            },
          }
        );
        setApplicantData(response.data);
      } catch (err) {
        setApplicantError(err);
      } finally {
        setApplicantLoading(false);
      }
    };
    fetchApplicantData();
  }, [id]);

  // ------------------------------------
  // Calcular Brecha con Ratings
  // ------------------------------------
  useEffect(() => {
    const calculateBrecha = (ratings) => {
      const sumMax = ratings.reduce((acc, req) => acc + req.maxValue, 0);
      const sumUser = ratings.reduce((acc, req) => acc + req.userValue, 0);
      return Math.max(sumMax - sumUser, 0);
    };
    const nuevaBrecha = calculateBrecha(ratingsState);
    setBrecha(nuevaBrecha);
  }, [ratingsState]);

  // ------------------------------------
  // Parsear requisitos
  // ------------------------------------
  useEffect(() => {
    if (data) {
      const { requirements_percentages } = data;
      const regex = /(\d+)%\s*([^,]+)/g;
      const requisitosParseados = [];
      let match;

      while ((match = regex.exec(requirements_percentages)) !== null) {
        const maxValue = parseInt(match[1], 10);
        const descripcion = match[2].trim();
        requisitosParseados.push({
          maxValue,
          descripcion,
          userValue: 0,
        });
      }

      setRatingsState(requisitosParseados);
      console.log('Requisitos parseados:', requisitosParseados);
    }
  }, [data]);

  // ------------------------------------
  // Actualizar desde applicantData
  // ------------------------------------
  useEffect(() => {
    if (applicantData) {
      const {
        requirements_calification,
        requirements_comment: applicantComment,
        requirements_gap,
      } = applicantData;

      const safeCalification = requirements_calification || '';
      const califications = safeCalification
        .split(',')
        .map((val) => parseInt(val, 10));

      setRatingsState((prev) =>
        prev.map((req, index) => ({
          ...req,
          userValue: califications[index] || 0,
        }))
      );

      setRequirementsComment(applicantComment || '');
      setBrecha(requirements_gap || 0);
    }
  }, [applicantData]);

  // ------------------------------------
  // Calcular Tiempo Total de Experiencia
  // ------------------------------------
  useEffect(() => {
    if (cvData?.experienciaLaboral) {
      const total = getTotalMonthsExperiencia(cvData.experienciaLaboral);
      setTotalMonths(total);
    }
  }, [cvData]);

  // ------------------------------------
  // Handler de rating
  // ------------------------------------
  const handleRatingChange = (index, newVal) => {
    setRatingsState((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const userValue = Math.max(0, Math.min(item.maxValue, Number(newVal)));
          return { ...item, userValue };
        }
        return item;
      })
    );
  };

  // ------------------------------------
  // Mensaje CV
  // ------------------------------------
  let cvMessage = '';
  if (cvLoading) {
    cvMessage = 'Cargando CV...';
  } else if (cvError) {
    cvMessage = `Error al cargar CV: ${cvError.message}`;
  } else if (!cvData) {
    cvMessage = 'No se encontró información de CV.';
  }

  // ------------------------------------
  // Parsear datos de CV
  // ------------------------------------
  let cvEducations = [];
  let cvExpLabel = '—';
  let cvCertifications = [];
  let cvDetailedExperiences = [];
  let cvIdiomas = [];
  let cvCompetencias = [];
  let cvLogrosRelevantes = [];

  if (cvData) {
    // EDUCACIÓN
    cvEducations = getAllDegrees(cvData.educacion);

    // Experiencia total
    if (totalMonths > 0) {
      if (totalMonths < 12) {
        cvExpLabel = `${totalMonths} mes${totalMonths === 1 ? '' : 'es'}`;
      } else {
        const years = (totalMonths / 12).toFixed(1);
        cvExpLabel = `${years} año${years === '1.0' ? '' : 's'}`;
      }
    }

    // Certificaciones
    if (cvData.certificaciones?.length > 0) {
      cvCertifications = cvData.certificaciones.map((cert) => ({
        curso: cert.curso?.trim() || '',
        entidad: cert.entidad?.trim() || '',
        ano: cert.ano?.trim() || '',
      }));
    }

    // Experiencia laboral
    if (cvData.experienciaLaboral?.length > 0) {
      cvDetailedExperiences = cvData.experienciaLaboral.map((exp, index) => ({
        key: index,
        cargo: exp.cargo || '—',
        empresa: exp.empresa || '—',
        fechaInicio: exp.fechaInicio || '—',
        fechaFin: exp.fechaFin || 'Present',
        descripcionRol: exp.descripcionRol || '—',
        lugar: exp.lugar || '—',
      }));
    }

    // Idiomas
    if (cvData.idiomas?.length > 0) {
      cvIdiomas = cvData.idiomas.map((idioma, index) => ({
        key: index,
        idioma: idioma.idioma || '—',
        fluidez: idioma.fluidez || '—',
      }));
    }

    // Competencias
    if (cvData.competencias?.length > 0) {
      cvCompetencias = cvData.competencias.map((comp, index) => ({
        key: index,
        competencia: comp || '—',
      }));
    }

    // Logros Relevantes
    if (cvData.logrosRelevantes?.length > 0) {
      cvLogrosRelevantes = cvData.logrosRelevantes.map((logro, index) => ({
        key: index,
        logro: logro || '—',
      }));
    }
  }

  // ------------------------------------
  // Construir texto del CV (IA)
  // ------------------------------------
  const buildCvText = () => {
    const educationsText =
      cvEducations.length > 0
        ? `Grados académicos: ${cvEducations.join(', ')}.`
        : 'Sin educación registrada.';
    const experienciaText = `Experiencia total: ${cvExpLabel}.`;
    const certsText =
      cvCertifications.length > 0
        ? 'Certificaciones: ' +
          cvCertifications
            .map((cert) => `${cert.curso} - ${cert.entidad} (${cert.ano})`)
            .join(', ')
        : 'Sin certificaciones.';
    const idiomasText =
      cvIdiomas.length > 0
        ? 'Idiomas: ' +
          cvIdiomas
            .map((idioma) => `${idioma.idioma} (${idioma.fluidez})`)
            .join(', ')
        : 'Sin idiomas registrados.';
    const cargosText =
      cvDetailedExperiences.length > 0
        ? 'Cargos desempeñados: ' +
          cvDetailedExperiences
            .map((exp) => exp.cargo)
            .filter((cargo) => cargo !== '—')
            .join(', ')
        : 'Sin cargos registrados.';

    return `${educationsText}\n${experienciaText}\n${certsText}\n${idiomasText}\n${cargosText}`;
  };

  // ------------------------------------
  // Botón "Generar con IA"
  // ------------------------------------
  const handleGenerarConIA = async () => {
    try {
      if (!data || !cvData) {
        alert('Aún no se han cargado los datos necesarios.');
        return;
      }
      const job_requirements = data.requirements_percentages;
      const cv_text = buildCvText();

      if (!job_requirements || !cv_text) {
        alert('job_requirements o cv_text están vacíos.');
        return;
      }

      setIaLoading(true);
      setIaError(null);
      setIaResponse(null);
      setRequirementsComment('');

      const response = await axios.post(
        `http://51.222.110.107:5012/applicant/calculate_requirements_gaps/${id}`,
        { job_requirements, cv_text },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setIaResponse(response.data);

      if (response.data?.requirements) {
        if (response.data.requirements.length !== ratingsState.length) {
          alert('La cantidad de requisitos en la IA no coincide con ratingsState.');
        }

        setRatingsState((prev) =>
          prev.map((req, index) => {
            const iaReq = response.data.requirements[index];
            return iaReq ? { ...req, userValue: iaReq.userValue } : req;
          })
        );

        if (response.data.summary && typeof response.data.summary.comentario === 'string') {
          setRequirementsComment(response.data.summary.comentario);
        }
        window.location.reload();
      }
    } catch (error) {
      console.error('Error al generar con IA:', error);
      setIaError(error);
      alert('Error al generar con IA. Revisa la consola para más detalles.');
    } finally {
      setIaLoading(false);
    }
  };

  // ------------------------------------
  // Enviar datos
  // ------------------------------------
  const handleEnviarDatos = async () => {
    try {
      const requirements_calification = ratingsState.map((req) => req.userValue).join(',');
      const requirements_gap = brecha;
      const trimmed_comment = requirements_comment.trim();

      if (!requirements_calification) {
        alert('No hay datos de calificación para enviar.');
        return;
      }
      if (!trimmed_comment) {
        alert('No hay comentario de recomendación para enviar.');
        return;
      }

      setSendLoading(true);
      setSendError(null);
      setSendSuccess(false);

      const response = await axios.put(
        `http://51.222.110.107:5012/applicant/${id}`,
        {
          requirements_calification,
          requirements_gap,
          requirements_comment: trimmed_comment,
        },
        {
          headers: {
            Authorization: '7zXnBjF5PBl7EzG/WhATQw==',
            'Content-Type': 'application/json',
          },
        }
      );

      setSendSuccess(true);
      console.log('Datos enviados correctamente:', response.data);
    } catch (error) {
      console.error('Error al enviar datos:', error);
      setSendError(error);
      alert('Error al enviar los datos. Revisa la consola para más detalles.');
    } finally {
      setSendLoading(false);
    }
  };

  // ------------------------------------
  // Botón para abrir CV en otra pestaña
  // ------------------------------------
  const handleOpenCvTab = () => {
    // Ajusta la ruta donde tengas el CV del postulante
    window.open(`http://51.222.110.107:5012/applicant/pdf_cv/${id}`, '_blank');
  };

  // ------------------------------------
  // Render principal
  // ------------------------------------
  if (loading || cvLoading || applicantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#21498E] to-[#6a82fb]">
        <div className="flex items-center space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <p className="text-white text-lg">
            {loading
              ? 'Cargando requisitos...'
              : cvLoading
              ? 'Cargando CV...'
              : 'Cargando datos del solicitante...'}
          </p>
        </div>
      </div>
    );
  }
  if (error || cvError || applicantError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#21498E] to-[#6a82fb]">
        <p className="text-red-300 text-lg">
          {error
            ? `Error al cargar requisitos: ${error.message}`
            : cvError
            ? `Error al cargar CV: ${cvError.message}`
            : `Error al cargar datos del solicitante: ${applicantError.message}`}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Encabezado */}
      <header className="bg-[#21498E] text-white py-4 shadow-lg transition-all duration-200">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Comparativa de Requisitos vs. CV</h1>
          <div className="text-sm">
            <span className="bg-white text-[#21498E] px-4 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition-transform duration-200">
              Brecha: {brecha}
            </span>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda: REQUISITOS */}
            <div className="bg-white shadow-xl rounded-lg p-6 transform hover:scale-[1.01] transition-transform duration-200">
              <h2 className="text-2xl font-bold text-[#21498E] mb-6">
                Requisitos del Puesto
              </h2>

              {/* TABLA DE REQUISITOS */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-[#21498E] text-white">
                      <th className="text-left py-3 px-4 font-semibold">Requisito</th>
                      <th className="text-center py-3 px-4 font-semibold">Calificación</th>
                      <th className="text-center py-3 px-4 font-semibold">Progreso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratingsState.map((req, index) => {
                      const progress = req.maxValue
                        ? (req.userValue / req.maxValue) * 100
                        : 0;
                      return (
                        <tr
                          key={index}
                          className="border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                        >
                          {/* Descripción */}
                          <td className="py-4 px-4">
                            <div className="text-gray-800 font-medium">{req.descripcion}</div>
                            <div className="text-xs text-gray-500">Máx: {req.maxValue}</div>
                          </td>
                          {/* Calificación */}
                          <td className="py-4 px-4 text-center">
                            <input
                              type="number"
                              value={req.userValue}
                              onChange={(e) =>
                                handleRatingChange(index, parseInt(e.target.value, 10) || 0)
                              }
                              className="w-16 text-center border border-[#21498E] rounded-md focus:outline-none focus:ring-2 focus:ring-[#21498E] transition-shadow duration-200"
                              min="0"
                              max={req.maxValue}
                            />
                          </td>
                          {/* Barra de Progreso */}
                          <td className="py-4 px-4">
                            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                              <div
                                className="h-3 bg-[#21498E] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-center text-gray-600 mt-1">
                              {progress.toFixed(0)}%
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Resumen de calificaciones */}
              <div className="mt-6 text-gray-700 space-y-1">
                <p>
                  <span className="font-semibold text-[#21498E]">
                    Suma de calificaciones:
                  </span>{' '}
                  {ratingsState.reduce((acc, cur) => acc + cur.userValue, 0)}
                </p>
                <p>
                  <span className="font-semibold text-[#21498E]">
                    Suma de máximos:
                  </span>{' '}
                  {ratingsState.reduce((acc, cur) => acc + cur.maxValue, 0)}
                </p>
              </div>

              {/* Botones IA y Enviar Datos */}
              <div className="mt-6 flex flex-col space-y-4">
                <button
                  onClick={handleGenerarConIA}
                  className="w-full px-4 py-3 bg-[#21498E] text-white rounded-full shadow-md hover:bg-[#1b3d73] focus:outline-none focus:ring-4 focus:ring-[#21498E]/50 transition-colors duration-200"
                  disabled={iaLoading}
                >
                  {iaLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      <span>Generando...</span>
                    </div>
                  ) : (
                    'Generar con IA'
                  )}
                </button>

                <button
                  onClick={handleEnviarDatos}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-200 transition-colors duration-200"
                  disabled={sendLoading || !requirements_comment}
                >
                  {sendLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    'Enviar datos'
                  )}
                </button>
              </div>

              {/* Mensajes de éxito/error envío */}
              {sendSuccess && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                  Los datos se han enviado correctamente.
                </div>
              )}
              {sendError && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                  Error al enviar los datos: {sendError.message}
                </div>
              )}

              {/* Recomendación de la IA */}
              {requirements_comment && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md shadow-inner">
                  <h3 className="text-lg font-semibold text-[#21498E] mb-2">
                    Recomendación
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {requirements_comment}
                  </p>
                </div>
              )}

              {/* Error de la IA */}
              {iaError && (
                <div className="mt-6 p-4 bg-red-100 rounded-md shadow-inner">
                  <h3 className="text-lg font-semibold text-red-700 mb-2">
                    Error de la IA
                  </h3>
                  <p className="text-red-700">
                    {iaError.response
                      ? iaError.response.data.error || 'Error desconocido.'
                      : iaError.message}
                  </p>
                </div>
              )}
            </div>

            {/* Columna Derecha: CV */}
            <div className="bg-white shadow-xl rounded-lg p-6 transform hover:scale-[1.01] transition-transform duration-200">
              {/* Encabezado de la Columna Derecha */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#21498E]">Datos del CV</h2>
                {/* Botón para abrir CV en otra pestaña */}
                <button
                  onClick={handleOpenCvTab}
                  className="px-4 py-2 bg-[#21498E] text-white rounded-full shadow-md hover:bg-[#1b3d73] focus:outline-none focus:ring-2 focus:ring-[#21498E]/50 transition-colors duration-200"
                >
                  Ver CV del Postulante
                </button>
              </div>

              {/* Mensaje si no hay CV */}
              {cvMessage && !cvData && (
                <p className="text-gray-500 mb-4 animate-pulse">{cvMessage}</p>
              )}

              {/* Si hay CV data */}
              {cvData && (
                <>
                  {/* Secciones "básicas" siempre visibles */}
                  <div className="space-y-6">
                    {/* EDUCACIÓN */}
                    <div>
                      <h3 className="text-xl font-semibold text-[#21498E] mb-2">
                        Educación (Grados)
                      </h3>
                      {cvEducations.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {cvEducations.map((deg, i) => (
                            <li
                              key={i}
                              className="hover:text-[#21498E] transition-colors duration-200"
                            >
                              {deg}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">No hay grados registrados.</p>
                      )}
                    </div>

                    <hr className="border-gray-300" />

                    {/* EXPERIENCIA TOTAL */}
                    <div>
                      <h3 className="text-xl font-semibold text-[#21498E] mb-2">
                        Experiencia Laboral (Tiempo Total)
                      </h3>
                      <p className="text-gray-700">
                        {totalMonths > 0
                          ? totalMonths < 12
                            ? `${totalMonths} mes${totalMonths === 1 ? '' : 'es'}`
                            : `${(totalMonths / 12).toFixed(1)} año${
                                (totalMonths / 12).toFixed(1) === '1.0' ? '' : 's'
                              }`
                          : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Botón al final: "Ver más detalles" si showAllCv = false */}
                  {!showAllCv && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => setShowAllCv(true)}
                        className="px-4 py-2 bg-[#21498E] text-white rounded-full shadow-md hover:bg-[#1b3d73] focus:outline-none focus:ring-2 focus:ring-[#21498E] transition-colors duration-200"
                      >
                        Ver más detalles
                      </button>
                    </div>
                  )}

                  {/* Secciones adicionales SOLO si showAllCv = true */}
                  {showAllCv && (
                    <>
                      <hr className="my-6 border-gray-300" />

                      {/* EXPERIENCIA LABORAL DETALLADA */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-[#21498E] mb-2">
                            Experiencia Laboral Detallada
                          </h3>
                          {cvDetailedExperiences.length > 0 ? (
                            <div className="space-y-4">
                              {cvDetailedExperiences.map((exp) => (
                                <div
                                  key={exp.key}
                                  className="p-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                >
                                  <h4 className="text-lg font-semibold text-[#21498E]">
                                    {exp.cargo} en {exp.empresa}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {exp.fechaInicio} - {exp.fechaFin} | {exp.lugar}
                                  </p>
                                  <p className="mt-1 text-gray-700">{exp.descripcionRol}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-600">No hay experiencias laborales registradas.</p>
                          )}
                        </div>

                        <hr className="border-gray-300" />

                        {/* CERTIFICACIONES */}
                        <div>
                          <h3 className="text-xl font-semibold text-[#21498E] mb-2">
                            Certificaciones
                          </h3>
                          {cvCertifications.length > 0 ? (
                            <div className="space-y-4">
                              {cvCertifications.map((cert, i) => (
                                <div
                                  key={i}
                                  className="p-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                >
                                  <p className="text-gray-700">
                                    <strong>Curso:</strong> {cert.curso || '—'}
                                  </p>
                                  <p className="text-gray-700">
                                    <strong>Entidad:</strong> {cert.entidad || '—'}
                                  </p>
                                  <p className="text-gray-700">
                                    <strong>Año:</strong> {cert.ano || '—'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-600">No hay certificaciones registradas.</p>
                          )}
                        </div>

                        <hr className="border-gray-300" />

                        {/* IDIOMAS */}
                        <div>
                          <h3 className="text-xl font-semibold text-[#21498E] mb-2">
                            Idiomas
                          </h3>
                          {cvIdiomas.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                              {cvIdiomas.map((idioma) => (
                                <li
                                  key={idioma.key}
                                  className="hover:text-[#21498E] transition-colors duration-200"
                                >
                                  {idioma.idioma} - {idioma.fluidez}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600">No hay idiomas registrados.</p>
                          )}
                        </div>

                        <hr className="border-gray-300" />

                        {/* COMPETENCIAS (Opcional) */}
                        {cvCompetencias.length > 0 && (
                          <>
                            <div>
                              <h3 className="text-xl font-semibold text-[#21498E] mb-2">
                                Competencias
                              </h3>
                              <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {cvCompetencias.map((comp) => (
                                  <li
                                    key={comp.key}
                                    className="hover:text-[#21498E] transition-colors duration-200"
                                  >
                                    {comp.competencia}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <hr className="border-gray-300" />
                          </>
                        )}

                        {/* LOGROS RELEVANTES (Opcional) */}
                        {cvLogrosRelevantes.length > 0 && (
                          <div>
                            <h3 className="text-xl font-semibold text-[#21498E] mb-2">
                              Logros Relevantes
                            </h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                              {cvLogrosRelevantes.map((logro) => (
                                <li
                                  key={logro.key}
                                  className="hover:text-[#21498E] transition-colors duration-200"
                                >
                                  {logro.logro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Botón final: "Ver menos detalles" */}
                      <div className="text-center mt-8">
                        <button
                          onClick={() => setShowAllCv(false)}
                          className="px-4 py-2 bg-[#21498E] text-white rounded-full shadow-md hover:bg-[#1b3d73] focus:outline-none focus:ring-2 focus:ring-[#21498E] transition-colors duration-200"
                        >
                          Ver menos detalles
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#21498E] py-4 text-sm text-center text-white shadow-inner">
        © 2024 Inova Solutions - Todos los derechos reservados
      </footer>
    </div>
  );
}
