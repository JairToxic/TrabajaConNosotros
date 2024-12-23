import React, { useState, useEffect, forwardRef } from "react";
import Image from "next/image";
import axios from "axios";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { getUserInfoByToken, getEmployeeByUserID } from "../../services/employee.dao";
 
const SubirCurriculum = ({processId}) => {
  const [cvFile, setCvFile] = useState(null); // Para almacenar el archivo cargado
  const [isUploading, setIsUploading] = useState(false); // Estado para controlar el proceso de carga
  const [uploadError, setUploadError] = useState(null); // Para manejar errores en la carga
  const [successMessage, setSuccessMessage] = useState(""); // Mensaje de éxito
  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error
  const { data: session } = useSession();
  const [userId, setUserId]=useState(null)
  const [type, setType]=useState(null)
  const [preexistingProcess, setPreexistingProcess]=useState(false)

  const handleBackClick = () => {
    window.location.href = `/procesos`;
  };

  useEffect(() => {
    const fetchUserProcess = async () => {
      if (session) {
        try {
          const user = await getUserInfoByToken(session);
          setUserId(user.id)
          try{
            const employee=await getEmployeeByUserID(session, user.id)
            if (employee.status==500){
              setType('External')
            }
            else{
              setType('Internal')
            }
          }
          catch (error){
            console.log(error)
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };
  
    fetchUserProcess();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (type){
        const response = await fetch(`http://51.222.110.107:5012/applicant/search?user_id=${userId}&process_id=${processId}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': '7zXnBjF5PBl7EzG/WhATQw==', 
            'Token':session.user.data.token // Aquí añades la cabecera Authorization
          }
        });
        console.log(response.status)
        if (response.status===200){
          setPreexistingProcess(true)
        }
      }
    };
  
    fetchUserInfo();
  }, [session, type]);

  // Función para manejar la selección del archivo
  const handleFileChange = (event) => {
    setCvFile(event.target.files[0]);
    setUploadError(null);
    setSuccessMessage("");
  };

  // Función para manejar el envío del archivo
  const handleUpload = async () => {

    if (!cvFile) {
      setUploadError("Por favor selecciona un archivo para subir.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setSuccessMessage("");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", cvFile);
    formData.append("user_id", userId);
    formData.append("process_id", processId);
    formData.append("type", type);

    try {
      const res = await axios.post("http://51.222.110.107:5012/applicant/read_cv", formData, {
        headers: {
          "Authorization":"7zXnBjF5PBl7EzG/WhATQw==",
          "Token":session.user.data.token
        },
      });

      // Imprimir la respuesta en la consola (de momento sin redirección)
      console.log("Respuesta del backend:", res.data);
      setSuccessMessage("¡Tu CV ha sido procesado exitosamente!");
 
    } catch (err) {
      setErrorMessage("Error al procesar el archivo. Intenta nuevamente.");
      console.error("Error al procesar el archivo:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {preexistingProcess ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <Image
              src="/check.png" // Replace with the actual path to your check icon
              alt="Check Icon"
              width={100}
              height={100}
            />
          </div>
          <h2 style={{ fontSize: "1.5rem", color: "#333", marginBottom: "20px" }}>
            Usted ya aplicó a este proceso
          </h2>
          <button
            onClick={handleBackClick}
            style={{
              backgroundColor: "#21498E",
              color: "#fff",
              padding: "12px 30px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background-color 0.3s ease",
            }}
          >
            Regresar
          </button>
        </div>
      ) : (
        <div>
          <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Banner */}
      <div style={{ position: "relative", width: "100%", height: "300px" }}>
        <Image
          src="/banner.png" // Cambia por la ruta de tu imagen
          alt="Banner Equipo"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(33, 73, 142, 0.6)", // Filtro oscuro para texto legible
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Únete a</h1>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>Nuestro Equipo</h1>
        </div>
      </div>

      {/* Sección principal */}
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2
          style={{
            color: "#21498E",
            fontSize: "2rem",
            marginBottom: "30px",
          }}
        >
          Subir Curriculum
        </h2>

        {/* Contenedor de las tarjetas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {/* Tarjeta 1 */}
          <div
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                backgroundColor: "#D5E5FF",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#21498E",
                  marginBottom: "10px",
                }}
              >
                Haz tu registro más fácil con nuestra Inteligencia Artificial
              </h3>
            </div>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src="/1.png" // Cambia por la ruta de la imagen correspondiente
                alt="Inteligencia Artificial"
                width={200}
                height={200}
                style={{ marginBottom: "20px" }}
              />
              <p
                style={{
                  color: "#000",
                  fontSize: "0.9rem",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                En nuestra plataforma, hemos integrado un modelo de Inteligencia Artificial que te ahorra tiempo y
                esfuerzo. Subiendo tu CV, nuestro sistema extrae automáticamente toda la información relevante y la
                organiza por ti.
              </p>

              {/* Aquí agregamos el formulario de carga de archivo */}
              <div
                style={{
                  marginBottom: "20px",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  id="fileInput"
                  style={{
                    display: "none", // Ocultamos el input real
                  }}
                />
                <label
                  htmlFor="fileInput"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#21498E",
                    color: "#fff",
                    padding: "12px 30px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "background-color 0.3s ease",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>📁</span>
                  <span>Seleccionar Archivo</span>
                </label>
                {cvFile && (
                  <div
                    style={{
                      marginTop: "15px",
                      color: "#333",
                      fontSize: "1rem",
                    }}
                  >
                    <strong>Archivo seleccionado: </strong> {cvFile.name}
                  </div>
                )}
              </div>

              {/* Botón de carga */}
              <button
                onClick={handleUpload}
                style={{
                  backgroundColor: "#21498E",
                  color: "#fff",
                  padding: "12px 30px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease",
                  marginTop: "15px",
                  position: "relative",
                }}
              >
                {isUploading ? (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "3px solid #fff",
                      borderTop: "3px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "0 auto",
                    }}
                  ></div>
                ) : (
                  "Subir Ahora"
                )}
              </button>

              {/* Mensajes de éxito y error */}
              {uploadError && (
                <div
                  style={{
                    color: "red",
                    marginTop: "15px",
                    fontSize: "1rem",
                  }}
                >
                  {uploadError}
                </div>
              )}
              {successMessage && (
                <div
                  style={{
                    color: "green",
                    marginTop: "15px",
                    fontSize: "1rem",
                  }}
                >
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div
                  style={{
                    color: "red",
                    marginTop: "15px",
                    fontSize: "1rem",
                  }}
                >
                  {errorMessage}
                </div>
              )}
            </div>
          </div>

          {/* Tarjeta 2 */}
          <div
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                backgroundColor: "#D5E5FF",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#21498E",
                  marginBottom: "10px",
                }}
              >
                Diseña tu CV desde 0 con nuestro formato
              </h3>
            </div>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src="/2.png" // Cambia por la ruta de la imagen correspondiente
                alt="Diseño CV"
                width={200}
                height={200}
                style={{ marginBottom: "20px" }}
              />
              <p
                style={{
                  color: "#000",
                  fontSize: "0.9rem",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                ¿No tienes un CV listo? ¡No te preocupes! Nuestra plataforma te permite completar tu registro
                fácilmente llenando un formulario rápido y sencillo, sin necesidad de tener un CV preparado.
              </p>
              <Link
                href="/disenar-cv"
                style={{
                  backgroundColor: "#21498E",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  textDecoration: "none",
                }}
              >
                Realizar Ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
        
      )}
    </>
  );
};

export default SubirCurriculum;
