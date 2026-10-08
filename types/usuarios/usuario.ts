import type {
  EstadoUsuario,
  Genero,
  UsuarioPerfil,
} from "@/types/auth";

export interface InstitucionResumen {
  id_institucion: string;
  nombre: string;
}

export interface UsuarioAdmin extends UsuarioPerfil {
  institucion: InstitucionResumen | null;
}

export interface FiltrosUsuarioAdmin {
  busqueda?: string;
  idRol?: string;
  estado?: EstadoUsuario | "";
  idInstitucion?: string;
}

export interface CrearUsuarioAdminInput {
  email: string;
  passwordTemporal: string;
  nombres: string;
  apellidos: string;
  nombrePreferido?: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: Genero;
  idRol: string;
  idInstitucion?: string | null;
  estado?: EstadoUsuario;
  debeCambiarPassword?: boolean;
}

export interface EditarUsuarioAdminInput {
  nombres?: string;
  apellidos?: string;
  nombrePreferido?: string | null;
  telefono?: string | null;
  fechaNacimiento?: string | null;
  genero?: Genero | null;
  idRol?: string;
  idInstitucion?: string | null;
  estado?: EstadoUsuario;
  debeCambiarPassword?: boolean;
}

export interface DatosEstudianteAdmin {
  codigoEstudiante?: string | null;
}

export interface DatosDocenteAdmin {
  codigoDocente?: string | null;
  profesion?: string | null;
  especialidad?: string | null;
}

export interface DatosPsicologoAdmin {
  codigoPsicologo?: string | null;
  licenciaProfesional?: string | null;
  especialidad?: string | null;
}

export interface CrearUsuarioAdminPayload
  extends CrearUsuarioAdminInput {
  estudiante?: DatosEstudianteAdmin;
  docente?: DatosDocenteAdmin;
  psicologo?: DatosPsicologoAdmin;
}

export interface EditarUsuarioAdminPayload
  extends EditarUsuarioAdminInput {
  idUsuario: string;
  estudiante?: DatosEstudianteAdmin;
  docente?: DatosDocenteAdmin;
  psicologo?: DatosPsicologoAdmin;
}