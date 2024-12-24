'use client'
 
import { useEffect, useState } from 'react';
import styles from './cv.module.css';
import Image from 'next/image';
import Head from 'next/head';
 
import {
  Briefcase,
  CircleUserRound,
  FileBadge,
  GraduationCap,
  ClipboardCheck,
  Award
} from 'lucide-react';
 
import { Urbanist } from 'next/font/google';
 
const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});
 
export default function CV({idCV}) {
  const [data, setData] = useState(null); // Inicializamos como null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await fetch(`http://51.222.110.107:5012/applicant/get_cv/${idCV}`, {
          method: 'GET',
          headers: {
            'Authorization': '7zXnBjF5PBl7EzG/WhATQw==',
            'Content-Type': 'application/json'
          }
        });
 
        if (!response.ok) {
          throw new Error(`Error al obtener los datos: ${response.status}`);
        }
 
        const cvData = await response.json();
        setData(cvData);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        setError(err);
        setLoading(false);
      }
    };
 
    fetchCV();
  }, []);
 
  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }
 
  if (error) {
    return <div className={styles.error}>Error al cargar los datos: {error.message}</div>;
  }
 
  // Construir el nombre completo
  const fullName = `${data.personalInfo.nombre || ''} ${data.personalInfo.apellido || ''}`.trim();
 
  // Determinar el título (puede ser el último cargo en experienciaLaboral o el grado en educacionSuperior)
  let title = '';
  if (data.experienciaLaboral && data.experienciaLaboral.length > 0) {
    const lastExperience = data.experienciaLaboral[data.experienciaLaboral.length - 1];
    title = lastExperience.cargo || '';
  }
  if (!title && data.educacion && data.educacion.educacionSuperior && data.educacion.educacionSuperior.length > 0) {
    title = data.educacion.educacionSuperior[0].grado || '';
  }
 
  return (
    <div className={`${styles.cv} ${urbanist.className}`}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>CV de {fullName}</title>
      </Head>
 
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.profileArea}>
            {data.personalInfo.foto ? (
              <Image
                src={data.personalInfo.foto}
                alt="Foto de Perfil"
                className={styles.profilePhoto}
                width={150}
                height={150}
              />
            ) : (
              <div className={styles.defaultPhoto}>No Photo</div>
            )}
            <div className={styles.profileInfo}>
              <h1>{fullName || 'Nombre Completo'}</h1>
              <h2>{title || 'Título Profesional'}</h2>
            </div>
          </div>
          <div className={styles.logo}>
            <Image
              src="/InovaLogo.jpg" // Ruta absoluta desde la carpeta public
              alt="Logo Inova"
              className={styles.logoImage}
              width={100} // Ajusta según tus necesidades
              height={100} // Ajusta según tus necesidades
              priority={true} // Carga prioritaria
            />
          </div>
        </div>
        <div className={styles.headerBackground}></div>
      </header>
 
      <main className={styles.main}>
        {/* Información Personal */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <CircleUserRound className={styles.sectionIcon} />
            Datos Personales
          </h3>
          <div className={styles.personalInfo}>
            <div className={styles.infoGrid}>
              <InfoItem label="Nombre" value={fullName || 'N/A'} />
              <InfoItem label="Cédula" value={data.personalInfo.cedula || 'N/A'} />
              <InfoItem label="Correo" value={data.personalInfo.correo || 'N/A'} />
              <InfoItem label="Teléfono" value={data.personalInfo.telefono ? data.personalInfo.telefono.join(', ') : 'N/A'} />
              <InfoItem label="Dirección" value={data.personalInfo.direccion || 'N/A'} />
              <InfoItem label="Nacionalidad" value={data.personalInfo.nacionalidad || 'N/A'} />
              <InfoItem label="Estado Civil" value={data.personalInfo.estadoCivil || 'N/A'} />
              <InfoItem label="Cantidad de Hijos" value={data.personalInfo.cantidadHijos || '0'} />
              <InfoItem label="Género" value={data.personalInfo.genero || 'N/A'} />
              <InfoItem label="LinkedIn" value={data.personalInfo.linkedIn || 'N/A'} />
              <InfoItem
                label={<span style={{ whiteSpace: 'pre-line' }}>Actividades en{"\n"} Tiempo Libre</span>}
                value={data.personalInfo.actividadesTiempoLibre || 'N/A'}
              />
              <InfoItem label="Aspiración Salarial" value={data.personalInfo.aspiracionSalarial ? `$${data.personalInfo.aspiracionSalarial}` : 'N/A'} />
              <InfoItem label="Expectativas de Trabajo" value={data.personalInfo.expectativasTrabajo || 'N/A'} />
              <InfoItem label="Discapacidad" value={data.personalInfo.discapacidad?.tieneDiscapacidad ? `Sí (${data.personalInfo.discapacidad.tipo}, ${data.personalInfo.discapacidad.porcentaje}%)` : 'No'} />
              <InfoItem label="Autoidentificación Étnica" value={data.personalInfo.autoidentificacionEtnica || 'N/A'} />
            </div>
          </div>
        </section>
 
        {/* Educación */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <GraduationCap className={styles.sectionIcon} />
            Educación
          </h3>
          <div className={styles.education}>
            {data.educacion.bachillerato && data.educacion.bachillerato.length > 0 && (
              <EducationItem
                title="Bachillerato"
                degree={data.educacion.bachillerato[0].grado || 'N/A'}
                institution={data.educacion.bachillerato[0].institucion}
                yearStart={data.educacion.bachillerato[0].ano.split(' - ')[0]}
                yearEnd={data.educacion.bachillerato[0].ano.split(' - ')[1]}
              />
            )}
            {data.educacion.educacionSuperior && data.educacion.educacionSuperior.length > 0 && (
              <EducationItem
                title="Educación Superior"
                degree={data.educacion.educacionSuperior[0].grado}
                institution={data.educacion.educacionSuperior[0].institucion}
                yearStart={data.educacion.educacionSuperior[0].anoInicio}
                yearEnd={data.educacion.educacionSuperior[0].anoFin}
              />
            )}
            {data.educacion.educacionDe4toNivel && data.educacion.educacionDe4toNivel.length > 0 && (
              <EducationItem
                title="Educación de Cuarto Nivel"
                degree={data.educacion.educacionDe4toNivel[0].grado || 'N/A'}
                institution={data.educacion.educacionDe4toNivel[0].institucion || 'N/A'}
                yearStart={data.educacion.educacionDe4toNivel[0].anoInicio || 'N/A'}
                yearEnd={data.educacion.educacionDe4toNivel[0].anoFin || 'N/A'}
              />
            )}
            {data.educacion.educacionSuperiorNoUniversitaria && data.educacion.educacionSuperiorNoUniversitaria.length > 0 && (
              <EducationItem
                title="Educación Superior No Universitaria"
                degree={data.educacion.educacionSuperiorNoUniversitaria[0].grado || 'N/A'}
                institution={data.educacion.educacionSuperiorNoUniversitaria[0].institucion || 'N/A'}
                yearStart={data.educacion.educacionSuperiorNoUniversitaria[0].anoInicio || 'N/A'}
                yearEnd={data.educacion.educacionSuperiorNoUniversitaria[0].anoFin || 'N/A'}
              />
            )}
          </div>
        </section>
 
        {/* Certificaciones */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <FileBadge className={styles.sectionIcon} />
            Certificaciones
          </h3>
          <div className={styles.certifications}>
            {data.certificaciones && data.certificaciones.length > 0 ? (
              data.certificaciones.map((cert, index) => (
                <div key={index} className={styles.certificationItem}>
                  <h4>{cert.curso}</h4>
                  <span>({cert.ano || 'N/A'})</span>
                  <p>{cert.entidad}</p>
                </div>
              ))
            ) : (
              <p>No hay certificaciones para mostrar.</p>
            )}
          </div>
        </section>
 
        {/* Experiencia Laboral */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Briefcase className={styles.sectionIcon} />
            Experiencia Laboral
          </h3>
          <div className={styles.experience}>
            {data.experienciaLaboral && data.experienciaLaboral.length > 0 ? (
              data.experienciaLaboral.map((exp, index) => (
                <div key={index} className={styles.experienceItem}>
                  {/* Encabezado de la experiencia */}
                  <div className={styles.experienceHeader}>
                    <h4>
                      {exp.cargo} en {exp.empresa}
                    </h4>
                    <div className={styles.periodAndLocation}>
                      <span>{exp.fechaInicio} - {exp.fechaFin}</span> {exp.lugar && `| ${exp.lugar}`}
                    </div>
                  </div>
 
                  {/* Descripción del rol */}
                  <div className={styles.experienceDescription}>
                    <p>{exp.descripcionRol || 'Descripción no disponible.'}</p>
                  </div>
 
                  {/* Información adicional */}
                  <div className={styles.experienceAdditional}>
                    {exp.beneficios && <InfoItem label="Beneficios" value={exp.beneficios} />}
                    {exp.referenciaLaboral && (
                      <div className={styles.reference}>
                        <h4>Referencia Laboral:</h4>
                        <ul>
                          <li><strong>Nombre:</strong> {exp.referenciaLaboral.nombre || 'N/A'}</li>
                          <li><strong>Cargo:</strong> {exp.referenciaLaboral.cargo || 'N/A'}</li>
                          <li><strong>Teléfono:</strong> {exp.referenciaLaboral.telefono || 'N/A'}</li>
                        </ul>
                      </div>
                    )}
                    {exp.remuneracionBruta && (
                      <InfoItem label="Remuneración Bruta" value={`$${exp.remuneracionBruta}`} />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No hay experiencia laboral para mostrar.</p>
            )}
          </div>
        </section>
 
        {/* Idiomas */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <FileBadge className={styles.sectionIcon} />
            Idiomas
          </h3>
          <div className={styles.languages}>
            {data.idiomas && data.idiomas.length > 0 ? (
              data.idiomas.map((lang, index) => (
                <div key={index} className={styles.languageItem}>
                  <span>{lang.idioma}</span>
                  <span>{lang.fluidez}</span>
                </div>
              ))
            ) : (
              <p>No hay idiomas para mostrar.</p>
            )}
          </div>
        </section>
 
        {/* Competencias */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Award className={styles.sectionIcon} />
            Competencias
          </h3>
          <ul className={styles.competencias}>
            {data.competencias && data.competencias.length > 0 ? (
              data.competencias.map((competencia, index) => (
                <li key={index}>{competencia}</li>
              ))
            ) : (
              <p>No hay competencias para mostrar.</p>
            )}
          </ul>
        </section>
 
        {/* Logros Relevantes */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Award className={styles.sectionIcon} />
            Logros Relevantes
          </h3>
          {data.logrosRelevantes && data.logrosRelevantes.length > 0 ? (
            <ul className={styles.logrosRelevantes}>
              {data.logrosRelevantes.map((logro, index) => (
                <li key={index}>{logro}</li>
              ))}
            </ul>
          ) : (
            <p>No hay logros relevantes para mostrar.</p>
          )}
        </section>
 
        {/* Proyectos Relevantes */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <ClipboardCheck className={styles.sectionIcon} />
            Proyectos Relevantes
          </h3>
          <div className={styles.projects}>
            {data.proyectosRelevantes && data.proyectosRelevantes.length > 0 ? (
              data.proyectosRelevantes.map((project, index) => (
                <div key={index} className={styles.projectItem}>
                  <h4>{project.proyecto}</h4>
                  {project.ano && <span>Año: {project.ano}</span>}
                  <p>{project.descripcion || 'Descripción no disponible.'}</p>
                  {project.rol && <p><strong>Rol:</strong> {project.rol}</p>}
                  {project.cliente && <p><strong>Cliente:</strong> {project.cliente}</p>}
                  {project.partner && <p><strong>Partner:</strong> {project.partner}</p>}
                </div>
              ))
            ) : (
              <p>No hay proyectos relevantes para mostrar.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
 
function InfoItem({ label, value }) {
  return (
    <div className={styles.infoItem}>
      {label && <span className={styles.infoLabel}>{label}:</span>}
      <span>{value}</span>
    </div>
  );
}
 
function EducationItem({ title, degree, institution, yearStart, yearEnd }) {
  return (
    <div className={styles.educationItem}>
      <h4>{title}</h4>
      <p>
        <strong>{degree}</strong> ({yearStart} - {yearEnd})
      </p>
      <p>{institution}</p>
    </div>
  );
}