import { useState, useEffect } from 'react';

const UltimateElegantCV = () => {
  const [cvData, setCvData] = useState(null);
  const [hovered, setHovered] = useState(false); // Estado para manejar el hover

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        const response = await fetch('http://localhost:5000/cvs/cv7891011', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener el CV');
        }

        const data = await response.json();
        setCvData(data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchCVData();
  }, []);

  const styles = {
    container: {
      fontFamily: "'Roboto', sans-serif",
      maxWidth: '1100px',
      margin: '40px auto',
      backgroundColor: '#1A1A2E',
      boxShadow: '0 15px 45px rgba(0, 0, 0, 0.2)',
      borderRadius: '20px',
      padding: '40px',
      color: '#f5f5f5',
    },
    header: {
      background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
      position: 'relative',
      borderRadius: '20px',
      boxShadow: '0 15px 45px rgba(0, 0, 0, 0.3)',
    },
    profileImage: {
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      objectFit: 'cover',
      marginBottom: '20px',
      border: '4px solid rgba(255, 255, 255, 0.4)',
      transition: 'all 0.3s ease',
    },
    profileImageHover: {
      transform: 'scale(1.1)', // Efecto de zoom cuando se pasa el ratón
    },
    nameSection: {
      textAlign: 'center',
    },
    name: {
      fontSize: '2.8em',
      fontWeight: '900',
      marginBottom: '10px',
      color: '#fff',
      letterSpacing: '1px',
    },
    jobTitle: {
      fontSize: '1.5em',
      opacity: '0.8',
      marginBottom: '20px',
      color: '#D1D3D8',
    },
    contactInfo: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    contactItem: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '12px 20px',
      borderRadius: '25px',
      color: 'white',
      transition: 'background-color 0.3s ease',
    },
    contactItemHovered: {
      backgroundColor: '#00c6ff', // Color de hover
    },
    sectionContainer: {
      marginBottom: '30px',
    },
    sectionTitle: {
      borderBottom: '3px solid #00c6ff',
      paddingBottom: '10px',
      marginBottom: '20px',
      color: '#D1D3D8',
      fontSize: '1.8em',
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    sectionContent: {
      padding: '20px',
      backgroundColor: '#2A2A3C',
      borderRadius: '15px',
      color: '#f5f5f5',
      marginTop: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    list: {
      listStyleType: 'none',
      paddingLeft: '20px',
    },
    listItem: {
      marginBottom: '15px',
      color: '#bbb',
      padding: '15px',
      border: '1px solid #444',
      borderRadius: '10px',
      backgroundColor: '#1F1F2E',
      transition: '0.3s ease',
    },
    listItemHovered: {
      backgroundColor: '#333',
    },
    divider: {
      borderBottom: '1px solid #444',
      marginBottom: '30px',
    },
  };

  if (!cvData) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#f5f5f5' }}>Cargando CV...</div>;
  }

  const {
    personalInfo,
    educacion,
    certificaciones,
    experienciaLaboral,
    proyectosRelevantes,
    logrosRelevantes,
    competencias,
    idiomas,
    imagenes,
  } = cvData;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <img 
          src={personalInfo.foto} 
          alt="Foto de perfil" 
          style={{
            ...styles.profileImage,
            ...(hovered ? styles.profileImageHover : {}),
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
        <div style={styles.nameSection}>
          <h1 style={styles.name}>{personalInfo.nombre} {personalInfo.apellido}</h1>
          <div style={styles.jobTitle}>{personalInfo.aspiracionSalarial}</div>
          <div style={styles.contactInfo}>
            {[ 
              { icon: '📧', text: personalInfo.correo },
              { icon: '📱', text: personalInfo.telefono.join(', ') },
              { icon: '🔗', text: personalInfo.linkedIn }
            ].map((contact, index) => (
              <div 
                key={index} 
                style={styles.contactItem}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {contact.icon} {contact.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secciones del CV */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Información Personal</h2>
        <div style={styles.sectionContent}>
          <p><strong>Estado Civil:</strong> {personalInfo.estadoCivil}</p>
          <p><strong>Fecha de Nacimiento:</strong> {personalInfo.diaNacimiento}</p>
          <p><strong>Cantidad de Hijos:</strong> {personalInfo.cantidadHijos}</p>
          <p><strong>Dirección:</strong> {personalInfo.direccion}</p>
          <p><strong>Género:</strong> {personalInfo.genero}</p>
          <p><strong>Autoidentificación Técnica:</strong> {personalInfo.autoidentificacionEtcnica}</p>
          {personalInfo.discapacidad && (
            <p><strong>Discapacidad:</strong> {personalInfo.discapacidad.tipo} ({personalInfo.discapacidad.porcentaje})</p>
          )}
          <p><strong>Expectativas de Trabajo:</strong> {personalInfo.expectativasTrabajo}</p>
          <p><strong>Actividades en Tiempo Libre:</strong> {personalInfo.actividadesTiempoLibre}</p>
        </div>
      </div>

      {/* Experiencia Profesional */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Experiencia Profesional</h2>
        <div style={styles.sectionContent}>
          {experienciaLaboral.map((job, index) => (
            <div key={index}>
              <div style={styles.listItem}>
                <h3>{job.cargo} - {job.empresa}</h3>
                <p>{job.fechaInicio} - {job.fechaFin}</p>
                <p>{job.descripcionRol}</p>
              </div>
              {index < experienciaLaboral.length - 1 && <div style={styles.divider}></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Educación */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Educación</h2>
        <div style={styles.sectionContent}>
          {[...educacion.bachillerato, ...educacion.educacionSuperiorNoUniversitaria, ...educacion.educacionSuperior].map((edu, index) => (
            <div key={index}>
              <div style={styles.listItem}>
                <h3>{edu.grado}</h3>
                <p>{edu.institucion} ({edu.anoInicio || edu.ano})</p>
              </div>
              {index < educacion.length - 1 && <div style={styles.divider}></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Logros y Certificaciones */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Logros y Certificaciones</h2>
        <div style={styles.sectionContent}>
          <div>
            <h3>Logros</h3>
            <ul style={styles.list}>
              {logrosRelevantes.map((achievement, index) => (
                <li key={index} style={styles.listItem}>{achievement}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Certificaciones</h3>
            <ul style={styles.list}>
              {certificaciones.map((cert, index) => (
                <li key={index} style={styles.listItem}>
                  {cert.curso} - {cert.entidad} ({cert.ano})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Competencias */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Competencias</h2>
        <ul style={styles.list}>
          {competencias.map((competence, index) => (
            <li key={index} style={styles.listItem}>{competence}</li>
          ))}
        </ul>
      </div>

      {/* Idiomas */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Idiomas</h2>
        <ul style={styles.list}>
          {idiomas.map((language, index) => (
            <li key={index} style={styles.listItem}>
              {language.idioma} ({language.fluidez})
            </li>
          ))}
        </ul>
      </div>

      {/* Proyectos Relevantes */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Proyectos Relevantes</h2>
        <div style={styles.sectionContent}>
          {proyectosRelevantes.map((project, index) => (
            <div key={index}>
              <div style={styles.listItem}>
                <h3>{project.nombre}</h3>
                <p>{project.descripcion}</p>
              </div>
              {index < proyectosRelevantes.length - 1 && <div style={styles.divider}></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UltimateElegantCV;
