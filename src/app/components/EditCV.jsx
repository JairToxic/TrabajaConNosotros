import { useState, useEffect } from 'react';

const EditCV = ({ cvData }) => {
  const [editedData, setEditedData] = useState(cvData);

  useEffect(() => {
    setEditedData(cvData);
  }, [cvData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(editedData);
    // Aquí puedes enviar los datos al servidor si lo deseas
  };

  return (
    <div className="edit-cv-container">
      <h2>Editar CV</h2>
      <form onSubmit={handleSubmit} className="edit-cv-form">
        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={editedData.nombre || ''}
            onChange={handleChange}
          />
        </div>

        {/* Correo */}
        <div className="form-group">
          <label htmlFor="correo">Correo</label>
          <input
            type="email"
            id="correo"
            name="Correo"
            value={editedData.Correo || ''}
            onChange={handleChange}
          />
        </div>

        {/* Número de Teléfono */}
        <div className="form-group">
          <label htmlFor="numeroTelefono">Número de Teléfono</label>
          <input
            type="text"
            id="numeroTelefono"
            name="numeroTelefono"
            value={editedData.numeroTelefono || ''}
            onChange={handleChange}
          />
        </div>

        {/* Idiomas */}
        <div className="form-group">
          <label htmlFor="lenguaje1">Lenguaje 1</label>
          <input
            type="text"
            id="lenguaje1"
            name="Lenguaje1"
            value={editedData.Lenguaje1 || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lenguaje2">Lenguaje 2</label>
          <input
            type="text"
            id="lenguaje2"
            name="Lenguaje2"
            value={editedData.Lenguaje2 || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lenguaje3">Lenguaje 3</label>
          <input
            type="text"
            id="lenguaje3"
            name="Lenguaje3"
            value={editedData.Lenguaje3 || ''}
            onChange={handleChange}
          />
        </div>

        {/* Proyectos */}
        <div className="form-group">
          <label htmlFor="NameProyect1">Nombre del Proyecto 1</label>
          <input
            type="text"
            id="NameProyect1"
            name="NameProyect1"
            value={editedData.NameProyect1 || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="NameProyect2">Nombre del Proyecto 2</label>
          <input
            type="text"
            id="NameProyect2"
            name="NameProyect2"
            value={editedData.NameProyect2 || ''}
            onChange={handleChange}
          />
        </div>

        {/* Información sobre Experiencia y Fecha de Trabajo */}
        <div className="form-group">
          <label htmlFor="ExpereincaiNombreEmpresa1">Nombre de la Empresa 1</label>
          <input
            type="text"
            id="ExpereincaiNombreEmpresa1"
            name="ExpereincaiNombreEmpresa1"
            value={editedData.ExpereincaiNombreEmpresa1 || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="FechaTrabajo1">Fecha de Trabajo 1</label>
          <input
            type="text"
            id="FechaTrabajo1"
            name="FechaTrabajo1"
            value={editedData.FechaTrabajo1 || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="FechaTrabajo2">Fecha de Trabajo 2</label>
          <input
            type="text"
            id="FechaTrabajo2"
            name="FechaTrabajo2"
            value={editedData.FechaTrabajo2 || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="FechaTrabajo3">Fecha de Trabajo 3</label>
          <input
            type="text"
            id="FechaTrabajo3"
            name="FechaTrabajo3"
            value={editedData.FechaTrabajo3 || ''}
            onChange={handleChange}
          />
        </div>

        {/* Certificaciones */}
        <div className="form-group">
          <label htmlFor="ListaCertificaciones">Certificaciones</label>
          <input
            type="text"
            id="ListaCertificaciones"
            name="ListaCertificaciones"
            value={editedData.ListaCertificaciones?.map(cert => cert.name).join(', ') || ''}
            onChange={handleChange}
          />
        </div>

        {/* Otros campos */}
        <div className="form-group">
          <label htmlFor="estadoCivil">Estado Civil</label>
          <input
            type="text"
            id="estadoCivil"
            name="estadoCivil"
            value={editedData.estadoCivil || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={editedData.direccion || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Nacionalidad">Nacionalidad</label>
          <input
            type="text"
            id="Nacionalidad"
            name="Nacionalidad"
            value={editedData.Nacionalidad || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cumpleaños">Cumpleaños</label>
          <input
            type="text"
            id="cumpleaños"
            name="cumpleaños"
            value={editedData.cumpleaños || ''}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn">Guardar cambios</button>
      </form>

      <style jsx>{`
        .edit-cv-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h2 {
          text-align: center;
          color: #333;
        }

        .edit-cv-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          font-weight: bold;
          margin-bottom: 5px;
          color: #333;
        }

        .form-group input {
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
          color: #000;
          background-color: #fff;
        }

        .form-group input:focus {
          border-color: #4CAF50;
        }

        .submit-btn {
          padding: 10px;
          background-color: #4CAF50;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .submit-btn:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default EditCV;
