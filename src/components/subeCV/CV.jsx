import Image from "next/image";
import Link from "next/link";

const SubirCurriculum = () => {
  return (
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
              <Link
                href="/subir-cv"
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
                Subir Ahora
              </Link>
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
  );
};

export default SubirCurriculum;
