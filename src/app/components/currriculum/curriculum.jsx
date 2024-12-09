'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './CurriculumVitae.css';
import ConfirmacionPopup from '../popUp/popUp'; 

const CurriculumVitae = () => {
  const [personalInfo, setPersonalInfo] = useState({});
  const [bachillerato, setBachillerato] = useState([]);
  const [educacionSuperior, setEducacionSuperior] = useState([]);
  const [certificaciones, setCertificaciones] = useState([]);
  const [experienciaLaboral, setExperienciaLaboral] = useState([]);
  const [proyectosRelevantes, setProyectosRelevantes] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(null);
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/cvs/cv123456');
        const data = await response.json();
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

    const fetchProfileImage = async () => {
      try {
        const response = await fetch('http://localhost:5000/imagenes');
        const images = await response.json();
        if (images && images.length > 0) {
          setProfileImage(images[0].path);
        }
      } catch (error) {
        console.error('Error al obtener la imagen de perfil', error);
      }
    };

    fetchData();
    fetchProfileImage();
  }, []);

  const handleChange = (state, setter, index, field, value) => {
    const updatedArray = [...state];
    updatedArray[index][field] = value;
    setter(updatedArray);
    
    const newErrors = {...errors};
    delete newErrors[`${state}.${index}.${field}`];
    setErrors(newErrors);
  };

  const handleAdd = (setter, defaultObject) => {
    setter((prev) => [...prev, defaultObject]);
  };

  const handleRemove = (setter, index) => {
    setter((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(personalInfo).forEach(([key, value]) => {
      if (!value || !value.trim()) {
        newErrors[`personalInfo.${key}`] = true;
      }
    });

    const sectionsToValidate = [
      { name: 'bachillerato', data: bachillerato },
      { name: 'educacionSuperior', data: educacionSuperior },
      { name: 'certificaciones', data: certificaciones },
      { name: 'proyectosRelevantes', data: proyectosRelevantes },
      { name: 'idiomas', data: idiomas }
    ];

    sectionsToValidate.forEach(section => {
      section.data.forEach((entry, index) => {
        Object.entries(entry).forEach(([field, value]) => {
          if (field === 'actividades') {
            value.forEach((actividad, actIndex) => {
              if (!actividad || !actividad.trim()) {
                newErrors[`${section.name}.${index}.actividades.${actIndex}`] = true;
              }
            });
          } else if (field !== section.name && (!value || !value.trim())) {
            newErrors[`${section.name}.${index}.${field}`] = true;
          }
        });
      });
    });

    experienciaLaboral.forEach((exp, index) => {
      Object.entries(exp).forEach(([field, value]) => {
        if (field === 'actividades') {
          value.forEach((actividad, actIndex) => {
            if (!actividad || !actividad.trim()) {
              newErrors[`experienciaLaboral.${index}.actividades.${actIndex}`] = true;
            }
          });
        } else if (field !== 'experienciaLaboral' && (!value || !value.trim())) {
          newErrors[`experienciaLaboral.${index}.${field}`] = true;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitRequest = () => {
    if (validateForm()) {
      setPendingSubmit(() => handleSubmit);
      setShowPopup(true);
    }
  };

  const handleSubmit = async () => {
    const updatedData = {
      personalInfo,
      educacion: { bachillerato, educacionSuperior },
      certificaciones,
      experienciaLaboral,
      proyectosRelevantes,
      idiomas,
    };

    try {
      const response = await fetch('http://localhost:5000/cvs/cv123456', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      response.ok 
        ? console.log('Datos actualizados correctamente')
        : console.error('Error al actualizar los datos');
    } catch (error) {
      console.error('Error al conectar con el servidor', error);
    }
    setShowPopup(false);
  };

  const renderSectionWithSubtitle = (
    items, 
    setter, 
    sectionName, 
    renderInputs, 
    defaultObject
  ) => (
    <div className="section">
      <h2 className="section-title">{sectionName}:</h2>
      {items.map((entry, index) => (
        <div className="form-row" key={index}>
          <h3 style={{
            color: '#00ADEF', 
            marginBottom: '10px', 
            borderBottom: '2px solid #00ADEF', 
            paddingBottom: '5px'
          }}>
            {sectionName} {index + 1}
          </h3>
          {renderInputs(entry, index)}
          {index > 0 && (
            <div className="button-group">
              <button 
                className="remove-button" 
                onClick={() => handleRemove(setter, index)}
              >
                -
              </button>
            </div>
          )}
        </div>
      ))}
      <button 
        className="add-button" 
        onClick={() => handleAdd(setter, defaultObject)}
      >
        +
      </button>
    </div>
  );

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
                onChange={(e) => {
                  setPersonalInfo({ ...personalInfo, [key]: e.target.value });
                  const newErrors = {...errors};
                  delete newErrors[`personalInfo.${key}`];
                  setErrors(newErrors);
                }}
                error={errors[`personalInfo.${key}`]}
              />
            ))}
          </div>
          <div className="photo-section">
            {profileImage ? (
              <Image 
                src={profileImage} 
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

      {renderSectionWithSubtitle(
        bachillerato, 
        setBachillerato, 
        'Educación', 
        (entry, index) => Object.entries(entry)
          .filter(([field]) => field !== 'educacion')
          .map(([field, value]) => (
            <InputField
              key={field}
              label={field}
              value={value}
              onChange={(e) => handleChange(bachillerato, setBachillerato, index, field, e.target.value)}
              error={errors[`bachillerato.${index}.${field}`]}
            />
          )),
        { 
          grado: '', 
          institucion: '', 
          año: ''        }
      )}

      {renderSectionWithSubtitle(
        educacionSuperior, 
        setEducacionSuperior, 
        'Educación Superior', 
        (entry, index) => Object.entries(entry)
          .filter(([field]) => field !== 'educacionSuperior')
          .map(([field, value]) => (
            <InputField
              key={field}
              label={field}
              value={value}
              onChange={(e) => handleChange(educacionSuperior, setEducacionSuperior, index, field, e.target.value)}
              error={errors[`educacionSuperior.${index}.${field}`]}
            />
          )),
        { 
          grado: '', 
          institucion: '', 
          año: '', 
          areaDeTitulo: ''
        }
      )}

      {renderSectionWithSubtitle(
        certificaciones, 
        setCertificaciones, 
        'Certificación', 
        (entry, index) => Object.entries(entry)
          .filter(([field]) => field !== 'certificacion')
          .map(([field, value]) => (
            <InputField
              key={field}
              label={field}
              value={value}
              onChange={(e) => handleChange(certificaciones, setCertificaciones, index, field, e.target.value)}
              error={errors[`certificaciones.${index}.${field}`]}
            />
          )),
        { 
          curso: '', 
          entidad: '', 
          año: ''
        }
      )}

      {renderSectionWithSubtitle(
        experienciaLaboral, 
        setExperienciaLaboral, 
        'Experiencia Laboral', 
        (entry, index) => (
          <>
            {Object.entries(entry)
              .filter(([field]) => 
                field !== 'actividades' && field !== 'experienciaLaboral'
              )
              .map(([field, value]) => (
                <InputField
                  key={field}
                  label={field}
                  value={value}
                  onChange={(e) => handleChange(experienciaLaboral, setExperienciaLaboral, index, field, e.target.value)}
                  error={errors[`experienciaLaboral.${index}.${field}`]}
                />
              ))}
            {entry.actividades.map((actividad, i) => (
              <InputField
                key={i}
                label={`Actividad ${i + 1}`}
                value={actividad}
                onChange={(e) => {
                  const updatedActivities = [...entry.actividades];
                  updatedActivities[i] = e.target.value;
                  handleChange(experienciaLaboral, setExperienciaLaboral, index, 'actividades', updatedActivities);
                }}
                error={errors[`experienciaLaboral.${index}.actividades.${i}`]}
              />
            ))}
          </>
        ),
        {
          empresa: '',
          lugar: '',
          fechaInicio: '',
          fechaFin: '',
          cargo: '',
          descripcionEmpresa: '',
          actividades: ['', '', ''],
          logrosDestacados: ''
        }
      )}

      {renderSectionWithSubtitle(
        proyectosRelevantes, 
        setProyectosRelevantes, 
        'Proyecto', 
        (entry, index) => Object.entries(entry)
          .filter(([field]) => field !== 'proyectoRelevante')
          .map(([field, value]) => (
            <InputField
              key={field}
              label={field}
              value={value}
              onChange={(e) => handleChange(proyectosRelevantes, setProyectosRelevantes, index, field, e.target.value)}
              error={errors[`proyectosRelevantes.${index}.${field}`]}
            />
          )),
        {
          proyecto: '',
          cliente: '',
          año: '',
          descripcion: '',
          tecnologiasUtilizadas: '',
          rolDesempeñado: ''
        }
      )}

      {renderSectionWithSubtitle(
        idiomas, 
        setIdiomas, 
        'Idioma', 
        (entry, index) => Object.entries(entry)
          .filter(([field]) => field !== 'language')
          .map(([field, value]) => (
            <InputField
              key={field}
              label={field}
              value={value}
              onChange={(e) => handleChange(idiomas, setIdiomas, index, field, e.target.value)}
              error={errors[`idiomas.${index}.${field}`]}
            />
          )),
        { 
          idioma: '', 
          nivel: '', 
          añoObtencion: ''
        }
      )}

      <div className="submit-section">
        <button className="blue-button" onClick={handleSubmitRequest}>
          Actualizar Datos
        </button>
      </div>

      {showPopup && (
        <ConfirmacionPopup
          mensaje="¿Estás seguro de que quieres enviar los datos actualizados?"
          onConfirm={pendingSubmit}
          onCancel={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default CurriculumVitae;