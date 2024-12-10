import { useEffect, useState } from 'react';

const CV = () => {
  const [cvData, setCvData] = useState(null);

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
        console.error(error);
      }
    };

    fetchCVData();
  }, []);

  if (!cvData) {
    return <div>Cargando CV...</div>;
  }

  const { personalInfo, educacion, certificaciones, experienciaLaboral, proyectosRelevantes, logrosRelevantes, competencias, idiomas, foto } = cvData;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.profileSection}>
          <img src={foto} alt="Foto de perfil" style={styles.profileImage} />
          <div style={styles.nameAndContact}>
            <h1 style={styles.name}>{personalInfo.nombre} {personalInfo.apellido}</h1>
            <p style={styles.contactInfo}><strong>Email:</strong> <a href={`mailto:${personalInfo.correo}`} style={styles.link}>{personalInfo.correo}</a></p>
            <p style={styles.contactInfo}><strong>Teléfono:</strong> {personalInfo.telefono.join(', ')}</p>
            <p style={styles.contactInfo}><strong>LinkedIn:</strong> <a href={personalInfo.linkedIn} target="_blank" rel="noopener noreferrer" style={styles.link}>{personalInfo.linkedIn}</a></p>
          </div>
        </div>
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Información Personal</h2>
        <div style={styles.grid}>
          <div><strong>Cédula:</strong> {personalInfo.cedula}</div>
          <div><strong>Nacionalidad:</strong> {personalInfo.nacionalidad}</div>
          <div><strong>Fecha de nacimiento:</strong> {personalInfo.diaNacimiento}</div>
          <div><strong>Estado civil:</strong> {personalInfo.estadoCivil}</div>
          <div><strong>Dirección:</strong> {personalInfo.direccion}</div>
          <div><strong>Aspiración salarial:</strong> {personalInfo.aspiracionSalarial}</div>
          <div><strong>Tiempo de ingreso:</strong> {personalInfo.tiempoIngreso}</div>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Educación</h2>
        <div style={styles.grid}>
          {educacion.bachillerato.map((item, index) => (
            <div key={index} style={styles.card}>{item.grado} - {item.institucion} ({item.ano})</div>
          ))}
          {educacion.educacionSuperiorNoUniversitaria.map((item, index) => (
            <div key={index} style={styles.card}>{item.grado} - {item.institucion} ({item.anoInicio} - {item.anoFin})</div>
          ))}
          {educacion.educacionSuperior.map((item, index) => (
            <div key={index} style={styles.card}>{item.grado} - {item.institucion} ({item.anoInicio} - {item.anoFin})</div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Certificaciones</h2>
        <div style={styles.grid}>
          {certificaciones.map((item, index) => (
            <div key={index} style={styles.card}>{item.curso} - {item.entidad} ({item.ano})</div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Experiencia Laboral</h2>
        {experienciaLaboral.map((item, index) => (
          <div key={index} style={styles.jobCard}>
            <h3>{item.cargo} - {item.empresa}</h3>
            <p><strong>Lugar:</strong> {item.lugar}</p>
            <p><strong>Fecha:</strong> {item.fechaInicio} a {item.fechaFin}</p>
            <p>{item.descripcionRol}</p>
            <p><strong>Remuneración:</strong> {item.remuneracionBruta}</p>
            <p><strong>Beneficios:</strong> {item.beneficios}</p>
            <p><strong>Referencia:</strong> {item.referenciaLaboral.nombre} ({item.referenciaLaboral.cargo}) - {item.referenciaLaboral.numero}</p>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Proyectos Relevantes</h2>
        {proyectosRelevantes.map((item, index) => (
          <div key={index} style={styles.projectCard}>
            <h3>{item.proyecto}</h3>
            <p><strong>Cliente:</strong> {item.cliente}</p>
            <p><strong>Rol:</strong> {item.rol}</p>
            <p><strong>Año:</strong> {item.ano}</p>
            <p><strong>Descripción:</strong> {item.descripcion}</p>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Logros Relevantes</h2>
        <ul style={styles.list}>
          {logrosRelevantes.map((item, index) => (
            <li key={index} style={styles.listItem}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Competencias</h2>
        <ul style={styles.list}>
          {competencias.map((item, index) => (
            <li key={index} style={styles.listItem}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Idiomas</h2>
        <ul style={styles.list}>
          {idiomas.map((item, index) => (
            <li key={index} style={styles.listItem}>{item.idioma} - {item.fluidez} ({item.porcentaje})</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '"Roboto", sans-serif',
    maxWidth: '900px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    color: '#333',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #ddd',
    paddingBottom: '20px',
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '20px',
    border: '4px solid #4CAF50',
    transition: 'transform 0.3s ease',
  },
  nameAndContact: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    fontSize: '2.4em',
    marginBottom: '15px',
    color: '#4CAF50',
    fontWeight: '600',
  },
  contactInfo: {
    color: '#666',
    marginBottom: '8px',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.8em',
    fontWeight: '700',
    color: '#333',
    marginBottom: '12px',
    borderBottom: '2px solid #4CAF50',
    paddingBottom: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  card: {
    backgroundColor: '#f4f4f4',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  jobCard: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    transition: 'transform 0.3s ease',
  },
  projectCard: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    transition: 'transform 0.3s ease',
  },
  list: {
    listStyleType: 'disc',
    marginLeft: '20px',
    color: '#555',
  },
  listItem: {
    marginBottom: '10px',
    transition: 'color 0.3s ease',
  },
};

export default CV;
