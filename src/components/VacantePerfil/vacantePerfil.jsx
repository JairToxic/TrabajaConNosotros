"use client";

import React, { useState, useEffect } from "react";
import { toPng } from "html-to-image";

const AsistenteInformacion = () => {
  const [data, setData] = useState(null);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Headers comunes para las solicitudes
  const headers = {
    "Content-Type": "application/json",
    Authorization: "7zXnBjF5PBl7EzG/WhATQw==",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://51.222.110.107:5012/process/open/4",
          {
            method: "GET",
            headers: headers,
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "No se pudo cargar la información. Por favor, inténtalo de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadAsImage = () => {
    const element = document.getElementById("component-to-download");
    if (element) {
      toPng(element)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "asistente-informacion.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error("Error al generar la imagen:", err);
        });
    }
  };

  // Función para procesar la educación
  const processEducation = (education) => {
    const processed = {
      posgrado: [],
      tecnologia: [],
      bachiller: "",
      certificacion: [],
      licencia: [],
      idioma: [],
      experiencia: "",
    };

    education.forEach((item) => {
      if (Array.isArray(item)) {
        item.forEach((subItem) => {
          if (subItem.posgrado && subItem.posgrado.toLowerCase() !== "no aplica") {
            processed.posgrado.push({
              posgrado: subItem.posgrado,
              tiempoPosgrado: subItem.tiempoPosgrado,
            });
          }
          if (
            subItem.tecnologia &&
            subItem.tecnologia.toLowerCase() !== "no aplica"
          ) {
            processed.tecnologia.push({
              tecnologia: subItem.tecnologia,
              tiempoTecnologia: subItem.tiempoTecnologia,
            });
          }
          if (
            subItem.certificacion &&
            subItem.certificacion.toLowerCase() !== "no aplica"
          ) {
            processed.certificacion.push({
              certificacion: subItem.certificacion,
              tiempoCertificacion: subItem.tiempoCertificacion,
            });
          }
          if (
            subItem.licencia &&
            subItem.licencia.toLowerCase() !== "no aplica"
          ) {
            processed.licencia.push({
              licencia: subItem.licencia,
              tiempoLicencia: subItem.tiempoLicencia,
            });
          }
          if (
            subItem.idioma &&
            subItem.idioma.toLowerCase() !== "no aplica"
          ) {
            processed.idioma.push({
              idioma: subItem.idioma,
              tiempoIdioma: subItem.tiempoIdioma,
            });
          }
          if (
            subItem.experiencia &&
            subItem.experiencia.toLowerCase() !== "no aplica"
          ) {
            processed.experiencia = subItem.experiencia;
          }
        });
      } else {
        if (
          item.bachiller &&
          item.bachiller.toLowerCase() !== "no aplica"
        ) {
          processed.bachiller = item.bachiller;
        }
      }
    });

    return processed;
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div
        className="bg-white shadow-xl rounded-3xl overflow-hidden w-full max-w-4xl"
        id="component-to-download"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white text-center py-6">
          <h1 className="text-3xl font-bold uppercase">TRABAJA CON NOSOTROS</h1>
        </div>

        {/* Banner */}
        <div className="relative">
          <img
            src="/banner.png"
            alt="Banner"
            className="w-full h-64 object-cover filter brightness-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-2xl md:text-4xl font-semibold">
            {data.position_name}
            </h2>
            
          </div>
        </div>

        {/* Contenido Principal */}
        {data && (
          <div className="p-6">
            {/* Misión */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                Misión
              </h3>
              <p className="text-gray-700">{data.mission}</p>
            </div>

            {/* Responsabilidad General */}
            <div className="mb-6">
             
            </div>

            {/* Requisitos para Postulación */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                Requisitos para Postulación
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {/* Posgrado */}
                {processEducation(data.education).posgrado.length > 0 && (
                  <li>
                    <strong>Posgrado:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {processEducation(data.education).posgrado.map(
                        (edu, idx) => (
                          <li key={idx}>
                            {edu.posgrado} ({edu.tiempoPosgrado})
                          </li>
                        )
                      )}
                    </ul>
                  </li>
                )}

                {/* Tecnología */}
                {processEducation(data.education).tecnologia.length > 0 && (
                  <li>
                    <strong>Tecnología:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {processEducation(data.education).tecnologia.map(
                        (tec, idx) => (
                          <li key={idx}>
                            {tec.tecnologia} ({tec.tiempoTecnologia})
                          </li>
                        )
                      )}
                    </ul>
                  </li>
                )}

                {/* Bachiller */}
                {processEducation(data.education).bachiller && (
                  <li>
                    <strong>Bachiller:</strong> {processEducation(data.education).bachiller}
                  </li>
                )}

                {/* Certificaciones */}
                {processEducation(data.education).certificacion.length > 0 && (
                  <li>
                    <strong>Certificaciones:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {processEducation(data.education).certificacion.map(
                        (cert, idx) => (
                          <li key={idx}>
                            {cert.certificacion} ({cert.tiempoCertificacion})
                          </li>
                        )
                      )}
                    </ul>
                  </li>
                )}

                {/* Licencias */}
                {processEducation(data.education).licencia.length > 0 && (
                  <li>
                    <strong>Licencias:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {processEducation(data.education).licencia.map(
                        (lic, idx) => (
                          <li key={idx}>
                            {lic.licencia} ({lic.tiempoLicencia})
                          </li>
                        )
                      )}
                    </ul>
                  </li>
                )}

                {/* Idiomas */}
                {processEducation(data.education).idioma.length > 0 && (
                  <li>
                    <strong>Idiomas:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {processEducation(data.education).idioma.map(
                        (idioma, idx) => (
                          <li key={idx}>
                            {idioma.idioma} ({idioma.tiempoIdioma})
                          </li>
                        )
                      )}
                    </ul>
                  </li>
                )}

                {/* Experiencia */}
                {processEducation(data.education).experiencia && (
                  <li>
                    <strong>Experiencia:</strong> {processEducation(data.education).experiencia}
                  </li>
                )}
              </ul>
            </div>

            {/* Conocimientos */}
            {data.knowledge && data.knowledge.length > 0 && (
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                  Conocimientos
                </h3>
                {data.knowledge.map((kn, idx) => (
                  <div key={idx} className="mb-2">
                    <p className="text-gray-700">
                      <strong>{kn.conocimiento}:</strong> {kn.descripcionConocimiento}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Competencias */}
            {data.competencies && data.competencies.length > 0 && (
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                  Competencias
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.competencies[0].competencias.map((comp, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-200 p-4 rounded-lg shadow hover:bg-gray-300 transition cursor-pointer"
                      onClick={() =>
                        setSelectedCompetency(
                          idx === selectedCompetency ? null : idx
                        )
                      }
                    >
                      <h4 className="text-xl font-medium text-blue-600">
                        {comp.descripcion}
                      </h4>
                      {selectedCompetency === idx && (
                        <p className="mt-2 text-gray-600">
                          <strong>Tipo:</strong> {comp.tipo} <br />
                          <strong>Grado:</strong> {comp.grado}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Beneficios */}
            {data.benefits && (
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                  Beneficios
                </h3>
                <p className="text-gray-700">{data.benefits}</p>
              </div>
            )}

            {/* Información de Contacto */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                Información de Contacto
              </h3>
              <p className="text-gray-700">Envía tu hoja de vida a:</p>
              <p className="text-gray-700">
                <strong>talentohumano@empresa.com</strong>
              </p>
              <p className="text-gray-700">Asunto: Inova EC-Postulacion a "escribir la vacante a que postula"</p>
            </div>

            {/* Detalles Adicionales */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                Detalles Adicionales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Localización */}
                <p className="text-gray-700">
                  <strong>Localización:</strong> {data.location}
                </p>
                {/* Horarios */}
                <p className="text-gray-700">
                  <strong>Horario:</strong> {data.schedule.start} - {data.schedule.end} (Break: {data.schedule.break})
                </p>
                {/* Número de Vacantes */}
                <p className="text-gray-700">
                  <strong>Número de Vacantes:</strong> {data.number_of_vacancies}
                </p>
                {/* Trabajo Remoto */}
                <p className="text-gray-700">
                  <strong>Trabajo Remoto:</strong> {data["work-from-home"]}
                </p>
                {/* Fecha de Apertura */}
                <p className="text-gray-700">
                  <strong>Fecha de Apertura:</strong> {new Date(data.opened_at).toLocaleDateString()}
                </p>
                {/* Deadline */}
                <p className="text-gray-700">
                  <strong>Fecha Límite:</strong> {new Date(data.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white text-center py-4">
          <p>&copy; {new Date().getFullYear()} Inova Solutions. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Botón para descargar */}
      <button
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        onClick={downloadAsImage}
      >
        Descargar como Imagen
      </button>

      {/* Mensaje de Carga */}
      {loading && (
        <div className="mt-4 text-gray-700">
          Cargando información...
        </div>
      )}

      {/* Mensaje de Error */}
      {error && (
        <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default AsistenteInformacion;
