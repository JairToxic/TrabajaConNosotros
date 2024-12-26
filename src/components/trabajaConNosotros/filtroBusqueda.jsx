import React, { useState, useEffect } from 'react';

const JobVacanciesSearch = () => {
  // Estado inicial para vacantes y filtros
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [filters, setFilters] = useState({
    positionName: '',
    stage: '',
    type: '',
    location: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Headers comunes para las solicitudes
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': '7zXnBjF5PBl7EzG/WhATQw==',
  };

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
        const openVacancies = data.filter(item => item.stage.toLowerCase() === 'reclutamiento');
        setVacancies(openVacancies);
        setFilteredVacancies(openVacancies);
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
      result = result.filter(vacancy => 
        vacancy.position_name.toLowerCase().includes(currentFilters.positionName.toLowerCase())
      );
    }

    if (currentFilters.stage) {
      result = result.filter(vacancy => 
        vacancy.stage.toLowerCase() === currentFilters.stage.toLowerCase()
      );
    }

    if (currentFilters.type) {
      result = result.filter(vacancy => 
        vacancy.type.toLowerCase() === currentFilters.type.toLowerCase()
      );
    }

    if (currentFilters.location) {
      result = result.filter(vacancy => 
        vacancy.location.toLowerCase() === currentFilters.location.toLowerCase()
      );
    }

    setFilteredVacancies(result);
  };

  // Resetear todos los filtros
  const resetFilters = () => {
    setFilters({
      positionName: '',
      stage: '',
      type: '',
      location: ''
    });
    setFilteredVacancies(vacancies);
  };

  // Manejar el clic en "Aplicar"
  const handleClick = (id) => {
    console.log('Aplicando para la vacante con ID:', id);
    window.location.href = `/aplicar-puesto/${id}`;
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Encabezado */}
        <header className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Búsqueda de Vacantes</h2>
        </header>

        {/* Filtros */}
        <div className="bg-gray-200 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Nombre del Puesto */}
            <input 
              type="text"
              placeholder="Nombre del Puesto" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.positionName}
              onChange={(e) => handleFilterChange('positionName', e.target.value)}
            />

          

            {/* Tipo */}
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Seleccionar Tipo</option>
              {['Full-time', 'Part-Time', 'Interno', 'Externo'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Localización */}
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.location} 
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">Seleccionar Localización</option>
              {['Remoto', 'Presencial','Quito','On-site'].map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Botón para Limpiar Filtros */}
          <div className="mt-6 flex justify-end">
            <button 
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
              onClick={resetFilters}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Indicador de Carga */}
        {loading && (
          <div className="text-center text-gray-500 mb-6">
            Cargando vacantes...
          </div>
        )}

        {/* Lista de Vacantes */}
        <div className="grid gap-6">
          {filteredVacancies.map(vacancy => (
            <div 
              key={vacancy.id} 
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-2xl font-bold text-blue-600">{vacancy.position_name}</h3>
                  <p className="text-gray-600"><strong>Localización:</strong> {vacancy.location}</p>
                </div>
                <button 
                  onClick={() => handleClick(vacancy.id)}
                  className="mt-4 md:mt-0 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
                >
                  Aplicar
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p><strong>Aplicantes:</strong> {vacancy.applicants}</p>
                <p><strong>Apertura:</strong> {new Date(vacancy.opened_at).toLocaleDateString()}</p>
                <p><strong>Etapa:</strong> {vacancy.stage}</p>
                <p><strong>Tipo:</strong> {vacancy.type}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje de No Resultados */}
        {!loading && filteredVacancies.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No se encontraron vacantes que coincidan con los filtros seleccionados.
          </p>
        )}
      </div>
    </div>
  );
};

export default JobVacanciesSearch;
