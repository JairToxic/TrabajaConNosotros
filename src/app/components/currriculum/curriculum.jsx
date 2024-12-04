'use client';

import Image from 'next/image';

const CurriculumVitae = () => {
  return (
    <div className="cv-container">
      {/* Encabezado con fondo de imagen */}
      <div className="header">
        <h1>Datos de Curriculum Vitae</h1>
      </div>

      {/* Sección de Datos Personales */}
      <div className="section">
        <h2 className="section-title">Datos Personales:</h2>
        <div className="personal-info">
          <div className="form-grid">
            <InputField label="Nombre" value="Juan José" />
            <InputField label="Apellido" value="Perez" />
            <InputField label="Día de nacimiento" value="09/09/1999" />
            <InputField label="Cédula" value="173456789" />
            <InputField label="Nacionalidad" value="Ecuatoriana" />
            <InputField label="Estado Civil" value="Casado" />
            <InputField label="Teléfono" value="0957213456" />
            <InputField label="Correo" value="jose@gmail.com" />
            <InputField label="Dirección" value="Juan José" />
          </div>
          <div className="photo-section">
            <Image src="/perfil.png" alt="Foto" width={250} height={250} className="profile-photo" />
            <button>Cambiar Foto</button>
          </div>
        </div>
      </div>

      {/* Estilos */}
      <style jsx>{`
        .cv-container {
          background-color: #ffffff;
          padding: 20px;
        }

        .header {
          background: url('/fondo.png') no-repeat center center;
          background-size: cover;
          padding: 40px;
          text-align: center;
          color: white;
        }

        h1 {
          font-size: 28px;
          margin: 0;
        }

        .section-title {
          color: black;
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: bold;
        }

        .section {
          margin: 20px 0;
        }

        .personal-info {
          display: flex;
          justify-content: space-between;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          width: 65%;
          color:black;
        }

        .photo-section {
          width: 30%;
          text-align: center;
        }

        .profile-photo {
          width: 100%;
          height: auto;
          border-radius: 10px;
        }

        button {
          background-color: #397fc7;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }

        .input-group label {
          color: black;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

// Componente reutilizable para los campos de entrada
const InputField = ({ label, value }) => (
  <div className="input-group">
    <label>{label}:</label>
    <input type="text" value={value} readOnly />
    <style jsx>{`
      .input-group {
        display: flex;
        flex-direction: column;
      }

      input {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f3f3f3;
      }
    `}</style>
  </div>
);

export default CurriculumVitae;
