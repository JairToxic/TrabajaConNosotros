'use client'

// components/FormularioPersona.js
import { useEffect, useState } from "react";
import { obtenerPersona } from "../services/simulado.Dao";



export default function FormularioEditable() {
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPersona() {
      try {
        const data = await obtenerPersona();
        setPersona(data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPersona();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersona({ ...persona, [name]: value });
  };

  if (loading) return <p className="text-center">Cargando datos...</p>;
  if (error) return <p className="text-center text-danger">Error: {error}</p>;
  if (!persona) return <p className="text-center text-warning">No se encontraron datos.</p>;

  return (
    <div>
      {/* Bootstrap CDN */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
        integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRNJAgN7+r6A1DEBiU/ePtTh/zJ7Ltm9IkjV7Lk3n"
        crossOrigin="anonymous"
      />

      {/* Estilo general */}
      <div className="container mt-5">
        <div className="row">
          {/* Imagen lateral */}
          <div className="col-md-5 d-none d-md-block">
            <div
              className="bg-image"
              style={{
                backgroundImage: `url('https://w7.pngwing.com/pngs/613/636/png-transparent-computer-icons-user-profile-male-avatar-avatar-heroes-logo-black-thumbnail.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100%",
                borderRadius: "10px 0 0 10px",
              }}
            ></div>
          </div>

          {/* Formulario */}
          <div className="col-md-7">
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white text-center">
                <h3>Formulario de Información</h3>
              </div>
              <div className="card-body">
                <form>
                  {/* Información Personal */}
                  <h4 className="text-primary mb-3">Información Personal</h4>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="id" className="form-label">
                        Nombre Completo:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="id"
                        name="id"
                        value={persona.id}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="cumpleaños" className="form-label">
                        Fecha de Nacimiento:
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="cumpleaños"
                        name="cumpleaños"
                        value={persona.cumpleaños}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <h4 className="text-primary mb-3">Información de Contacto</h4>
                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">
                      Dirección:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="direccion"
                      name="direccion"
                      value={persona.direccion}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label htmlFor="numeroTelefono" className="form-label">
                        Teléfono:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="numeroTelefono"
                        name="numeroTelefono"
                        value={persona.numeroTelefono}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="Correo" className="form-label">
                        Correo Electrónico:
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="Correo"
                        name="Correo"
                        value={persona.Correo}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Educación */}
                  <h4 className="text-primary mt-4">Educación</h4>
                  {persona.EducacionColegio.map((edu, index) => (
                    <div key={index} className="bg-light p-3 rounded mb-3">
                      <h5>{edu.NombreInstitucion}</h5>
                      <p>
                        <strong>Categoría:</strong> {edu.NombreCategoria}
                      </p>
                      <p>
                        <strong>Periodo:</strong> {edu.AñoInicio} - {edu.AñoFin}
                      </p>
                      <p>
                        <strong>Lugar:</strong> {edu.Lugar}
                      </p>
                    </div>
                  ))}

                  {/* Botones */}
                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary px-4">
                      Guardar Cambios
                    </button>
                    <button type="reset" className="btn btn-outline-secondary px-4 ms-2">
                      Restablecer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
