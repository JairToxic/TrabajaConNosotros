"use client";
import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { RecuperarContrasena } from "@src/services/auth.dao";

// Validación con Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("Correo electrónico requerido"),
});

export default function ResetPassword() {
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar el Popup
  const [popupMessage, setPopupMessage] = useState(""); // Estado para almacenar el mensaje del Popup
  const [popupType, setPopupType] = useState("success"); // Estado para controlar si es éxito o error
  const router = useRouter(); // Hook de Next.js para redirigir

  const handleSubmit = async (values) => {
    console.log("Email para resetear contraseña:", values.email);
    const response = await RecuperarContrasena(values.email);

    // Si la solicitud fue exitosa
    if (response.status === 200) {
      setPopupType("success");
      setPopupMessage("Se ha enviado un correo electrónico a su cuenta.");
      setShowPopup(true);
    } else {
      // Mostrar mensaje de error en el popup
      setPopupType("error");
      setPopupMessage(`Error: ${response.message}`);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    if (popupType === "success") {
      router.push(`${process.env.NEXT_URL_LOGIN}/login`); // Redirigir solo si fue éxito
    }
  };

  return (
    <PageContainer>
      <ResetPasswordContainer>
        <LoginUpImageContainer>
          <Image
            src="https://peopleconnectpictures.blob.core.windows.net/login/inova-decoration.svg"
            alt="Login Image"
            width={350}
            height={350}
          />
        </LoginUpImageContainer>
        <InovaLogo>
          <Image
            src="https://peopleconnectpictures.blob.core.windows.net/login/logotipo-inova-larged.svg"
            alt="Login Image"
            width={350}
            height={350}
          />
        </InovaLogo>
        <FormContainer>
          <h1>Resetea tu contraseña</h1>
          <p>
            Ingresa tu correo para recibir un email para poder resetear su
            contraseña
          </p>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur }) => (
              <Form>
                <label>
                  Correo:
                  <Field
                    type="email"
                    name="email"
                    placeholder="Correo"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <ErrorMessage name="email" component={ErrorText} />
                </label>
                <button type="submit">Enviar</button>
              </Form>
            )}
          </Formik>
        </FormContainer>
        <LoginDownImageContainer>
          <Image
            src="https://peopleconnectpictures.blob.core.windows.net/login/inova-decoreation-upside-down.svg"
            alt="Login Image"
            width={350}
            height={350}
          />
        </LoginDownImageContainer>
      </ResetPasswordContainer>

      {showPopup && (
        <Popup>
          <PopupContent>
            <h2>{popupType === "success" ? "¡Éxito!" : "¡Error!"}</h2>
            <p>{popupMessage}</p>
            <button onClick={handleClosePopup}>Aceptar</button>
          </PopupContent>
        </Popup>
      )}
    </PageContainer>
  );
}

// Estilos del popup
const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;

  h2 {
    margin-bottom: 1rem;
  }

  button {
    padding: 0.75rem;
    font-size: 1rem;
    background-color: #21498e;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #9bcb3c;
    }
  }
`;

// Estilos existentes
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f5f5;
  font-family: "Segoe UI", sans-serif;
  padding: 2rem; /* Aumenta el padding para pantallas pequeñas */
  overflow-y: auto; /* Permitir scroll si es necesario */
`;

const ResetPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  width: 100%;
  max-width: 700px;
  padding: 0rem 0rem;
  position: relative;
  margin: 2rem 0; /* Añadido margen para evitar recortes en pantallas pequeñas */

  @media (max-width: 768px) {
    padding: 0rem;
    margin: 0rem; /* Ajusta margen para pantallas móviles */
  }
`;

const FormContainer = styled.div`
  display: flex;
  align-self: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0rem;
  width: 80%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0rem;
    margin-top: 1rem; /* Añadido margen superior para separación */
  }

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    text-align: left;
  }

  p {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: #333;
    text-align: left;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  label {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    color: #333;
    text-align: left;
  }

  input {
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 10px;
    border: 1px solid #ccc;
    margin-top: 0.5rem;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.3s, box-shadow 0.3s;

    &:focus {
      border-color: #21498e;
      box-shadow: 0 0 5px rgba(33, 73, 142, 0.3);
    }
  }

  button {
    padding: 0.75rem;
    font-size: 1rem;
    background-color: #21498e;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
    transition: background-color 0.3s, box-shadow 0.3s;

    &:hover {
      background-color: #9bcb3c;
      box-shadow: 0 5px 15px rgba(155, 203, 60, 0.4);
    }
  }
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const LoginUpImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%; /* Ocupa todo el ancho del componente */
  background-color: #fff;

  img {
    width: 100%; /* La imagen ocupa todo el ancho */
    height: auto; /* Mantiene la proporción de la imagen */
  }
`;

const LoginDownImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #fff;
  padding: 0rem 0; /* Añadido padding para separación */

  img {
    width: 100%;
    height: auto;
  }
`;

const InovaLogo = styled.div`
  position: absolute;
  top: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 1rem;

  img {
    max-width: 150px;
    height: auto;
    transition: transform 0.3s ease-in-out;
  }

  /* Ajustar el tamaño al hacer zoom */
  @media (max-width: 768px) {
    img {
      max-width: 15vw;
    }
  }
`;

