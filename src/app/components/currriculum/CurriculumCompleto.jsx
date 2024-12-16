import React, { useEffect, useState } from 'react';
import './CVForm.css';
import Cookies from 'js-cookie';
 
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
    idiomas:[]
  });

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        const response = await fetch('http://51.222.110.107:5012/applicant/get_cv/12', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': '7zXnBjF5PBl7EzG/WhATQw=='  // Aquí añades la cabecera Authorization
          }
        });
  
        if (!response.ok) {
          throw new Error('No se pudo obtener el CV');
        }
  
        const data = await response.json();
        setCvData(data);
        const savedCv = Cookies.get('cv');
        console.log(savedCv)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCVData();
  }, []);
  

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedData = { ...cvData };
        updatedData.personalInfo.foto = reader.result;
        setCvData(updatedData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFoto = () => {
    const updatedData = { ...cvData };
    updatedData.personalInfo.foto = '';
    setCvData(updatedData);
  };

  // Funciones genéricas para manejo de arrays simples y de objetos dentro de cvData
  const handleAddArrayItem = (field, newItem) => {
    const updatedData = { ...cvData };
    updatedData[field].push(newItem);
    setCvData(updatedData);
  };

  const handleRemoveArrayItem = (field, index) => {
    const updatedData = { ...cvData };
    updatedData[field].splice(index, 1);
    setCvData(updatedData);
  };

  const handleArrayChange = (e, index, field) => {
    const { name, value } = e.target;
    const updatedData = { ...cvData };

    if (!updatedData[field]) {
      updatedData[field] = [];
    }

    // Determinar si es array de objetos o de strings
    if (typeof updatedData[field][index] === 'object') {
      updatedData[field][index][name] = value;
    } else {
      // Array de strings (como logrosRelevantes o competencias)
      updatedData[field][index] = value;
    }

    setCvData(updatedData);
  };

  // Manejo especial para teléfonos dentro de personalInfo
  const handleAddTelefono = () => {
    const updatedData = { ...cvData };
    updatedData.personalInfo.telefono.push('');
    setCvData(updatedData);

    const newErrors = { ...errors };
    newErrors.telefono.push('');
    setErrors(newErrors);
  };

  const handleRemoveTelefono = (index) => {
    const updatedData = { ...cvData };
    updatedData.personalInfo.telefono.splice(index, 1);
    setCvData(updatedData);

    const newErrors = { ...errors };
    newErrors.telefono.splice(index, 1);
    setErrors(newErrors);
  };

  const handleTelefonoChange = (e, index) => {
    const { value } = e.target;
    const updatedData = { ...cvData };
    updatedData.personalInfo.telefono[index] = value;
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
            [name]: checked 
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

  // Manejo de educación
  const handleAddEntry = (category) => {
    const newEntry = category === 'bachillerato'
      ? { grado: '', institucion: '', ano: '' }
      : { grado: '', institucion: '', anoInicio: '', anoFin: '' };

    const updatedData = { ...cvData };
    updatedData.educacion[category].push(newEntry);
    setCvData(updatedData);
  };

  const handleRemoveEntry = (category, index) => {
    const updatedData = { ...cvData };
    updatedData.educacion[category].splice(index, 1);
    setCvData(updatedData);
  };

  const handleChangeEducacion = (category, index, field, value) => {
    const updatedData = { ...cvData };
    updatedData.educacion[category][index][field] = value;
    setCvData(updatedData);
  };

  // Experiencia laboral
  const handleExperienceChange = (e, index, field, subField) => {
    const { name, value } = e.target;
    const updatedData = { ...cvData };

    if (!updatedData[field] || !updatedData[field][index]) return;
    
    if (subField) {
      updatedData[field][index][subField][name] = value;
    } else {
      updatedData[field][index][name] = value;
    }

    setCvData(updatedData);
  };

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

  const handleRemoveExperience = (index) => {
    const updatedData = { ...cvData };
    updatedData.experienciaLaboral.splice(index, 1);
    setCvData(updatedData);
  };

  const validateForm = () => {
    let formValid = true;
    const newErrors = { ...errors };

    const trimString = (value) => String(value || '').trim();

    // Validaciones datos personales
    if (!trimString(cvData.personalInfo.nombre)) {
      newErrors.nombre = 'El nombre es obligatorio.';
      formValid = false;
    } else {
      newErrors.nombre = '';
    }

    if (!trimString(cvData.personalInfo.apellido)) {
      newErrors.apellido = 'El apellido es obligatorio.';
      formValid = false;
    } else {
      newErrors.apellido = '';
    }

    if (!trimString(cvData.personalInfo.cedula)) {
      newErrors.cedula = 'La cédula es obligatoria.';
      formValid = false;
    } else {
      newErrors.cedula = '';
    }

    if (!trimString(cvData.personalInfo.nacionalidad)) {
      newErrors.nacionalidad = 'La nacionalidad es obligatoria.';
      formValid = false;
    } else {
      newErrors.nacionalidad = '';
    }

    if (!trimString(cvData.personalInfo.correo)) {
      newErrors.correo = 'El correo es obligatorio.';
      formValid = false;
    } else {
      newErrors.correo = '';
    }

    if (!trimString(cvData.personalInfo.linkedIn)) {
      newErrors.linkedIn = 'El linkedin es obligatorio.';
      formValid = false;
    } else {
      newErrors.linkedIn = '';
    }

    if (!trimString(cvData.personalInfo.aspiracionSalarial)) {
      newErrors.aspiracionSalarial = 'La aspiración salarial es obligatoria.';
      formValid = false;
    } else {
      newErrors.aspiracionSalarial = '';
    }

    if (!trimString(cvData.personalInfo.tiempoIngreso)) {
      newErrors.tiempoIngreso = 'El tiempo de ingreso es obligatorio.';
      formValid = false;
    } else {
      newErrors.tiempoIngreso = '';
    }

    // Validar teléfonos
    const telefonoErrors = cvData.personalInfo.telefono.map((tel) => {
      if (!trimString(tel)) {
        formValid = false;
        return 'El teléfono es obligatorio.';
      }
      return '';
    });
    newErrors.telefono = telefonoErrors;

    // Validar experiencia laboral
    const expErrors = cvData.experienciaLaboral.map((exp) => {
      const eErr = {};
      if (!trimString(exp.empresa)) {
        eErr.empresa = 'El campo Empresa es obligatorio.';
        formValid = false;
      }
      if (!trimString(exp.lugar)) {
        eErr.lugar = 'El campo Lugar es obligatorio.';
        formValid = false;
      }
      if (!exp.fechaInicio) {
        eErr.fechaInicio = 'La Fecha de Inicio es obligatoria.';
        formValid = false;
      }
      if (!exp.fechaFin) {
        eErr.fechaFin = 'La Fecha de Fin es obligatoria.';
        formValid = false;
      }
      if (!trimString(exp.cargo)) {
        eErr.cargo = 'El campo Cargo es obligatorio.';
        formValid = false;
      }
      if (!trimString(exp.descripcionRol)) {
        eErr.descripcionRol = 'La Descripción del Rol es obligatoria.';
        formValid = false;
      }
      if (!trimString(exp.remuneracionBruta)) {
        eErr.remuneracionBruta = 'La Remuneración Bruta es obligatoria.';
        formValid = false;
      }
      if (!trimString(exp.beneficios)) {
        eErr.beneficios = 'El campo Beneficios es obligatorio.';
        formValid = false;
      }
      if (!trimString(exp.referenciaLaboral.nombre)) {
        eErr.referenciaNombre = 'El Nombre de la Referencia es obligatorio.';
        formValid = false;
      }
      if (!trimString(exp.referenciaLaboral.cargo)) {
        eErr.referenciaCargo = 'El Cargo de la Referencia es obligatorio.';
        formValid = false;
      }
      if (!trimString(exp.referenciaLaboral.telefono)) {
        eErr.referenciaTelefono = 'El Teléfono de la Referencia es obligatorio.';
        formValid = false;
      }
      return eErr;
    });
    newErrors.experienciaLaboral = expErrors;

    // Validar proyectosRelevantes
    const proyectosErrors = cvData.proyectosRelevantes.map((proy) => {
      const pErr = {};
      if (!trimString(proy.proyecto)) {
        pErr.proyecto = 'El nombre del proyecto es obligatorio.';
        formValid = false;
      }
      if (!trimString(proy.cliente)) {
        pErr.cliente = 'El nombre del cliente es obligatorio.';
        formValid = false;
      }
      if (!trimString(proy.rol)) {
        pErr.rol = 'El rol es obligatorio.';
        formValid = false;
      }
      if (!trimString(proy.ano)) {
        pErr.ano = 'El año es obligatorio.';
        formValid = false;
      }
      if (!trimString(proy.partner)) {
        pErr.partner = 'El partner es obligatorio.';
        formValid = false;
      }
      if (!trimString(proy.descripcion)) {
        pErr.descripcion = 'La descripción es obligatoria.';
        formValid = false;
      }
      return pErr;
    });
    newErrors.proyectosRelevantes = proyectosErrors;

    // Validar logrosRelevantes (array de strings)
    const logrosErrors = cvData.logrosRelevantes.map((logro) => {
      if (!trimString(logro)) {
        formValid = false;
        return { logro: 'El campo Logro es obligatorio.' };
      }
      return {};
    });
    newErrors.logrosRelevantes = logrosErrors;

    // Validar competencias (array de strings)
    const competenciasErrors = cvData.competencias.map((comp) => {
      if (!trimString(comp)) {
        formValid = false;
        return 'El campo Competencia es obligatorio.';
      }
      return '';
    });
    newErrors.competencias = competenciasErrors;

    // Validar idiomas (array de objetos)
    const idiomasErrors = cvData.idiomas.map((idioma) => {
      const iErr = {};
      if (!trimString(idioma.idioma)) {
        iErr.idioma = 'El idioma es obligatorio.';
        formValid = false;
      }
      if (!trimString(idioma.fluidez)) {
        iErr.fluidez = 'La fluidez es obligatoria.';
        formValid = false;
      }
      if (!trimString(idioma.porcentaje)) {
        iErr.porcentaje = 'El porcentaje de fluidez es obligatorio.';
        formValid = false;
      }
      return iErr;
    });
    newErrors.idiomas = idiomasErrors;

    setErrors(newErrors);
    return formValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    fetch('http://51.222.110.107:5012/applicant/update_cv/12', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': '7zXnBjF5PBl7EzG/WhATQw=='
      },
      body: JSON.stringify(cvData),
    })
    .then(response => {
      if(!response.ok) throw new Error("Error al actualizar el CV");
      return response.json();
    })
    .then(data => alert('CV actualizado con éxito!'))
    .catch(error => alert('Error al actualizar el CV: ' + error));
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <form className="cv-form" onSubmit={handleSubmit}>
      <h1>Editar CV</h1>

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
              value={telefono}
              onChange={(e) => handleTelefonoChange(e, index)}
              className={errors.telefono[index] ? 'error' : ''}
              placeholder={`Teléfono ${index + 1}`}
            />
            {errors.telefono[index] && (
              <p className="error-text">{errors.telefono[index]}</p>
            )}
            <button
              type="button"
              onClick={() => handleRemoveTelefono(index)}
            >
              Eliminar Teléfono
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddTelefono}
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
          accept="image/*"
          className="file-input"
        />
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
              onChange={(e) =>
                setCvData(prevData => ({
                  ...prevData,
                  personalInfo: {
                    ...prevData.personalInfo,
                    discapacidad: {
                      ...prevData.personalInfo.discapacidad,
                      tipo: e.target.value
                    }
                  }
                }))
              }
            />
          </div>
          <div className="form-group">
            <label>Porcentaje:</label>
            <input
              type="text"
              name="porcentaje"
              value={cvData.personalInfo.discapacidad.porcentaje}
              onChange={(e) =>
                setCvData(prevData => ({
                  ...prevData,
                  personalInfo: {
                    ...prevData.personalInfo,
                    discapacidad: {
                      ...prevData.personalInfo.discapacidad,
                      porcentaje: e.target.value
                    }
                  }
                }))
              }
            />
          </div>
        </>
      )}

      {/* Educación */}
      <h2>Educación</h2>
      {Object.keys(cvData.educacion).map((category) => (
        <div key={category}>
          <h3>{category.replace(/([A-Z])/g, ' $1')}</h3>
          {cvData.educacion[category].map((entry, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Grado"
                value={entry.grado}
                onChange={(e) => handleChangeEducacion(category, index, 'grado', e.target.value)}
              />
              <input
                type="text"
                placeholder="Institución"
                value={entry.institucion}
                onChange={(e) => handleChangeEducacion(category, index, 'institucion', e.target.value)}
              />
              {category !== 'bachillerato' && (
                <>
                  <input
                    type="text"
                    placeholder="Año Inicio"
                    value={entry.anoInicio || ''}
                    onChange={(e) => handleChangeEducacion(category, index, 'anoInicio', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Año Fin"
                    value={entry.anoFin || ''}
                    onChange={(e) => handleChangeEducacion(category, index, 'anoFin', e.target.value)}
                  />
                </>
              )}
              {category === 'bachillerato' && (
                <input
                  type="text"
                  placeholder="Año"
                  value={entry.ano}
                  onChange={(e) => handleChangeEducacion(category, index, 'ano', e.target.value)}
                />
              )}
              <button type="button" onClick={() => handleRemoveEntry(category, index)}>Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddEntry(category)}>Añadir {category}</button>
        </div>
      ))}

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

          <input
            type="text"
            name="proyecto"
            value={proyecto.proyecto}
            onChange={(e) => handleArrayChange(e, index, 'proyectosRelevantes')}
            className={errors.proyectosRelevantes[index]?.proyecto ? 'error' : ''}
            placeholder="Proyecto"
          />
          {errors.proyectosRelevantes[index]?.proyecto && (
            <p className="error-text">{errors.proyectosRelevantes[index].proyecto}</p>
          )}

          <input
            type="text"
            name="cliente"
            value={proyecto.cliente}
            onChange={(e) => handleArrayChange(e, index, 'proyectosRelevantes')}
            className={errors.proyectosRelevantes[index]?.cliente ? 'error' : ''}
            placeholder="Cliente"
          />
          {errors.proyectosRelevantes[index]?.cliente && (
            <p className="error-text">{errors.proyectosRelevantes[index].cliente}</p>
          )}

          <input
            type="text"
            name="rol"
            value={proyecto.rol}
            onChange={(e) => handleArrayChange(e, index, 'proyectosRelevantes')}
            className={errors.proyectosRelevantes[index]?.rol ? 'error' : ''}
            placeholder="Rol"
          />
          {errors.proyectosRelevantes[index]?.rol && (
            <p className="error-text">{errors.proyectosRelevantes[index].rol}</p>
          )}

          <input
            type="text"
            name="ano"
            value={proyecto.ano}
            onChange={(e) => handleArrayChange(e, index, 'proyectosRelevantes')}
            className={errors.proyectosRelevantes[index]?.ano ? 'error' : ''}
            placeholder="Año"
          />
          {errors.proyectosRelevantes[index]?.ano && (
            <p className="error-text">{errors.proyectosRelevantes[index].ano}</p>
          )}

          <input
            type="text"
            name="partner"
            value={proyecto.partner}
            onChange={(e) => handleArrayChange(e, index, 'proyectosRelevantes')}
            className={errors.proyectosRelevantes[index]?.partner ? 'error' : ''}
            placeholder="Partner"
          />
          {errors.proyectosRelevantes[index]?.partner && (
            <p className="error-text">{errors.proyectosRelevantes[index].partner}</p>
          )}

          <input
            type="text"
            name="descripcion"
            value={proyecto.descripcion}
            onChange={(e) => handleArrayChange(e, index, 'proyectosRelevantes')}
            className={errors.proyectosRelevantes[index]?.descripcion ? 'error' : ''}
            placeholder="Descripción"
          />
          {errors.proyectosRelevantes[index]?.descripcion && (
            <p className="error-text">{errors.proyectosRelevantes[index].descripcion}</p>
          )}

          <button
            type="button"
            onClick={() => handleRemoveArrayItem('proyectosRelevantes', index)}
          >
            Eliminar Proyecto
          </button>
        </div>
      ))}

      <button type="button" onClick={() => handleAddArrayItem('proyectosRelevantes', { proyecto: '', cliente: '', rol: '', ano: '', partner: '', descripcion: '' })}>
        Añadir Proyecto
      </button>

      {/* Logros Relevantes */}
      <h2>Logros Relevantes</h2>
      {cvData.logrosRelevantes.map((logro, index) => (
        <div key={index}>
          <input
            type="text"
            value={logro}
            onChange={(e) => handleArrayChange(e, index, 'logrosRelevantes')}
            className={errors.logrosRelevantes[index]?.logro ? 'error' : ''}
            placeholder={`Logro ${index + 1}`}
          />
          {errors.logrosRelevantes[index]?.logro && (
            <p className="error-text">{errors.logrosRelevantes[index].logro}</p>
          )}
          <button
            type="button"
            onClick={() => handleRemoveArrayItem('logrosRelevantes', index)}
          >
            Eliminar Logro
          </button>
        </div>
      ))}
      <button type="button" onClick={() => handleAddArrayItem('logrosRelevantes', '')}>
        Añadir Logro
      </button>

      {/* Competencias */}
      <h2>Competencias</h2>
      {cvData.competencias.map((competencia, index) => (
        <div key={index}>
          <input
            type="text"
            value={competencia}
            onChange={(e) => handleArrayChange(e, index, 'competencias')}
            className={errors.competencias[index] ? 'error' : ''}
            placeholder={`Competencia ${index + 1}`}
          />
          {errors.competencias[index] && (
            <p className="error-text">{errors.competencias[index]}</p>
          )}
          <button
            type="button"
            onClick={() => handleRemoveArrayItem('competencias', index)}
          >
            Eliminar Competencia
          </button>
        </div>
      ))}
      <button type="button" onClick={() => handleAddArrayItem('competencias', '')}>
        Añadir Competencia
      </button>

      {/* Idiomas */}
      <h2>Idiomas</h2>
      {cvData.idiomas.map((idioma, index) => (
        <div key={index}>
          <input
            type="text"
            name="idioma"
            value={idioma.idioma}
            onChange={(e) => handleArrayChange(e, index, 'idiomas')}
            className={errors.idiomas[index]?.idioma ? 'error' : ''}
            placeholder="Idioma"
          />
          {errors.idiomas[index]?.idioma && (
            <p className="error-text">{errors.idiomas[index].idioma}</p>
          )}

          <input
            type="text"
            name="fluidez"
            value={idioma.fluidez}
            onChange={(e) => handleArrayChange(e, index, 'idiomas')}
            className={errors.idiomas[index]?.fluidez ? 'error' : ''}
            placeholder="Fluidez"
          />
          {errors.idiomas[index]?.fluidez && (
            <p className="error-text">{errors.idiomas[index].fluidez}</p>
          )}

          <input
            type="text"
            name="porcentaje"
            value={idioma.porcentaje}
            onChange={(e) => handleArrayChange(e, index, 'idiomas')}
            className={errors.idiomas[index]?.porcentaje ? 'error' : ''}
            placeholder="Porcentaje"
          />
          {errors.idiomas[index]?.porcentaje && (
            <p className="error-text">{errors.idiomas[index].porcentaje}</p>
          )}

          <button
            type="button"
            onClick={() => handleRemoveArrayItem('idiomas', index)}
          >
            Eliminar Idioma
          </button>
        </div>
      ))}

      <button type="button" onClick={() => handleAddArrayItem('idiomas', { idioma: '', fluidez: '', porcentaje: '' })}>
        Añadir Idioma
      </button>

      <button type="submit" className="btn-submit">Actualizar CV</button>
    </form>
  );
};

export default CVForm;
