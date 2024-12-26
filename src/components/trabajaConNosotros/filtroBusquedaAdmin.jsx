import React, { useState, useEffect } from 'react';

const JobVacanciesSearchAdmin = () => {
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [filters, setFilters] = useState({
    positionName: '',
    stage: '',
    type: '',
    minRequirements: ''
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
        const openVacancies = data.filter(item => item.stage.toLowerCase() === 'abierto');
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

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

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

    if (currentFilters.minRequirements) {
      result = result.filter(vacancy => 
        parseFloat(vacancy.requirements_percentages) >= parseFloat(currentFilters.minRequirements)
      );
    }

    setFilteredVacancies(result);
  };

  const resetFilters = () => {
    setFilters({
      positionName: '',
      stage: '',
      type: '',
      minRequirements: ''
    });
    setFilteredVacancies(vacancies);
  };

  const handleClick = (id) => {
    console.log('Ver CVs en la vacante:', id);
    window.location.href = `/admin/trabaja-con-nosotros/vacantes/postulantes/${id}`;
  };

  // Función para eliminar una vacante
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta vacante? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://51.222.110.107:5012/process/${id}`, {
        method: 'DELETE',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      // Actualizar el estado eliminando la vacante eliminada
      const updatedVacancies = vacancies.filter(vacancy => vacancy.id !== id);
      setVacancies(updatedVacancies);
      setFilteredVacancies(updatedVacancies.filter(vacancy => applyCurrentFilters(vacancy)));
      setError(null);
      alert('Vacante eliminada exitosamente.');
    } catch (error) {
      console.error('Error deleting vacancy:', error);
      setError('No se pudo eliminar la vacante. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  // Función auxiliar para aplicar filtros actuales a una vacante
  const applyCurrentFilters = (vacancy) => {
    const { positionName, stage, type, minRequirements } = filters;

    if (positionName && !vacancy.position_name.toLowerCase().includes(positionName.toLowerCase())) {
      return false;
    }

    if (stage && vacancy.stage.toLowerCase() !== stage.toLowerCase()) {
      return false;
    }

    if (type && vacancy.type.toLowerCase() !== type.toLowerCase()) {
      return false;
    }

    if (minRequirements && parseFloat(vacancy.requirements_percentages) < parseFloat(minRequirements)) {
      return false;
    }

    return true;
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Encabezado */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Búsqueda de Vacantes</h2>
          <button 
            onClick={() => window.location.href = '/admin/trabaja-con-nosotros/vacantes/crear'}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Crear Nueva Vacante
          </button>
        </header>

        {/* Filtros */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Nombre del Puesto */}
            <input 
              type="text"
              placeholder="Nombre del Puesto" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.positionName}
              onChange={(e) => handleFilterChange('positionName', e.target.value)}
            />

            {/* Etapa */}
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.stage} 
              onChange={(e) => handleFilterChange('stage', e.target.value)}
            >
              <option value="">Seleccionar Etapa</option>
              {['Reclutamiento', 'Entrevistas', 'Selección'].map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>

            {/* Tipo */}
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Seleccionar Tipo</option>
              {['Full-time', 'Part-Time', 'Interno', 'Externo', 'Jair'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Requisitos Mínimos */}
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.minRequirements} 
              onChange={(e) => handleFilterChange('minRequirements', e.target.value)}
            >
              <option value="">Requisitos Mínimos</option>
              {['70', '80', '90'].map(percentage => (
                <option key={percentage} value={percentage}>
                  {percentage}% o más
                </option>
              ))}
            </select>
          </div>

          {/* Botón para Limpiar Filtros */}
          <div className="mt-4 flex justify-end">
            <button 
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
              onClick={resetFilters}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {/* Indicador de Carga */}
        {loading && (
          <div className="text-center text-gray-500 mb-4">
            Cargando vacantes...
          </div>
        )}

        {/* Lista de Vacantes */}
        <div className="grid gap-6">
          {filteredVacancies.map(vacancy => (
            <div 
              key={vacancy.id} 
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow relative"
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="text-xl font-bold text-blue-600">{vacancy.position_name}</h3>
                  <p className="text-gray-600"><strong>Localización:</strong> {vacancy.location}</p>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4 mt-4 md:mt-0">
                  <button 
                    onClick={() => handleClick(vacancy.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition mb-2 md:mb-0"
                  >
                    Ver Detalles
                  </button>
                  <button 
                    onClick={() => handleDelete(vacancy.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

export default JobVacanciesSearchAdmin;
