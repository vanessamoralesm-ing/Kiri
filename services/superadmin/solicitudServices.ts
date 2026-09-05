import { supabase } from "@/lib/supabase";

import type {
    SolicitudInstitucion,
} from "@/types/superadmin/solicitudes";


// ==========================================================
// OBTENER TODAS LAS SOLICITUDES
// ==========================================================

export async function obtenerSolicitudesInstitucionales():
    Promise<SolicitudInstitucion[]> {

    const {
        data,
        error,
    } = await supabase
        .from("solicitud_institucion")
        .select(`
            id_solicitud,
            id_institucion,

            nombre_institucion,
            codigo_institucional,
            tipo_institucion,

            direccion,
            municipio,
            departamento,

            nombre_solicitante,
            apellido_solicitante,
            cedula_solicitante,
            cargo_solicitante,

            correo,
            telefono,
            descripcion,

            fecha_solicitud,
            fecha_resolucion,
            estado
        `)
        .order(
            "fecha_solicitud",
            {
                ascending: false,
            },
        );


    if (error) {
        console.error(
            "Error obteniendo solicitudes institucionales:",
            error,
        );

        throw new Error(
            "No fue posible cargar las solicitudes institucionales.",
        );
    }


    return (data ?? []) as SolicitudInstitucion[];
}


// ==========================================================
// OBTENER UNA SOLICITUD POR ID
// ==========================================================

export async function obtenerSolicitudInstitucionalPorId(
    idSolicitud: string,
): Promise<SolicitudInstitucion> {

    if (!idSolicitud.trim()) {
        throw new Error(
            "El identificador de la solicitud es obligatorio.",
        );
    }


    const {
        data,
        error,
    } = await supabase
        .from("solicitud_institucion")
        .select(`
            id_solicitud,
            id_institucion,

            nombre_institucion,
            codigo_institucional,
            tipo_institucion,

            direccion,
            municipio,
            departamento,

            nombre_solicitante,
            apellido_solicitante,
            cedula_solicitante,
            cargo_solicitante,

            correo,
            telefono,
            descripcion,

            fecha_solicitud,
            fecha_resolucion,
            estado
        `)
        .eq(
            "id_solicitud",
            idSolicitud,
        )
        .single();


    if (error) {
        console.error(
            "Error obteniendo solicitud institucional:",
            error,
        );

        throw new Error(
            "No fue posible cargar la solicitud institucional.",
        );
    }


    return data as SolicitudInstitucion;
}