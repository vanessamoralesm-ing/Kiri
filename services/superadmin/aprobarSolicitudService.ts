import { supabase } from "@/lib/supabase";


// ==========================================================
// RESULTADO
// ==========================================================

export interface AprobarSolicitudResult {
    success: boolean;

    institucion: {
        id_institucion: string;
        nombre: string;
        codigo_institucional: string;
        estado: "activo";
    };

    usuario: {
        id_usuario: string;
        correo: string;
        rol: "administrador_institucional";
        debe_cambiar_password: boolean;
    };

    solicitud: {
        id_solicitud: string;
        estado: "aprobada";
        fecha_resolucion: string;
    };

    correo_enviado: boolean;

    message: string;

    warning?: string;
}


// ==========================================================
// APROBAR SOLICITUD
// ==========================================================

export async function aprobarSolicitudInstitucional(
    idSolicitud: string,
): Promise<AprobarSolicitudResult> {

    if (!idSolicitud.trim()) {
        throw new Error(
            "El identificador de la solicitud es obligatorio.",
        );
    }


    const {
        data,
        error,
    } =
        await supabase.functions.invoke(
            "aprobar-solicitud-institucional",
            {
                body: {
                    id_solicitud:
                        idSolicitud,
                },
            },
        );


    if (error) {
        console.error(
            "Error ejecutando aprobar-solicitud-institucional:",
            error,
        );

        throw new Error(
            "No fue posible ejecutar la aprobación.",
        );
    }


    if (!data?.success) {
        console.error(
            "Error devuelto por la Edge Function:",
            data,
        );

        throw new Error(
            data?.error ??
            "No fue posible aprobar la institución.",
        );
    }
    return data as AprobarSolicitudResult;
}