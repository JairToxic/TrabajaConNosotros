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
  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    nacionalidad: '',
    correo: '',
    telefono: [],
    linkedIn: '',
    aspiracionSalarial:'',
    tiempoIngreso:'',
    experienciaLaboral: [],
    proyectosRelevantes:[],
    logrosRelevantes: [],
    competencias: [],
    idiomas:[],

  });
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
  

  const addIdioma = (field) => {
    const updatedData = { ...cvData };
    updatedData[field].push({ idioma: '', fluidez: '', porcentaje: '' }); // Añadir un objeto vacío
    setCvData(updatedData);  // Actualizar el estado
  };
  const removeIdioma = (field, index) => {
    const updatedData = { ...cvData };
    updatedData[field].splice(index, 1);  // Elimina el item en el índice especificado
    setCvData(updatedData);  // Actualizar el estado
  };
  
  const handleIdiomaChange = (e, index, field) => {
    const { name, value } = e.target;
    const updatedData = { ...cvData };
  
    // Asegúrate de que el array 'idiomas' esté inicializado y contiene objetos
    if (!updatedData[field][index]) {
      updatedData[field][index] = { idioma: '', fluidez: '', porcentaje: '' }; // Inicializa los objetos si no existen
    }
  
    updatedData[field][index][name] = value;
  
    setCvData(updatedData); // Actualiza el estado
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
    const newTelefonos = [...cvData.personalInfo.telefono, ''];
    const newErrors = { ...errors, telefono: [...errors.telefono, ''] };
  
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, telefono: newTelefonos },
    }));
    setErrors(newErrors);
  };
  
  const handleRemoveTelefono = (name, index) => {
    const newTelefonos = cvData.personalInfo.telefono.filter((_, i) => i !== index);
    const newErrors = {
      ...errors,
      telefono: errors.telefono.filter((_, i) => i !== index),
    };
  
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, telefono: newTelefonos },
    }));
    setErrors(newErrors);
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
  
    // Asegúrate de que el array esté inicializado
    if (!updatedData[field]) {
      updatedData[field] = [];  // Si no existe el array, lo inicializamos como vacío
    }
  
    // Asegúrate de que cada elemento en el array sea una cadena de texto (y no un objeto)
    if (updatedData[field][index] === undefined) {
      updatedData[field][index] = ''; // Inicializamos como una cadena vacía
    }
  
    // Asignamos el valor directamente al campo correspondiente
    updatedData[field][index] = value;
  
    setCvData(updatedData); // Actualizamos el estado con los nuevos valores
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    let formValid = true;
    const newErrors = { ...errors };
  
    
    // Validación de campos obligatorios
    if (!cvData.personalInfo.nombre) {
      newErrors.nombre = 'El nombre es obligatorio.';
      formValid = false;
    } else {
      newErrors.nombre = '';
    }
  
    if (!cvData.personalInfo.apellido) {
      newErrors.apellido = 'El apellido es obligatorio.';
      formValid = false;
    } else {
      newErrors.apellido = '';
    }
  
    if (!cvData.personalInfo.cedula) {
      newErrors.cedula = 'La cédula es obligatoria.';
      formValid = false;
    } else {
      newErrors.cedula = '';
    }
  
    if (!cvData.personalInfo.nacionalidad) {
      newErrors.nacionalidad = 'La nacionalidad es obligatoria.';
      formValid = false;
    } else {
      newErrors.nacionalidad = '';
    }
  
    if (!cvData.personalInfo.correo) {
      newErrors.correo = 'El correo es obligatorio.';
      formValid = false;
    } else {
      newErrors.correo = '';
    }
    if (!cvData.personalInfo.linkedIn) {
        newErrors.linkedIn = 'El linkedin es obligatorio.';
        formValid = false;
      } else {
        newErrors.linkedIn = '';
      }
      if (!cvData.personalInfo.aspiracionSalarial) {
        newErrors.aspiracionSalarial = 'Aspiracion salarias es obligatorio.';
        formValid = false;
      } else {
        newErrors.aspiracionSalarial = '';
      }
      if (!cvData.personalInfo.tiempoIngreso) {
        newErrors.tiempoIngreso = 'El tiempo de ingreso es obligatorio.';
        formValid = false;
      } else {
        newErrors.tiempoIngreso = '';
      }

      // Validar los teléfonos
  const telefonoErrors = cvData.personalInfo.telefono.map((telefono) => {
    if (!telefono.trim()) {
      formValid = false;
      return 'El teléfono es obligatorio.';
    }
    return '';
  });

  newErrors.telefono = telefonoErrors;



  cvData.experienciaLaboral.forEach((experiencia, index) => {
    const experienciaErrors = {};

    if (!experiencia.empresa.trim()) {
      experienciaErrors.empresa = 'El campo Empresa es obligatorio.';
      formValid = false;
    }
    if (!experiencia.lugar.trim()) {
      experienciaErrors.lugar = 'El campo Lugar es obligatorio.';
      formValid = false;
    }
    if (!experiencia.fechaInicio) {
      experienciaErrors.fechaInicio = 'La Fecha de Inicio es obligatoria.';
      formValid = false;
    }
    if (!experiencia.fechaFin) {
      experienciaErrors.fechaFin = 'La Fecha de Fin es obligatoria.';
      formValid = false;
    }
    if (!experiencia.cargo.trim()) {
      experienciaErrors.cargo = 'El campo Cargo es obligatorio.';
      formValid = false;
    }
    if (!experiencia.descripcionRol.trim()) {
      experienciaErrors.descripcionRol = 'El campo Descripción del Rol es obligatorio.';
      formValid = false;
    }
    if (!experiencia.remuneracionBruta.trim()) {
      experienciaErrors.remuneracionBruta = 'El campo Remuneración Bruta es obligatorio.';
      formValid = false;
    }
    if (!experiencia.beneficios.trim()) {
      experienciaErrors.beneficios = 'El campo Beneficios es obligatorio.';
      formValid = false;
    }
    if (!experiencia.referenciaLaboral.nombre.trim()) {
      experienciaErrors.referenciaNombre = 'El Nombre de la Referencia es obligatorio.';
      formValid = false;
    }
    if (!experiencia.referenciaLaboral.cargo.trim()) {
      experienciaErrors.referenciaCargo = 'El Cargo de la Referencia es obligatorio.';
      formValid = false;
    }
    if (!experiencia.referenciaLaboral.telefono.trim()) {
      experienciaErrors.referenciaTelefono = 'El Teléfono de la Referencia es obligatorio.';
      formValid = false;
    }

    newErrors.experienciaLaboral[index] = experienciaErrors;
  });

