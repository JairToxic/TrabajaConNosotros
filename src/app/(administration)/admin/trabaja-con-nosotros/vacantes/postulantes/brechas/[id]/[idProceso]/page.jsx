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
    const start = parseSpanishDate(exp.fechaInicio);
    let end = parseSpanishDate(exp.fechaFin);

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
 * Parsea strings como "ABRIL 2024", "SEP 2024", "ACTUALIDAD", etc.
 * Retorna {year, month} o null.
 */
function parseSpanishDate(raw) {
  if (!raw) return null;
  const lower = raw.trim().toLowerCase();

  // Si incluye "actual", "present", etc. => null para usar la fecha actual afuera
  if (lower.includes('actual') || lower.includes('present')) {
    return null;
  }

  // Mapeo de meses en español
  const monthsMap = {
    ene: 1,
    enero: 1,
    feb: 2,
    febr: 2,
    mar: 3,
    marz: 3,
    abr: 4,
    abril: 4,
    may: 5,
    mayo: 5,
    jun: 6,
    junio: 6,
    jul: 7,
    julio: 7,
    ago: 8,
    agos: 8,
    agost: 8,
    sep: 9,
    sept: 9,
    septiembre: 9,
    oct: 10,
    octubre: 10,
    nov: 11,
    noviem: 11,
    dic: 12,
    diciem: 12,
  };

  const parts = lower.split(/\s+/);
  let year = null;
  let month = null;

  parts.forEach((p) => {
    // Chequeamos año (por ejemplo "2022", "2023", etc.)
    const maybeYear = p.match(/\b20\d{2}\b/);
    if (maybeYear) {
      year = parseInt(maybeYear[0], 10);
    }
    // Chequeamos mes
    Object.keys(monthsMap).forEach((mKey) => {
      if (p.startsWith(mKey)) {
        month = monthsMap[mKey];
      }
    });
  });

  if (!year || !month) {
    return null;
  }
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
  // Obtención de parámetros de la URL
  const { id, idProceso } = useParams();

  // Estados para los requisitos
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para CV
  const [cvData, setCvData] = useState(null);
  const [cvLoading, setCvLoading] = useState(true);
  const [cvError, setCvError] = useState(null);

  // Estados para los datos del solicitante
  const [applicantData, setApplicantData] = useState(null);
  const [applicantLoading, setApplicantLoading] = useState(true);
  const [applicantError, setApplicantError] = useState(null);

  // Arreglo con los requisitos parseados
  const [ratingsState, setRatingsState] = useState([]);

  // Estados para manejar la respuesta de la IA
  const [iaResponse, setIaResponse] = useState(null);
  const [iaError, setIaError] = useState(null);
  const [iaLoading, setIaLoading] = useState(false);

  // Estado para la brecha calculada localmente
  const [brecha, setBrecha] = useState(0);

  // Estado para la recomendación de la IA
  const [requirements_comment, setRequirementsComment] = useState('');

  // Nuevos estados para el envío de datos
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  // ------------------------------------
  // FETCH Requisitos (Process)
  // ------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://51.222.110.107:5012/process/${idProceso}`, {
          headers: {
            Authorization: '7zXnBjF5PBl7EzG/WhATQw==',
          },
        });
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
  // FETCH Datos del Solicitante
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
  // Calcular Brecha Basada en las Calificaciones
  // ------------------------------------
  useEffect(() => {
    const calculateBrecha = (ratings) => {
      const sumMax = ratings.reduce((acc, req) => acc + req.maxValue, 0);
      const sumUser = ratings.reduce((acc, req) => acc + req.userValue, 0);
      return Math.max(sumMax - sumUser, 0); // Evitar negativo
    };

    const nuevaBrecha = calculateBrecha(ratingsState);
    setBrecha(nuevaBrecha);
  }, [ratingsState]);

  // ------------------------------------
  // Parsear requisitos desde Process Data
  // ------------------------------------
  useEffect(() => {
    if (data) {
      const { requirements_percentages } = data;

      // Ejemplo: "60% Formación, 20% Experiencia, 20% Certificaciones"
      const regex = /(\d+)%\s*([^,]+)/g;
      const requisitosParseados = [];
      let match;

      while ((match = regex.exec(requirements_percentages)) !== null) {
        const maxValue = parseInt(match[1], 10);
        const descripcion = match[2].trim();
        requisitosParseados.push({
          maxValue,
          descripcion,
          userValue: 0, // Inicialmente 0
        });
      }

      setRatingsState(requisitosParseados);
      console.log('Requisitos Parseados desde Process Data:', requisitosParseados);
    }
  }, [data]);

  // ------------------------------------
  // Actualizar estados desde Applicant Data
  // ------------------------------------
  useEffect(() => {
    if (applicantData) {
      const {
        requirements_calification,
        requirements_comment: applicantComment,
        requirements_gap,
      } = applicantData;

      // Asegurarnos de que no sea undefined o null para evitar el error .split
      const safeCalification = requirements_calification || '';

      // Parsear requirements_calification
      const califications = safeCalification
        .split(',')
        .map((val) => parseInt(val, 10));

      setRatingsState((prevRatings) =>
        prevRatings.map((req, index) => ({
          ...req,
          userValue: califications[index] || 0, // Tomamos la calificación o 0 si no existe
        }))
      );

      // Establecer requirements_comment y requirements_gap
      setRequirementsComment(applicantComment || '');
      setBrecha(requirements_gap || 0);

      console.log('Datos del Solicitante Actualizados:', {
        requirements_calification,
        applicantComment,
        requirements_gap,
      });
    }
  }, [applicantData]);

  // ------------------------------------
  // Función para cambiar la calificación
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
  // Preparamos datos del CV para la segunda columna
  // ------------------------------------
  let cvMessage = '';
  if (cvLoading) {
    cvMessage = 'Cargando CV...';
  } else if (cvError) {
    cvMessage = `Error al cargar CV: ${cvError.message}`;
  } else if (!cvData) {
    cvMessage = 'No se encontró información de CV.';
  }

  // EDUCACIÓN (solo grados)
  let cvEducations = [];
  // EXPERIENCIA (meses -> años)
  let cvExpLabel = '—';
  // CERTIFICACIONES
  let cvCertifications = [];

  if (cvData) {
    // 1) Extraer grados
    cvEducations = getAllDegrees(cvData.educacion);

    // 2) Calcular total de meses y convertir a años/meses
    const totalMonths = getTotalMonthsExperiencia(cvData.experienciaLaboral);
    if (totalMonths > 0) {
      if (totalMonths < 12) {
        cvExpLabel = `${totalMonths} mes${totalMonths === 1 ? '' : 'es'}`;
      } else {
        const years = (totalMonths / 12).toFixed(1);
        cvExpLabel = `${years} año${years === '1.0' ? '' : 's'}`;
      }
    }

    // 3) Certificaciones
    if (cvData.certificaciones && cvData.certificaciones.length > 0) {
      cvCertifications = cvData.certificaciones.map((cert) => ({
        curso: cert.curso?.trim() || '',
        entidad: cert.entidad?.trim() || '',
        ano: cert.ano?.trim() || '',
      }));
    }
  }

  // ------------------------------------
  // Función para construir un texto del CV (simple)
  // ------------------------------------
  const buildCvText = () => {
    // EDUCACIÓN
    const educationsText =
      cvEducations.length > 0
        ? `Grados académicos: ${cvEducations.join(', ')}.`
        : 'Sin educación registrada.';

    // EXPERIENCIA
    const experienciaText = `Experiencia total: ${cvExpLabel}.`;

    // CERTIFICACIONES
    const certsText =
      cvCertifications.length > 0
        ? 'Certificaciones: ' +
          cvCertifications
            .map((cert) => {
              return `${cert.curso} - ${cert.entidad} (${cert.ano})`;
            })
            .join(', ')
        : 'Sin certificaciones.';

    // Combinar todo en un solo string
    return `${educationsText}\n${experienciaText}\n${certsText}`;
  };

  // ------------------------------------
  // Botón "Generar con IA"
  // ------------------------------------
  const handleGenerarConIA = async () => {
    try {
      if (!data || !cvData) {
        console.warn('Aún no se han cargado los datos necesarios.');
        alert('Aún no se han cargado los datos necesarios.');
        return;
      }

      // 1) job_requirements = el string con porcentajes (p.ej. "60% Formación, 20% Experiencia...")
      const job_requirements = data.requirements_percentages;

      // 2) cv_text = string generado con la información del CV
      const cv_text = buildCvText();

      // Verificar que los campos no estén vacíos
      if (!job_requirements || !cv_text) {
        console.warn('job_requirements o cv_text están vacíos.');
        alert('job_requirements o cv_text están vacíos.');
        return;
      }

      // Mostrar carga
      setIaLoading(true);
      setIaError(null);
      setIaResponse(null);
      setRequirementsComment(''); // Resetear comentario anterior

      // Registrar los datos que se van a enviar
      console.log('Enviando datos a Flask:', { job_requirements, cv_text });

      // Llamada a tu endpoint en Flask (ajusta la URL según tu entorno)
      const response = await axios.post(
        'http://localhost:5000/procesar_cv',
        {
          job_requirements,
          cv_text,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Manejar la respuesta de la IA
      console.log('Respuesta IA:', response.data);
      setIaResponse(response.data);

      // **Actualizar `ratingsState` con los `userValue` de la IA**
      if (response.data && response.data.requirements) {
        // Verificar que la cantidad de requisitos coincida
        if (response.data.requirements.length !== ratingsState.length) {
          console.warn(
            'La cantidad de requisitos en la respuesta de la IA no coincide con la de ratingsState.'
          );
          alert(
            'La cantidad de requisitos en la respuesta de la IA no coincide con la de ratingsState.'
          );
        }

        setRatingsState((prevRatings) =>
          prevRatings.map((req, index) => {
            const iaReq = response.data.requirements[index];
            if (iaReq) {
              console.log(
                `Actualizando Requisito: "${req.descripcion}" con userValue: ${iaReq.userValue}`
              );
              return { ...req, userValue: iaReq.userValue };
            }
            return req;
          })
        );

        // Extraer y establecer la recomendación de la IA
        if (response.data.summary && typeof response.data.summary.comentario === 'string') {
          setRequirementsComment(response.data.summary.comentario);
        }
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
  // Función para enviar los datos al endpoint
  // ------------------------------------
  const handleEnviarDatos = async () => {
    try {
      // Preparar los datos
      const requirements_calification = ratingsState.map((req) => req.userValue).join(',');
      const requirements_gap = brecha;
      // Renombramos localmente para no confundir con el estado
      const trimmed_comment = requirements_comment.trim();

      // Validar los datos
      if (!requirements_calification) {
        alert('No hay datos de calificación para enviar.');
        return;
      }

      if (!trimmed_comment) {
        alert('No hay comentario de recomendación para enviar.');
        return;
      }

      // Mostrar carga
      setSendLoading(true);
      setSendError(null);
      setSendSuccess(false);

      // Enviar solicitud PUT
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

      // Manejar la respuesta de éxito
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
      <header className="bg-[#21498E] text-white py-6 shadow-lg transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Comparativa de Requisitos vs. CV</h1>
          <div className="text-sm">
            <span className="bg-white text-[#21498E] px-4 py-2 rounded-full font-semibold shadow-md transform hover:scale-105 transition-transform duration-300">
              Brecha: {brecha}
            </span>
          </div>
        </div>
      </header>

      {/* Contenido: 2 columnas (izq: Requisitos - der: CV) */}
      <main className="flex-grow py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Columna Izquierda: REQUISITOS */}
            <div className="bg-white shadow-xl rounded-lg p-8 transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl font-bold text-[#21498E] mb-6">Requisitos del Puesto</h2>

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
                      const progress =
                        req.maxValue === 0 ? 0 : (req.userValue / req.maxValue) * 100;
                      return (
                        <tr
                          key={index}
                          className="border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-300"
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
                              className="w-16 text-center border border-[#21498E] rounded-md focus:outline-none focus:ring-2 focus:ring-[#21498E] transition-shadow duration-300"
                              min="0"
                              max={req.maxValue}
                            />
                          </td>
                          {/* Barra de Progreso */}
                          <td className="py-4 px-4">
                            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                              <div
                                className="h-3 bg-[#21498E] transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
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

              {/* Resumen final */}
              <div className="mt-8 text-gray-700 space-y-2">
                <p>
                  <span className="font-semibold text-[#21498E]">Suma de calificaciones:</span>{' '}
                  {ratingsState.reduce((acc, cur) => acc + cur.userValue, 0)}
                </p>
                <p>
                  <span className="font-semibold text-[#21498E]">Suma de máximos:</span>{' '}
                  {ratingsState.reduce((acc, cur) => acc + cur.maxValue, 0)}
                </p>
              </div>

              {/* BOTÓN "Generar con IA" */}
              <div className="mt-6">
                <button
                  onClick={handleGenerarConIA}
                  className="w-full px-4 py-3 bg-[#21498E] text-white rounded-full shadow-lg hover:bg-[#1b3d73] focus:outline-none focus:ring-4 focus:ring-[#21498E]/50 transition-colors duration-300"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      <span>Generando...</span>
                    </div>
                  ) : (
                    'Generar con IA'
                  )}
                </button>
              </div>

              {/* BOTÓN "Enviar datos" */}
              <div className="mt-4">
                <button
                  onClick={handleEnviarDatos}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-200 transition-colors duration-300"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    'Enviar datos'
                  )}
                </button>
              </div>

              {/* Mostrar Éxito del Envío */}
              {sendSuccess && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                  Los datos se han enviado correctamente.
                </div>
              )}

              {/* Mostrar Error del Envío */}
              {sendError && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                  Error al enviar los datos: {sendError.message}
                </div>
              )}

              {/* Mostrar Recomendación de la IA */}
              {requirements_comment && (
                <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-[#21498E] mb-3">Recomendación</h3>
                  <p className="text-gray-700">{requirements_comment}</p>
                </div>
              )}

              {/* Mostrar Error de la IA */}
              {iaError && (
                <div className="mt-6 p-5 bg-red-100 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-red-700 mb-3">Error de la IA</h3>
                  <p className="text-red-700">
                    {iaError.response
                      ? iaError.response.data.error || 'Error desconocido.'
                      : iaError.message}
                  </p>
                </div>
              )}
            </div>

            {/* Columna Derecha: CV */}
            <div className="bg-white shadow-xl rounded-lg p-8 transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl font-bold text-[#21498E] mb-6">Datos del CV</h2>

              {/* Mensaje (cargando, error, etc.) */}
              {cvMessage && !cvData && (
                <p className="text-gray-500 mb-4 animate-pulse">{cvMessage}</p>
              )}

              {/* Si hay CV data, mostramos las secciones */}
              {cvData && (
                <div className="space-y-8">
                  {/* EDUCACIÓN */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#21498E] mb-3">
                      Educación (Grados)
                    </h3>
                    {cvEducations.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {cvEducations.map((deg, i) => (
                          <li
                            key={i}
                            className="hover:text-[#21498E] transition-colors duration-300"
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
                    <h3 className="text-xl font-semibold text-[#21498E] mb-3">
                      Experiencia Laboral (Tiempo Total)
                    </h3>
                    <p className="text-gray-700">{cvExpLabel}</p>
                  </div>

                  <hr className="border-gray-300" />

                  {/* CERTIFICACIONES */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#21498E] mb-3">Certificaciones</h3>
                    {cvCertifications.length > 0 ? (
                      <div className="space-y-4">
                        {cvCertifications.map((cert, i) => (
                          <div
                            key={i}
                            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
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
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#21498E] py-6 text-sm text-center text-white shadow-inner">
        © 2024 Inova Solutions - Todos los derechos reservados
      </footer>
    </div>
  );
}
