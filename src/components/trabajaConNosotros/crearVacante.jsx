'use client'

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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
  const [tiempoExperienciaCargo, setTiempoExperienciaCargo] = useState([]);
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

  // Cálculos de campos
  const totalCamposDinamicos =
    formacionAcademica.length +
    certificacionesCargo.length +
    competenciasCargo.length +
    beneficios.length;
  const [totalCampos, setTotalCampos] = useState(15);

  // Sumas para validar
  const [sumEncajePerfil, setSumEncajePerfil] = useState(0);
  const [sumCompetencias, setSumCompetencias] = useState(0);
  const [sumTiempoExperiencia, setSumTiempoExperiencia] = useState(0);

  // Efecto para total campos
  useEffect(() => {
    setTotalCampos(15 + totalCamposDinamicos * 2);
  }, [totalCamposDinamicos]);

  // Efecto para encaje perfil
  useEffect(() => {
    const sumaFormacion = formacionAcademica.reduce((acc, cur) => acc + Number(cur.porcentaje || 0), 0);
    const sumaCertificaciones = certificacionesCargo.reduce((acc, cur) => acc + Number(cur.porcentaje || 0), 0);
    setSumEncajePerfil(sumaFormacion + sumaCertificaciones);
  }, [formacionAcademica, certificacionesCargo]);

  // Efecto para competencias
  useEffect(() => {
    const totalComp = competenciasCargo.reduce((acc, cur) => acc + Number(cur.porcentaje || 0), 0);
    setSumCompetencias(totalComp);
  }, [competenciasCargo]);

  // Efecto para tiempo de experiencia
  useEffect(() => {
    const sumaExp = tiempoExperienciaCargo.reduce((acc, cur) => acc + Number(cur.porcentaje || 0), 0);
    setSumTiempoExperiencia(sumaExp);
    setFormData((prev) => ({
      ...prev,
      nivelExperiencia: sumaExp ? `${sumaExp} años` : "",
    }));
  }, [tiempoExperienciaCargo]);

  // Efecto para progreso
  useEffect(() => {
    const inputs = document.querySelectorAll(
      "input[required], textarea[required], select[required]"
    );
    const llenos = Array.from(inputs).filter((i) => i.value.trim() !== "").length;
    setCompletado(Math.round((llenos / totalCampos) * 100));
  }, [
    formData,
    formacionAcademica,
    tiempoExperienciaCargo,
    certificacionesCargo,
    competenciasCargo,
    beneficios,
    totalCampos,
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

  // *** Aquí definimos handleDynamicChange ***
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
      case "tiempoExperienciaCargo":
        copia = [...tiempoExperienciaCargo];
        setStateFn = setTiempoExperienciaCargo;
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
      const token = session.user.data.token
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
    const arrTiempo = [];
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
              arrTiempo.push({
                nombre: item.experiencia,
                porcentaje: anios,
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
            arrTiempo.push({
              nombre: f.experiencia,
              porcentaje: anios,
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
    if (arrTiempo.length > 0) setTiempoExperienciaCargo(arrTiempo);
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
      case "tiempoExperienciaCargo":
        setTiempoExperienciaCargo((prev) => [...prev, nuevoCampo]);
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
      case "tiempoExperienciaCargo":
        setTiempoExperienciaCargo((prev) => prev.filter((_, i) => i !== index));
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
          window.alert("Debe haber al menos un beneficio.");
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

    // Validar campos
    Object.keys(formData).forEach((key) => {
      if (formData[key].trim() === "") {
        valid = false;
        nuevosErrores[key] = true;
      }
    });

    // Validar perfil
    if (!selectedPerfil) {
      valid = false;
      nuevosErrores.perfilDescriptivo = true;
      alert("Por favor, selecciona un Perfil Descriptivo.");
    }

    // Validar beneficios
    beneficios.forEach((b, i) => {
      if (b.texto.trim() === "") {
        valid = false;
        nuevosErrores[`beneficios_${i}_texto`] = true;
      }
    });

    // Validar campos dinámicos
    const validarCamposDinamicos = (campos, tipo) => {
      campos.forEach((c, i) => {
        if (tipo !== "tiempoExperienciaCargo") {
          if (c.nombre && c.nombre.trim() === "") {
            valid = false;
            nuevosErrores[`${tipo}_${i}_nombre`] = true;
          }
          if (
            c.porcentaje === "" ||
            isNaN(c.porcentaje) ||
            Number(c.porcentaje) < 0 ||
            Number(c.porcentaje) > 100
          ) {
            valid = false;
            nuevosErrores[`${tipo}_${i}_porcentaje`] = true;
          }
        } else {
          // Para tiempoExperienciaCargo, solo validamos que no esté vacío
          // y que sea >= 0 (igual a la idea).
          if (c.nombre && c.nombre.trim() === "") {
            valid = false;
            nuevosErrores[`${tipo}_${i}_nombre`] = true;
          }
          if (
            c.porcentaje === "" ||
            isNaN(c.porcentaje) ||
            Number(c.porcentaje) < 0
          ) {
            valid = false;
            nuevosErrores[`${tipo}_${i}_porcentaje`] = true;
          }
        }
      });
    };

    validarCamposDinamicos(formacionAcademica, "formacionAcademica");
    validarCamposDinamicos(certificacionesCargo, "certificacionesCargo");
    validarCamposDinamicos(competenciasCargo, "competenciasCargo");
    validarCamposDinamicos(tiempoExperienciaCargo, "tiempoExperienciaCargo");

    // Validar sumas
    if (sumEncajePerfil !== 100) {
      valid = false;
      nuevosSumErrors.encajePerfil = true;
      alert("La suma de los porcentajes en 'Análisis de Encaje de Perfil' debe ser 100.");
    }
    if (sumCompetencias !== 100) {
      valid = false;
      nuevosSumErrors.competencias = true;
      alert("La suma de los porcentajes en 'Competencias' debe ser 100.");
    }

    setErrors(nuevosErrores);
    setSumErrors(nuevosSumErrors);

    if (!valid) {
      alert("Corrige los errores antes de enviar el formulario.");
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
        construirPorcentajes(tiempoExperienciaCargo) +
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

    const token = session.user.data.token
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
      alert("Vacante creada exitosamente.");

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
      setTiempoExperienciaCargo([]);
      setCertificacionesCargo([]);
      setCompetenciasCargo([]);
      setSumEncajePerfil(0);
      setSumCompetencias(0);
      setSumTiempoExperiencia(0);
      setCompletado(0);
      setSelectedPerfil(null);
      setPerfiles([]);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert(`Hubo un problema al crear la vacante: ${error.message}`);
    }
  };

  // Al montar, obtener departamentos
  useEffect(() => {
    const fetchDepartamentos = async () => {
        if (session){
            const url = "http://51.222.110.107:5000/departments/list";
            const token = session.user.data.token
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
                </div>

                {/* Tipo */}
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="tipo">
                    Tipo
                  </label>
                  <input
                    type="text"
                    name="tipo"
                    id="tipo"
                    value={formData.tipo}
                    onChange={handleStaticChange}
                    style={{
                      ...styles.input,
                      ...(errors.tipo ? styles.inputError : {}),
                    }}
                    placeholder="Tiempo Completo, Medio Tiempo, etc."
                    required
                  />
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
                        ...(errors[`formacionAcademica_${index}_nombre`]
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
                        ...(errors[`formacionAcademica_${index}_porcentaje`]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      min="0"
                      max="100"
                      required
                    />
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

              {/* Tiempo de Experiencia */}
              <div style={styles.dynamicSection}>
                <h4 style={{ color: "#2b6cb0", marginBottom: "10px" }}>
                  Tiempo de Experiencia en el Cargo
                </h4>
                {tiempoExperienciaCargo.map((campo, index) => (
                  <div key={index} style={styles.dynamicField}>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Descripción de la Experiencia"
                      value={campo.nombre}
                      onChange={(e) =>
                        handleDynamicChange(e, "tiempoExperienciaCargo", index)
                      }
                      style={{
                        ...styles.dynamicInput,
                        ...(errors[`tiempoExperienciaCargo_${index}_nombre`]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      required
                    />
                    <input
                      type="number"
                      name="porcentaje"
                      placeholder="Años de Experiencia"
                      value={campo.porcentaje}
                      onChange={(e) =>
                        handleDynamicChange(e, "tiempoExperienciaCargo", index)
                      }
                      style={{
                        ...styles.dynamicInput,
                        ...(errors[
                          `tiempoExperienciaCargo_${index}_porcentaje`
                        ]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      min="0"
                      required
                    />
                    {tiempoExperienciaCargo.length > 1 && (
                      <button
                        type="button"
                        style={styles.removeButton}
                        onClick={() =>
                          eliminarCampo("tiempoExperienciaCargo", index)
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
                  onClick={() => agregarCampo("tiempoExperienciaCargo")}
                >
                  Agregar Experiencia
                </button>
                <p
                  style={{
                    marginTop: "10px",
                    color: "#38a169",
                    fontWeight: "600",
                  }}
                >
                  Suma Total de Experiencia: {sumTiempoExperiencia} años
                </p>
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
                        ...(errors[`certificacionesCargo_${index}_nombre`]
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
                        ...(errors[`certificacionesCargo_${index}_porcentaje`]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      min="0"
                      max="100"
                      required
                    />
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
                        ...(errors[`competenciasCargo_${index}_nombre`]
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
                        ...(errors[`competenciasCargo_${index}_porcentaje`]
                          ? styles.dynamicInputError
                          : {}),
                      }}
                      min="0"
                      max="100"
                      required
                    />
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
};

export default NuevaVacante;
