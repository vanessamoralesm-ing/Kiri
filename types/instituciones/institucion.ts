import type { EstadoUsuario } from "@/types/auth";
import type { TipoInstitucion } from "@/types/superadmin/solicitudes";
export type EstadoInstitucion = EstadoUsuario;
export interface Institucion {
  id_institucion: string;
  codigo_institucional: string;
  nombre: string;
  logo: string | null;
  correo: string | null;
  telefono: string | null;
  direccion: string | null;
  municipio: string | null;
  departamento: string | null;
  fecha_registro: string;
  estado: EstadoInstitucion;
  tipo_institucion: TipoInstitucion;
}
export type InstitucionPayload = Omit<
  Institucion,
  "id_institucion" | "fecha_registro"
>;
export interface FiltrosInstitucion {
  busqueda?: string;
  estado?: EstadoInstitucion | "";
  tipo?: string;
}
export const TIPOS_INSTITUCION = [
  { value: "educacion_superior", label: "Educación superior" },
  { value: "escolar", label: "Escolar" },
  { value: "salud", label: "Salud" },
] as const;
export const nombreTipoInstitucion = (tipo: string) =>
  TIPOS_INSTITUCION.find((t) => t.value === tipo)?.label ?? tipo;
