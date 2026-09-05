export type TipoInstitucion =
    | "educacion_superior"
    | "escolar"
    | "salud";


export type EstadoSolicitud =
    | "pendiente"
    | "aprobada"
    | "rechazada";


export type FiltroEstado =
    | "todas"
    | EstadoSolicitud;


export type FiltroTipo =
    | "todos"
    | TipoInstitucion;


// ==========================================================
// SOLICITUD QUE VIENE DE LA BASE DE DATOS
// ==========================================================

export interface SolicitudInstitucion {
    id_solicitud: string;

    id_institucion:
        string | null;

    nombre_institucion:
        string;

    codigo_institucional:
        string;

    tipo_institucion:
        TipoInstitucion;

    direccion:
        string;

    municipio:
        string;

    departamento:
        string;

    nombre_solicitante:
        string;

    apellido_solicitante:
        string;

    cedula_solicitante:
        string;

    cargo_solicitante:
        string;

    correo:
        string;

    telefono:
        string;

    descripcion:
        string;

    fecha_solicitud:
        string;

    fecha_resolucion:
        string | null;

    estado:
        EstadoSolicitud;
}


// ==========================================================
// DATOS PARA CREAR UNA SOLICITUD
// ==========================================================

export interface CrearSolicitudInstitucionInput {
    nombre_institucion:
        string;

    codigo_institucional:
        string;

    tipo_institucion:
        TipoInstitucion;

    direccion:
        string;

    municipio:
        string;

    departamento:
        string;

    nombre_solicitante:
        string;

    apellido_solicitante:
        string;

    cedula_solicitante:
        string;

    cargo_solicitante:
        string;

    correo:
        string;

    telefono:
        string;

    descripcion:
        string;
}