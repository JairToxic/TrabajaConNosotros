"use client";

import React, { useState } from "react";
import { toPng } from "html-to-image";

const jobCompetencies = [
  { title: "Habilidad Analítica" },
  { title: "Comunicación Efectiva" },
  { title: "Gestión del Tiempo" },
];

const AsistenteInformacion = () => {
  const [selectedCompetency, setSelectedCompetency] = useState(null);

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

  return (
    <div className="container">
      <div className="card" id="component-to-download">
        {/* Header */}
        <div className="header">
          <h1>TRABAJA CON NOSOTROS</h1>
        </div>

        {/* Banner */}
        <div className="banner">
          <img src="/banner.png" alt="Banner" className="banner-image" />
          <div className="banner-text">
            <h2>ASISTENTE DE INFORMACIÓN</h2>
            <p>ENFOQUE MERCHANDISING</p>
          </div>
        </div>

        {/* Responsabilidad General */}
        <div className="section">
          <h3>RESPONSABILIDAD GENERAL DEL PUESTO:</h3>
          <p>
            Garantizar la adecuada administración y análisis de información
            relacionada con los equipos de ejecución y procesos de
            merchandising.
          </p>
        </div>

        {/* Requisitos para Postulación */}
        <div className="section">
          <h3>REQUISITOS PARA POSTULACIÓN:</h3>
          <ul>
            <li>Experiencia en administración de información.</li>
            <li>Manejo de equipos de ejecución en campo, promoción de trade, mercaderistas y encuestadores.</li>
            <li>Manejo avanzado de Excel, PowerPoint y herramientas digitales.</li>
          </ul>
        </div>

        {/* Competencias */}
        <div className="section competencies">
          <h3>COMPETENCIAS:</h3>
          <div className="competency-grid">
            {jobCompetencies.map((competency, index) => (
              <div
                key={index}
                className="competency-item"
                onMouseEnter={() => setSelectedCompetency(index)}
                onMouseLeave={() => setSelectedCompetency(null)}
              >
                <h4>{competency.title}</h4>
                {selectedCompetency === index && (
                  <p className="competency-description">{competency.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="footer">
          <p>Envía tu hoja de vida a:</p>
          <p>
            <strong>talentohumano@empresa.com</strong>
          </p>
          <p>Asunto: ASISTENTE MERCHANDISING</p>
        </div>
      </div>

      {/* Botón para descargar */}
      <button className="download-button" onClick={downloadAsImage}>
        Descargar como Imagen
      </button>

      <style jsx>{`
        /* Global Container */
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa, #e9ecef);
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }

        /* Card Content */
        .card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          width: 100%;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        /* Header */
        .header {
          text-align: center;
          padding: 25px;
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
        }

        .header h1 {
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: 2px;
          margin: 0;
          text-transform: uppercase;
        }

        /* Banner */
        .banner {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
        }

        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(70%);
        }

        .banner-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
          z-index: 2;
        }

        .banner-text h2 {
          font-size: 2.5rem;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          margin-bottom: 10px;
        }

        .banner-text p {
          font-size: 1.2rem;
          font-weight: 300;
          letter-spacing: 3px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        /* Section */
        .section {
          padding: 25px;
          border-bottom: 1px solid #e9ecef;
        }

        .section h3 {
          font-size: 1.6rem;
          color: #2c3e50;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 3px solid #3498db;
        }

        .section p, .section ul {
          color: #495057;
          line-height: 1.6;
        }

        .section ul {
          list-style: none;
          padding: 0;
        }

        .section ul li {
          padding: 10px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .section ul li:last-child {
          border-bottom: none;
        }

        /* Competencies */
        .competency-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .competency-item {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .competency-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .competency-item h4 {
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 1.2rem;
        }

        .competency-description {
          font-size: 0.9rem;
          color: #6c757d;
          margin-top: 10px;
          max-height: 200px;
          overflow-y: auto;
        }

        /* Footer */
        .footer {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          text-align: center;
          padding: 25px;
        }

        .footer p {
          margin: 10px 0;
        }

        .footer strong {
          color: #f1c40f;
          font-size: 1.1rem;
        }

        /* Download Button */
        .download-button {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: bold;
          color: white;
          background: #3498db;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .download-button:hover {
          background: #2980b9;
        }
      `}</style>
    </div>
  );
};

export default AsistenteInformacion;
