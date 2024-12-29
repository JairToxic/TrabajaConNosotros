import React, { useState, useEffect, Fragment } from 'react';
import { FaExclamationCircle, FaCheck, FaEye, FaTrash, FaPlus } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react'; // Para modales y transiciones

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
  const [updatingStage, setUpdatingStage] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vacancyToDelete, setVacancyToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Opciones de etapas disponibles
  const stageOptions = ['Reclutamiento', 'Preselección', 'Etapa Final'];

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

  const handleView = (id) => {
    console.log('Ver CVs en la vacante:', id);
    window.location.href = `/admin/trabaja-con-nosotros/vacantes/postulantes/${id}`;
  };

  const openDeleteModal = (id) => {
    setVacancyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setVacancyToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!vacancyToDelete) return;

    try {
      const response = await fetch(`http://51.222.110.107:5012/process/${vacancyToDelete}`, {
        method: 'DELETE',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const updatedVacancies = vacancies.filter(vacancy => vacancy.id !== vacancyToDelete);
      setVacancies(updatedVacancies);
      setFilteredVacancies(updatedVacancies.filter(vacancy => applyCurrentFilters(vacancy)));
      setError(null);
      setSuccessMessage('Vacante eliminada exitosamente.');
      
      // Borrar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error deleting vacancy:', error);
      setErrorMessage('No se pudo eliminar la vacante. Por favor, inténtalo de nuevo más tarde.');
      
      // Borrar el mensaje de error después de 5 segundos
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } finally {
      closeDeleteModal();
    }
  };

  const handleStageUpdate = async (id, newStage) => {
    setUpdatingStage(true);
    try {
      const response = await fetch(`http://51.222.110.107:5012/process/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ stage: newStage })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const updatedVacancies = vacancies.map(vacancy => 
        vacancy.id === id ? { ...vacancy, stage: newStage } : vacancy
      );
      setVacancies(updatedVacancies);
      setFilteredVacancies(updatedVacancies.filter(vacancy => applyCurrentFilters(vacancy)));
      setSuccessMessage('Etapa actualizada exitosamente');
      
      // Borrar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error updating stage:', error);
      setErrorMessage('No se pudo actualizar la etapa. Por favor, inténtalo de nuevo más tarde.');
      
      // Borrar el mensaje de error después de 5 segundos
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } finally {
      setUpdatingStage(false);
    }
  };

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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notificaciones Tipo Toast */}
      <div className="fixed top-5 right-5 z-50">
        {/* Notificación de Éxito */}
        <Transition show={successMessage !== null} as={Fragment}>
          <Transition.Child
            as={Fragment}
            enter="transform transition duration-300"
            enterFrom="translate-y-[-20px] opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transform transition duration-300"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-[-20px] opacity-0"
          >
            <div className="mb-4 w-80 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center shadow-lg">
              <FaCheck className="mr-2" />
              <span>{successMessage}</span>
            </div>
          </Transition.Child>
        </Transition>

        {/* Notificación de Error */}
        <Transition show={errorMessage !== null} as={Fragment}>
          <Transition.Child
            as={Fragment}
            enter="transform transition duration-300"
            enterFrom="translate-y-[-20px] opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transform transition duration-300"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-[-20px] opacity-0"
          >
            <div className="mb-4 w-80 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center shadow-lg">
              <FaExclamationCircle className="mr-2" />
              <span>{errorMessage}</span>
            </div>
          </Transition.Child>
        </Transition>
      </div>

      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Gestión de Vacantes</h2>
          <button 
            onClick={() => window.location.href = '/admin/trabaja-con-nosotros/vacantes/crear-nuevo'}
            className="mt-4 md:mt-0 flex items-center bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-600 transition duration-300 ease-in-out shadow-lg"
          >
            <FaPlus className="mr-2" />
            Crear Vacante
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-gray-100 p-6 rounded-xl shadow-inner mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Filtros de Búsqueda</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-gray-600 mb-2">Nombre del Puesto</label>
              <input 
                type="text"
                placeholder="Buscar por puesto" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 shadow-sm"
                value={filters.positionName}
                onChange={(e) => handleFilterChange('positionName', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Etapa</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 shadow-sm"
                value={filters.stage} 
                onChange={(e) => handleFilterChange('stage', e.target.value)}
              >
                <option value="">Seleccionar Etapa</option>
                {stageOptions.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Tipo</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 shadow-sm"
                value={filters.type} 
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">Todos los Tipos</option>
                {['Full-time', 'Part-Time', 'Interno', 'Externo', 'Jair'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Requisitos Mínimos</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 shadow-sm"
                value={filters.minRequirements} 
                onChange={(e) => handleFilterChange('minRequirements', e.target.value)}
              >
                <option value="">Cualquier Nivel</option>
                {['70', '80', '90'].map(percentage => (
                  <option key={percentage} value={percentage}>
                    {percentage}% o más
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              className="flex items-center bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out shadow-lg"
              onClick={resetFilters}
            >
              <FaExclamationCircle className="mr-2" />
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Indicador de Carga */}
        {loading && (
          <div className="text-center text-gray-500 mb-6">
            <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <p>Cargando vacantes...</p>
          </div>
        )}

        {/* Lista de Vacantes */}
        <div className="grid gap-8">
          {filteredVacancies.map(vacancy => (
            <div 
              key={vacancy.id} 
              className="bg-white shadow-xl rounded-3xl p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-3xl font-bold text-indigo-600">{vacancy.position_name}</h3>
                  <p className="text-gray-600 mt-2"><span className="font-semibold">Localización:</span> {vacancy.location}</p>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-4">
                  <select
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    value={vacancy.stage}
                    onChange={(e) => handleStageUpdate(vacancy.id, e.target.value)}
                    disabled={updatingStage}
                  >
                    {stageOptions.map(stage => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={() => handleView(vacancy.id)}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out shadow-lg"
                  >
                    <FaEye className="mr-2" />
                    Ver Detalles
                  </button>
                  <button 
                    onClick={() => openDeleteModal(vacancy.id)}
                    className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out shadow-lg"
                  >
                    <FaTrash className="mr-2" />
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">Aplicantes:</span>
                  <span className="text-gray-600">{vacancy.applicants}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">Apertura:</span>
                  <span className="text-gray-600">{new Date(vacancy.opened_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">Etapa:</span>
                  <span className={`px-3 py-1 rounded-full text-white ${getStageBadgeColor(vacancy.stage)}`}>
                    {vacancy.stage}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">Tipo:</span>
                  <span className="text-gray-600">{vacancy.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje cuando no hay vacantes filtradas */}
        {!loading && filteredVacancies.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No se encontraron vacantes que coincidan con los filtros seleccionados.
          </p>
        )}

        {/* Modal de Confirmación de Eliminación */}
        <Transition appear show={isDeleteModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Confirmar Eliminación
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar esta vacante? Esta acción no se puede deshacer.
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end space-x-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={closeDeleteModal}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={handleDelete}
                      >
                        Eliminar
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

// Función para asignar colores a las etapas
const getStageBadgeColor = (stage) => {
  switch(stage) {
    case 'Reclutamiento':
      return 'bg-indigo-500';
    case 'Preselección':
      return 'bg-yellow-500';
    case 'Etapa Final':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export default JobVacanciesSearchAdmin;
