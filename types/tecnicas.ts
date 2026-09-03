export interface TecnicaComplementaria {
  id_tecnica: string;
  nombre: string;
  descripcion: string;
  objetivo: string;
  duracion_estimada: number | null;
  estado: "activa" | "inactiva";
  fecha_registro: string;
  fecha_actualizacion: string;
}

export interface PasoTecnica {
  id_paso: string;
  id_tecnica: string;
  titulo: string;
  instruccion: string;
  orden: number;
  duracion_segundos: number | null;
  tipo_recurso: "imagen" | "video" | null;
  url_recurso: string | null;
  miniatura_url: string | null;
  estado: "activo" | "inactivo";
  fecha_registro: string;
  fecha_actualizacion: string;
}

export interface RegistroTecnica {
  id_registro: string;
  id_usuario: string;
  id_tecnica: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  completada: boolean;
  tecnica_complementaria?: {
    nombre: string;
  } | null;
}