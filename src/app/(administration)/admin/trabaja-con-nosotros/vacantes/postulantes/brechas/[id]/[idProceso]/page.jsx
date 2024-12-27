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
 
  // Si incluye "actual", "present", etc. => null para usar la fecha actual fuera
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
    // Chequeamos año
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
  // Estados para los requisitos
  const {id, idProceso}=useParams()
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  // Estados para CV
  const [cvData, setCvData] = useState(null);
  const [cvLoading, setCvLoading] = useState(true);
  const [cvError, setCvError] = useState(null);
 
  // Arreglo con los requisitos parseados
  const [ratingsState, setRatingsState] = useState([]);
 
  // Estados para manejar la respuesta de la IA
  const [iaResponse, setIaResponse] = useState(null);
  const [iaError, setIaError] = useState(null);
  const [iaLoading, setIaLoading] = useState(false);
 
  // ------------------------------------
  // FETCH Requisitos
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
  }, []);
 
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
  }, []);
 
  // ------------------------------------
  // Parsear requisitos
  // ------------------------------------
  useEffect(() => {
    if (data) {
      const { requirements_percentages } = data;
     
      const regex = /(\d+)%\s*([^,]+)/g;
      const requisitosParseados = [];
      let match;
     
      // Usar regex para capturar cada requisito con porcentaje y descripción
      while ((match = regex.exec(requirements_percentages)) !== null) {
        const maxValue = parseInt(match[1], 10); // Captura el porcentaje
        const descripcion = match[2].trim(); // Captura la descripción
        requisitosParseados.push({
          maxValue,
          descripcion,
          userValue: 0, // Inicialmente 0
        });
      }
     
      setRatingsState(requisitosParseados);
      console.log('Requisitos Parseados:', requisitosParseados);
     
     
    }
  }, [data]);
 
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
  // Cálculos finales (suma, brecha)
  // ------------------------------------
  const sumaCalificaciones = ratingsState.reduce(
    (acc, cur) => acc + cur.userValue,
    0
  );
  const sumaMaximos = ratingsState.reduce(
    (acc, cur) => acc + cur.maxValue,
    0
  );
  const brecha = sumaMaximos - sumaCalificaciones;
 
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
 
    // 3) Certificaciones (curso, entidad, año)
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
    const educationsText = cvEducations.length > 0
      ? `Grados académicos: ${cvEducations.join(', ')}.`
      : 'Sin educación registrada.';
 
    // EXPERIENCIA
    const experienciaText = `Experiencia total: ${cvExpLabel}.`;
 
    // CERTIFICACIONES
    const certsText = cvCertifications.length > 0
      ? 'Certificaciones: ' + cvCertifications.map(cert => {
          return `${cert.curso} - ${cert.entidad} (${cert.ano})`;
        }).join(', ')
      : 'Sin certificaciones.';
 
    // Combinas todo en un solo string
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
 
      // 1) job_requirements = el string con porcentajes
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
 
      // Registrar los datos que se van a enviar
      console.log('Enviando datos a Flask:', { job_requirements, cv_text });
 
      // Llamada a tu endpoint en Flask
      const response = await axios.post(
        'http://localhost:5000/procesar_cv', // Ajusta la URL y el puerto según tu entorno
        {
          job_requirements,
          cv_text
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
 
      // Manejar la respuesta de la IA
      console.log('Respuesta IA:', response.data);
      setIaResponse(response.data);
 
      // **Actualizar `ratingsState` con los `userValue` de la IA usando el índice**
      if (response.data && response.data.requirements) {
        // Verificar que la cantidad de requisitos coincida
        if (response.data.requirements.length !== ratingsState.length) {
          console.warn('La cantidad de requisitos en la respuesta de la IA no coincide con la de ratingsState.');
          alert('La cantidad de requisitos en la respuesta de la IA no coincide con la de ratingsState.');
        }
 
        setRatingsState((prevRatings) =>
          prevRatings.map((req, index) => {
            const iaReq = response.data.requirements[index];
            if (iaReq) {
              console.log(`Actualizando Requisito: "${req.descripcion}" con userValue: ${iaReq.userValue}`);
              return { ...req, userValue: iaReq.userValue };
            }
            return req;
          })
        );
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
  // Render principal
  // ------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Cargando requisitos...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">
          Error al cargar requisitos: {error.message}
        </p>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Encabezado */}
      <header className="bg-[#21498E] text-white py-4 shadow">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Comparativa de Requisitos vs. CV</h1>
          <div className="text-sm">
            <span className="bg-white text-[#21498E] px-3 py-2 rounded font-semibold shadow">
              Brecha: {brecha}
            </span>
          </div>
        </div>
      </header>
 
      {/* Contenido: 2 columnas (izq: Requisitos - der: CV) */}
      <main className="flex-grow py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna Izquierda: REQUISITOS */}
            <div className="bg-white shadow-md rounded-md p-6">
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                Requisitos del Puesto
              </h2>
 
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 w-1/2">
                        Requisito
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-600 w-1/6">
                        Calificación
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-600 w-1/3">
                        Barra de Progreso
                      </th>
                    </tr>
                  </thead>
                  <tbody>
  {ratingsState.map((req, index) => {
    const progress =
      req.maxValue === 0 ? 0 : (req.userValue / req.maxValue) * 100;
    return (
      <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
        {/* Descripción */}
        <td className="py-3 px-4">
          <div>{req.descripcion}</div>
          <div className="text-xs text-gray-500">(Máx: {req.maxValue})</div>
        </td>
        {/* Calificación */}
        <td className="py-3 px-4 text-center">
          <input
            type="number"
            value={req.userValue}
            onChange={(e) =>
              handleRatingChange(index, parseInt(e.target.value, 10) || 0)
            }
            className="w-16 text-center border rounded"
          />
        </td>
        {/* Barra de Progreso */}
        <td className="py-3 px-4">
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="h-2 bg-blue-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-center">{progress.toFixed(0)}%</div>
        </td>
      </tr>
    );
  })}
</tbody>
 
                </table>
              </div>
 
              {/* Resumen final */}
              <div className="mt-6 text-gray-700 space-y-1">
                <p>
                  <span className="font-semibold">Suma de calificaciones:</span>{' '}
                  {sumaCalificaciones}
                </p>
                <p>
                  <span className="font-semibold">Suma de máximos:</span>{' '}
                  {sumaMaximos}
                </p>
                <p>
                  <span className="font-semibold">Brecha:</span> {brecha}
                </p>
              </div>
 
              {/* BOTÓN "Generar con IA" */}
              <div className="mt-6">
                <button
                  onClick={handleGenerarConIA}
                  className="px-4 py-2 bg-[#21498E] text-white rounded shadow hover:bg-[#1b3d73] transition-colors"
                  disabled={iaLoading}
                >
                  {iaLoading ? 'Generando...' : 'Generar con IA'}
                </button>
              </div>
 
              {/* Mostrar Respuesta de la IA */}
              {iaResponse && (
                <div className="mt-6 p-4 bg-gray-100 rounded-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Respuesta de la IA
                  </h3>
                  <pre className="whitespace-pre-wrap text-gray-700">
                    {JSON.stringify(iaResponse, null, 2)}
                  </pre>
                </div>
              )}
 
              {/* Mostrar Error de la IA */}
              {iaError && (
                <div className="mt-6 p-4 bg-red-100 rounded-md">
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
            <div className="bg-white shadow-md rounded-md p-6">
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                Datos del CV
              </h2>
 
              {/* Si hay algún mensaje (cargando, error, etc.) */}
              {cvMessage && !cvData && (
                <p className="text-gray-500 mb-4">{cvMessage}</p>
              )}
 
              {/* Si hay CV data, mostramos las secciones */}
              {cvData && (
                <div className="space-y-6">
                  {/* EDUCACIÓN */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Educación (Grados)
                    </h3>
                    {cvEducations.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {cvEducations.map((deg, i) => (
                          <li key={i}>{deg}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">
                        No hay grados registrados.
                      </p>
                    )}
                  </div>
 
                  <hr className="border-gray-200" />
 
                  {/* EXPERIENCIA TOTAL */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Experiencia Laboral (Tiempo Total)
                    </h3>
                    <p className="text-gray-600">{cvExpLabel}</p>
                  </div>
 
                  <hr className="border-gray-200" />
 
                  {/* CERTIFICACIONES */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Certificaciones
                    </h3>
                    {cvCertifications.length > 0 ? (
                      <div className="space-y-2">
                        {cvCertifications.map((cert, i) => (
                          <div
                            key={i}
                            className="p-3 border border-gray-200 rounded-md"
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
                      <p className="text-gray-600">
                        No hay certificaciones registradas.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
 
      {/* Footer */}
      <footer className="bg-white py-4 text-sm text-center text-gray-500 shadow-inner">
        © 2024 Tu Compañía - Todos los derechos reservados
      </footer>
    </div>
  );
}