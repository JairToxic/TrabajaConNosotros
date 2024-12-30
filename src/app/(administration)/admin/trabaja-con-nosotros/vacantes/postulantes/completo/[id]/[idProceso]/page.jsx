// AnalisisCompleto.jsx
'use client';
import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { useParams, usePathname } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react'; // Para modales y transiciones
import { FaCheck, FaExclamationCircle, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import {getUserInfoById} from '../../../../../../../../../services/user.dao.js'
import { getPositionInfoById } from '../../../../../../../../../services/position.dao.js'
import { getProcessById } from '../../../../../../../../../services/process.dao.js'
import { useSession } from "next-auth/react";

/**
 * Funciones auxiliares para parsear fechas y calcular experiencia.
 */

// Convierte la experiencia laboral en meses y suma todo.
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

// Parsea strings como "June 2024", "March2023", "Present", etc.
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

// Devuelve un array con los "grados" de educación
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

/**
 * Componente principal: Análisis Completo
 */
export default function AnalisisCompleto() {
  const { id, idProceso } = useParams();
  const { data: session } = useSession();
  const pathname = usePathname(); 

  // Estados para data (requisitos y competencias) y su carga
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);
  const [positionId, setPositionId]=useState(null)
  const [positionName, setPositionName]=useState('')
  const [departmentName, setDepartmentName]=useState('')
  const [image, setImage]=useState('https://th.bing.com/th/id/OIP.LvkRLCqjbi4eEPoq9tblFwHaFl?rs=1&pid=ImgDetMain')

  // Estados para CV
  const [cvData, setCvData] = useState(null);
  const [loadingCv, setLoadingCv] = useState(true);
  const [errorCv, setErrorCv] = useState(null);

  // Estados para datos del solicitante
  const [applicantData, setApplicantData] = useState(null);
  const [loadingApplicant, setLoadingApplicant] = useState(true);
  const [errorApplicant, setErrorApplicant] = useState(null);

  // Estados para requisitos
  const [requirementsState, setRequirementsState] = useState([]);

  // Estados para competencias
  const [competenciesState, setCompetenciesState] = useState([]);

  // Estados para brechas
  const [brechaRequisitos, setBrechaRequisitos] = useState(0);
  const [brechaCompetencias, setBrechaCompetencias] = useState(0);

  // Estados para recomendaciones
  const [requirementsComment, setRequirementsComment] = useState('');
  const [competenciesComment, setCompetenciesComment] = useState('');

  // Estados para brecha final y total candidato
  const [brechaFinal, setBrechaFinal] = useState(0);
  const [totalCandidato, setTotalCandidato] = useState(0);

  //Datos usuario
  const [userId, setUserId]=useState(null)
  const [userName, setUserName]=useState(null)
  const [errorUser, setErrorUser] = useState(null);

  /**
   * Fetch de datos: Requisitos y Competencias del Proceso
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session){
          const response = await axios.get(`http://51.222.110.107:5012/process/${idProceso}`, {
            headers: {
              Authorization: '7zXnBjF5PBl7EzG/WhATQw==',
              'Content-Type': 'application/json',
            },
          });
          setData(response.data);
          setPositionName(response.data.position_name)
          setPositionId(response.data.position_id)
          const positionInfo = await getPositionInfoById(session, response.data.position_id)
          setDepartmentName(positionInfo.position.department_name)
        }
      } catch (err) {
        setErrorData(err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [idProceso, session]);

  /**
   * Fetch del CV del Solicitante
   */
  useEffect(() => {
    const fetchCvData = async () => {
      try {
        const response = await axios.get(`http://51.222.110.107:5012/applicant/get_cv/${id}`, {
          headers: {
            Authorization: '7zXnBjF5PBl7EzG/WhATQw==',
            'Content-Type': 'application/json',
          },
        });
        setCvData(response.data);
        setUserName(`${response.data.personalInfo.nombre} ${response.data.personalInfo.apellido}`);
        const image = response.data.personalInfo.foto;
        if (image !== null && image !== "") {
          setImage(image);
        }
      } catch (err) {
        setErrorCv(err);
      } finally {
        setLoadingCv(false);
      }
    };
    fetchCvData();
  }, [id]);

  /**
   * Fetch de los Datos del Solicitante
   */
  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        const response = await axios.get(`http://51.222.110.107:5012/applicant/${id}`, {
          headers: {
            Authorization: '7zXnBjF5PBl7EzG/WhATQw==',
            'Content-Type': 'application/json',
          },
        });
        setApplicantData(response.data);
      } catch (err) {
        setErrorUser(err);
      } finally {
        setLoadingApplicant(false);
      }
    };
    fetchApplicantData();
  }, [id]);

  /**
   * Parsear Requisitos desde los Datos del Proceso
   */
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

      setRequirementsState(requisitosParseados);
    }
  }, [data]);

  /**
   * Parsear Competencias desde los Datos del Proceso
   */
  useEffect(() => {
    if (data) {
      const { competencies_percentages } = data;
      const regex = /(\d+)%\s*([^,]+)/g;
      const competenciasParseadas = [];
      let match;

      while ((match = regex.exec(competencies_percentages)) !== null) {
        const maxValue = parseInt(match[1], 10);
        const descripcion = match[2].trim();
        competenciasParseadas.push({
          maxValue,
          descripcion,
          userValue: 0,
        });
      }

      setCompetenciesState(competenciasParseadas);
    }
  }, [data]);

  /**
   * Actualizar Requisitos desde los Datos del Solicitante
   */
  useEffect(() => {
    if (applicantData) {
      const { requirements_calification, requirements_comment, requirements_gap } = applicantData;

      const califications = requirements_calification
        ? requirements_calification.split(',').map((val) => parseInt(val, 10) || 0)
        : [];

      setRequirementsState((prev) =>
        prev.map((req, index) => ({
          ...req,
          userValue: califications[index] || 0,
        }))
      );

      setRequirementsComment(requirements_comment || '');
      setBrechaRequisitos(requirements_gap || 0);
    }
  }, [applicantData]);

  /**
   * Actualizar Competencias desde los Datos del Solicitante
   */
  useEffect(() => {
    if (applicantData) {
      const { competencies_calification, competencies_comment, competencies_gap } = applicantData;

      const califications = competencies_calification
        ? competencies_calification.split(',').map((val) => parseInt(val, 10) || 0)
        : [];

      setCompetenciesState((prev) =>
        prev.map((comp, index) => ({
          ...comp,
          userValue: califications[index] || 0,
        }))
      );

      setCompetenciesComment(competencies_comment || '');
      setBrechaCompetencias(competencies_gap || 0);
    }
  }, [applicantData]);

  /**
   * Calcular Brechas Totales y Brecha Final
   */
  useEffect(() => {
    // Brecha Final = (brechaRequisitos + brechaCompetencias) / 2
    const finalBrecha = (brechaRequisitos + brechaCompetencias) / 2;
    setBrechaFinal(finalBrecha);

    // Total Candidato = 100 - brechaFinal
    const total = 100 - finalBrecha;
    setTotalCandidato(total);
  }, [brechaRequisitos, brechaCompetencias]);

  /**
   * Función para obtener el color del badge según la etapa
   */
  const getBadgeColor = (stage) => {
    switch (stage) {
      case 'Reclutamiento':
        return '#4c51bf'; // Indigo
      case 'Preselección':
        return '#ecc94b'; // Yellow
      case 'Etapa Final':
        return '#48bb78'; // Green
      default:
        return '#a0aec0'; // Gray
    }
  };

  /**
   * Render principal
   */
  if (loadingData || loadingCv || loadingApplicant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <p className="text-gray-700 text-lg">
            {loadingData
              ? 'Cargando análisis completo...'
              : loadingCv
              ? 'Cargando datos del CV...'
              : 'Cargando datos del solicitante...'}
          </p>
        </div>
      </div>
    );
  }

  if (errorData || errorCv || errorApplicant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">
          {errorData
            ? `Error al cargar datos de proceso: ${errorData.message}`
            : errorCv
            ? `Error al cargar CV: ${errorCv.message}`
            : `Error al cargar datos del solicitante: ${errorApplicant.message}`}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Encabezado */}
      <header className="bg-blue-800 text-white py-6 shadow-md">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Análisis Completo</h1>
          <div className="text-sm space-x-4">
            <span className="bg-white text-blue-800 px-4 py-2 rounded-full font-semibold shadow-md">
              Brecha Requisitos: {brechaRequisitos}
            </span>
            <span className="bg-white text-blue-800 px-4 py-2 rounded-full font-semibold shadow-md">
              Brecha Competencias: {brechaCompetencias}
            </span>
            <span className="bg-white text-blue-800 px-4 py-2 rounded-full font-semibold shadow-md">
              Brecha Final: {brechaFinal}
            </span>
            <span className="bg-white text-blue-800 px-4 py-2 rounded-full font-semibold shadow-md">
              Total Candidato: {totalCandidato}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-6 mt-10 w-[90%]">
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center border" style={{ borderColor: '#1e40af', width: '80%' }}>
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Datos Candidato</h2>
          
          <div className="w-full">
            {/* Upper Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 p-4" style={{ margin: '5px' }}>
              <h2 className="text-3xl font-semibold text-[#1e40af] mb-4">{userName}</h2> 
              </div>
              <div className="flex-1 p-4" style={{ margin: '5px' }}>
                <button
                  onClick={() => window.location.href = `${pathname}/cv/${id}`}
                  className="bg-blue-800 text-white px-6 py-2 rounded-[5px] font-semibold shadow-md hover:bg-blue-700 transition-colors duration-200 w-full text-center"
                >
                  Ver Currículum
                </button>
              </div>
            </div>
            
            {/* Lower Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/4 p-4">
                <img src={image} alt="Candidate" className="w-full h-auto" />
              </div>
              
              <div className="flex-1 p-4 flex flex-col justify-between">
                {/* Departamento and Posición with split columns */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-[#1e40af] text-xl font-medium">Departamento:</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-black text-xl font-medium">{departmentName}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-2">
                  <div className="flex-1">
                    <p className="text-[#1e40af] text-xl font-medium">Posición:</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-black text-xl font-medium">{positionName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Contenido Principal */}
      <main className="flex-grow py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Sección de Requisitos */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Análisis de Requisitos</h2>

            {/* Tabla de Requisitos */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-blue-800 text-white">
                    <th className="text-left py-3 px-4 font-semibold">Requisito</th>
                    <th className="text-center py-3 px-4 font-semibold">Calificación</th>
                    <th className="text-center py-3 px-4 font-semibold">Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  {requirementsState.map((req, index) => {
                    const progress = req.maxValue
                      ? (req.userValue / req.maxValue) * 100
                      : 0;
                    return (
                      <tr
                        key={index}
                        className="border-b last:border-b-0 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {/* Descripción */}
                        <td className="py-4 px-4">
                          <div className="text-gray-800 font-medium">{req.descripcion}</div>
                          <div className="text-xs text-gray-500">Máx: {req.maxValue}</div>
                        </td>
                        {/* Calificación (Solo lectura) */}
                        <td className="py-4 px-4 text-center">
                          <input
                            type="number"
                            value={req.userValue}
                            readOnly
                            className="w-16 text-center border border-blue-800 rounded-md bg-gray-100 cursor-not-allowed"
                            min="0"
                            max={req.maxValue}
                          />
                        </td>
                        {/* Barra de Progreso */}
                        <td className="py-4 px-4">
                          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                            <div
                              className="h-3 bg-blue-800 transition-all duration-300"
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

            {/* Resumen de Requisitos */}
            <div className="mt-6 text-gray-700 space-y-1">
              <p>
                <span className="font-semibold text-blue-800">
                  Suma de calificaciones:
                </span>{' '}
                {requirementsState.reduce((acc, cur) => acc + cur.userValue, 0)}
              </p>
              <p>
                <span className="font-semibold text-blue-800">
                  Suma de máximos:
                </span>{' '}
                {requirementsState.reduce((acc, cur) => acc + cur.maxValue, 0)}
              </p>
            </div>

            {/* Recomendación */}
            {requirementsComment && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md shadow-inner">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Recomendación
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {requirementsComment}
                </p>
              </div>
            )}
          </div>

          {/* Sección de Competencias */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Análisis de Competencias</h2>

            {/* Tabla de Competencias */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-blue-800 text-white">
                    <th className="text-left py-3 px-4 font-semibold">Competencia</th>
                    <th className="text-center py-3 px-4 font-semibold">Calificación</th>
                    <th className="text-center py-3 px-4 font-semibold">Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  {competenciesState.map((comp, index) => {
                    const progress = comp.maxValue
                      ? (comp.userValue / comp.maxValue) * 100
                      : 0;
                    return (
                      <tr
                        key={index}
                        className="border-b last:border-b-0 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {/* Descripción */}
                        <td className="py-4 px-4">
                          <div className="text-gray-800 font-medium">{comp.descripcion}</div>
                          <div className="text-xs text-gray-500">Máx: {comp.maxValue}</div>
                        </td>
                        {/* Calificación (Solo lectura) */}
                        <td className="py-4 px-4 text-center">
                          <input
                            type="number"
                            value={comp.userValue}
                            readOnly
                            className="w-16 text-center border border-blue-800 rounded-md bg-gray-100 cursor-not-allowed"
                            min="0"
                            max={comp.maxValue}
                          />
                        </td>
                        {/* Barra de Progreso */}
                        <td className="py-4 px-4">
                          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                            <div
                              className="h-3 bg-blue-800 transition-all duration-300"
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

            {/* Resumen de Competencias */}
            <div className="mt-6 text-gray-700 space-y-1">
              <p>
                <span className="font-semibold text-blue-800">
                  Suma de calificaciones:
                </span>{' '}
                {competenciesState.reduce((acc, cur) => acc + cur.userValue, 0)}
              </p>
              <p>
                <span className="font-semibold text-blue-800">
                  Suma de máximos:
                </span>{' '}
                {competenciesState.reduce((acc, cur) => acc + cur.maxValue, 0)}
              </p>
            </div>

            {/* Recomendación */}
            {competenciesComment && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md shadow-inner">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Recomendación
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {competenciesComment}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Brecha Final y Total Candidato */}
        <div className="max-w-6xl mx-auto px-6 mt-10">
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Resumen Final</h2>
            <div className="flex flex-col md:flex-row items-center justify-around w-full">
              {/* Brecha Final */}
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-md mb-4 md:mb-0">
                <span className="font-semibold">Brecha Final:</span> {brechaFinal}
              </div>
              {/* Total Candidato */}
              <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-md">
                <span className="font-semibold">Total Candidato:</span> {totalCandidato}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 py-4 text-sm text-center text-white shadow-inner">
        © 2024 Inova Solutions - Todos los derechos reservados
      </footer>
    </div>
  );
}
