import type { Genero, SignUpInput } from "@/types/auth";
export const EDAD_MINIMA = 6;
export const EDAD_MAXIMA = 50;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NOMBRE_REGEX =
  /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/;

const GENEROS_PERMITIDOS: Genero[] = [
  "femenino",
  "masculino",
  "otro",
  "prefiero_no_decir",
];

// =======================================================
// CORREO ELECTRÓNICO
// =======================================================

export const validateEmail = (
  email: string,
): string => {
  const correo = email.trim();

  if (!correo) {
    return "El correo electrónico es obligatorio.";
  }

  if (correo.length > 150) {
    return "El correo electrónico es demasiado largo.";
  }

  if (!EMAIL_REGEX.test(correo)) {
    return "Ingresa un correo electrónico válido.";
  }

  return "";
};

// =======================================================
// CONTRASEÑA
// =======================================================

export const validatePassword = (
  password: string,
): string => {
  if (!password) {
    return "La contraseña es obligatoria.";
  }

  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  return "";
};

// =======================================================
// CONFIRMAR CONTRASEÑA
// =======================================================

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string => {
  if (!confirmPassword) {
    return "Debes confirmar tu contraseña.";
  }

  if (password !== confirmPassword) {
    return "Las contraseñas no coinciden.";
  }

  return "";
};

// =======================================================
// NOMBRES
// =======================================================

export const validateNombres = (
  nombres: string,
): string => {
  const valor = nombres.trim();

  if (!valor) {
    return "Los nombres son obligatorios.";
  }

  if (valor.length < 2) {
    return "Ingresa un nombre válido.";
  }

  if (valor.length > 100) {
    return "Los nombres no pueden superar los 100 caracteres.";
  }

  // Permite letras, tildes, ñ, espacios,
  // apóstrofes y guiones.
  if (!NOMBRE_REGEX.test(valor)) {
    return "Los nombres solo pueden contener letras.";
  }

  return "";
};

// =======================================================
// APELLIDOS
// =======================================================

export const validateApellidos = (
  apellidos: string,
): string => {
  const valor = apellidos.trim();

  if (!valor) {
    return "Los apellidos son obligatorios.";
  }

  if (valor.length < 2) {
    return "Ingresa un apellido válido.";
  }

  if (valor.length > 100) {
    return "Los apellidos no pueden superar los 100 caracteres.";
  }

  if (!NOMBRE_REGEX.test(valor)) {
    return "Los apellidos solo pueden contener letras.";
  }

  return "";
};

// =======================================================
// NOMBRE PREFERIDO
// =======================================================

export const validateNombrePreferido = (
  nombrePreferido?: string,
): string => {
  if (!nombrePreferido?.trim()) {
    return "";
  }

  const valor = nombrePreferido.trim();

  if (valor.length > 100) {
    return "El nombre preferido no puede superar los 100 caracteres.";
  }

  if (!NOMBRE_REGEX.test(valor)) {
    return "El nombre preferido solo puede contener letras.";
  }

  return "";
};

// =======================================================
// TELÉFONO
// =======================================================

export const validateTelefono = (
  telefono: string,
): string => {
  const valor = telefono.trim();

  if (!valor) {
    return "El teléfono es obligatorio.";
  }

  if (!/^\d{8}$/.test(valor)) {
    return "El teléfono debe contener exactamente 8 dígitos.";
  }

  return "";
};

// =======================================================
// FECHA DE NACIMIENTO
// =======================================================
//
// Solo pueden registrarse usuarios entre 6 y 50 años,
// ambos límites incluidos.
//

