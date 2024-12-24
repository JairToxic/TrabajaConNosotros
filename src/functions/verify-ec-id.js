function validarCedulaEcuatoriana(cedula) {
    // Asegurarse de que la cédula tenga 10 dígitos
    if (cedula.length !== 10) return false;

    // Obtener los dos primeros dígitos (provincia)
    const provincia = parseInt(cedula.substring(0, 2), 10);

    // La provincia debe estar entre 0 y 24, o ser 30 (para extranjeros)
    if (provincia < 0 || (provincia > 24 && provincia !== 30)) return false;

    // El tercer dígito debe ser menor que 6
    const tercerDigito = parseInt(cedula[2], 10);
    if (tercerDigito >= 6) return false;

    // Coeficientes para la validación
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    // Aplicar el algoritmo de validación
    for (let i = 0; i < 9; i++) {
        let valor = parseInt(cedula[i], 10) * coeficientes[i];
        if (valor >= 10) valor -= 9;
        suma += valor;
    }

    // Obtener el último dígito de la cédula (dígito verificador)
    const digitoVerificador = parseInt(cedula[9], 10);

    // Calcular el valor de la suma más cercana a un múltiplo de 10
    const decenaSuperior = Math.ceil(suma / 10) * 10;

    // Comparar el dígito verificador con la diferencia
    return digitoVerificador === (decenaSuperior - suma);
}

export default validarCedulaEcuatoriana;