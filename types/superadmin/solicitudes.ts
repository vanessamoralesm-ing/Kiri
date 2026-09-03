export type EstadoSolicitud = "pendiente" | "aprobada" | "rechazada";

export type TipoInstitucion = "educacion_superior" | "escolar" | "salud";

export type FiltroEstado = "todas" | EstadoSolicitud;

export type FiltroTipo = "todos" | TipoInstitucion;

export interface ModuloSolicitado {
    id: string;
    nombre: string;
}

export interface InstitucionSolicitud {
    nombre: string;
    siglas: string;
    sede: string;
    direccion: string;
    rut: string;
    matricula_estimada: number;
    tipo: TipoInstitucion;
}

export interface SolicitanteSolicitud {
    nombre: string;
    cargo: string;
    correo: string;
    telefono: string;
    verificado: boolean;
}

export interface SolicitudInstitucion {
    id_solicitud: string;
    codigo: string;

    institucion: InstitucionSolicitud;

    solicitante: SolicitanteSolicitud;

    modulos: ModuloSolicitado[];

    estado: EstadoSolicitud;

    fecha_solicitud: string;
    hora_solicitud: string;

    documentos: number;
}
