export type Genero =
  | 'femenino'
  | 'masculino'
  | 'otro'
  | 'prefiero_no_decir';

export interface SignUpInput {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  nombrePreferido?: string;
  telefono: string;
  // Formato YYYY-MM-DD
  fechaNacimiento: string;
  genero: Genero;
}


export interface SignUpResult {
  // true si el usuario fue creado pero Supabase
  // todavía no creó una sesión porque debe
  // confirmar su correo.
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
  genero: string | null;
  foto_perfil: string | null;
  fecha_registro: string;
  estado: string;

  // Relación con public.rol
  rol: Rol | null;
}