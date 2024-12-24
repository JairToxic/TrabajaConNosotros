"use client";
import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RegistrarUsuario } from "@src/services/auth.dao";
import { useSession } from "next-auth/react";
import FloatingPopup from "./floating-popup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validación de Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("Correo electrónico requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("Contraseña requerida"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Confirmación de contraseña requerida"),
  first_name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "El nombre no puede contener números")
    .required("Nombre requerido"),
  last_name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "El apellido no puede contener números")
    .required("Apellido requerido"),
  identification_type: Yup.string()
    .oneOf(["cedula", "pasaporte"], "Tipo de identificación inválido")
    .required("Tipo de identificación requerido"),
  identification_number: Yup.string()
    .matches(/^\d+$/, "El número de identificación no puede contener letras")
    .required("Número de identificación requerido"),
  birth_date: Yup.date().required("Fecha de nacimiento requerida"),
  phone: Yup.string().required("Teléfono requerido"),
});

export default function Register() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [redirectTo, setRedirectTo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const handleShowPopup = (value) => {
    setShowPopup(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (values) => {
    console.log("Form data:", values);

    const result = await RegistrarUsuario(session, values);
    console.log("Registration response:", result);

    if (result?.status === 200) {
      setPopupMessage("Usuario creado exitosamente.");
      setButtonText("Aceptar");
      setRedirectTo(`${process.env.NEXT_URL_LOGIN}/login`);
      setShowPopup(true);
    } else {
      console.error("Error registering:", result?.message);
      setPopupMessage(`Error: ${result?.message || "Unknown error"}`);
      setButtonText("Cerrar");
      setRedirectTo("#");
      setShowPopup(true);
    }
  };

  return (
    <PageContainer>
      <RegisterContainer>
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
        <RegisterBox>
          <h1>Registrarse en Inova</h1>
          <Formik
            initialValues={{
              email: "",
              password: "",
              confirm_password: "",
              first_name: "",
              last_name: "",
              identification_type: "",
              identification_number: "",
              birth_date: "",
              phone: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, setFieldValue }) => (
              <Form>
                <InputRow>
                  <label>
                    Nombre:
                    <Field
                      type="text"
                      name="first_name"
                      placeholder="Nombre"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.first_name}
                    />
                    <ErrorMessage name="first_name" component={ErrorText} />
                  </label>
                  <label>
                    Apellido:
                    <Field
                      type="text"
                      name="last_name"
                      placeholder="Apellido"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.last_name}
                    />
                    <ErrorMessage name="last_name" component={ErrorText} />
                  </label>
                </InputRow>
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
                <label>
                  Contraseña:
                  <PasswordContainer>
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Contraseña"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <PasswordToggleWrapper onClick={togglePasswordVisibility}>
                      <Image
                        src={
                          showPassword
                            ? "https://peopleconnectpictures.blob.core.windows.net/login/eye_on_icon.svg"
                            : "https://peopleconnectpictures.blob.core.windows.net/login/eye_off_icon.svg"
                        }
                        alt="Show/Hide Password"
                        width={24}
                        height={24}
                      />
                    </PasswordToggleWrapper>
                  </PasswordContainer>
                  <ErrorMessage name="password" component={ErrorText} />
                </label>
                <label>
                  Confirmar Contraseña:
                  <PasswordContainer>
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      placeholder="Confirme su contraseña"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.confirm_password}
                    />
                    <PasswordToggleWrapper onClick={toggleConfirmPasswordVisibility}>
                      <Image
                        src={
                          showConfirmPassword
                            ? "https://peopleconnectpictures.blob.core.windows.net/login/eye_on_icon.svg"
                            : "https://peopleconnectpictures.blob.core.windows.net/login/eye_off_icon.svg"
                        }
                        alt="Show/Hide Password"
                        width={24}
                        height={24}
                      />
                    </PasswordToggleWrapper>
                  </PasswordContainer>
                  <ErrorMessage name="confirm_password" component={ErrorText} />
                </label>

                <label>
                  Fecha de nacimiento:
                  <Field
                    type="date"
                    name="birth_date"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.birth_date}
                  />
                  <ErrorMessage name="birth_date" component={ErrorText} />
                </label>
                <label>
                  Teléfono:
                  <Field
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                  />
                  <ErrorMessage name="phone" component={ErrorText} />
                </label>
                <InputRow>
                  <label>
                    Tipo de identificación:
                    <Field
                      as="select"
                      name="identification_type"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.identification_type}
                    >
                      <option value="">Seleccione un tipo</option>
                      <option value="cedula">Cédula</option>
                      <option value="pasaporte">Pasaporte</option>
                    </Field>
                    <ErrorMessage
                      name="identification_type"
                      component={ErrorText}
                    />
                  </label>
                  <label>
                    Número de identificación:
                    <Field
                      type="text"
                      name="identification_number"
                      placeholder="Número de identificación"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.identification_number}
                    />
                    <ErrorMessage
                      name="identification_number"
                      component={ErrorText}
                    />
                  </label>
                </InputRow>
                <button type="submit">Registrarse</button>
              </Form>
            )}
          </Formik>
        </RegisterBox>
        <LoginDownImageContainer>
          <Image
            src="https://peopleconnectpictures.blob.core.windows.net/login/inova-decoreation-upside-down.svg"
            alt="Login Image"
            width={350}
            height={350}
          />
        </LoginDownImageContainer>
      </RegisterContainer>

      {showPopup && (
        <FloatingPopup
          message={popupMessage}
          buttonText={buttonText}
          redirectTo={redirectTo}
          onClose={handleClosePopup}
        />
      )}
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Cambiado de height a min-height */
  background-color: #f5f5f5;
  font-family: "Segoe UI", sans-serif;
  padding: 2rem; /* Aumenta el padding para pantallas pequeñas */
  overflow-y: auto; /* Permitir scroll si es necesario */
`;

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
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

const RegisterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0rem;
  width: 80%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0rem;
    margin-top: 1rem; /* Añadido margen superior para separación */
  }

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    text-align: center;
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
  }

  input,
  select {
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
    margin-top: 1rem;
    transition: background-color 0.3s, box-shadow 0.3s;

    &:hover {
      background-color: #9bcb3c;
      box-shadow: 0 5px 15px rgba(155, 203, 60, 0.4);
    }
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggleWrapper = styled.div`
  cursor: pointer;
  margin-left: 0.5rem;
  transition: transform 0.2s;
  display: flex;
  position: absolute;
  right: 10px;

  &:hover {
    transform: scale(1.1);
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;

  label {
    flex: 1;
  }

  input,
  select {
    width: 100%;
  }
    @media (max-width: 768px) {
    display: block;
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
