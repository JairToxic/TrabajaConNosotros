import React, { useEffect, useState } from 'react';
import './CVForm.css';

const CVForm = () => {
  const [cvData, setCvData] = useState({
    personalInfo: {
      nombre: '',
      apellido: '',
      cedula: '',
      nacionalidad: '',
      correo: '',
      telefono: [''],
      linkedIn: '',
      aspiracionSalarial: '',
      tiempoIngreso: '',
      diaNacimiento: '',
      estadoCivil: '',
      direccion: '',
      foto: '',
      genero: '',
      autoidentificacionEtcnica: '',
      discapacidad: { tieneDiscapacidad: false, tipo: '', porcentaje: '' },
      expectativasTrabajo: '',
      actividadesTiempoLibre: '',
      cantidadHijos: 0
    },
    educacion: {
      bachillerato: [{ grado: '', institucion: '', ano: '' }],
      educacionSuperiorNoUniversitaria: [{ grado: '', institucion: '', anoInicio: '', anoFin: '' }],
      educacionSuperior: [{ grado: '', institucion: '', anoInicio: '', anoFin: '' }],
      educacionDe4toNivel: [{ grado: '', institucion: '', anoInicio: '', anoFin: '' }]
    },
    certificaciones: [{ curso: '', entidad: '', ano: '' }],
    experienciaLaboral: [{
      empresa: '',
      lugar: '',
      fechaInicio: '',
      fechaFin: '',
      cargo: '',
      descripcionRol: '',
      remuneracionBruta: '',
      beneficios: '',
      referenciaLaboral: { nombre: '', cargo: '', telefono: '' }
    }],
    proyectosRelevantes: [{ proyecto: '', cliente: '', rol: '', ano: '', partner: '', descripcion: '' }],
    logrosRelevantes: [''],
    competencias: [''],
    idiomas: [{ idioma: '', fluidez: '', porcentaje: '' }],
    imagenes: [{ filename: '', path: '' }]
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar los datos al cargar el componente
  useEffect(() => {
    const fetchCVData = async () => {
      try {
        const response = await fetch('http://localhost:5000/cvs/cv123456', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener el CV');
        }

        const data = await response.json();
        setCvData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCVData();
  }, []);
  // Maneja el cambio de foto
const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedData = { ...cvData };
        updatedData.personalInfo.foto = reader.result; // Guardamos el URL de la foto
        setCvData(updatedData);
      };
      reader.readAsDataURL(file); // Leemos el archivo como una URL
    }
  };
  
  // Maneja la eliminación de la foto
  const handleRemoveFoto = () => {
    const updatedData = { ...cvData };
    updatedData.personalInfo.foto = ''; // Limpiamos la foto
    setCvData(updatedData);
  };
  
  
// Función para agregar un nuevo objeto a un array
const handleAddArrayItem = (field) => {
    const updatedData = { ...cvData };
    const newItem = field === 'idiomas'
      ? { idioma: '', fluidez: '', porcentaje: '' }
      : '';  // Puedes agregar objetos vacíos para otros campos de arrays como 'proyectosRelevantes', 'logrosRelevantes', etc.
  
    updatedData[field].push(newItem);
    setCvData(updatedData);
  };
  
  
  // Función para agregar un nuevo teléfono
const handleAddTelefono = () => {
    const updatedData = { ...cvData };
    updatedData.personalInfo.telefono.push('');  // Agrega un nuevo teléfono vacío
    setCvData(updatedData);
  };
// Función para eliminar un teléfono
const handleRemoveTelefono = (index) => {
    const updatedData = { ...cvData };
    updatedData.personalInfo.telefono.splice(index, 1);  // Elimina el teléfono en el índice especificado
    setCvData(updatedData);
  };  
  // Función para actualizar el teléfono en el array
const handleTelefonoChange = (e, index) => {
    const { value } = e.target;
    const updatedData = { ...cvData };
    updatedData.personalInfo.telefono[index] = value;  // Actualiza el teléfono en el índice correspondiente
    setCvData(updatedData);
  };
  // Función para eliminar un objeto de un array
  const handleRemoveArrayItem = (field, index) => {
    const updatedData = { ...cvData };
    updatedData[field].splice(index, 1);
    setCvData(updatedData);
  };

  
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setCvData(prevData => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          discapacidad: {
            ...prevData.personalInfo.discapacidad,
            [name]: checked // actualizamos si está marcado o no
          }
        }
      }));
    } else {
      setCvData(prevData => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          [name]: value
        }
      }));
    }
  };
  // Función para actualizar un campo específico dentro de un array
