// JobVacanciesSearch.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaExclamationCircle, 
  FaCheck, 
  FaEye, 
  FaHandshake, 
  FaArrowUp 
} from 'react-icons/fa';

// Estilos en línea utilizando CSS-in-JS
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #f0f4f8, #ffffff)',
    padding: '20px',
    fontFamily: "'Arial, sans-serif'",
    position: 'relative',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    animation: 'fadeInDown 1s ease-out',
  },
  title: {
    fontSize: '3rem',
    color: '#21498E',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#1C3879',
    marginTop: '10px',
    animation: 'fadeInUp 1s ease-out',
  },
  shakeIcon: {
    marginTop: '20px',
    color: '#21498E',
    width: '64px',
    height: '64px',
    animation: 'shake 2s infinite',
  },
  filters: {
    backgroundColor: '#D6EAF8',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '40px',
  },
  filterTitle: {
    fontSize: '1.5rem',
    color: '#1C3879',
    marginBottom: '20px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  filterGroupRow: {
    flexDirection: 'row',
  },
  filterLabel: {
    fontSize: '1rem',
    color: '#1C3879',
    marginBottom: '5px',
  },
  filterInput: {
    padding: '10px 15px',
    border: '1px solid #AED6F1',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
  },
  resetButton: {
    backgroundColor: '#EC7063',
    color: '#ffffff',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
  resetButtonHover: {
    backgroundColor: '#CB4335',
  },
  resetButtonIcon: {
    marginRight: '10px',
  },
  vacancyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  vacancyCard: {
    position: 'relative',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    padding: '24px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  vacancyCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
  },
  badges: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    gap: '10px',
  },
  badge: {
    backgroundColor: '#F9E79F',
    color: '#D4AC0D',
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  vacancyTitle: {
    fontSize: '2rem',
    color: '#21498E',
  },
  vacancyDetails: {
    marginTop: '10px',
    fontSize: '1rem',
    color: '#555555',
  },
  vacancyDetailsItem: {
    margin: '5px 0',
  },
  vacancyActions: {
    marginTop: '20px',
    display: 'flex',
    gap: '15px',
  },
  detailsButton: {
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    color: '#ffffff',
    backgroundColor: '#2E86C1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease',
  },
  detailsButtonHover: {
    backgroundColor: '#1B4F72',
  },
  applyButton: {
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    color: '#ffffff',
    backgroundColor: '#28B463',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease',
  },
  applyButtonHover: {
    backgroundColor: '#1D8348',
  },
  vacancyActionsIcon: {
    marginRight: '10px',
  },
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#82E0AA',
    color: '#ffffff',
    padding: '15px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    animation: 'slideIn 0.5s forwards, fadeOut 0.5s forwards 4.5s',
    zIndex: 1000,
  },
  toastError: {
    backgroundColor: '#E74C3C',
  },
  toastIcon: {
    width: '20px',
    height: '20px',
  },
  errorMessage: {
    backgroundColor: '#E74C3C',
    color: '#ffffff',
    padding: '15px 20px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  loadingIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#21498E',
    marginBottom: '20px',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
    marginRight: '10px',
    width: '24px',
    height: '24px',
  },
  noResultsMessage: {
    textAlign: 'center',
    color: '#555555',
    fontSize: '1.2rem',
    marginTop: '40px',
  },
  scrollTopButton: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: '#21498E',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    padding: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  scrollTopButtonHover: {
    backgroundColor: '#1A3D7C',
    transform: 'scale(1.1)',
  },
  scrollTopIcon: {
    width: '20px',
    height: '20px',
  },
  /* Animaciones clave */
  '@keyframes fadeInDown': {
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes shake': {
    '0%': { transform: 'rotate(0deg)' },
    '25%': { transform: 'rotate(5deg)' },
    '50%': { transform: 'rotate(0deg)' },
    '75%': { transform: 'rotate(-5deg)' },
    '100%': { transform: 'rotate(0deg)' },
  },
  '@keyframes slideIn': {
    from: { opacity: 0, transform: 'translateX(100%)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  '@keyframes fadeOut': {
    from: { opacity: 1, transform: 'translateX(0)' },
    to: { opacity: 0, transform: 'translateX(100%)' },
  },
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
};