export const validateFechaNacimiento = (
  fechaNacimiento: string,
): string => {
  const valor = fechaNacimiento.trim();

  if (!valor) {
    return "La fecha de nacimiento es obligatoria.";
  }

  // Formato esperado: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return "La fecha de nacimiento no tiene un formato válido.";
  }

  const [year, month, day] =
    valor.split("-").map(Number);

  const fecha = new Date(
    year,
    month - 1,
    day,
  );

  // Verifica que la fecha exista realmente.
  const fechaReal =
    fecha.getFullYear() === year &&
    fecha.getMonth() === month - 1 &&
    fecha.getDate() === day;

  if (!fechaReal) {
    return "La fecha de nacimiento no es válida.";
  }

  const hoy = new Date();

  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);

  if (fecha > hoy) {
    return "La fecha de nacimiento no puede ser futura.";
  }

  // Calcular edad exacta considerando
  // si ya cumplió años este año.
  let edad =
    hoy.getFullYear() -
    fecha.getFullYear();

  const diferenciaMes =
    hoy.getMonth() -
    fecha.getMonth();

  if (
    diferenciaMes < 0 ||
    (diferenciaMes === 0 &&
      hoy.getDate() < fecha.getDate())
  ) {
    edad--;
  }

  if (edad < EDAD_MINIMA) {
    return `Debes tener al menos ${EDAD_MINIMA} años para usar Kiri.`;
  }

  if (edad > EDAD_MAXIMA) {
    return `La edad máxima permitida para registrarse es de ${EDAD_MAXIMA} años.`;
  }

  return "";
};

// =======================================================
// GÉNERO
// =======================================================

export const validateGenero = (
  genero: Genero | "",
): string => {
  if (!genero) {
    return "Selecciona una opción de género.";
  }

  if (!GENEROS_PERMITIDOS.includes(genero)) {
    return "La opción de género seleccionada no es válida.";
  }

  return "";
};

// =======================================================
// LOGIN
// =======================================================

export interface LoginErrors {
  email?: string;
  password?: string;
}

export const validateLogin = (
  email: string,
  password: string,
): LoginErrors => {
  const errors: LoginErrors = {};

  const emailError = validateEmail(email);

  if (emailError) {
    errors.email = emailError;
  }

  if (!password) {
    errors.password =
      "La contraseña es obligatoria.";
  }

  return errors;
};

// =======================================================
// REGISTRO
// =======================================================

export interface RegisterValidationInput
  extends SignUpInput {
  confirmPassword: string;
  aceptaTerminos: boolean;
}

export interface RegisterErrors {
  nombres?: string;
  apellidos?: string;
  nombrePreferido?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: string;
  password?: string;
  confirmPassword?: string;
  terminos?: string;
}

// =======================================================
// VALIDAR FORMULARIO COMPLETO DE REGISTRO
// =======================================================

export const validateRegister = (
  input: RegisterValidationInput,
): RegisterErrors => {
  const errors: RegisterErrors = {};

  const nombresError =
    validateNombres(input.nombres);

  if (nombresError) {
    errors.nombres = nombresError;
  }

  const apellidosError =
    validateApellidos(input.apellidos);

  if (apellidosError) {
    errors.apellidos = apellidosError;
  }

  const nombrePreferidoError =
    validateNombrePreferido(
      input.nombrePreferido,
    );

  if (nombrePreferidoError) {
    errors.nombrePreferido =
      nombrePreferidoError;
  }

  const emailError =
    validateEmail(input.email);

  if (emailError) {
    errors.email = emailError;
  }

  const telefonoError =
    validateTelefono(input.telefono);

  if (telefonoError) {
    errors.telefono = telefonoError;
  }

  const fechaError =
    validateFechaNacimiento(
      input.fechaNacimiento,
    );

  if (fechaError) {
    errors.fechaNacimiento =
      fechaError;
  }

  const generoError =
    validateGenero(input.genero);

  if (generoError) {
    errors.genero = generoError;
  }

  const passwordError =
    validatePassword(input.password);

  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmError =
    validateConfirmPassword(
      input.password,
      input.confirmPassword,
    );

  if (confirmError) {
    errors.confirmPassword =
      confirmError;
  }

  if (!input.aceptaTerminos) {
    errors.terminos =
      "Debes aceptar los Términos y Condiciones y la Política de Privacidad.";
  }

  return errors;
};