'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './CurriculumVitae.css';
import ConfirmacionPopup from '../popUp/popUp';

const SECTIONS = [
  { name: 'bachillerato', defaultObject: { grado: '', institucion: '', año: '' } },
  { name: 'educacionSuperior', defaultObject: { grado: '', institucion: '', año: '', areaDeTitulo: '' } },
  { name: 'certificaciones', defaultObject: { curso: '', entidad: '', año: '' } },
  { name: 'proyectosRelevantes', defaultObject: { proyecto: '', cliente: '', año: '', descripcion: '', tecnologiasUtilizadas: '', rolDesempeñado: '' } },
  { name: 'idiomas', defaultObject: { idioma: '', nivel: '', añoObtencion: '' } }
];

const CurriculumVitae = () => {
  const [state, setState] = useState({
    personalInfo: {},
    bachillerato: [],
    educacionSuperior: [],
    certificaciones: [],
    experienciaLaboral: [],
    proyectosRelevantes: [],
    idiomas: [],
    profileImage: null,
    showPopup: false,
    pendingSubmit: null,
    errors: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cvResponse = await fetch('http://localhost:5000/cvs/cv123456');
        const imageResponse = await fetch('http://localhost:5000/imagenes');
        
        if (cvResponse.ok) {
          const data = await cvResponse.json();
          setState(prev => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(data).map(([key, value]) => 
                key === 'educacion' 
                  ? ['bachillerato', value.bachillerato] 
                  : [key, value]
              )
            )
          }));
        }
        
        const images = await imageResponse.json();
        if (images?.length) {
          setState(prev => ({ ...prev, profileImage: images[0].path }));
        }
      } catch (error) {
        console.error('Fetch error', error);
      }
    };
    
    fetchData();
  }, []);

  const updateState = (section, action, data, index) => {
    setState(prev => {
      const newState = { ...prev };
      if (action === 'add') {
        newState[section] = [...prev[section], data];
      } else if (action === 'remove' && prev[section].length > 1) {
        newState[section] = prev[section].filter((_, i) => i !== index);
      } else if (action === 'update') {
        const newSection = [...prev[section]];
        newSection[index] = { ...newSection[index], ...data };
        newState[section] = newSection;
      }
      newState.errors = {};
      return newState;
    });
  };

  const validateForm = () => {
    const errors = {};
    const validateSection = (section, fields = []) => {
      state[section].forEach((entry, index) => {
        Object.entries(entry).forEach(([field, value]) => {
          if ((fields.includes(field) || !fields.length) && (!value || !value.trim())) {
            errors[`${section}.${index}.${field}`] = true;
          }
        });
      });
    };

    Object.entries(state.personalInfo).forEach(([key, value]) => {
      if (!value || !value.trim()) errors[`personalInfo.${key}`] = true;
    });

    SECTIONS.forEach(section => validateSection(section.name));
    validateSection('experienciaLaboral', ['actividades']);
    
    setState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmitRequest = () => {
    if (validateForm()) {
      setState(prev => ({ ...prev, showPopup: true, pendingSubmit: handleSubmit }));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/cvs/cv123456', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo: state.personalInfo,
          educacion: { 
            bachillerato: state.bachillerato, 
            educacionSuperior: state.educacionSuperior 
          },
          certificaciones: state.certificaciones,
          experienciaLaboral: state.experienciaLaboral,
          proyectosRelevantes: state.proyectosRelevantes,
          idiomas: state.idiomas
        })
      });

      response.ok 
        ? console.log('Datos actualizados') 
        : console.error('Error al actualizar');
    } catch (error) {
      console.error('Error de conexión', error);
    }
    setState(prev => ({ ...prev, showPopup: false }));
  };

  const InputField = ({ label, value, onChange, error }) => (
    <div className={`input-group ${error ? 'error' : ''}`}>
      <label>{label}:</label>
      <input 
        type="text" 
        value={value} 
        onChange={onChange} 
        style={{ 
          borderColor: error ? 'red' : '#ccc',
          backgroundColor: error ? '#ffebee' : '#f3f3f3'
        }}
      />
      {error && <span className="error-message">Este campo no puede estar vacío</span>}
    </div>
  );

  const renderSection = (sectionName, renderInputs) => {
    const items = state[sectionName];
    const section = SECTIONS.find(s => s.name === sectionName);

    return (
      <div className="section">
        <h2 className="section-title">{sectionName}:</h2>
        {items.map((entry, index) => (
          <div key={index} className="form-row">
            <h3 style={{ color: '#00ADEF', marginBottom: '10px', borderBottom: '2px solid #00ADEF' }}>
              {sectionName} {index + 1}
            </h3>
            {renderInputs(entry, index)}
            {index > 0 && (
              <button 
                className="remove-button" 
                onClick={() => updateState(sectionName, 'remove', null, index)}
              >-</button>
            )}
          </div>
        ))}
        <button 
          className="add-button" 
          onClick={() => updateState(sectionName, 'add', section.defaultObject)}
        >+</button>
      </div>
    );
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Datos de Curriculum Vitae</h1>

      <div className="section personal-section">
        <h2 className="section-title">Datos Personales:</h2>
        <div className="personal-info">
          <div className="form-grid">
            {Object.entries(state.personalInfo).map(([key, value]) => (
              <InputField
                key={key}
                label={key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                value={value}
                onChange={(e) => {
                  updateState('personalInfo', 'update', { [key]: e.target.value });
                }}
                error={state.errors[`personalInfo.${key}`]}
              />
            ))}
          </div>
          <div className="photo-section">
            {state.profileImage ? (
              <Image 
                src={state.profileImage} 
                alt="Foto de perfil" 
                width={180} 
                height={180} 
                className="profile-photo" 
                onError={(e) => {
                  console.error('Error loading image', e);
                  e.target.src = '/perfil.png'; 
                }}
              />
            ) : (
              <Image 
                src="/perfil.png" 
                alt="Foto" 
                width={180} 
                height={180} 
                className="profile-photo" 
              />
            )}
            <button className="blue-button">Cambiar Foto</button>
          </div>
        </div>
      </div>

      {renderSection(
        'bachillerato', 
        (entry, index) => Object.entries(entry)
          .filter(([field]) => field !== 'educacion')
          .map(([field, value]) => (
            <InputField
              key={field}
              label={field}
              value={value}
              onChange={(e) => updateState('bachillerato', 'update', { [field]: e.target.value }, index)}
              error={state.errors[`bachillerato.${index}.${field}`]}
            />
          ))
      )}

      {renderSection(
        'educacionSuperior', 
        (entry, index) => Object.entries(entry)
          .filter(([field]) => field !== 'educacionSuperior')
          .map(([field, value]) => (
            <InputField
              key={field}
              label={field}
              value={value}
              onChange={(e) => updateState('educacionSuperior', 'update', { [field]: e.target.value }, index)}
              error={state.errors[`educacionSuperior.${index}.${field}`]}
            />
          ))
      )}

      {renderSection(
        'certificaciones', 
        (entry, index) => Object.entries(entry)
          .filter(([field]) => field !== 'certificacion')
          .map(([field, value]) => (
            <InputField
              key={field}
              label={field}
              value={value}
              onChange={(e) => updateState('certificaciones', 'update', { [field]: e.target.value }, index)}
              error={state.errors[`certificaciones.${index}.${field}`]}
            />
          ))
      )}

      {renderSection(
        'proyectosRelevantes', 
        (entry, index) => Object.entries(entry)
          .filter(([field]) => field !== 'proyectoRelevante')
          .map(([field, value]) => (
            <InputField
              key={field}
              label={field}
              value={value}
              onChange={(e) => updateState('proyectosRelevantes', 'update', { [field]: e.target.value }, index)}
              error={state.errors[`proyectosRelevantes.${index}.${field}`]}
            />
          ))
      )}

      {renderSection(
        'idiomas', 
        (entry, index) => Object.entries(entry)
          .filter(([field]) => field !== 'language')
          .map(([field, value]) => (
            <InputField
              key={field}
              label={field}
              value={value}
              onChange={(e) => updateState('idiomas', 'update', { [field]: e.target.value }, index)}
              error={state.errors[`idiomas.${index}.${field}`]}
            />
          ))
      )}

      <div className="section">
        <h2 className="section-title">Experiencia Laboral:</h2>
        {state.experienciaLaboral.map((entry, index) => (
          <div key={index} className="form-row">
            <h3 style={{ color: '#00ADEF', marginBottom: '10px', borderBottom: '2px solid #00ADEF' }}>
              Experiencia Laboral {index + 1}
            </h3>
            {Object.entries(entry)
              .filter(([field]) => field !== 'actividades' && field !== 'experienciaLaboral')
              .map(([field, value]) => (
                <InputField
                  key={field}
                  label={field}
                  value={value}
                  onChange={(e) => updateState('experienciaLaboral', 'update', { [field]: e.target.value }, index)}
                  error={state.errors[`experienciaLaboral.${index}.${field}`]}
                />
              ))}
            {entry.actividades.map((actividad, actIndex) => (
              <InputField
                key={actIndex}
                label={`Actividad ${actIndex + 1}`}
                value={actividad}
                onChange={(e) => {
                  const updatedActivities = [...entry.actividades];
                  updatedActivities[actIndex] = e.target.value;
                  updateState('experienciaLaboral', 'update', { actividades: updatedActivities }, index);
                }}
                error={state.errors[`experienciaLaboral.${index}.actividades.${actIndex}`]}
              />
            ))}
            {index > 0 && (
              <button 
                className="remove-button" 
                onClick={() => updateState('experienciaLaboral', 'remove', null, index)}
              >-</button>
            )}
          </div>
        ))}
        <button 
          className="add-button" 
          onClick={() => updateState('experienciaLaboral', 'add', {
            empresa: '',
            lugar: '',
            fechaInicio: '',
            fechaFin: '',
            cargo: '',
            descripcionEmpresa: '',
            actividades: ['', '', ''],
            logrosDestacados: ''
          })}
        >+</button>
      </div>

      <div className="submit-section">
        <button className="blue-button" onClick={handleSubmitRequest}>
          Actualizar Datos
        </button>
      </div>

      {state.showPopup && (
        <ConfirmacionPopup
          mensaje="¿Estás seguro de que quieres enviar los datos actualizados?"
          onConfirm={state.pendingSubmit}
          onCancel={() => setState(prev => ({ ...prev, showPopup: false }))}
        />
      )}
    </div>
  );
};

export default CurriculumVitae;