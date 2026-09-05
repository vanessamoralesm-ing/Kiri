import { supabase } from "@/lib/supabase";


// ==========================================================
// TYPES
// ==========================================================
export interface SuperAdminDashboardStats {
    solicitudesPendientes: number;
    institucionesActivas: number;
    usuariosRegistrados: number;
    cuestionariosActivos: number;
}
// ==========================================================
// OBTENER ESTADÍSTICAS DEL DASHBOARD
// ==========================================================

export async function obtenerEstadisticasDashboard():
    Promise<SuperAdminDashboardStats> {

    const [
        solicitudesResult,
        institucionesResult,
        usuariosResult,
        cuestionariosResult,
    ] = await Promise.all([

        // ==================================================
        // SOLICITUDES PENDIENTES
        // ==================================================

        supabase
            .from("solicitud_institucion")
            .select(
                "*",
                {
                    count: "exact",
                    head: true,
                },
            )
            .eq(
                "estado",
                "pendiente",
            ),


        // ==================================================
        // INSTITUCIONES ACTIVAS
        // ==================================================

        supabase
            .from("institucion")
            .select(
                "*",
                {
                    count: "exact",
                    head: true,
                },
            )
            .eq(
                "estado",
                "activo",
            ),


        // ==================================================
        // USUARIOS REGISTRADOS
        // ==================================================

        supabase
            .from("usuario")
            .select(
                "*",
                {
                    count: "exact",
                    head: true,
                },
            ),


        // ==================================================
        // CUESTIONARIOS / TEST ACTIVOS
        // ==================================================

        supabase
            .from("test")
            .select(
                "*",
                {
                    count: "exact",
                    head: true,
                },
            )
            .eq(
                "estado",
                true,
            ),
    ]);


    // ======================================================
    // VALIDAR ERRORES
    // ======================================================

    if (solicitudesResult.error) {
        console.error(
            "Error contando solicitudes:",
            solicitudesResult.error,
        );

        throw new Error(
            "No fue posible obtener las solicitudes.",
        );
    }


    if (institucionesResult.error) {
        console.error(
            "Error contando instituciones:",
            institucionesResult.error,
        );

        throw new Error(
            "No fue posible obtener las instituciones.",
        );
    }


    if (usuariosResult.error) {
        console.error(
            "Error contando usuarios:",
            usuariosResult.error,
        );

        throw new Error(
            "No fue posible obtener los usuarios.",
        );
    }


    if (cuestionariosResult.error) {
        console.error(
            "Error contando cuestionarios:",
            cuestionariosResult.error,
        );

        throw new Error(
            "No fue posible obtener los cuestionarios.",
        );
    }


    // ======================================================
    // RESULTADO
    // ======================================================

    return {
        solicitudesPendientes:
            solicitudesResult.count ?? 0,

        institucionesActivas:
            institucionesResult.count ?? 0,

        usuariosRegistrados:
            usuariosResult.count ?? 0,

        cuestionariosActivos:
            cuestionariosResult.count ?? 0,
    };
}