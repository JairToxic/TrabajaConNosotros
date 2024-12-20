'use client';
import { useState, useEffect } from 'react';
import JobCard from './JobCard';
import Image from 'next/image';

export default function Home() {
  const [isGridView, setIsGridView] = useState(true);
  const [jobs, setJobs] = useState([]); // Vacantes originales
  const [filteredJobs, setFilteredJobs] = useState([]); // Vacantes filtradas
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    schedule: '',
    level: '',
    relation: '',
  });

  // Fetch de los datos desde el JSON
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5001/jobs'); // Ruta al JSON
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data); // Inicialmente todas las vacantes están visibles
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchJobs();
  }, []);

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: value,
    }));
  };

  // Aplicar filtros al presionar el botón "Realizar la búsqueda"
  const applyFilters = (e) => {
    e.preventDefault();
    const filtered = jobs.filter((job) => {
      return (
        (filters.title === '' || job.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.location === '' || job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (filters.schedule === '' || job.schedule.toLowerCase().includes(filters.schedule.toLowerCase())) &&
        (filters.level === '' || job.level.toLowerCase().includes(filters.level.toLowerCase())) &&
        (filters.relation === '' || job.relation.toLowerCase().includes(filters.relation.toLowerCase()))
      );
    });
    setFilteredJobs(filtered);
  };

  return (
    <div>
      {/* Banner */}
      <div style={{ position: "relative", width: "100%", height: "350px" }}>
        <Image
          src="/banner.png"
          alt="Banner Equipo"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(33, 73, 142, 0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Únete a</h1>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>Nuestro Equipo</h1>
        </div>
      </div>

      {/* Formulario */}
      <div
        style={{
          backgroundColor: "#D0DBEA",
          padding: "30px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "900px",
          margin: "30px auto",
        }}
      >
        <h2 style={{ color: "#397FC7", textAlign: "center" }}>
          Encuentra el empleo que mejor se adapte a tus necesidades
        </h2>
        <form onSubmit={applyFilters}>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="title" style={{ display: "block", marginBottom: "8px" }}>Nombre del empleo:</label>
            <input
              id="title"
              type="text"
              placeholder="Buscar empleo por puesto o palabra clave"
              value={filters.title}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="location" style={{ display: "block", marginBottom: "8px" }}>Ubicación:</label>
            <input
              id="location"
              type="text"
              placeholder="Lugar del empleo"
              value={filters.location}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="schedule" style={{ display: "block", marginBottom: "8px" }}>Carga horaria:</label>
            <input
              id="schedule"
              type="text"
              placeholder="Carga horaria del empleo"
              value={filters.schedule}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="level" style={{ display: "block", marginBottom: "8px" }}>Nivel Laboral:</label>
            <input
              id="level"
              type="text"
              placeholder="Nivel laboral del empleo"
              value={filters.level}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="relation" style={{ display: "block", marginBottom: "8px" }}>Relación con la empresa:</label>
            <input
              id="relation"
              type="text"
              placeholder="Relación con la empresa del empleo"
              value={filters.relation}
              onChange={handleFilterChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#397FC7",
                color: "#fff",
                padding: "12px 30px",
                borderRadius: "5px",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Realizar la búsqueda
            </button>
          </div>
        </form>
      </div>

      {/* Contenedor de Vacantes */}
      <div className="container">
        <h1>Vacantes Disponibles</h1>
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={toggleView}
            style={{
              padding: "10px 20px",
              backgroundColor: "#397FC7",
              color: "#fff",
              borderRadius: "5px",
              cursor: "pointer",
              border: "none",
            }}
          >
            Cambiar vista
          </button>
        </div>

        <div className={isGridView ? "grid" : "list"}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) =>
              isGridView ? (
                <JobCard key={job.id} job={job} />
              ) : (
                <div className="job-list-item" key={job.id}>
                  <div className="job-image">
                    <Image src="/tarjeta.png" alt="Icono" width={100} height={100} />
                  </div>
                  <div className="job-details">
                    <h3>{job.title}</h3>
                    <p><strong>Ubicación:</strong> {job.location}</p>
                    <p><strong>Tipo:</strong> {job.schedule}</p>
                    <p><strong>Publicado el:</strong> {job.publishedDate}</p>
                    <p>{job.description}</p>
                  </div>
                </div>
              )
            )
          ) : (
            <p>No hay vacantes disponibles que coincidan con los filtros.</p>
          )}
        </div>
      </div>
    </div>
  );
}