// Validar los Proyectos Relevantes
const proyectosErrors = cvData.proyectosRelevantes.map((proyecto) => {
    const errors = {};
    if (!proyecto.proyecto || proyecto.proyecto.trim() === '') {
      errors.proyecto = 'El nombre del proyecto es obligatorio.';
      formValid = false;
    }
    if (!proyecto.cliente || proyecto.cliente.trim() === '') {
      errors.cliente = 'El nombre del cliente es obligatorio.';
      formValid = false;
    }
    return errors;
  });
  
  newErrors.proyectosRelevantes = proyectosErrors;

  // Validar logrosRelevantes
const logrosErrors = cvData.logrosRelevantes.map((logro) => {
    // Asegúrate de que logro.logro existe antes de llamar a trim()
    if (!logro?.logro?.trim()) {
      formValid = false;
      return { logro: 'El campo Logro es obligatorio.' };
    }
    return {}; // Si no hay error, devuelve un objeto vacío
  });
  
  newErrors.logrosRelevantes = logrosErrors;
  

// Validar competencias
const competenciasErrors = cvData.competencias.map((competencia) => {
    if (!competencia?.trim()) { // Validamos que el campo no esté vacío
      formValid = false;
      return 'El campo Competencia es obligatorio.';
    }
    return ''; // Si no hay error, se devuelve una cadena vacía
  });
  
  newErrors.competencias = competenciasErrors;

