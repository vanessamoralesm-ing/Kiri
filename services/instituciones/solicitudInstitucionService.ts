import { supabase } from "@/lib/supabase";

import type {
    CrearSolicitudInstitucionInput,
} from "@/types/superadmin/solicitudes";


// ==========================================================
// RESPUESTA DE LA EDGE FUNCTION
// ==========================================================

export interface CrearSolicitudInstitucionResult {
    success: boolean;

    solicitud: {
        id_solicitud: string;
        fecha_solicitud: string;
        estado: "pendiente";
    };

    correo_enviado: boolean;

    message?: string;
    warning?: string;
}


// ==========================================================
// CREAR SOLICITUD INSTITUCIONAL
// ==========================================================

export async function crearSolicitudInstitucional(
    solicitud: CrearSolicitudInstitucionInput,
): Promise<CrearSolicitudInstitucionResult> {

    // ======================================================
    // LLAMAR EDGE FUNCTION
    // ======================================================

    const {
        data,
        error,
    } =
        await supabase.functions.invoke(
            "crear-solicitud-institucional",
            {
                body: {
                    nombre_institucion:
                        solicitud.nombre_institucion.trim(),

                    codigo_institucional:
                        solicitud.codigo_institucional.trim(),

                    tipo_institucion:
                        solicitud.tipo_institucion,

                    direccion:
                        solicitud.direccion.trim(),

                    municipio:
                        solicitud.municipio.trim(),

                    departamento:
                        solicitud.departamento.trim(),

                    nombre_solicitante:
                        solicitud.nombre_solicitante.trim(),

                    apellido_solicitante:
                        solicitud.apellido_solicitante.trim(),

                    cedula_solicitante:
                        solicitud.cedula_solicitante.trim(),

                    cargo_solicitante:
                        solicitud.cargo_solicitante.trim(),

                    correo:
                        solicitud.correo
                            .trim()
                            .toLowerCase(),

                    telefono:
                        solicitud.telefono.trim(),

                    descripcion:
                        solicitud.descripcion.trim(),
                },
            },
        );


    // ======================================================
    // ERROR INVOCANDO LA FUNCIÓN
    // ======================================================

    if (error) {
        console.error(
            "Error ejecutando crear-solicitud-institucional:",
            error,
        );

        throw new Error(
            "No fue posible registrar la solicitud.",
        );
    }


    // ======================================================
    // ERROR DEVUELTO POR EL BACKEND
    // ======================================================

    if (!data?.success) {
        console.error(
            "Error devuelto por la Edge Function:",
            data,
        );

        throw new Error(
            data?.error ??
            "No fue posible registrar la solicitud.",
        );
    }


    // ======================================================
    // RESPUESTA CORRECTA
    // ======================================================

    return data as CrearSolicitudInstitucionResult;
}