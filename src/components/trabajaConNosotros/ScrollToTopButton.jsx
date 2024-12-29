// ScrollToTopButton.jsx
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Función para verificar la posición del scroll
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) { // Puedes ajustar este valor
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Agregar y limpiar el event listener de scroll
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Función para desplazarse al inicio
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Desplazamiento suave
    });
  };

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300 z-50"
        aria-label="Volver al inicio"
      >
        <FaArrowUp />
      </button>
    )
  );
};

export default ScrollToTopButton;
