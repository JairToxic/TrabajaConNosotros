'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import './CurriculumVitae.css';

const CurriculumVitae = () => {
  const [personalInfo, setPersonalInfo] = useState({});
  const [bachillerato, setBachillerato] = useState([]);
  const [educacionSuperior, setEducacionSuperior] = useState([]);
  const [certificaciones, setCertificaciones] = useState([]);
  const [experienciaLaboral, setExperienciaLaboral] = useState([]);
  const [proyectosRelevantes, setProyectosRelevantes] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  
  // Obtener los datos del CV por id desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/cvs/cv123456');  // Cambia la URL por la correcta
        const data = await response.json()

        if (response.ok) {
          setPersonalInfo(data.personalInfo);
          setBachillerato(data.educacion.bachillerato);
          setEducacionSuperior(data.educacion.educacionSuperior);
          setCertificaciones(data.certificaciones);
          setExperienciaLaboral(data.experienciaLaboral);
          setProyectosRelevantes(data.proyectosRelevantes);
          setIdiomas(data.idiomas);
        } else {
          console.error('Error al obtener los datos', data.error);
        }
      } catch (error) {
        console.error('Error al conectar con el servidor', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (setter, index, field, value) => {
    const updatedArray = [...setter];
    updatedArray[index][field] = value;
    setter(updatedArray);
  };

  const handleAdd = (setter, defaultObject) => setter((prev) => [...prev, defaultObject]);

  const handleRemove = (setter, index) => {
    setter((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Datos de Curriculum Vitae</h1>

      <div className="section personal-section">
        <h2 className="section-title">Datos Personales:</h2>
        <div className="personal-info">
          <div className="form-grid">
            {Object.entries(personalInfo).map(([key, value]) => (
              <InputField
                key={key}
                label={key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                value={value}
                onChange={(e) => setPersonalInfo({ ...personalInfo, [key]: e.target.value })}
              />
            ))}
          </div>
          <div className="photo-section">
            <Image src="/perfil.png" alt="Foto" width={180} height={180} className="profile-photo" />
            <button className="blue-button">Cambiar Foto</button>
          </div>
        </div>
      </div>

      {[{
        title: 'Educación',
        items: bachillerato,
        setter: setBachillerato,
        defaultObject: { grado: '', institucion: '' },
      },
      {
        title: 'Educación Superior',
        items: educacionSuperior,
        setter: setEducacionSuperior,
        defaultObject: { grado: '', institucion: '' },
      },
      {
        title: 'Certificaciones o Cursos',
        items: certificaciones,
        setter: setCertificaciones,
        defaultObject: { curso: '', entidad: '' },
      }].map((section, index) => (
        <div className="section" key={index}>
          <h2 className="section-title">{section.title}:</h2>
          {section.items.map((entry, idx) => (
            <div className="form-row" key={idx}>
              {Object.entries(entry).map(([field, value]) => (
                <InputField
                  key={field}
                  label={field}
                  value={value}
                  onChange={(e) => handleChange(section.items, idx, field, e.target.value)}
                />
              ))}
              <div className="button-group">
                {idx > 0 && (
                  <button className="remove-button" onClick={() => handleRemove(section.setter, idx)}>
                    -
                  </button>
                )}
              </div>
            </div>
          ))}
          <button className="add-button" onClick={() => handleAdd(section.setter, section.defaultObject)}>
            +
          </button>
        </div>
      ))}

      <div className="section">
        <h2 className="section-title">Experiencia Laboral:</h2>
        {experienciaLaboral.map((entry, index) => (
          <div className="experience-section" key={index}>
            <div className="form-row">
              {Object.entries(entry).map(([field, value]) => (
                field !== 'actividades' && (
                  <InputField
                    key={field}
                    label={field}
                    value={value}
                    onChange={(e) => handleChange(experienciaLaboral, index, field, e.target.value)}
                  />
                )
              ))}
            </div>
            {entry.actividades.map((actividad, i) => (
              <InputField
                key={i}
                label={`Actividad ${i + 1}`}
                value={actividad}
                onChange={(e) => {
                  const updatedActivities = [...entry.actividades];
                  updatedActivities[i] = e.target.value;
                  handleChange(experienciaLaboral, index, 'actividades', updatedActivities);
                }}
              />
            ))}
            <div className="button-group">
              {index > 0 && (
                <button className="remove-button" onClick={() => handleRemove(setExperienciaLaboral, index)}>
                  -
                </button>
              )}
            </div>
          </div>
        ))}
        <button className="add-button" onClick={() => handleAdd(setExperienciaLaboral, {
          empresa: '',
          lugar: '',
          fechaInicio: '',
          fechaFin: '',
          cargo: '',
          descripcionEmpresa: '',
          actividades: ['', '', ''],
        })}>
          +
        </button>
      </div>

      <div className="section">
        <h2 className="section-title">Proyectos Relevantes:</h2>
        {proyectosRelevantes.map((entry, index) => (
          <div className="project-section" key={index}>
            <h3 className="project-title">Proyecto {index + 1}</h3>
            <div className="form-row">
              {Object.entries(entry).map(([field, value]) => (
                <InputField
                  key={field}
                  label={field}
                  value={value}
                  onChange={(e) => handleChange(proyectosRelevantes, index, field, e.target.value)}
                />
              ))}
            </div>
            <div className="button-group">
              {index > 0 && (
                <button className="remove-button" onClick={() => handleRemove(setProyectosRelevantes, index)}>
                  -
                </button>
              )}
            </div>
          </div>
        ))}
        <button className="add-button" onClick={() => handleAdd(setProyectosRelevantes, {
          proyecto: '',
          cliente: '',
          rol: '',
          ano: '',
          partner: '',
          descripcion: '',
        })}>
          +
        </button>
      </div>

      <div className="section">
        <h2 className="section-title">Idiomas:</h2>
        {idiomas.map((entry, index) => (
          <div className="language-section" key={index}>
            <div className="form-row">
              <InputField
                label="Idioma"
                value={entry.idioma}
                onChange={(e) => handleChange(idiomas, index, 'idioma', e.target.value)}
              />
              <InputField
                label="Porcentaje de fluidez"
                value={entry.fluidez}
                onChange={(e) => handleChange(idiomas, index, 'fluidez', e.target.value)}
              />
            </div>
            <div className="button-group">
              {index > 0 && (
                <button className="remove-button" onClick={() => handleRemove(setIdiomas, index)}>
                  -
                </button>
              )}
            </div>
          </div>
        ))}
        <button className="add-button" onClick={() => handleAdd(setIdiomas, { idioma: '', fluidez: '' })}>
          +
        </button>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange }) => (
  <div className="input-group">
    <label>{label}:</label>
    <input type="text" value={value} onChange={onChange} />
  </div>
);

export default CurriculumVitae;