const JobVacanciesSearch = () => {
  // Estado para vacantes y filtros
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [filters, setFilters] = useState({
    positionName: '',
    stage: '',
    type: '',
    location: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    message: '',
    type: '', // 'success' or 'error'
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Opciones de etapas
  const stageOptions = ['Reclutamiento', 'Preselección', 'Etapa Final'];

  // Headers para las solicitudes
  const headers = {
    'Content-Type': 'application/json',
    Authorization: '7zXnBjF5PBl7EzG/WhATQw==',
  };

  // Fetch de vacantes al montar el componente
  useEffect(() => {
    const fetchVacancies = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://51.222.110.107:5012/process/', {
          method: 'GET',
          headers: headers,
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setVacancies(data);
        setFilteredVacancies(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching vacancies:', error);
        setError('No se pudo cargar las vacantes. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  // Manejar cambios en los filtros
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Aplicar filtros a las vacantes
  const applyFilters = (currentFilters) => {
    let result = vacancies;

    if (currentFilters.positionName) {
      result = result.filter((vacancy) =>
        vacancy.position_name.toLowerCase().includes(currentFilters.positionName.toLowerCase())
      );
    }

    if (currentFilters.stage) {
      result = result.filter(
        (vacancy) => vacancy.stage.toLowerCase() === currentFilters.stage.toLowerCase()
      );
    }

    if (currentFilters.type) {
      result = result.filter(
        (vacancy) => vacancy.type.toLowerCase() === currentFilters.type.toLowerCase()
      );
    }

    if (currentFilters.location) {
      result = result.filter(
        (vacancy) => vacancy.location.toLowerCase() === currentFilters.location.toLowerCase()
      );
    }

    setFilteredVacancies(result);
  };

  // Resetear filtros
  const resetFilters = () => {
    setFilters({
      positionName: '',
      stage: '',
      type: '',
      location: '',
    });
    setFilteredVacancies(vacancies);
  };

  // Manejar clic en "Aplicar"
  const handleApply = (id) => {
    // Mostrar notificación de éxito
    setToast({
      message: 'Has aplicado exitosamente para esta vacante.',
      type: 'success',
    });
    // Redirigir después de 1.5 segundos
    setTimeout(() => {
      window.location.href = `/aplicar-puesto/${id}`;
    }, 1500);
  };

  // Manejar clic en "Detalles"
  const handleViewDetails = (id) => {
    // Mostrar notificación de información
    setToast({
      message: 'Redirigiendo a los detalles de la vacante.',
      type: 'success',
    });
    // Redirigir después de 1.5 segundos
    setTimeout(() => {
      window.location.href = `/vacante-description/${id}`;
    }, 1500);
  };

  // Renderizar notificación tipo toast
  const renderToast = () => {
    if (toast.message === '') return null;

    return (
      <div
        style={{
          ...styles.toast,
          ...(toast.type === 'error' ? styles.toastError : {}),
        }}
        onAnimationEnd={() => setToast({ message: '', type: '' })}
      >
        {toast.type === 'error' ? (
          <FaExclamationCircle style={styles.toastIcon} />
        ) : (
          <FaCheck style={styles.toastIcon} />
        )}
        <span>{toast.message}</span>
      </div>
    );
  };

  // Manejar visibilidad del botón de scroll al top
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para scroll al top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div style={styles.container}>
      {/* Notificación Tipo Toast */}
      {renderToast()}

      {/* Encabezado y Mensaje Motivacional */}
      <div style={styles.header}>
        <h1 style={styles.title}>Cómo Trabajar con Nosotros</h1>
        <p style={styles.subtitle}>
          Únete a nuestro equipo y crece profesionalmente en un ambiente dinámico y colaborativo. ¡Tu futuro comienza aquí!
        </p>
        <FaHandshake style={styles.shakeIcon} />
      </div>

      {/* Filtros */}
      <div style={styles.filters}>
        <h3 style={styles.filterTitle}>Filtros de Búsqueda</h3>
        <div
          style={{
            ...styles.filterGroup,
            ...(window.innerWidth >= 768 ? styles.filterGroupRow : {}),
          }}
        >
          {/* Nombre del Puesto */}
          <div style={{ flex: 1 }}>
            <label htmlFor="positionName" style={styles.filterLabel}>
              Nombre del Puesto
            </label>
            <input
              type="text"
              id="positionName"
              placeholder="Buscar por puesto"
              style={styles.filterInput}
              value={filters.positionName}
              onChange={(e) => handleFilterChange('positionName', e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = styles.filterInputFocus.borderColor)}
              onBlur={(e) => (e.target.style.borderColor = '#AED6F1')}
            />
          </div>

          {/* Etapa */}
          <div style={{ flex: 1 }}>
            <label htmlFor="stage" style={styles.filterLabel}>
              Etapa
            </label>
            <select
              id="stage"
              style={styles.filterInput}
              value={filters.stage}
              onChange={(e) => handleFilterChange('stage', e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = styles.filterInputFocus.borderColor)}
              onBlur={(e) => (e.target.style.borderColor = '#AED6F1')}
            >
              <option value="">Seleccionar Etapa</option>
              {stageOptions.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div style={{ flex: 1 }}>
            <label htmlFor="type" style={styles.filterLabel}>
              Tipo
            </label>
            <select
              id="type"
              style={styles.filterInput}
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = styles.filterInputFocus.borderColor)}
              onBlur={(e) => (e.target.style.borderColor = '#AED6F1')}
            >
              <option value="">Seleccionar Tipo</option>
              {['Full-time', 'Part-Time', 'Interno', 'Externo'].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Localización */}
          <div style={{ flex: 1 }}>
            <label htmlFor="location" style={styles.filterLabel}>
              Localización
            </label>
            <select
              id="location"
              style={styles.filterInput}
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = styles.filterInputFocus.borderColor)}
              onBlur={(e) => (e.target.style.borderColor = '#AED6F1')}
            >
              <option value="">Seleccionar Localización</option>
              {['Remoto', 'Presencial', 'Quito', 'On-site'].map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón para Limpiar Filtros */}
        <button
          style={styles.resetButton}
          onClick={resetFilters}
          onMouseOver={(e) => Object.assign(e.target.style, styles.resetButtonHover)}
          onMouseOut={(e) => Object.assign(e.target.style, { backgroundColor: styles.resetButton.backgroundColor })}
        >
          <FaExclamationCircle style={styles.resetButtonIcon} />
          Limpiar Filtros
        </button>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div style={styles.errorMessage}>
          <FaExclamationCircle />
          {error}
        </div>
      )}

      {/* Indicador de Carga */}
      {loading && (
        <div style={styles.loadingIndicator}>
          <svg
            style={styles.spinner}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="#21498E"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="#21498E"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Cargando vacantes...</span>
        </div>
      )}

      {/* Lista de Vacantes */}
      <div style={styles.vacancyList}>
        {filteredVacancies.map((vacancy) => (
          <div
            key={vacancy.id}
            style={styles.vacancyCard}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.vacancyCardHover)}
            onMouseOut={(e) =>
              Object.assign(e.currentTarget.style, {
                transform: 'translateY(0)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              })
            }
          >
            {/* Badges de Características */}
            <div style={styles.badges}>
              {vacancy.remote && <span style={styles.badge}>Remoto</span>}
              {vacancy.urgent && <span style={styles.badge}>Urgente</span>}
              {/* Puedes añadir más badges según las características de la vacante */}
            </div>

            {/* Título */}
            <h3 style={styles.vacancyTitle}>{vacancy.position_name}</h3>

            {/* Información de la Vacante */}
            <div style={styles.vacancyDetails}>
              <p style={styles.vacancyDetailsItem}>
                <strong>Localización:</strong> {vacancy.location}
              </p>
              <p style={styles.vacancyDetailsItem}>
                <strong>Aplicantes:</strong> {vacancy.applicants}
              </p>
              <p style={styles.vacancyDetailsItem}>
                <strong>Apertura:</strong> {new Date(vacancy.opened_at).toLocaleDateString()}
              </p>
              <p style={styles.vacancyDetailsItem}>
                <strong>Etapa:</strong> {vacancy.stage}
              </p>
              <p style={styles.vacancyDetailsItem}>
                <strong>Tipo:</strong> {vacancy.type}
              </p>
            </div>

            {/* Botones de Acción */}
            <div style={styles.vacancyActions}>
              <button
                style={styles.detailsButton}
                onClick={() => handleViewDetails(vacancy.id)}
                onMouseOver={(e) => Object.assign(e.target.style, styles.detailsButtonHover)}
                onMouseOut={(e) => Object.assign(e.target.style, styles.detailsButton)}
              >
                <FaEye />
                Detalles
              </button>
              <button
                style={styles.applyButton}
                onClick={() => handleApply(vacancy.id)}
                onMouseOver={(e) => Object.assign(e.target.style, styles.applyButtonHover)}
                onMouseOut={(e) => Object.assign(e.target.style, styles.applyButton)}
              >
                <FaCheck />
                Aplicar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje de No Resultados */}
      {!loading && filteredVacancies.length === 0 && (
        <p style={styles.noResultsMessage}>
          No se encontraron vacantes que coincidan con los filtros seleccionados.
        </p>
      )}

      {/* Botón de Scroll al Principio */}
      {showScrollTop && (
        <button
          style={styles.scrollTopButton}
          onClick={scrollToTop}
          onMouseOver={(e) => Object.assign(e.target.style, styles.scrollTopButtonHover)}
          onMouseOut={(e) => Object.assign(e.target.style, { backgroundColor: styles.scrollTopButton.backgroundColor })}
          aria-label="Volver al inicio"
        >
          <FaArrowUp style={styles.scrollTopIcon} />
        </button>
      )}

      {/* Animaciones clave */}
      <style>
        {`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shake {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(5deg); }
            50% { transform: rotate(0deg); }
            75% { transform: rotate(-5deg); }
            100% { transform: rotate(0deg); }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeOut {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(100%);
            }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default JobVacanciesSearch;
