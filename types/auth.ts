export type Genero =
  | "femenino"
  | "masculino"
  | "otro"
  | "prefiero_no_decir";

export type EstadoUsuario = "activo" | "inactivo";

export interface SignUpInput {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  nombrePreferido?: string;
  telefono: string;
  fechaNacimiento: string;
  genero: Genero;
}

export interface SignUpResult {
  requiresEmailConfirmation: boolean;
}

export interface Rol {
  id_rol: string;
  nombre: string;
  descripcion: string | null;
}

export interface UsuarioPerfil {
  id_usuario: string;
  id_rol: string;
  id_institucion: string | null;
  nombres: string;
  apellidos: string;
  nombre_preferido: string | null;
  correo: string;
  telefono: string | null;
  fecha_nacimiento: string | null;
  genero: Genero | null;
  foto_perfil: string | null;
  fecha_registro: string;
  estado: EstadoUsuario;
  debe_cambiar_password: boolean;

  rol: {
    id_rol: string;
    nombre: string;
    descripcion: string | null;
  } | null;
}