const handleExperienceChange = (e, index, field, subField) => {
    const { name, value } = e.target;
    const updatedData = { ...cvData };
  
    // Verificamos si el campo existe
    if (!updatedData[field] || !updatedData[field][index]) return;
  
    // Si se trata de un campo dentro de un subobjeto, lo actualizamos con subField
    if (subField) {
      updatedData[field][index][subField][name] = value;
    } else {
      updatedData[field][index][name] = value;
    }
  
    setCvData(updatedData);
  }
  // Función para agregar un nuevo objeto al array
const handleAddExperience = () => {
    const updatedData = { ...cvData };
    const newExperience = {
      empresa: '',
      lugar: '',
      fechaInicio: '',
      fechaFin: '',
      cargo: '',
      descripcionRol: '',
      remuneracionBruta: '',
      beneficios: '',
      referenciaLaboral: { nombre: '', cargo: '', telefono: '' }
    };
  
    updatedData.experienciaLaboral.push(newExperience);
    setCvData(updatedData);
  };
  
  // Función para eliminar un objeto del array
  const handleRemoveExperience = (index) => {
    const updatedData = { ...cvData };
    updatedData.experienciaLaboral.splice(index, 1);
    setCvData(updatedData);
  };

  const handleArrayChange = (e, index, field) => {
    const { name, value } = e.target;
    const updatedData = { ...cvData };
    updatedData[field][index][name] = value;
    setCvData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/cvs/cv123456', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cvData),
    })
    .then(response => response.json())
    .then(data => alert('CV actualizado con éxito!'))
    .catch(error => alert('Error al actualizar el CV: ' + error));
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <form className="cv-form" onSubmit={handleSubmit}>
      <h1>Editar CV</h1>

      {/* Datos Personales */}
      <h2>Datos Personales</h2>
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={cvData.personalInfo.nombre}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Apellido:</label>
        <input
          type="text"
          name="apellido"
          value={cvData.personalInfo.apellido}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Cédula:</label>
        <input
          type="text"
          name="cedula"
          value={cvData.personalInfo.cedula}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Nacionalidad:</label>
        <input
          type="text"
          name="nacionalidad"
          value={cvData.personalInfo.nacionalidad}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Correo:</label>
        <input
          type="email"
          name="correo"
          value={cvData.personalInfo.correo}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-group">
  <label>Teléfonos:</label>
  {cvData.personalInfo.telefono.map((telefono, index) => (
    <div key={index} className="telefono-input">
      <input
        type="text"
        name="telefono"
        value={telefono}
        onChange={(e) => handleTelefonoChange(e, index, 'telefono')}
        placeholder={`Teléfono ${index + 1}`}
      />
      <button
        type="button"
        onClick={() => handleRemoveTelefono('telefono', index)}
      >
        Eliminar Teléfono
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={() => handleAddTelefono('telefono')}
  >
    Añadir Teléfono
  </button>
</div>



      <div className="form-group">
        <label>LinkedIn:</label>
        <input
          type="url"
          name="linkedIn"
          value={cvData.personalInfo.linkedIn}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Aspiración Salarial:</label>
        <input
          type="text"
          name="aspiracionSalarial"
          value={cvData.personalInfo.aspiracionSalarial}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Tiempo de Ingreso:</label>
        <input
          type="text"
          name="tiempoIngreso"
          value={cvData.personalInfo.tiempoIngreso}
          onChange={handleInputChange}
        />
      </div>

      <div className="optional-info-message">
  <span className="icon">⚠️</span>
  <p>Te invitamos a llenar la siguiente información totalmente voluntaria y opcional, con la finalidad de administrarla en caso de que seas contratado.</p>
</div>

      <div className="form-group">
        <label>Fecha de Nacimiento:</label>
        <input
          type="date"
          name="diaNacimiento"
          value={cvData.personalInfo.diaNacimiento}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Estado Civil:</label>
        <input
          type="text"
          name="estadoCivil"
          value={cvData.personalInfo.estadoCivil}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Dirección:</label>
        <input
          type="text"
          name="direccion"
          value={cvData.personalInfo.direccion}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Género:</label>
        <input
          type="text"
          name="genero"
          value={cvData.personalInfo.genero}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
  <label>Foto:</label>
  <input
    type="file"
    name="foto"
    onChange={handleFotoChange}
    accept="image/*" // Asegura que solo se pueda seleccionar una imagen
  />
  {cvData.personalInfo.foto && (
    <div className="photo-preview">
      <img src={cvData.personalInfo.foto} alt="Foto del CV" />
      <button
        type="button"
        onClick={handleRemoveFoto}
      >
        Eliminar Foto
      </button>
    </div>
  )}
</div>


      <div className="form-group">
        <label>Autoidentificación Étnica:</label>
        <input
          type="text"
          name="autoidentificacionEtcnica"
          value={cvData.personalInfo.autoidentificacionEtcnica}
          onChange={handleInputChange}
        />
      </div>

            {/* Discapacidad */}
      <h3>Discapacidad</h3>
      <div className="form-group">
        <label>Tiene discapacidad:</label>
        <input
          type="checkbox"
          name="tieneDiscapacidad"
          checked={cvData.personalInfo.discapacidad.tieneDiscapacidad}
          onChange={handleInputChange}
        />
      </div>

      {cvData.personalInfo.discapacidad.tieneDiscapacidad && (
        <>
          <div className="form-group">
            <label>Tipo:</label>
            <input
              type="text"
              name="tipo"
              value={cvData.personalInfo.discapacidad.tipo}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Porcentaje:</label>
            <input
              type="text"
              name="porcentaje"
              value={cvData.personalInfo.discapacidad.porcentaje}
              onChange={handleInputChange}
            />
          </div>
        </>
         )}


      {/* Experiencia Laboral */}
      <h2>Experiencia Laboral</h2>
{cvData.experienciaLaboral.map((experiencia, index) => (
  <div key={index}>
    <h3>Experiencia {index + 1}</h3>

    <div className="form-group">
      <label>Empresa:</label>
      <input
        type="text"
        name="empresa"
        value={experiencia.empresa}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
      />
    </div>

    <div className="form-group">
      <label>Lugar:</label>
      <input
        type="text"
        name="lugar"
        value={experiencia.lugar}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
      />
    </div>

    <div className="form-group">
      <label>Fecha de Inicio:</label>
      <input
        type="month"
        name="fechaInicio"
        value={experiencia.fechaInicio}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
      />
    </div>

    <div className="form-group">
      <label>Fecha de Fin:</label>
      <input
        type="month"
        name="fechaFin"
        value={experiencia.fechaFin}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
      />
    </div>

    <div className="form-group">
      <label>Cargo:</label>
      <input
        type="text"
        name="cargo"
        value={experiencia.cargo}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
      />
    </div>

    <div className="form-group">
      <label>Descripción del Rol:</label>
      <textarea
        name="descripcionRol"
        value={experiencia.descripcionRol}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
      />
    </div>

    <div className="form-group">
      <label>Remuneración Bruta:</label>
      <input
        type="text"
        name="remuneracionBruta"
        value={experiencia.remuneracionBruta}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
      />
    </div>

    <div className="form-group">
      <label>Beneficios:</label>
      <input
        type="text"
        name="beneficios"
        value={experiencia.beneficios}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
      />
    </div>

    <div className="form-group">
      <label>Referencia Laboral - Nombre:</label>
      <input
        type="text"
        name="nombre"
        value={experiencia.referenciaLaboral.nombre}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral', 'referenciaLaboral')}
      />
    </div>

    <div className="form-group">
      <label>Referencia Laboral - Cargo:</label>
      <input
        type="text"
        name="cargo"
        value={experiencia.referenciaLaboral.cargo}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral', 'referenciaLaboral')}
      />
    </div>

    <div className="form-group">
      <label>Referencia Laboral - Teléfono:</label>
      <input
        type="text"
        name="telefono"
        value={experiencia.referenciaLaboral.telefono}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral', 'referenciaLaboral')}
      />
    </div>

    <button
      type="button"
      onClick={() => handleRemoveExperience(index)}
    >
      Eliminar Experiencia
    </button>
  </div>
))}

<button type="button" onClick={handleAddExperience}>
  Añadir Experiencia
</button>



      {/* Proyectos Relevantes */}
      {/* Proyectos Relevantes */}
<h2>Proyectos Relevantes</h2>
{cvData.proyectosRelevantes.map((proyecto, index) => (
  <div key={index}>
    <h3>Proyecto {index + 1}</h3>
    <div className="form-group">
      <label>Proyecto:</label>
      <input
        type="text"
        name="proyecto"
        value={proyecto.proyecto}
        onChange={(e) => handleArrayChange(e, index, 'proyectosRelevantes')}
      />
    </div>
    <div className="form-group">
      <label>Cliente:</label>
      <input
        type="text"
        name="cliente"
        value={proyecto.cliente}
        onChange={(e) => handleArrayChange(e, index, 'proyectosRelevantes')}
      />
    </div>
    <button
      type="button"
      onClick={() => handleRemoveArrayItem('proyectosRelevantes', index)}
    >
      Eliminar Proyecto
    </button>
  </div>
))}

<button type="button" onClick={() => handleAddArrayItem('proyectosRelevantes')}>
  Añadir Proyecto
</button>


      {/* Logros Relevantes */}
      <h2>Logros Relevantes</h2>
{cvData.logrosRelevantes.map((logro, index) => (
  <div key={index}>
    <div className="form-group">
      <label>Logro {index + 1}:</label>
      <input
        type="text"
        name="logro"
        value={logro}
        onChange={(e) => handleArrayChange(e, index, 'logrosRelevantes')}
      />
    </div>
    <button
      type="button"
      onClick={() => handleRemoveArrayItem('logrosRelevantes', index)}
    >
      Eliminar Logro
    </button>
  </div>
))}
<button type="button" onClick={() => handleAddArrayItem('logrosRelevantes')}>
  Añadir Logro
</button>


      {/* Competencias */}
      <h2>Competencias</h2>
{cvData.competencias.map((competencia, index) => (
  <div key={index}>
    <div className="form-group">
      <label>Competencia {index + 1}:</label>
      <input
        type="text"
        name="competencia"
        value={competencia}
        onChange={(e) => handleArrayChange(e, index, 'competencias')}
      />
    </div>
    <button
      type="button"
      onClick={() => handleRemoveArrayItem('competencias', index)}
    >
      Eliminar Competencia
    </button>
  </div>
))}
<button type="button" onClick={() => handleAddArrayItem('competencias')}>
  Añadir Competencia
</button>

    {/* Idiomas */}
<h2>Idiomas</h2>
{cvData.idiomas.map((idioma, index) => (
  <div key={index}>
    <div className="form-group">
      <label>Idioma {index + 1}:</label>
      <input
        type="text"
        name="idioma"
        value={idioma.idioma}
        onChange={(e) => handleArrayChange(e, index, 'idiomas')}
      />
    </div>
    <div className="form-group">
      <label>Fluidez:</label>
      <input
        type="text"
        name="fluidez"
        value={idioma.fluidez}
        onChange={(e) => handleArrayChange(e, index, 'idiomas')}
      />
    </div>
    <div className="form-group">
      <label>Porcentaje:</label>
      <input
        type="text"
        name="porcentaje"
        value={idioma.porcentaje}
        onChange={(e) => handleArrayChange(e, index, 'idiomas')}
      />
    </div>
    <button
      type="button"
      onClick={() => handleRemoveArrayItem('idiomas', index)}
    >
      Eliminar Idioma
    </button>
  </div>
))}

<button type="button" onClick={() => handleAddArrayItem('idiomas')}>
  Añadir Idioma
</button>

      <button type="submit" className="btn-submit">Actualizar CV</button>
    </form>
  );
};

export default CVForm;
