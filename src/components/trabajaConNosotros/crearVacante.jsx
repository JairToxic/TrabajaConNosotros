'use client'

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componente HoverButton para efectos de hover
const HoverButton = ({ children, style, ...props }) => {
  const [hover, setHover] = useState(false);

  const hoverStyle = {
    backgroundColor: hover ? "#2c5282" : style.backgroundColor,
    transform: hover ? "scale(1.02)" : "scale(1)",
  };

  return (
    <button
      style={{ ...style, ...hoverStyle }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      {children}
    </button>
  );
};

const NuevaVacante = () => {
  const [completado, setCompletado] = useState(0);
  const { data: session } = useSession();
  
  // Estado para campos estáticos
  const [formData, setFormData] = useState({
    departamento: "",
    nombreVacante: "",
    numeroVacantes: "",
    solicitadoPor: "",
    aprobadoPor: "",
    tipo: "",
    modalidadTrabajo: "",
    nivelExperiencia: "",
    fechaFin: "",
    descripcion: "",
  });

  // Estado para beneficios dinámicos
  const [beneficios, setBeneficios] = useState([{ id: Date.now(), texto: "" }]);

  // Estados para la sección dinámica
  const [formacionAcademica, setFormacionAcademica] = useState([]);
  const [experienciaCargo, setExperienciaCargo] = useState([]);
  const [certificacionesCargo, setCertificacionesCargo] = useState([]);
  const [competenciasCargo, setCompetenciasCargo] = useState([]);

  // Errores
  const [errors, setErrors] = useState({});
  const [sumErrors, setSumErrors] = useState({
    encajePerfil: false,
    competencias: false,
  });

  // Departamentos
  const [departamentos, setDepartamentos] = useState([]);
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(true);
  const [errorDepartamentos, setErrorDepartamentos] = useState(null);

  // Perfiles
  const [perfiles, setPerfiles] = useState([]);
  const [loadingPerfiles, setLoadingPerfiles] = useState(false);
  const [errorPerfiles, setErrorPerfiles] = useState(null);

  // Perfil seleccionado
  const [selectedPerfil, setSelectedPerfil] = useState(null);

  // Sumas para validar
  const [sumEncajePerfil, setSumEncajePerfil] = useState(0);
  const [sumCompetencias, setSumCompetencias] = useState(0);

  // Efecto para encaje perfil
  useEffect(() => {
    const sumaFormacion = formacionAcademica.reduce((acc, cur) => acc + Number(cur.porcentaje || 0), 0);
    const sumaCertificaciones = certificacionesCargo.reduce((acc, cur) => acc + Number(cur.porcentaje || 0), 0);
    const sumaExperiencia = experienciaCargo.reduce((acc, cur) => acc + Number(cur.porcentaje || 0), 0);
    setSumEncajePerfil(sumaFormacion + sumaCertificaciones + sumaExperiencia);
  }, [formacionAcademica, certificacionesCargo, experienciaCargo]);

  // Efecto para competencias
  useEffect(() => {
    const totalComp = competenciasCargo.reduce((acc, cur) => acc + Number(cur.porcentaje || 0), 0);
    setSumCompetencias(totalComp);
  }, [competenciasCargo]);

  // Efecto para progreso
  useEffect(() => {
    const inputs = document.querySelectorAll(
      "input[required], textarea[required], select[required]"
    );
    const llenos = Array.from(inputs).filter((i) => i.value.trim() !== "").length;
    const total = inputs.length;
    setCompletado(total > 0 ? Math.round((llenos / total) * 100) : 0);
  }, [
    formData,
    formacionAcademica,
    experienciaCargo,
    certificacionesCargo,
    competenciasCargo,
    beneficios,
    perfiles,
  ]);

  // Manejo de cambios en formData
  const handleStaticChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }

    if (name === "departamento") {
      setSelectedPerfil(null);
      setPerfiles([]);
      if (value) {
        fetchPerfiles(value);
      }
    }
  };

  // Manejo de cambios en campos dinámicos
  const handleDynamicChange = (e, tipo, index) => {
    const { name, value } = e.target;
    // Por ejemplo, si en el input tenemos name="nombre" o name="porcentaje"

    // Haremos una copia del array correspondiente
    let copia;
    let setStateFn;

    switch (tipo) {
      case "formacionAcademica":
        copia = [...formacionAcademica];
        setStateFn = setFormacionAcademica;
        break;
      case "experienciaCargo":
        copia = [...experienciaCargo];
        setStateFn = setExperienciaCargo;
        break;
      case "certificacionesCargo":
        copia = [...certificacionesCargo];
        setStateFn = setCertificacionesCargo;
        break;
      case "competenciasCargo":
        copia = [...competenciasCargo];
        setStateFn = setCompetenciasCargo;
        break;
      default:
        return;
    }

    // Actualizamos el campo que está cambiando
    copia[index][name] = value;
    // Actualizamos el estado
    setStateFn(copia);

    // Si el campo deja de estar vacío, limpiamos el error
    if (value.trim() !== "") {
      setErrors((prev) => ({
        ...prev,
        [`${tipo}_${index}_${name}`]: false,
      }));
    }
  };

  // Cargar perfiles
  const fetchPerfiles = async (departmentId) => {
    setLoadingPerfiles(true);
    setErrorPerfiles(null);
    try {
      const url = `http://51.222.110.107:5011/perfiles/by_department/${departmentId}`;
      const token = session.user.data.token;
      const authorization = "7zXnBjF5PBl7EzG/WhATQw==";

      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Token: token,
          Authorization: authorization,
        },
      });
      if (!resp.ok) {
        throw new Error(`Error: ${resp.status} ${resp.statusText}`);
      }
      const data = await resp.json();
      setPerfiles(data);
      setLoadingPerfiles(false);
    } catch (error) {
      console.error("Error al obtener perfiles descriptivos:", error);
      setErrorPerfiles(error.message);
      setLoadingPerfiles(false);
    }
  };

  // Manejar selección de perfil
  const handlePerfilChange = (e) => {
    const perfilId = e.target.value;
    if (!perfilId) {
      setSelectedPerfil(null);
      return;
    }
    const perfilSeleccionado = perfiles.find((p) => String(p._id) === String(perfilId));
    setSelectedPerfil(perfilSeleccionado);
    setErrors((prev) => ({ ...prev, perfilDescriptivo: false }));
    if (perfilSeleccionado) {
      procesarPerfilDescriptivo(perfilSeleccionado);
    }
  };

  const procesarPerfilDescriptivo = (perfil) => {
    if (!perfil || !perfil.datos_e_identificacion_del_cargo) return;

    const teletrabajoVal =
      perfil.datos_e_identificacion_del_cargo[0]?.teletrabajo || "";
    const modalidad = teletrabajoVal.toLowerCase() === "si" ? "Remoto" : "Presencial";
    const nombreVacante =
      perfil.datos_e_identificacion_del_cargo[0]?.nombre_del_cargo || "";

    const formaciones = perfil.perfiles_detalle?.[0]?.perfilDuro?.formacion || [];
    let sumaExp = 0;

    const arrFormacion = [];
    const arrCerts = [];
    const arrExperiencia = [];
    const arrCompetencias =
      perfil.competencias_requeridas?.[0]?.competencias.map((comp) => ({
        nombre: comp.descripcion,
        porcentaje: "",
      })) || [];

    formaciones.forEach((f) => {
      if (Array.isArray(f)) {
        f.forEach((item) => {
          if (item.posgrado && item.posgrado !== "N/A") {
            arrFormacion.push({
              nombre: `Posgrado: ${item.posgrado} (${item.tiempoPosgrado})`,
              porcentaje: "",
            });
          }
          if (item.idioma && item.idioma !== "N/A") {
            arrFormacion.push({
              nombre: `Idioma: ${item.idioma} (${item.tiempoIdioma})`,
              porcentaje: "",
            });
          }
          if (item.experiencia && item.experiencia !== "N/A") {
            const match = item.tiempoExperiencia.match(/\d+/);
            if (match) {
              const anios = parseInt(match[0], 10);
              sumaExp += anios;
              arrExperiencia.push({
                nombre: item.experiencia,
                porcentaje: "", // Ahora se trata como porcentaje
              });
            }
          }
          if (item.certificacion && item.certificacion !== "N/A") {
            arrCerts.push({
              nombre: item.certificacion,
              porcentaje: "",
            });
          }
        });
      } else if (f && typeof f === "object") {
        if (f.experiencia && f.experiencia !== "N/A") {
          const match = f.tiempoExperiencia.match(/\d+/);
          if (match) {
            const anios = parseInt(match[0], 10);
            sumaExp += anios;
            arrExperiencia.push({
              nombre: f.experiencia,
              porcentaje: "", // Ahora se trata como porcentaje
            });
          }
        }
      }
    });

    setFormData((prev) => ({
      ...prev,
      modalidadTrabajo: modalidad,
      nombreVacante: nombreVacante,
      nivelExperiencia: sumaExp ? `${sumaExp} años` : "",
    }));

    if (arrFormacion.length > 0) setFormacionAcademica(arrFormacion);
    if (arrCerts.length > 0) setCertificacionesCargo(arrCerts);
    if (arrCompetencias.length > 0) setCompetenciasCargo(arrCompetencias);
    if (arrExperiencia.length > 0) setExperienciaCargo(arrExperiencia);
  };

  // Agregar campo
  const agregarCampo = (tipo) => {
    const nuevoCampo =
      tipo === "beneficios"
        ? { id: Date.now(), texto: "" }
        : { nombre: "", porcentaje: "" };
    switch (tipo) {
      case "formacionAcademica":
        setFormacionAcademica((prev) => [...prev, nuevoCampo]);
        break;
      case "experienciaCargo":
        setExperienciaCargo((prev) => [...prev, nuevoCampo]);
        break;
      case "certificacionesCargo":
        setCertificacionesCargo((prev) => [...prev, nuevoCampo]);
        break;
      case "competenciasCargo":
        setCompetenciasCargo((prev) => [...prev, nuevoCampo]);
        break;
      case "beneficios":
        setBeneficios((prev) => [...prev, nuevoCampo]);
        break;
      default:
        break;
    }
  };

  // Eliminar campo
  const eliminarCampo = (tipo, index) => {
    switch (tipo) {
      case "formacionAcademica":
        setFormacionAcademica((prev) => prev.filter((_, i) => i !== index));
        break;
      case "experienciaCargo":
        setExperienciaCargo((prev) => prev.filter((_, i) => i !== index));
        break;
      case "certificacionesCargo":
        setCertificacionesCargo((prev) => prev.filter((_, i) => i !== index));
        break;
      case "competenciasCargo":
        setCompetenciasCargo((prev) => prev.filter((_, i) => i !== index));
        break;
      case "beneficios":
        if (beneficios.length > 1) {
          setBeneficios((prev) => prev.filter((_, i) => i !== index));
        } else {
          toast.error("Debe haber al menos un beneficio.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        break;
      default:
        break;
    }
  };

  // Manejar cambios en beneficios
  const handleBeneficioChange = (e, index) => {
    const { value } = e.target;
    const copia = [...beneficios];
    copia[index].texto = value;
    setBeneficios(copia);

    if (value.trim() !== "") {
      setErrors((prev) => ({
        ...prev,
        [`beneficios_${index}_texto`]: false,
      }));
    }
  };

  const construirPorcentajes = (campos) => {
    return campos
      .map((c) => `${c.porcentaje}% ${c.nombre}`)
      .join(", ");
  };

  // Envío de formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    let nuevosErrores = {};
    let nuevosSumErrors = { encajePerfil: false, competencias: false };

    // Validar campos estáticos
    Object.keys(formData).forEach((key) => {
      if (formData[key].trim() === "") {
        valid = false;
        nuevosErrores[key] = true;
        toast.error(`El campo "${key}" es requerido.`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    });

    // Validar perfil
    if (!selectedPerfil) {
      valid = false;
      nuevosErrores.perfilDescriptivo = true;
      toast.error("Por favor, selecciona un Perfil Descriptivo.", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    // Validar beneficios
    beneficios.forEach((b, i) => {
      if (b.texto.trim() === "") {
        valid = false;
        nuevosErrores[`beneficios_${i}_texto`] = true;
        toast.error(`El beneficio ${i + 1} es requerido.`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    });

    // Validar campos dinámicos
    const validarCamposDinamicos = (campos, tipo) => {
      campos.forEach((c, i) => {
        if (c.nombre && c.nombre.trim() === "") {
          valid = false;
          nuevosErrores[`${tipo}_${i}_nombre`] = true;
          toast.error(`El campo "${tipo} - Nombre" en el ítem ${i + 1} es requerido.`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
        if (
          c.porcentaje === "" ||
          isNaN(c.porcentaje) ||
          Number(c.porcentaje) < 0 ||
          Number(c.porcentaje) > 100
        ) {
          valid = false;
          nuevosErrores[`${tipo}_${i}_porcentaje`] = true;
          toast.error(`El campo "${tipo} - Porcentaje" en el ítem ${i + 1} debe ser un número entre 0 y 100.`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      });
    };

    validarCamposDinamicos(formacionAcademica, "Formación Académica");
    validarCamposDinamicos(certificacionesCargo, "Certificaciones");
    validarCamposDinamicos(competenciasCargo, "Competencias");
    validarCamposDinamicos(experienciaCargo, "Experiencia");

    // Validar sumas
    if (sumEncajePerfil > 100) {
      valid = false;
      nuevosSumErrors.encajePerfil = true;
      toast.error("La suma de los porcentajes en 'Análisis de Encaje de Perfil' no debe exceder 100%.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (sumCompetencias !== 100) {
      valid = false;
      nuevosSumErrors.competencias = true;
      toast.error("La suma de los porcentajes en 'Competencias' debe ser exactamente 100%.", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    setErrors(nuevosErrores);
    setSumErrors(nuevosSumErrors);

    if (!valid) {
      return;
    }

    // Construir payload
    const payload = {
      position_id: selectedPerfil._id,
      position_name: formData.nombreVacante,
      number_of_vacancies: Number(formData.numeroVacantes),
      requirements_percentages:
        construirPorcentajes(formacionAcademica) +
        ", " +
        construirPorcentajes(experienciaCargo) +
        ", " +
        construirPorcentajes(certificacionesCargo),
      competencies_percentages: construirPorcentajes(competenciasCargo),
      location: formData.modalidadTrabajo,
      approved_by: formData.aprobadoPor,
      description: formData.descripcion,
      type: formData.tipo,
      deadline: new Date(formData.fechaFin).toISOString(),
      benefits: beneficios.map((x) => x.texto).join(", "),
    };

    const token = session.user.data.token;
    const authorization = "7zXnBjF5PBl7EzG/WhATQw==";

    try {
      const response = await fetch("http://51.222.110.107:5012/process/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: token,
          Authorization: authorization,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Error al enviar los datos: ${response.status} ${response.statusText}`
        );
      }

      const resData = await response.json();
      console.log("Respuesta del servidor:", resData);
      toast.success("Vacante creada exitosamente.", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset
      setFormData({
        departamento: "",
        nombreVacante: "",
        numeroVacantes: "",
        solicitadoPor: "",
        aprobadoPor: "",
        tipo: "",
        modalidadTrabajo: "",
        nivelExperiencia: "",
        fechaFin: "",
        descripcion: "",
      });
      setBeneficios([{ id: Date.now(), texto: "" }]);
      setFormacionAcademica([]);
      setExperienciaCargo([]);
      setCertificacionesCargo([]);
      setCompetenciasCargo([]);
      setSumEncajePerfil(0);
      setSumCompetencias(0);
      setCompletado(0);
      setSelectedPerfil(null);
      setPerfiles([]);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(`Hubo un problema al crear la vacante: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Al montar, obtener departamentos
  useEffect(() => {
    const fetchDepartamentos = async () => {
      if (session) {
        const url = "http://51.222.110.107:5000/departments/list";
        const token = session.user.data.token;
        const authorization = "7zXnBjF5PBl7EzG/WhATQw==";

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Token: token,
              Authorization: authorization,
            },
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          setDepartamentos(data.departments);
          setLoadingDepartamentos(false);
        } catch (error) {
          console.error("Error al obtener departamentos:", error);
          setErrorDepartamentos(error.message);
          setLoadingDepartamentos(false);
        }
      }
    };

    fetchDepartamentos();
  }, [session]);

  return (
    <div style={styles.container}>
      {/* Contenedor de Notificaciones */}
      <ToastContainer />

      {/* Encabezado */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Gestión de Vacantes</h1>
      </header>

      <div style={styles.content}>
        {/* Sección izquierda - Formulario */}
        <div style={styles.formSection}>
          <h2 style={styles.formTitle}>Nueva Vacante</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Sección 1: Selección de Depto y Perfil (Cargo) */}
            <div style={styles.section}>
              <h3 style={styles.sectionHeader}>Selecciona el Cargo</h3>
              <div style={styles.fieldGroup}>
                {/* Departamento */}
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="departamento">
                    Departamento
                  </label>
                  <select
                    name="departamento"
                    id="departamento"
                    value={formData.departamento}
                    onChange={handleStaticChange}
                    style={{
                      ...styles.select,
                      ...(errors.departamento ? styles.selectError : {}),
                    }}
                    required
                  >
                    <option value="">Seleccione</option>
                    {loadingDepartamentos && <option>Cargando...</option>}
                    {errorDepartamentos && (
                      <option>Error al cargar departamentos</option>
                    )}

                    {!loadingDepartamentos && !errorDepartamentos && (
                      departamentos.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department_name}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.departamento && (
                    <span style={styles.errorText}>Este campo es requerido.</span>
                  )}
                </div>

                {/* Perfil Descriptivo (Cargo) */}
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="perfilDescriptivo">
                    Perfil Descriptivo
                  </label>
                  {formData.departamento ? (
                    loadingPerfiles ? (
                      <p>Cargando perfiles descriptivos...</p>
                    ) : errorPerfiles ? (
                      <p style={{ color: "#e53e3e" }}>
                        Error al cargar perfiles: {errorPerfiles}
                      </p>
                    ) : perfiles.length > 0 ? (
                      <select
                        id="perfilDescriptivo"
                        value={selectedPerfil ? selectedPerfil._id : ""}
                        onChange={handlePerfilChange}
                        style={{
                          ...styles.select,
                          ...(errors.perfilDescriptivo ? styles.selectError : {}),
                        }}
                        required
                      >
                        <option value="">Seleccione un Perfil</option>
                        {perfiles.map((perfil) => (
                          <option key={perfil._id} value={perfil._id}>
                            {perfil.datos_e_identificacion_del_cargo?.[0]?.nombre_del_cargo ||
                              `Perfil ID ${perfil._id}`}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p>No hay perfiles disponibles para este departamento.</p>
                    )
                  ) : (
                    <p>Seleccione un departamento primero.</p>
                  )}
                  {errors.perfilDescriptivo && (
                    <span style={styles.errorText}>Este campo es requerido.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sección 2: Información Principal */}
            <div style={styles.section}>
              <h3 style={styles.sectionHeader}>Información Principal</h3>
              <div style={styles.fieldGroup}>
                {/* Nombre Vacante */}
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="nombreVacante">
                    Nombre de la Vacante
                  </label>
                  <input
                    type="text"
                    name="nombreVacante"
                    id="nombreVacante"
                    value={formData.nombreVacante}
                    onChange={handleStaticChange}
                    style={{
                      ...styles.input,
                      ...(errors.nombreVacante ? styles.inputError : {}),
                    }}
                    required
                  />
                  {errors.nombreVacante && (
                    <span style={styles.errorText}>Este campo es requerido.</span>
                  )}
                </div>

                {/* Número Vacantes */}
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="numeroVacantes">
                    Número de Vacantes
                  </label>
                  <input
                    type="number"
                    name="numeroVacantes"
                    id="numeroVacantes"
                    value={formData.numeroVacantes}
                    onChange={handleStaticChange}
                    style={{
                      ...styles.input,
                      ...(errors.numeroVacantes ? styles.inputError : {}),
                    }}
                    min="1"
                    required
                  />
                  {errors.numeroVacantes && (
                    <span style={styles.errorText}>Este campo es requerido.</span>
                  )}
                </div>

                {/* Solicitado Por */}
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="solicitadoPor">
                    Solicitado por
                  </label>
                  <input
                    type="text"
                    name="solicitadoPor"
                    id="solicitadoPor"
                    value={formData.solicitadoPor}
                    onChange={handleStaticChange}
                    style={{
                      ...styles.input,
                      ...(errors.solicitadoPor ? styles.inputError : {}),
                    }}
                    required
                  />
                  {errors.solicitadoPor && (
                    <span style={styles.errorText}>Este campo es requerido.</span>
                  )}
                </div>

                {/* Aprobado Por */}
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="aprobadoPor">
                    Aprobado por
                  </label>
                  <input
                    type="text"
                    name="aprobadoPor"
                    id="aprobadoPor"
                    value={formData.aprobadoPor}
                    onChange={handleStaticChange}
                    style={{
                      ...styles.input,
                      ...(errors.aprobadoPor ? styles.inputError : {}),
                    }}
                    required
                  />
                  {errors.aprobadoPor && (
                    <span style={styles.errorText}>Este campo es requerido.</span>
                  )}
                </div>

                {/* Tipo */}
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="tipo">
                    Tipo
                  </label>
                  <select
                    name="tipo"
                    id="tipo"
                    value={formData.tipo}
                    onChange={handleStaticChange}
                    style={{
                      ...styles.select,
                      ...(errors.tipo ? styles.inputError : {}),
                    }}
                    required
                  >
                    <option value="" disabled={formData.tipo !== ""}>
                      Seleccione un tipo
                    </option>
                    <option value="Interno">Interno</option>
                    <option value="Externo">Externo</option>
                    <option value="Mixto">Mixto</option>
                  </select>
                  {errors.tipo && (
                    <span style={styles.errorText}>Este campo es requerido.</span>
                  )}
                </div>

                {/* Modalidad */}
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="modalidadTrabajo">
                    Modalidad
                  </label>
                  <input
                    type="text"
                    name="modalidadTrabajo"
                    id="modalidadTrabajo"
                    value={formData.modalidadTrabajo}
                    onChange={handleStaticChange}
                    style={{
                      ...styles.input,
                      ...(errors.modalidadTrabajo ? styles.inputError : {}),
                    }}
                    placeholder="Presencial, Remoto, etc."
                    required
                  />
                  {errors.modalidadTrabajo && (
                    <span style={styles.errorText}>Este campo es requerido.</span>
                  )}
                </div>

                {/* Nivel Experiencia */}
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="nivelExperiencia">
                    Nivel de Experiencia
                  </label>
                  <input
                    type="text"
                    name="nivelExperiencia"
                    id="nivelExperiencia"
                    value={formData.nivelExperiencia}
                    onChange={handleStaticChange}
                    style={{
                      ...styles.input,
                      ...(errors.nivelExperiencia ? styles.inputError : {}),
                    }}
                    placeholder="Ej. 3 años"
                    required
                  />
                  {errors.nivelExperiencia && (
                    <span style={styles.errorText}>Este campo es requerido.</span>
                  )}
                </div>

                {/* Fecha Fin */}
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="fechaFin">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    name="fechaFin"
                    id="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleStaticChange}
                    style={{
                      ...styles.input,
                      ...(errors.fechaFin ? styles.inputError : {}),
                    }}
                    required
                  />
                  {errors.fechaFin && (
                    <span style={styles.errorText}>Este campo es requerido.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sección 3: Descripción */}
            <div style={styles.section}>
              <h3 style={styles.sectionHeader}>Detalles y Descripción</h3>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="descripcion">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={handleStaticChange}
                  style={{
                    ...styles.textarea,
                    ...(errors.descripcion ? styles.textareaError : {}),
                  }}
                  required
                />
                {errors.descripcion && (
                  <span style={styles.errorText}>Este campo es requerido.</span>
                )}
              </div>

              {/* Beneficios */}
              <div style={styles.field}>
                <label style={styles.label}>Beneficios</label>
                {beneficios.map((b, i) => (
                  <div
                    key={b.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <input
                      type="text"
                      value={b.texto}
                      onChange={(e) => handleBeneficioChange(e, i)}
                      style={{
                        ...styles.input,
                        flex: "1",
                        marginRight: "10px",
                        ...(errors[`beneficios_${i}_texto`]
                          ? styles.inputError
                          : {}),
                      }}
                      placeholder={`Beneficio ${i + 1}`}
                      required
                    />
                    {errors[`beneficios_${i}_texto`] && (
                      <span style={styles.errorText}>
                        Este campo es requerido.
                      </span>
                    )}
                    {beneficios.length > 1 && (
                      <button
                        type="button"
                        style={styles.removeButton}
                        onClick={() => eliminarCampo("beneficios", i)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  style={styles.addButton}
                  onClick={() => agregarCampo("beneficios")}
                >
                  Agregar Beneficio
                </button>
              </div>
            </div>

            {/* Sección 4: Análisis de Encaje de Perfil */}
            <div style={styles.section}>
              <h3 style={styles.sectionHeader}>Análisis de Encaje de Perfil</h3>
              <p style={{ marginBottom: "15px", color: "#2b6cb0" }}>
                Asigne la ponderación correspondiente para cada ítem
              </p>

              {/* Formación Académica */}
              <div style={styles.dynamicSection}>
                <h4 style={{ color: "#2b6cb0", marginBottom: "10px" }}>
                  Formación Académica
                </h4>
                {formacionAcademica.map((campo, index) => (
                  <div key={index} style={styles.dynamicField}>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Nombre de la Formación"
                      value={campo.nombre}
                      onChange={(e) =>
                        handleDynamicChange(e, "formacionAcademica", index)
                      }
                      style={{
                        ...styles.dynamicInput,
                        ...(errors[`Formación Académica_${index}_nombre`]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      required
                    />
                    <input
                      type="number"
                      name="porcentaje"
                      placeholder="Porcentaje (%)"
                      value={campo.porcentaje}
                      onChange={(e) =>
                        handleDynamicChange(e, "formacionAcademica", index)
                      }
                      style={{
                        ...styles.dynamicInput,
                        ...(errors[`Formación Académica_${index}_porcentaje`]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      min="0"
                      max="100"
                      required
                    />
                    {errors[`Formación Académica_${index}_nombre`] && (
                      <span style={styles.errorText}>
                        Este campo es requerido.
                      </span>
                    )}
                    {errors[`Formación Académica_${index}_porcentaje`] && (
                      <span style={styles.errorText}>
                        Debe ser un número entre 0 y 100.
                      </span>
                    )}
                    {formacionAcademica.length > 1 && (
                      <button
                        type="button"
                        style={styles.removeButton}
                        onClick={() =>
                          eliminarCampo("formacionAcademica", index)
                        }
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  style={styles.addButton}
                  onClick={() => agregarCampo("formacionAcademica")}
                >
                  Agregar Formación
                </button>
              </div>

              {/* Experiencia */}
              <div style={styles.dynamicSection}>
                <h4 style={{ color: "#2b6cb0", marginBottom: "10px" }}>
                  Experiencia
                </h4>
                {experienciaCargo.map((campo, index) => (
                  <div key={index} style={styles.dynamicField}>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Descripción de la Experiencia"
                      value={campo.nombre}
                      onChange={(e) =>
                        handleDynamicChange(e, "experienciaCargo", index)
                      }
                      style={{
                        ...styles.dynamicInput,
                        ...(errors[`Experiencia_${index}_nombre`]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      required
                    />
                    <input
                      type="number"
                      name="porcentaje"
                      placeholder="Porcentaje (%)"
                      value={campo.porcentaje}
                      onChange={(e) =>
                        handleDynamicChange(e, "experienciaCargo", index)
                      }
                      style={{
                        ...styles.dynamicInput,
                        ...(errors[`Experiencia_${index}_porcentaje`]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      min="0"
                      max="100"
                      required
                    />
                    {errors[`Experiencia_${index}_nombre`] && (
                      <span style={styles.errorText}>
                        Este campo es requerido.
                      </span>
                    )}
                    {errors[`Experiencia_${index}_porcentaje`] && (
                      <span style={styles.errorText}>
                        Debe ser un número entre 0 y 100.
                      </span>
                    )}
                    {experienciaCargo.length > 1 && (
                      <button
                        type="button"
                        style={styles.removeButton}
                        onClick={() =>
                          eliminarCampo("experienciaCargo", index)
                        }
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  style={styles.addButton}
                  onClick={() => agregarCampo("experienciaCargo")}
                >
                  Agregar Experiencia
                </button>
              </div>

              {/* Certificaciones */}
              <div style={styles.dynamicSection}>
                <h4 style={{ color: "#2b6cb0", marginBottom: "10px" }}>
                  Certificaciones
                </h4>
                {certificacionesCargo.map((campo, index) => (
                  <div key={index} style={styles.dynamicField}>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Certificación"
                      value={campo.nombre}
                      onChange={(e) =>
                        handleDynamicChange(e, "certificacionesCargo", index)
                      }
                      style={{
                        ...styles.dynamicInput,
                        ...(errors[`Certificaciones_${index}_nombre`]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      required
                    />
                    <input
                      type="number"
                      name="porcentaje"
                      placeholder="Porcentaje (%)"
                      value={campo.porcentaje}
                      onChange={(e) =>
                        handleDynamicChange(e, "certificacionesCargo", index)
                      }
                      style={{
                        ...styles.dynamicInput,
                        ...(errors[`Certificaciones_${index}_porcentaje`]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      min="0"
                      max="100"
                      required
                    />
                    {errors[`Certificaciones_${index}_nombre`] && (
                      <span style={styles.errorText}>
                        Este campo es requerido.
                      </span>
                    )}
                    {errors[`Certificaciones_${index}_porcentaje`] && (
                      <span style={styles.errorText}>
                        Debe ser un número entre 0 y 100.
                      </span>
                    )}
                    {certificacionesCargo.length > 1 && (
                      <button
                        type="button"
                        style={styles.removeButton}
                        onClick={() =>
                          eliminarCampo("certificacionesCargo", index)
                        }
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  style={styles.addButton}
                  onClick={() => agregarCampo("certificacionesCargo")}
                >
                  Agregar Certificación
                </button>
              </div>

              {/* Competencias */}
              <div style={styles.dynamicSection}>
                <h4 style={{ color: "#2b6cb0", marginBottom: "10px" }}>
                  Competencias del Cargo en Total
                </h4>
                {competenciasCargo.map((campo, index) => (
                  <div key={index} style={styles.dynamicField}>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Competencia"
                      value={campo.nombre}
                      onChange={(e) =>
                        handleDynamicChange(e, "competenciasCargo", index)
                      }
                      style={{
                        ...styles.dynamicInput,
                        ...(errors[`Competencias_${index}_nombre`]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      required
                    />
                    <input
                      type="number"
                      name="porcentaje"
                      placeholder="Porcentaje (%)"
                      value={campo.porcentaje}
                      onChange={(e) =>
                        handleDynamicChange(e, "competenciasCargo", index)
                      }
                      style={{
                        ...styles.dynamicInput,
                        ...(errors[`Competencias_${index}_porcentaje`]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      min="0"
                      max="100"
                      required
                    />
                    {errors[`Competencias_${index}_nombre`] && (
                      <span style={styles.errorText}>
                        Este campo es requerido.
                      </span>
                    )}
                    {errors[`Competencias_${index}_porcentaje`] && (
                      <span style={styles.errorText}>
                        Debe ser un número entre 0 y 100.
                      </span>
                    )}
                    {competenciasCargo.length > 1 && (
                      <button
                        type="button"
                        style={styles.removeButton}
                        onClick={() =>
                          eliminarCampo("competenciasCargo", index)
                        }
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  style={styles.addButton}
                  onClick={() => agregarCampo("competenciasCargo")}
                >
                  Agregar Competencia
                </button>
                <p
                  style={{
                    marginTop: "10px",
                    color: sumCompetencias === 100 ? "#38a169" : "#e53e3e",
                    fontWeight: "600",
                  }}
                >
                  Suma Total: {sumCompetencias}%{" "}
                  {sumCompetencias !== 100 && " (Debe ser exactamente 100%)"}
                </p>
              </div>

              {/* Suma Total de Encaje de Perfil */}
              <div style={styles.sumSection}>
                <p
                  style={{
                    color: sumEncajePerfil <= 100 ? "#38a169" : "#e53e3e",
                    fontWeight: "600",
                  }}
                >
                  Suma Total de Encaje de Perfil: {sumEncajePerfil}%{" "}
                  {sumEncajePerfil > 100 && " (No debe exceder 100%)"}
                </p>
              </div>
            </div>

            {/* Botón Guardar */}
            <div style={styles.submitContainer}>
              <HoverButton type="submit" style={styles.submitButton}>
                Guardar Cambios
              </HoverButton>
            </div>
          </form>
        </div>

        {/* Sección derecha - Barra de Progreso */}
        <div style={styles.progressSection}>
          <h3 style={styles.progressTitle}>Progreso</h3>
          <div style={styles.progressBarContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${completado}%`,
              }}
            ></div>
          </div>
          <p style={styles.progressText}>{completado}% Completado</p>
        </div>
      </div>
    </div>
  );
};

// Estilos en línea (idénticos a tu ejemplo)
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#2b6cb0",
    color: "#fff",
  },
  headerTitle: {
    margin: 0,
    fontSize: "2em",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    maxWidth: "1400px",
    margin: "30px auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    flexWrap: "wrap",
  },
  formSection: {
    flex: 3,
    padding: "40px",
    minWidth: "300px",
  },
  formTitle: {
    textAlign: "center",
    color: "#2b6cb0",
    marginBottom: "30px",
    fontSize: "1.8em",
  },
  form: {
    width: "100%",
  },
  section: {
    marginBottom: "30px",
  },
  sectionHeader: {
    color: "#2b6cb0",
    borderBottom: "2px solid #2b6cb0",
    paddingBottom: "8px",
    marginBottom: "20px",
    fontSize: "1.2em",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    flexWrap: "wrap",
  },
  field: {
    flex: "1 1 45%",
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "600",
    color: "#2b6cb0",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "1em",
    transition: "border-color 0.3s ease",
  },
  inputError: {
    border: "1px solid #e53e3e",
  },
  select: {
    padding: "12px 15px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "1em",
    backgroundColor: "#fff",
    transition: "border-color 0.3s ease",
    appearance: "none",
  },
  selectError: {
    border: "1px solid #e53e3e",
  },
  textarea: {
    padding: "12px 15px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "1em",
    minHeight: "100px",
    resize: "vertical",
    transition: "border-color 0.3s ease",
  },
  textareaError: {
    border: "1px solid #e53e3e",
  },
  submitContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  submitButton: {
    backgroundColor: "#2b6cb0",
    color: "#fff",
    padding: "12px 30px",
    borderRadius: "8px",
    border: "none",
    fontSize: "1em",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  progressSection: {
    flex: 1,
    backgroundColor: "#2b6cb0",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    minWidth: "250px",
  },
  progressTitle: {
    marginBottom: "25px",
    fontSize: "1.5em",
  },
  progressBarContainer: {
    width: "100%",
    height: "25px",
    backgroundColor: "#cbd5e0",
    borderRadius: "12.5px",
    overflow: "hidden",
    marginBottom: "20px",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#f6ad55",
    transition: "width 0.5s ease",
  },
  progressText: {
    fontSize: "1.2em",
    fontWeight: "600",
  },
  dynamicSection: {
    marginBottom: "30px",
  },
  dynamicField: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  dynamicInput: {
    flex: "1",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "1em",
  },
  dynamicInputError: {
    border: "1px solid #e53e3e",
  },
  
  addButton: {
    backgroundColor: "#48bb78",
    color: "#fff",
    padding: "8px 15px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontSize: "0.9em",
  },
  removeButton: {
    backgroundColor: "#e53e3e",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontSize: "0.9em",
  },
  errorText: {
    color: "#e53e3e",
    fontSize: "0.8em",
    marginTop: "5px",
  },
  sumSection: {
    marginTop: "20px",
    textAlign: "right",
  },
};

export default NuevaVacante;
