"use client";
import styled from "styled-components";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    console.log("email:", email);
    console.log("password:", password);
    e.preventDefault();
    const responseNextAuth = await signIn("credentials", {
      username: email,
      password: password,
      redirect: false,
    });
    console.log("responseNextAuth:", responseNextAuth);
    if (responseNextAuth?.ok === false) {
      console.error("Error signing in:", responseNextAuth.error);
    } else {
      router.push("http://51.222.110.107:3005/home");
    }
  };

  return (
    <PageContainer>
      <LoginContainer>
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
        <LoginBox>
          <h1>Bienvenido a Inova</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Correo:
              <input
                type="text"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Contraseña:
              <PasswordContainer>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <PasswordToggleWrapper
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Image
                    src="https://peopleconnectpictures.blob.core.windows.net/login/eye_off_icon.svg"
                    alt="Mostrar/Ocultar Contraseña"
                    width={24}
                    height={24}
                  />
                </PasswordToggleWrapper>
              </PasswordContainer>
            </label>
            <ForgotPasswordLink>
              <a href={`${process.env.NEXT_URL_LOGIN}/forgot-password`}>¿Olvidaste la contraseña?</a>
            </ForgotPasswordLink>
            <button type="submit">Iniciar Sesión</button>
          </form>
          <p>
            ¿Aún no tienes cuenta? <a href={`${process.env.NEXT_URL_LOGIN}/register`}>Regístrate</a>
          </p>
        </LoginBox>
        <LoginDownImageContainer>
          <Image
            src="https://peopleconnectpictures.blob.core.windows.net/login/inova-decoreation-upside-down.svg"
            alt="Login Image"
            width={350}
            height={350}
          />
        </LoginDownImageContainer>
      </LoginContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Cambiado de height a min-height */
  background-color: #fafafa;
  font-family: "Segoe UI", sans-serif;
  padding: 2rem; /* Aumenta el padding para pantallas pequeñas */
  overflow-y: auto; /* Permitir scroll si es necesario */
`;

const LoginContainer = styled.div`
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

const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0rem;
  width: 80%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1.5rem;
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
      box-shadow: 0 0 5px rgba(33, 73, 142, 0.3); /* Added shadow on focus */
    }
  }

  a {
    color: #003366;
    text-decoration: none;
    position: relative;
    display: inline-block;

    &:after {
      content: "";
      position: absolute;
      width: 0;
      height: 2px;
      display: block;
      background: #003366;
      transition: width 0.3s;
    }

    &:hover:after {
      width: 100%; /* Hover effect */
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

  p {
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #666;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
const PasswordToggleWrapper = styled.div`
  cursor: pointer;
  margin-left: 0.5rem; /* Added margin for spacing */
  transition: transform 0.2s;
  display: flex; /* Ensure it's flex to align properly */
  position: absolute;
  right: 10px;

  &:hover {
    transform: scale(1.1); /* Slight zoom effect on hover */
  }
`;

const ForgotPasswordLink = styled.div`
  & {
    display: flex;
    justify-content: flex-end;
  }
  a {
    cursor: pointer;
    color: #003366;
    text-decoration: none;
    position: relative;
    display: inline-block;

    &:after {
      content: "";
      position: absolute;
      width: 0;
      height: 2px;
      display: block;
      background: #003366;
      transition: width 0.3s;
    }

    &:hover:after {
      width: 100%; /* Hover effect */
    }
  }
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

