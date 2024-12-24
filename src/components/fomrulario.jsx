import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function GenerateDocForm() {
  const [formData, setFormData] = useState({
    nombre: 'Juan Pérez',
    id: '123456789',
    imagen1: 'https://w7.pngwing.com/pngs/993/650/png-transparent-user-profile-computer-icons-others-miscellaneous-black-profile-avatar.png',
    cumpleaños: '1990-05-15',
    direccion: 'Calle Ficticia 123, Ciudad X',
    Nacionalidad: 'Mexicana',
    estadoCivil: 'Soltero',
    numeroTelefono: '+52 123 456 7890',
    Correo: 'juan.perez@example.com',
    EducacionColegio: 'Preparatoria Nacional',
    EducacionDespues18: 'Licenciatura en Ingeniería de Software',
    NombreCategoria: 'Certificaciones Técnicas',
    ListaCertificaciones: 'Certificación en Python, Certificación en AWS',
    ExpereincaiNombreEmpresa1: 'TechCorp',
    FechaTrabajo1: '2015-2019',
    CargoEmpresa1: 'Desarrollador de Software',
    DescripcionEmpresa1: 'Desarrollo y mantenimiento de aplicaciones web.',
    ExpereincaiNombreEmpresa2: 'Innovatech',
    FechaTrabajo2: '2019-2023',
    CargoEmpresa2: 'Ingeniero de Software Senior',
    DescripcionEmpresa2: 'Liderazgo en proyectos de integración de IA.',
    ExpereincaiNombreEmpresa3: 'FutureTech',
    FechaTrabajo3: '2023-Presente',
    CargoEmpresa3: 'Arquitecto de Soluciones',
    DescripcionEmpresa3: 'Diseño de soluciones de software escalables.',
    Lenguaje1: 'Español',
    PorcentajeLenguaje1: '100',
    Lenguaje2: 'Inglés',
    PorcentajeLenguaje2: '90',
    Lenguaje3: 'Francés',
    PorcentajeLenguaje3: '50',
    NameProyect1: 'Sistema de Gestión de Inventarios',
    CustomerProyect1: 'Cliente A',
    RoleProyect1: 'Desarrollador Principal',
    YearProyect1: '2020',
    TypeofProyect1: 'Desarrollo de Software',
    PartnerProyect1: 'Empresa B',
    NameProyect2: 'Plataforma de Análisis de Datos',
    CustomerProyect2: 'Cliente B',
    RoleProyect2: 'Líder Técnico',
    YearProyect2: '2022',
    TypeofProyect2: 'Desarrollo de Software',
    PartnerProyect2: 'Empresa C'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/generate-doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Documento generado con éxito');
      } else {
        alert('Error al generar el documento: ' + result.error);
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
      alert('Hubo un error al intentar generar el documento');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Formulario de Generación de Documento</h2>
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Datos Personales</h5>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre:</label>
              <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="id" className="form-label">ID:</label>
              <input type="text" name="id" className="form-control" value={formData.id} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="imagen1" className="form-label">Imagen URL:</label>
              <input type="text" name="imagen1" className="form-control" value={formData.imagen1} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="cumpleaños" className="form-label">Cumpleaños:</label>
              <input type="date" name="cumpleaños" className="form-control" value={formData.cumpleaños} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="direccion" className="form-label">Dirección:</label>
              <input type="text" name="direccion" className="form-control" value={formData.direccion} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="Nacionalidad" className="form-label">Nacionalidad:</label>
              <input type="text" name="Nacionalidad" className="form-control" value={formData.Nacionalidad} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="estadoCivil" className="form-label">Estado Civil:</label>
              <input type="text" name="estadoCivil" className="form-control" value={formData.estadoCivil} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="numeroTelefono" className="form-label">Número de Teléfono:</label>
              <input type="tel" name="numeroTelefono" className="form-control" value={formData.numeroTelefono} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="Correo" className="form-label">Correo:</label>
              <input type="email" name="Correo" className="form-control" value={formData.Correo} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Educación</h5>
            <div className="mb-3">
              <label htmlFor="EducacionColegio" className="form-label">Educación (Colegio):</label>
              <input type="text" name="EducacionColegio" className="form-control" value={formData.EducacionColegio} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="EducacionDespues18" className="form-label">Educación (Después de los 18):</label>
              <input type="text" name="EducacionDespues18" className="form-control" value={formData.EducacionDespues18} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="NombreCategoria" className="form-label">Nombre de la Categoría:</label>
              <input type="text" name="NombreCategoria" className="form-control" value={formData.NombreCategoria} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="ListaCertificaciones" className="form-label">Lista de Certificaciones:</label>
              <input type="text" name="ListaCertificaciones" className="form-control" value={formData.ListaCertificaciones} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Experiencia Profesional</h5>
            {/* Empresa 1 */}
            <div className="mb-3">
              <label htmlFor="ExpereincaiNombreEmpresa1" className="form-label">Empresa 1:</label>
              <input type="text" name="ExpereincaiNombreEmpresa1" className="form-control" value={formData.ExpereincaiNombreEmpresa1} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="FechaTrabajo1" className="form-label">Fecha de Trabajo (Empresa 1):</label>
              <input type="text" name="FechaTrabajo1" className="form-control" value={formData.FechaTrabajo1} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="CargoEmpresa1" className="form-label">Cargo (Empresa 1):</label>
              <input type="text" name="CargoEmpresa1" className="form-control" value={formData.CargoEmpresa1} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="DescripcionEmpresa1" className="form-label">Descripción (Empresa 1):</label>
              <textarea name="DescripcionEmpresa1" className="form-control" rows="3" value={formData.DescripcionEmpresa1} onChange={handleChange}></textarea>
            </div>
            {/* Empresa 2 */}
            <div className="mb-3">
              <label htmlFor="ExpereincaiNombreEmpresa2" className="form-label">Empresa 2:</label>
              <input type="text" name="ExpereincaiNombreEmpresa2" className="form-control" value={formData.ExpereincaiNombreEmpresa2} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="FechaTrabajo2" className="form-label">Fecha de Trabajo (Empresa 2):</label>
              <input type="text" name="FechaTrabajo2" className="form-control" value={formData.FechaTrabajo2} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="CargoEmpresa2" className="form-label">Cargo (Empresa 2):</label>
              <input type="text" name="CargoEmpresa2" className="form-control" value={formData.CargoEmpresa2} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="DescripcionEmpresa2" className="form-label">Descripción (Empresa 2):</label>
              <textarea name="DescripcionEmpresa2" className="form-control" rows="3" value={formData.DescripcionEmpresa2} onChange={handleChange}></textarea>
            </div>
            {/* Empresa 3 */}
            <div className="mb-3">
              <label htmlFor="ExpereincaiNombreEmpresa3" className="form-label">Empresa 3:</label>
              <input type="text" name="ExpereincaiNombreEmpresa3" className="form-control" value={formData.ExpereincaiNombreEmpresa3} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="FechaTrabajo3" className="form-label">Fecha de Trabajo (Empresa 3):</label>
              <input type="text" name="FechaTrabajo3" className="form-control" value={formData.FechaTrabajo3} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="CargoEmpresa3" className="form-label">Cargo (Empresa 3):</label>
              <input type="text" name="CargoEmpresa3" className="form-control" value={formData.CargoEmpresa3} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="DescripcionEmpresa3" className="form-label">Descripción (Empresa 3):</label>
              <textarea name="DescripcionEmpresa3" className="form-control" rows="3" value={formData.DescripcionEmpresa3} onChange={handleChange}></textarea>
            </div>
          </div>
        </div>

        {/* Otros campos como idiomas y proyectos se agregan de forma similar */}
        <button type="submit" className="btn btn-primary">Generar Documento</button>
      </form>
    </div>
  );
}
