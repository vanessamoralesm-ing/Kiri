export type EstadoPublicacion =
    | "activa"
    | "oculta"
    | "eliminada";

export type EstadoComentario =
    | "activo"
    | "oculto"
    | "eliminado";

export type TipoReaccion =
    | "me_gusta"
    | "apoyo"
    | "me_importa";

export type MotivoReporte =
    | "contenido_inapropiado"
    | "acoso"
    | "spam"
    | "informacion_falsa"
    | "otro";

export interface EmocionForo {
    id_emocion_foro: string;
    nombre: string;
    descripcion: string | null;
    estado: boolean;
    fecha_registro: string;
}

export interface UsuarioForo {
    id_usuario: string;
    nombres: string | null;
    apellidos?: string | null;
    nombre_preferido: string | null;
    foto_perfil: string | null;
}

export interface PublicacionForo {
    id_publicacion: string;
    id_usuario: string;
    titulo: string;
    contenido: string;
    fecha_publicacion: string;
    fecha_actualizacion: string;
    estado: EstadoPublicacion;
    editada: boolean;

    usuario?: UsuarioForo | null;
    emociones?: EmocionForo[];

    total_reacciones?: number;
    total_comentarios?: number;
    reaccion_usuario?: TipoReaccion | null;
}

export interface ComentarioForo {
    id_comentario: string;
    id_publicacion: string;
    id_usuario: string;
    contenido: string;
    fecha_comentario: string;
    fecha_actualizacion: string;
    estado: EstadoComentario;
    editada: boolean;

    usuario?: UsuarioForo | null;
}

export interface ReaccionForo {
    id_reaccion: string;
    id_usuario: string;
    id_publicacion: string;
    tipo_reaccion: TipoReaccion;
    fecha_reaccion: string;
}

export interface ReporteForo {
    id_reporte: string;
    id_usuario_reporta: string;
    id_publicacion: string | null;
    id_comentario: string | null;
    motivo: MotivoReporte;
    descripcion: string | null;
    estado: "pendiente" | "revisado" | "descartado";
    fecha_reporte: string;
    fecha_revision: string | null;
}