// Replace the existing idiomas validation with this:
const idiomasErrors = cvData.idiomas.map((idioma, index) => {
    const idiomaErrors = {};
  
    if (!idioma || typeof idioma !== 'object') {
      idiomaErrors.idioma = 'Datos de idioma inválidos.';
      formValid = false;
    } else {
      if (!idioma.idioma || idioma.idioma.trim() === '') {
        idiomaErrors.idioma = 'El idioma es obligatorio.';
        formValid = false;
      }
  
      if (!idioma.fluidez || idioma.fluidez.trim() === '') {
        idiomaErrors.fluidez = 'La fluidez es obligatoria.';
        formValid = false;
      }
  
      if (!idioma.porcentaje || idioma.porcentaje.trim() === '') {
        idiomaErrors.porcentaje = 'El porcentaje de fluidez es obligatorio.';
        formValid = false;
      }
    }
  
    return idiomaErrors;
  });
  
  newErrors.idiomas = idiomasErrors;

  

  setErrors(newErrors);
  
  
    if (formValid) {
      console.log("Formulario enviado con éxito");
    }




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
          className={errors.nombre ? 'error' : ''}
  />
  {errors.nombre && <p className="error-text">{errors.nombre}</p>}
</div>
      <div className="form-group">
        <label>Apellido:</label>
        <input
          type="text"
          name="apellido"
          value={cvData.personalInfo.apellido}
          onChange={handleInputChange}
          className={errors.apellido ? 'error' : ''}
          />
          {errors.apellido && <p className="error-text">{errors.apellido}</p>}
        </div>
      <div className="form-group">
        <label>Cédula:</label>
        <input
          type="text"
          name="cedula"
          value={cvData.personalInfo.cedula}
          onChange={handleInputChange}
          className={errors.cedula ? 'error' : ''}
          />
          {errors.cedula && <p className="error-text">{errors.cedula}</p>}
        </div>
      <div className="form-group">
        <label>Nacionalidad:</label>
        <input
          type="text"
          name="nacionalidad"
          value={cvData.personalInfo.nacionalidad}
          onChange={handleInputChange}
          className={errors.nacionalidad ? 'error' : ''}
          />
          {errors.nacionalidad && <p className="error-text">{errors.nacionalidad}</p>}
        </div>
      <div className="form-group">
        <label>Correo:</label>
        <input
          type="email"
          name="correo"
          value={cvData.personalInfo.correo}
          onChange={handleInputChange}
          className={errors.correo ? 'error' : ''}
          />
          {errors.correo && <p className="error-text">{errors.correo}</p>}
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
        className={errors.telefono[index] ? 'error' : ''}
        placeholder={`Teléfono ${index + 1}`}
      />
      {errors.telefono[index] && (
        <p className="error-text">{errors.telefono[index]}</p>
      )}
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
          className={errors.linkedIn ? 'error' : ''}
          />
          {errors.linkedIn && <p className="error-text">{errors.linkedIn}</p>}
        </div>
      <div className="form-group">
        <label>Aspiración Salarial:</label>
        <input
          type="text"
          name="aspiracionSalarial"
          value={cvData.personalInfo.aspiracionSalarial}
          onChange={handleInputChange}
          className={errors.aspiracionSalarial ? 'error' : ''}
          />
          {errors.aspiracionSalarial && <p className="error-text">{errors.aspiracionSalarial}</p>}
        </div>
      <div className="form-group">
        <label>Tiempo de Ingreso:</label>
        <input
          type="text"
          name="tiempoIngreso"
          value={cvData.personalInfo.tiempoIngreso}
          onChange={handleInputChange}
          className={errors.tiempoIngreso ? 'error' : ''}
          />
          {errors.tiempoIngreso && <p className="error-text">{errors.tiempoIngreso}</p>}
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
    className="file-input" // Si quieres aplicar más estilos personalizados al input
  />
  <label htmlFor="file-input" className="custom-button">
    Subir Foto
  </label>
  
  {cvData.personalInfo.foto && (
    <div className="image-display">
      <img 
        src={cvData.personalInfo.foto} 
        alt="Foto del CV" 
        className="preview-image"
      />
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
        className={errors.experienciaLaboral[index]?.empresa ? 'error' : ''}
      />
      {errors.experienciaLaboral[index]?.empresa && (
        <p className="error-text">{errors.experienciaLaboral[index].empresa}</p>
      )}
    </div>

    <div className="form-group">
      <label>Lugar:</label>
      <input
        type="text"
        name="lugar"
        value={experiencia.lugar}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
        className={errors.experienciaLaboral[index]?.lugar ? 'error' : ''}
      />
      {errors.experienciaLaboral[index]?.lugar && (
        <p className="error-text">{errors.experienciaLaboral[index].lugar}</p>
      )}
    </div>

    <div className="form-group">
      <label>Fecha de Inicio:</label>
      <input
        type="month"
        name="fechaInicio"
        value={experiencia.fechaInicio}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
        className={errors.experienciaLaboral[index]?.fechaInicio ? 'error' : ''}
      />
      {errors.experienciaLaboral[index]?.fechaInicio && (
        <p className="error-text">{errors.experienciaLaboral[index].fechaInicio}</p>
      )}
    </div>

    <div className="form-group">
      <label>Fecha de Fin:</label>
      <input
        type="month"
        name="fechaFin"
        value={experiencia.fechaFin}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
        className={errors.experienciaLaboral[index]?.fechaFin ? 'error' : ''}
      />
      {errors.experienciaLaboral[index]?.fechaFin && (
        <p className="error-text">{errors.experienciaLaboral[index].fechaFin}</p>
      )}
    </div>

    <div className="form-group">
      <label>Cargo:</label>
      <input
        type="text"
        name="cargo"
        value={experiencia.cargo}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
        className={errors.experienciaLaboral[index]?.cargo ? 'error' : ''}
      />
      {errors.experienciaLaboral[index]?.cargo && (
        <p className="error-text">{errors.experienciaLaboral[index].cargo}</p>
      )}
    </div>

    <div className="form-group">
      <label>Descripción del Rol:</label>
      <textarea
        name="descripcionRol"
        value={experiencia.descripcionRol}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
        className={errors.experienciaLaboral[index]?.descripcionRol ? 'error' : ''}
      />
      {errors.experienciaLaboral[index]?.descripcionRol && (
        <p className="error-text">{errors.experienciaLaboral[index].descripcionRol}</p>
      )}
    </div>

    <div className="form-group">
      <label>Remuneración Bruta:</label>
      <input
        type="text"
        name="remuneracionBruta"
        value={experiencia.remuneracionBruta}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
        className={errors.experienciaLaboral[index]?.remuneracionBruta ? 'error' : ''}
      />
      {errors.experienciaLaboral[index]?.remuneracionBruta && (
        <p className="error-text">{errors.experienciaLaboral[index].remuneracionBruta}</p>
      )}
    </div>

    <div className="form-group">
      <label>Beneficios:</label>
      <input
        type="text"
        name="beneficios"
        value={experiencia.beneficios}
        onChange={(e) => handleExperienceChange(e, index, 'experienciaLaboral')}
        className={errors.experienciaLaboral[index]?.beneficios ? 'error' : ''}
      />
      {errors.experienciaLaboral[index]?.beneficios && (
        <p className="error-text">{errors.experienciaLaboral[index].beneficios}</p>
      )}
    </div>

    <div className="form-group">
      <label>Referencia Laboral - Nombre:</label>
      <input
        type="text"
        name="nombre"
        value={experiencia.referenciaLaboral.nombre}
        onChange={(e) =>
          handleExperienceChange(e, index, 'experienciaLaboral', 'referenciaLaboral')
        }
        className={errors.experienciaLaboral[index]?.referenciaNombre ? 'error' : ''}
      />
      {errors.experienciaLaboral[index]?.referenciaNombre && (
        <p className="error-text">{errors.experienciaLaboral[index].referenciaNombre}</p>
      )}
    </div>

    <div className="form-group">
      <label>Referencia Laboral - Cargo:</label>
      <input
        type="text"
        name="cargo"
        value={experiencia.referenciaLaboral.cargo}
        onChange={(e) =>
          handleExperienceChange(e, index, 'experienciaLaboral', 'referenciaLaboral')
        }
        className={errors.experienciaLaboral[index]?.referenciaCargo ? 'error' : ''}
      />
      {errors.experienciaLaboral[index]?.referenciaCargo && (
        <p className="error-text">{errors.experienciaLaboral[index].referenciaCargo}</p>
      )}
    </div>

    <div className="form-group">
      <label>Referencia Laboral - Teléfono:</label>
      <input
        type="text"
        name="telefono"
        value={experiencia.referenciaLaboral.telefono}
        onChange={(e) =>
          handleExperienceChange(e, index, 'experienciaLaboral', 'referenciaLaboral')
        }
        className={errors.experienciaLaboral[index]?.referenciaTelefono ? 'error' : ''}
      />
      {errors.experienciaLaboral[index]?.referenciaTelefono && (
        <p className="error-text">{errors.experienciaLaboral[index].referenciaTelefono}</p>
      )}
    </div>

    <button type="button" onClick={() => handleRemoveExperience(index)}>
      Eliminar Experiencia
    </button>
  </div>
))}


