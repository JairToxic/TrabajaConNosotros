'use client';
import JobCard from './JobCard';

export default function Home() {
  return (
    <div className="container">
      <h1>Vacantes Disponibles</h1>
      <div className="grid">
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
      </div>

      <style jsx>{`
        .container {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #ffffff; /* Fondo blanco */
          padding: 40px;
          min-height: 100vh;
        }
        h1 {
          color: #000000; /* Título en negro */
          margin-bottom: 20px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* Dos columnas */
          gap: 30px;
          justify-content: center;
          width: 100%;
          max-width: 800px; /* Limita el ancho máximo */
        }
        @media (min-width: 1200px) {
          .grid {
            max-width: 900px; /* Ajuste para pantallas grandes */
            gap: 40px; /* Mayor espacio entre tarjetas */
          }
        }
      `}</style>
    </div>
  );
}
