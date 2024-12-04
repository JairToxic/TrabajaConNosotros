'use client'
import { useState, useEffect } from 'react';
import './styles.css'; // Importa el archivo CSS con los estilos

// Función para obtener los datos de la persona
async function obtenerPersona() {
  try {
    const res = await fetch("http://localhost:5000/persona");
    if (!res.ok) {
      throw new Error("No se pudo obtener la persona");
    }
    const data = await res.json();
    return data; // El objeto persona está directamente en el primer nivel
  } catch (err) {
    console.error("Error al obtener la persona", err);
    throw err;
  }
}

const PersonalInformationForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    imagen1: '',
    cumpleaños: '',
    direccion: '',
    Nacionalidad: '',
    estadoCivil: '',
    numeroTelefono: '',
    Correo: '',
    EducacionColegio: [],
    EducacionDespues18: [],
    NombreCategoria: '',
    ListaCertificaciones: [],
    Expereincai: [],
    Lenguajes: [],
    Proyectos: [],
  });

  useEffect(() => {
    // Obtener los datos de la persona desde el API
    obtenerPersona()
      .then(data => {
        setFormData(data); // Aquí simplemente se asignan los datos completos al estado
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []); // Solo se ejecuta una vez al cargar el componente
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Formatear los datos a la estructura que espera el backend
    const dataToSend = {
      nombre: formData.id,
      id: formData.id,
      imagen1: formData.imagen1,
      cumpleaños: formData.cumpleaños,
      direccion: formData.direccion,
      Nacionalidad: formData.Nacionalidad,
      estadoCivil: formData.estadoCivil,
      numeroTelefono: formData.numeroTelefono,
      Correo: formData.Correo,
      EducacionColegio: formData.EducacionColegio.map((edu) => edu.NombreInstitucion).join(', '),
      EducacionDespues18: formData.EducacionDespues18.join(', '),
      NombreCategoria: formData.NombreCategoria,
      ListaCertificaciones: formData.ListaCertificaciones.map((cert) => cert.NombreCategoria).join(', '),
      ExpereincaiNombreEmpresa1: formData.Expereincai[0]?.NombreEmpresa || "",
      FechaTrabajo1: `${formData.Expereincai[0]?.AñoInicio || ''}-${formData.Expereincai[0]?.AñoFin || ''}`,
      CargoEmpresa1: formData.Expereincai[0]?.CargoEmpresa || "",
      DescripcionEmpresa1: formData.Expereincai[0]?.DescripcionEmpresa.join(', ') || "",
      ExpereincaiNombreEmpresa2: formData.Expereincai[1]?.NombreEmpresa || "",
      FechaTrabajo2: `${formData.Expereincai[1]?.AñoInicio || ''}-${formData.Expereincai[1]?.AñoFin || ''}`,
      CargoEmpresa2: formData.Expereincai[1]?.CargoEmpresa || "",
      DescripcionEmpresa2: formData.Expereincai[1]?.DescripcionEmpresa.join(', ') || "",
      ExpereincaiNombreEmpresa3: formData.Expereincai[2]?.NombreEmpresa || "",
      FechaTrabajo3: `${formData.Expereincai[2]?.AñoInicio || ''}-${formData.Expereincai[2]?.AñoFin || ''}`,
      CargoEmpresa3: formData.Expereincai[2]?.CargoEmpresa || "",
      DescripcionEmpresa3: formData.Expereincai[2]?.DescripcionEmpresa.join(', ') || "",
      Lenguaje1: formData.Lenguajes[0]?.Lenguaje || "",
      PorcentajeLenguaje1: formData.Lenguajes[0]?.Porcentaje || "",
      Lenguaje2: formData.Lenguajes[1]?.Lenguaje || "",
      PorcentajeLenguaje2: formData.Lenguajes[1]?.Porcentaje || "",
      Lenguaje3: formData.Lenguajes[2]?.Lenguaje || "",
      PorcentajeLenguaje3: formData.Lenguajes[2]?.Porcentaje || "",
      NameProyect1: formData.Proyectos[0]?.NombreProyecto || "",
      CustomerProyect1: formData.Proyectos[0]?.Cliente || "",
      RoleProyect1: formData.Proyectos[0]?.Rol || "",
      YearProyect1: formData.Proyectos[0]?.Año || "",
      TypeofProyect1: formData.Proyectos[0]?.TipoProyecto || "",
      PartnerProyect1: formData.Proyectos[0]?.Socio || "",
      NameProyect2: formData.Proyectos[1]?.NombreProyecto || "",
      CustomerProyect2: formData.Proyectos[1]?.Cliente || "",
      RoleProyect2: formData.Proyectos[1]?.Rol || "",
      YearProyect2: formData.Proyectos[1]?.Año || "",
      TypeofProyect2: formData.Proyectos[1]?.TipoProyecto || "",
      PartnerProyect2: formData.Proyectos[1]?.Socio || "",
    };
  
    try {
      const response = await fetch("http://127.0.0.1:5000/generate-doc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      // Verificar el tipo de contenido
      const contentType = response.headers.get('Content-Type');
      console.log('Content-Type:', contentType);
  
      if (!response.ok) {
        throw new Error('Error al generar el documento');
      }
  
      // Verificar si el archivo es un DOCX (no PDF)
      if (!contentType || !contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        throw new Error('El archivo generado no es un DOCX');
      }
  
      // Obtener el archivo binario (blob)
      const fileBlob = await response.blob();
  
      const fileUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'documento_generado.docx';  // Cambiar extensión a .docx
      link.click();
  
      // Eliminar la línea de "removeChild" ya que no es necesario eliminar el link
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error('Error al generar el documento:', error);
    }
  };
  

  return (
    <div className="form-container">
      <h1>Información Personal</h1>
      <form onSubmit={handleSubmit} className="form">
        {/* Información Personal */}
        <div className="form-section">
          <h2>Datos Personales</h2>
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Ej. Maria Perez"
            value={formData.id} // Aquí se usa directamente el id de la persona
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          />
          <label>Imagen de Perfil:</label>
          <input
            type="url"
            placeholder="URL de la imagen"
            value={formData.imagen1}
            onChange={(e) => setFormData({ ...formData, imagen1: e.target.value })}
          />
          <label>Cumpleaños:</label>
          <input
            type="date"
            value={formData.cumpleaños}
            onChange={(e) => setFormData({ ...formData, cumpleaños: e.target.value })}
          />
          <label>Dirección:</label>
          <input
            type="text"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          />
          <label>Nacionalidad:</label>
          <input
            type="text"
            value={formData.Nacionalidad}
            onChange={(e) => setFormData({ ...formData, Nacionalidad: e.target.value })}
          />
          <label>Estado Civil:</label>
          <select
            value={formData.estadoCivil}
            onChange={(e) => setFormData({ ...formData, estadoCivil: e.target.value })}
          >
            <option value="soltera">Soltera</option>
            <option value="casada">Casada</option>
            <option value="divorciada">Divorciada</option>
            <option value="viuda">Viuda</option>
          </select>
          <label>Número de Teléfono:</label>
          <input
            type="tel"
            value={formData.numeroTelefono}
            onChange={(e) => setFormData({ ...formData, numeroTelefono: e.target.value })}
          />
          <label>Correo Electrónico:</label>
          <input
            type="email"
            value={formData.Correo}
            onChange={(e) => setFormData({ ...formData, Correo: e.target.value })}
          />
        </div>

        {/* Educación */}
        <div className="form-section">
          <h2>Educación</h2>
          <label>Educación Previa a los 18 años:</label>
          {formData.EducacionColegio.map((edu, index) => (
            <div key={index}>
              <input
                type="text"
                value={edu.NombreInstitucion}
                onChange={(e) => {
                  const updatedEducation = [...formData.EducacionColegio];
                  updatedEducation[index].NombreInstitucion = e.target.value;
                  setFormData({ ...formData, EducacionColegio: updatedEducation });
                }}
                placeholder="Institución"
              />
              <input
                type="number"
                value={edu.AñoInicio}
                onChange={(e) => {
                  const updatedEducation = [...formData.EducacionColegio];
                  updatedEducation[index].AñoInicio = e.target.value;
                  setFormData({ ...formData, EducacionColegio: updatedEducation });
                }}
                placeholder="Año Inicio"
              />
              <input
                type="number"
                value={edu.AñoFin}
                onChange={(e) => {
                  const updatedEducation = [...formData.EducacionColegio];
                  updatedEducation[index].AñoFin = e.target.value;
                  setFormData({ ...formData, EducacionColegio: updatedEducation });
                }}
                placeholder="Año Fin"
              />
              <input
                type="text"
                value={edu.Lugar}
                onChange={(e) => {
                  const updatedEducation = [...formData.EducacionColegio];
                  updatedEducation[index].Lugar = e.target.value;
                  setFormData({ ...formData, EducacionColegio: updatedEducation });
                }}
                placeholder="Lugar"
              />
              <input
                type="text"
                value={edu.NombreCategoria}
                onChange={(e) => {
                  const updatedEducation = [...formData.EducacionColegio];
                  updatedEducation[index].NombreCategoria = e.target.value;
                  setFormData({ ...formData, EducacionColegio: updatedEducation });
                }}
                placeholder="Categoría"
              />
            </div>
          ))}
        </div>

        {/* Certificaciones */}
        <div className="form-section">
          <h2>Certificaciones</h2>
          {formData.ListaCertificaciones.map((cert, index) => (
            <div key={index}>
              <input
                type="text"
                value={cert.NombreCategoria}
                onChange={(e) => {
                  const updatedCertifications = [...formData.ListaCertificaciones];
                  updatedCertifications[index].NombreCategoria = e.target.value;
                  setFormData({ ...formData, ListaCertificaciones: updatedCertifications });
                }}
                placeholder="Certificación"
              />
              <input
                type="text"
                value={cert.NombreInstitucion}
                onChange={(e) => {
                  const updatedCertifications = [...formData.ListaCertificaciones];
                  updatedCertifications[index].NombreInstitucion = e.target.value;
                  setFormData({ ...formData, ListaCertificaciones: updatedCertifications });
                }}
                placeholder="Institución"
              />
            </div>
          ))}
        </div>

        {/* Experiencia */}
        <div className="form-section">
          <h2>Experiencia Laboral</h2>
          {formData.Expereincai.map((exp, index) => (
            <div key={index}>
              <input
                type="text"
                value={exp.NombreEmpresa}
                onChange={(e) => {
                  const updatedExperience = [...formData.Expereincai];
                  updatedExperience[index].NombreEmpresa = e.target.value;
                  setFormData({ ...formData, Expereincai: updatedExperience });
                }}
                placeholder="Empresa"
              />
              <input
                type="text"
                value={exp.CargoEmpresa}
                onChange={(e) => {
                  const updatedExperience = [...formData.Expereincai];
                  updatedExperience[index].CargoEmpresa = e.target.value;
                  setFormData({ ...formData, Expereincai: updatedExperience });
                }}
                placeholder="Cargo"
              />
              <textarea
                value={exp.DescripcionEmpresa.join(', ')}
                onChange={(e) => {
                  const updatedExperience = [...formData.Expereincai];
                  updatedExperience[index].DescripcionEmpresa = e.target.value.split(', ');
                  setFormData({ ...formData, Expereincai: updatedExperience });
                }}
                placeholder="Descripción"
              />
            </div>
          ))}
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default PersonalInformationForm;
