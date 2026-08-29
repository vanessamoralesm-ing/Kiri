// ==========================================================
// ESTADOS
// ==========================================================

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


export type EstadoReporte =
    | "pendiente"
    | "revisado"
    | "descartado";


// ==========================================================
// EMOCIÓN DEL FORO
// ==========================================================

export interface EmocionForo {
    id_emocion_foro: string;

    nombre: string;

    descripcion: string | null;

    estado: boolean;

    fecha_registro: string;
}


// ==========================================================
// USUARIO DEL FORO
// ==========================================================

export interface UsuarioForo {
    id_usuario: string;

    nombres: string;

    apellidos: string;

    nombre_preferido: string | null;

    foto_perfil: string | null;
}


// ==========================================================
// PUBLICACIÓN
// ==========================================================

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


// ==========================================================
// COMENTARIO
// ==========================================================

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


// ==========================================================
// REACCIÓN
// ==========================================================

export interface ReaccionForo {
    id_reaccion: string;

    id_usuario: string;

    id_publicacion: string;

    tipo_reaccion: TipoReaccion;

    fecha_reaccion: string;
}


// ==========================================================
// REPORTE
// ==========================================================

export interface ReporteForo {
    id_reporte: string;

    id_usuario_reporta: string;

    id_publicacion: string | null;

    id_comentario: string | null;

    motivo: MotivoReporte;

    descripcion: string | null;

    estado: EstadoReporte;

    fecha_reporte: string;

    fecha_revision: string | null;
}


// ==========================================================
// PREGUNTA DE LA SEMANA
// ==========================================================

export interface PreguntaSemanaForo {
    id_pregunta_semana: string;

    pregunta: string;

    fecha_inicio: string;

    fecha_fin: string | null;

    estado: boolean;
}


// ==========================================================
// RESPUESTA A PREGUNTA DE LA SEMANA
// ==========================================================

export interface RespuestaPreguntaSemanaForo {
    id_respuesta: string;

    id_pregunta_semana: string;

    id_usuario: string;

    respuesta: string;

    fecha_respuesta: string;
}


// ==========================================================
// INPUTS DE PUBLICACIONES
// ==========================================================

export interface CrearPublicacionInput {
    idUsuario: string;

    titulo: string;

    contenido: string;

    emociones?: string[];
}


export interface EditarPublicacionInput {
    idPublicacion: string;

    idUsuario: string;

    titulo: string;

    contenido: string;

    emociones?: string[];
}


// ==========================================================
// INPUTS DE COMENTARIOS
// ==========================================================

export interface CrearComentarioInput {
    idPublicacion: string;

    idUsuario: string;

    contenido: string;
}


export interface EditarComentarioInput {
    idComentario: string;

    idUsuario: string;

    contenido: string;
}


// ==========================================================
// INPUT DE REPORTE
// ==========================================================

export interface CrearReporteInput {
    idUsuarioReporta: string;

    idPublicacion?: string | null;

    idComentario?: string | null;

    motivo: MotivoReporte;

    descripcion?: string | null;
}


// ==========================================================
// INPUT DE RESPUESTA A PREGUNTA DE LA SEMANA
// ==========================================================

export interface CrearRespuestaPreguntaSemanaInput {
    idPreguntaSemana: string;

    idUsuario: string;

    respuesta: string;
}

export interface RespuestaPreguntaSemanaConUsuario
    extends RespuestaPreguntaSemanaForo {

    usuario?: UsuarioForo | null;
}