<button type="button" onClick={handleAddExperience}>
  Añadir Experiencia
</button>



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
        className={errors.proyectosRelevantes[index]?.proyecto ? 'error' : ''}
      />
      {errors.proyectosRelevantes[index]?.proyecto && (
        <p className="error-text">{errors.proyectosRelevantes[index].proyecto}</p>
      )}
    </div>

    <div className="form-group">
      <label>Cliente:</label>
      <input
        type="text"
        name="cliente"
        value={proyecto.cliente}
        onChange={(e) => handleArrayChange(e, index, 'proyectosRelevantes')}
        className={errors.proyectosRelevantes[index]?.cliente ? 'error' : ''}
      />
      {errors.proyectosRelevantes[index]?.cliente && (
        <p className="error-text">{errors.proyectosRelevantes[index].cliente}</p>
      )}
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
        value={logro.logro || ''} // Asegura que el valor exista
        onChange={(e) => handleArrayChange(e, index, 'logrosRelevantes')}
        className={errors.logrosRelevantes[index]?.logro ? 'error' : ''}
      />
      {errors.logrosRelevantes[index]?.logro && (
        <p className="error-text">{errors.logrosRelevantes[index].logro}</p>
      )}
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


<h2>Competencias</h2>
{cvData.competencias.map((competencia, index) => (
  <div key={index}>
    <div className="form-group">
      <label>Competencia {index + 1}:</label>
      <input
        type="text"
        name="competencia"
        value={competencia}  // Aquí se espera una cadena de texto
        onChange={(e) => handleArrayChange(e, index, 'competencias')}
        className={errors.competencias[index] ? 'error' : ''}  // Aplica error si corresponde
      />
      {errors.competencias[index] && (
        <p className="error-text">{errors.competencias[index]}</p>  // Muestra el error si existe
      )}
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
        className={errors.idiomas?.[index]?.idioma ? 'error' : ''}  // Clase para error
      />
      {errors.idiomas?.[index]?.idioma && (
        <p className="error-text">{errors.idiomas[index].idioma}</p>
      )}
    </div>

    <div className="form-group">
      <label>Fluidez:</label>
      <input
        type="text"
        name="fluidez"
        value={idioma.fluidez}
        onChange={(e) => handleArrayChange(e, index, 'idiomas')}
        className={errors.idiomas?.[index]?.fluidez ? 'error' : ''}  // Clase para error
      />
      {errors.idiomas?.[index]?.fluidez && (
        <p className="error-text">{errors.idiomas[index].fluidez}</p>
      )}
    </div>

    <div className="form-group">
      <label>Porcentaje:</label>
      <input
        type="text"
        name="porcentaje"
        value={idioma.porcentaje}
        onChange={(e) => handleArrayChange(e, index, 'idiomas')}
        className={errors.idiomas?.[index]?.porcentaje ? 'error' : ''}  // Clase para error
      />
      {errors.idiomas?.[index]?.porcentaje && (
        <p className="error-text">{errors.idiomas[index].porcentaje}</p>
      )}
    </div>

    <button
      type="button"
      onClick={() => removeIdioma('idiomas', index)}
    >
      Eliminar Idioma
    </button>
  </div>
))}

<button type="button" onClick={() => addIdioma('idiomas')}>
  Añadir Idioma
</button>

<button type="submit" className="btn-submit">Actualizar CV</button>

    </form>
  );
};

export default CVForm;
