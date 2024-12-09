import React from 'react';
import styles from './ConfirmacionPopup.module.css'; // Asegúrate de crear este CSS
 
const ConfirmacionPopup = ({ mensaje, onConfirm, onCancel, link, linkText }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Confirmación</h2>
        <p>{mensaje}</p>
       
        {/* Muestra el enlace si se proporciona */}
        {link && (
          <p>
            <a href={link} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {linkText || 'Más información'}
            </a>
          </p>
        )}
       
        <div className={styles.buttonGroup}>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancelar
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default ConfirmacionPopup;