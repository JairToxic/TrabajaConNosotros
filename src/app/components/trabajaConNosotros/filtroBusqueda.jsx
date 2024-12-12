import React, { useState, useEffect } from 'react';

const JobVacanciesSearch = () => {
  // Initial state for vacancies and filters
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [filters, setFilters] = useState({
    positionName: '',
    stage: '',
    type: '',
    minRequirements: ''
  });

  // Fetch vacancies on component mount
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await fetch('http://localhost:5001/vacancies');
        const data = await response.json();
        setVacancies(data);
        setFilteredVacancies(data);
      } catch (error) {
        console.error('Error fetching vacancies:', error);
      }
    };

    fetchVacancies();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Apply filters to vacancies
  const applyFilters = (currentFilters) => {
    let result = vacancies;

    // Filter by position name
    if (currentFilters.positionName) {
      result = result.filter(vacancy => 
        vacancy.position_name.toLowerCase().includes(currentFilters.positionName.toLowerCase())
      );
    }

    // Filter by stage
    if (currentFilters.stage) {
      result = result.filter(vacancy => 
        vacancy.stage.toLowerCase() === currentFilters.stage.toLowerCase()
      );
    }

    // Filter by type
    if (currentFilters.type) {
      result = result.filter(vacancy => 
        vacancy.type.toLowerCase() === currentFilters.type.toLowerCase()
      );
    }

    // Filter by minimum requirements percentage
    if (currentFilters.minRequirements) {
      result = result.filter(vacancy => 
        parseFloat(vacancy.requirements_percentages) >= parseFloat(currentFilters.minRequirements)
      );
    }

    setFilteredVacancies(result);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      positionName: '',
      stage: '',
      type: '',
      minRequirements: ''
    });
    setFilteredVacancies(vacancies);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h2 className="text-xl font-bold text-gray-800">Búsqueda de Vacantes</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Position Name Filter */}
            <input 
              type="text"
              placeholder="Nombre del Puesto" 
              className="w-full p-2 border rounded"
              value={filters.positionName}
              onChange={(e) => handleFilterChange('positionName', e.target.value)}
            />

            {/* Stage Filter */}
            <select 
              className="w-full p-2 border rounded"
              value={filters.stage} 
              onChange={(e) => handleFilterChange('stage', e.target.value)}
            >
              <option value="">Seleccionar Etapa</option>
              {['Reclutamiento', 'Entrevistas', 'Selección'].map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select 
              className="w-full p-2 border rounded"
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Seleccionar Tipo</option>
              {['Interno', 'Externo'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Minimum Requirements Filter */}
            <select 
              className="w-full p-2 border rounded"
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

          {/* Reset Filters Button */}
          <button 
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mb-4" 
            onClick={resetFilters}
          >
            Limpiar Filtros
          </button>

          {/* Vacancies List */}
          <div className="grid gap-4">
            {filteredVacancies.map(vacancy => (
              <div 
                key={vacancy.id} 
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold mb-2">{vacancy.position_name}</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  <p><strong>Etapa:</strong> {vacancy.stage}</p>
                  <p><strong>Tipo:</strong> {vacancy.type}</p>
                  <p><strong>Vacantes:</strong> {vacancy.number_of_vacancies}</p>
                  <p><strong>Requisitos:</strong> {vacancy.requirements_percentages}</p>
                  <p><strong>Competencias:</strong> {vacancy.competencies_percentages}</p>
                  <p><strong>Apertura:</strong> {new Date(vacancy.opened_at).toLocaleDateString()}</p>
                  <p className="md:col-span-2"><strong>Descripción:</strong> {vacancy.description}</p>
                  <p className="md:col-span-2"><strong>Beneficios:</strong> {vacancy.benefits}</p>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredVacancies.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No se encontraron vacantes que coincidan con los filtros seleccionados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobVacanciesSearch;