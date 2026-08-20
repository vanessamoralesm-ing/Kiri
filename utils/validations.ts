import type {
  Genero,
  SignUpInput,
} from '@/types/auth';


// =======================================================
// CONFIGURACIÓN
// =======================================================

export const EDAD_MINIMA = 6;


// =======================================================
// CORREO ELECTRÓNICO
// =======================================================

export const validateEmail = (
  email: string
): string => {

  const correo = email.trim();

  if (!correo) {
    return 'El correo electrónico es obligatorio.';
  }

  if (correo.length > 150) {
    return 'El correo electrónico es demasiado largo.';
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(correo)) {
    return 'Ingresa un correo electrónico válido.';
  }

  return '';
};


// =======================================================
// CONTRASEÑA
// =======================================================

export const validatePassword = (
  password: string
): string => {

  if (!password) {
    return 'La contraseña es obligatoria.';
  }

  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }

  return '';
};


// =======================================================
// CONFIRMAR CONTRASEÑA
// =======================================================

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string => {

  if (!confirmPassword) {
    return 'Debes confirmar tu contraseña.';
  }

  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden.';
  }

  return '';
};


// =======================================================
// NOMBRES
// =======================================================

export const validateNombres = (
  nombres: string
): string => {

  const valor = nombres.trim();

  if (!valor) {
    return 'Los nombres son obligatorios.';
  }

  if (valor.length < 2) {
    return 'Ingresa un nombre válido.';
  }

  if (valor.length > 100) {
    return 'Los nombres no pueden superar los 100 caracteres.';
  }

  /*
   * Permite:
   * letras
   * tildes
   * ñ
   * espacios
   * apóstrofes
   * guiones
   */

  const nombreRegex =
    /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/;

  if (!nombreRegex.test(valor)) {
    return 'Los nombres solo pueden contener letras.';
  }

  return '';
};


// =======================================================
// APELLIDOS
// =======================================================

export const validateApellidos = (
  apellidos: string
): string => {

  const valor = apellidos.trim();

  if (!valor) {
    return 'Los apellidos son obligatorios.';
  }

  if (valor.length < 2) {
    return 'Ingresa un apellido válido.';
  }

  if (valor.length > 100) {
    return 'Los apellidos no pueden superar los 100 caracteres.';
  }

  const apellidoRegex =
    /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/;

  if (!apellidoRegex.test(valor)) {
    return 'Los apellidos solo pueden contener letras.';
  }

  return '';
};


// =======================================================
// NOMBRE PREFERIDO
// =======================================================

export const validateNombrePreferido = (
  nombrePreferido?: string
): string => {

  // Es opcional

  if (!nombrePreferido?.trim()) {
    return '';
  }

  const valor =
    nombrePreferido.trim();

  if (valor.length > 100) {
    return 'El nombre preferido no puede superar los 100 caracteres.';
  }

  const nombreRegex =
    /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/;

  if (!nombreRegex.test(valor)) {
    return 'El nombre preferido solo puede contener letras.';
  }

  return '';
};


// =======================================================
// TELÉFONO
// =======================================================

export const validateTelefono = (
  telefono: string
): string => {

  const valor =
    telefono.trim();

  if (!valor) {
    return 'El teléfono es obligatorio.';
  }

  /*
   * Exactamente:
   *
   * - 8 caracteres
   * - todos deben ser números
   */

  const telefonoRegex =
    /^\d{8}$/;

  if (!telefonoRegex.test(valor)) {
    return 'El teléfono debe contener exactamente 8 dígitos.';
  }

  return '';
};


// =======================================================
// FECHA DE NACIMIENTO
// =======================================================

export const validateFechaNacimiento = (
  fechaNacimiento: string
): string => {

  const valor =
    fechaNacimiento.trim();


  // -----------------------------------------------------
  // CAMPO OBLIGATORIO
  // -----------------------------------------------------

  if (!valor) {
    return 'La fecha de nacimiento es obligatoria.';
  }


  // -----------------------------------------------------
  // FORMATO YYYY-MM-DD
  // -----------------------------------------------------

  const fechaRegex =
    /^\d{4}-\d{2}-\d{2}$/;

  if (!fechaRegex.test(valor)) {
    return 'La fecha de nacimiento no tiene un formato válido.';
  }


  // -----------------------------------------------------
  // OBTENER AÑO, MES Y DÍA
  // -----------------------------------------------------

  const [
    year,
    month,
    day,
  ] =
    valor
      .split('-')
      .map(Number);


  const fecha =
    new Date(
      year,
      month - 1,
      day
    );


  // -----------------------------------------------------
  // COMPROBAR QUE SEA UNA FECHA REAL
  // -----------------------------------------------------

  /*
   * Evita fechas como:
   *
   * 2020-02-31
   * 2025-13-10
   * 2025-00-20
   */

  const fechaReal =
    fecha.getFullYear() === year &&
    fecha.getMonth() === month - 1 &&
    fecha.getDate() === day;


  if (!fechaReal) {
    return 'La fecha de nacimiento no es válida.';
  }


  // -----------------------------------------------------
  // NO PERMITIR FECHAS FUTURAS
  // -----------------------------------------------------

  const hoy =
    new Date();

  hoy.setHours(
    0,
    0,
    0,
    0
  );


  fecha.setHours(
    0,
    0,
    0,
    0
  );


  if (fecha > hoy) {
    return 'La fecha de nacimiento no puede ser futura.';
  }


  // -----------------------------------------------------
  // CALCULAR EDAD
  // -----------------------------------------------------

  let edad =
    hoy.getFullYear() -
    fecha.getFullYear();


  const diferenciaMes =
    hoy.getMonth() -
    fecha.getMonth();


  if (
    diferenciaMes < 0 ||
    (
      diferenciaMes === 0 &&
      hoy.getDate() <
        fecha.getDate()
    )
  ) {
    edad--;
  }


  // -----------------------------------------------------
  // EDAD MÍNIMA
  // -----------------------------------------------------

  if (edad < EDAD_MINIMA) {
    return `Debes tener al menos ${EDAD_MINIMA} años para usar Kiri.`;
  }


  return '';
};


// =======================================================
// GÉNERO
// =======================================================

export const validateGenero = (
  genero: Genero | ''
): string => {

  if (!genero) {
    return 'Selecciona una opción de género.';
  }


  const generosPermitidos:
    Genero[] = [
      'femenino',
      'masculino',
      'otro',
      'prefiero_no_decir',
    ];


  if (
    !generosPermitidos.includes(
      genero
    )
  ) {
    return 'La opción de género seleccionada no es válida.';
  }


  return '';
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
  password: string
): LoginErrors => {

  const errors:
    LoginErrors = {};


  // Correo

  const emailError =
    validateEmail(email);

  if (emailError) {
    errors.email =
      emailError;
  }


  // Contraseña

  if (!password) {
    errors.password =
      'La contraseña es obligatoria.';
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
  input: RegisterValidationInput
): RegisterErrors => {

  const errors:
    RegisterErrors = {};


  // -----------------------------------------------------
  // NOMBRES
  // -----------------------------------------------------

  const nombresError =
    validateNombres(
      input.nombres
    );

  if (nombresError) {
    errors.nombres =
      nombresError;
  }


  // -----------------------------------------------------
  // APELLIDOS
  // -----------------------------------------------------

  const apellidosError =
    validateApellidos(
      input.apellidos
    );

  if (apellidosError) {
    errors.apellidos =
      apellidosError;
  }


  // -----------------------------------------------------
  // NOMBRE PREFERIDO
  // -----------------------------------------------------

  const nombrePreferidoError =
    validateNombrePreferido(
      input.nombrePreferido
    );

  if (nombrePreferidoError) {
    errors.nombrePreferido =
      nombrePreferidoError;
  }


  // -----------------------------------------------------
  // CORREO
  // -----------------------------------------------------

  const emailError =
    validateEmail(
      input.email
    );

  if (emailError) {
    errors.email =
      emailError;
  }


  // -----------------------------------------------------
  // TELÉFONO
  // -----------------------------------------------------

  const telefonoError =
    validateTelefono(
      input.telefono
    );

  if (telefonoError) {
    errors.telefono =
      telefonoError;
  }


  // -----------------------------------------------------
  // FECHA DE NACIMIENTO
  // -----------------------------------------------------

  const fechaError =
    validateFechaNacimiento(
      input.fechaNacimiento
    );

  if (fechaError) {
    errors.fechaNacimiento =
      fechaError;
  }


  // -----------------------------------------------------
  // GÉNERO
  // -----------------------------------------------------

  const generoError =
    validateGenero(
      input.genero
    );

  if (generoError) {
    errors.genero =
      generoError;
  }


  // -----------------------------------------------------
  // CONTRASEÑA
  // -----------------------------------------------------

  const passwordError =
    validatePassword(
      input.password
    );

  if (passwordError) {
    errors.password =
      passwordError;
  }


  // -----------------------------------------------------
  // CONFIRMAR CONTRASEÑA
  // -----------------------------------------------------

  const confirmError =
    validateConfirmPassword(
      input.password,
      input.confirmPassword
    );

  if (confirmError) {
    errors.confirmPassword =
      confirmError;
  }


  // -----------------------------------------------------
  // TÉRMINOS Y CONDICIONES
  // -----------------------------------------------------

  if (!input.aceptaTerminos) {

    errors.terminos =
      'Debes aceptar los Términos y Condiciones y la Política de Privacidad.';

  }


  return errors;
};