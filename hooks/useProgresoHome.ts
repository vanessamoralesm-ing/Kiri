import { useCallback, useMemo, useState } from "react";

import { useFocusEffect } from "expo-router";

import { obtenerHistorialDiario } from "@/services/diario/autorregistro.service";

import { supabase } from "@/lib/supabase";

import { EntradaDiarioResumen } from "@/types/diario";

// ==========================================================
// TIPOS
// ==========================================================

export type DiaRacha = {
    fecha: string;
    etiqueta: string;
    completado: boolean;
    esHoy: boolean;
};

type ActividadRacha = {
    fecha: string;
    tipo: "diario" | "cuestionario";
};

type EjecucionTestCompletada = {
    id_ejecucion: string;
    id_usuario: string;
    estado: string;
    fecha_fin: string | null;
};

export type ProgresoHome = {
    cargando: boolean;

    rachaActual: number;

    actividadHoy: boolean;

    diasSemana: DiaRacha[];

    totalRegistros: number;

    totalCuestionarios: number;

    totalActividades: number;
};

// ==========================================================
// FECHAS
// ==========================================================

function normalizarFecha(fecha: Date) {
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

function obtenerClaveFecha(fecha: Date) {
    const anio = fecha.getFullYear();

    const mes = String(fecha.getMonth() + 1).padStart(2, "0");

    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

function restarDias(fecha: Date, cantidad: number) {
    const resultado = new Date(fecha);

    resultado.setDate(resultado.getDate() - cantidad);

    return normalizarFecha(resultado);
}

function diferenciaDias(fechaMayor: Date, fechaMenor: Date) {
    const mayorUTC = Date.UTC(
        fechaMayor.getFullYear(),
        fechaMayor.getMonth(),
        fechaMayor.getDate(),
    );

    const menorUTC = Date.UTC(
        fechaMenor.getFullYear(),
        fechaMenor.getMonth(),
        fechaMenor.getDate(),
    );

    return Math.round((mayorUTC - menorUTC) / 86400000);
}

// ==========================================================
// FECHAS ÚNICAS CON ACTIVIDAD
// ==========================================================

function obtenerFechasUnicas(actividades: ActividadRacha[]) {
    const claves = new Set(
        actividades.map((actividad) =>
            obtenerClaveFecha(new Date(actividad.fecha)),
        ),
    );

    return Array.from(claves)
        .map((clave) => {
            const [anio, mes, dia] = clave.split("-").map(Number);

            return new Date(anio, mes - 1, dia);
        })
        .sort((a, b) => b.getTime() - a.getTime());
}

// ==========================================================
// CALCULAR RACHA
// ==========================================================

function calcularRacha(actividades: ActividadRacha[]) {
    const fechas = obtenerFechasUnicas(actividades);

    if (fechas.length === 0) {
        return 0;
    }

    const hoy = normalizarFecha(new Date());

    const ultimaActividad = fechas[0];

    const diasDesdeUltimaActividad = diferenciaDias(hoy, ultimaActividad);

    /*
     * Si la última actividad fue hace más de un día,
     * ya se rompió la racha.
     */
    if (diasDesdeUltimaActividad > 1) {
        return 0;
    }

    let racha = 1;

    for (let i = 1; i < fechas.length; i++) {
        const diferencia = diferenciaDias(fechas[i - 1], fechas[i]);

        if (diferencia !== 1) {
            break;
        }

        racha++;
    }

    return racha;
}

// ==========================================================
// ÚLTIMOS SIETE DÍAS
// ==========================================================

function obtenerUltimosSieteDias(actividades: ActividadRacha[]): DiaRacha[] {
    const hoy = normalizarFecha(new Date());

    const fechasConActividad = new Set(
        actividades.map((actividad) =>
            obtenerClaveFecha(new Date(actividad.fecha)),
        ),
    );

    const etiquetas = ["D", "L", "M", "M", "J", "V", "S"];

    const dias: DiaRacha[] = [];

    for (let i = 6; i >= 0; i--) {
        const fecha = restarDias(hoy, i);

        const clave = obtenerClaveFecha(fecha);

        dias.push({
            fecha: clave,

            etiqueta: etiquetas[fecha.getDay()],

            completado: fechasConActividad.has(clave),

            esHoy: i === 0,
        });
    }

    return dias;
}

// ==========================================================
// HOOK
// ==========================================================

export function useProgresoHome(): ProgresoHome {
    const [cargando, setCargando] = useState(true);

    const [registrosDiario, setRegistrosDiario] = useState<
        EntradaDiarioResumen[]
    >([]);

    const [cuestionariosCompletados, setCuestionariosCompletados] = useState<
        EjecucionTestCompletada[]
    >([]);

    // ========================================================
    // CARGAR PROGRESO
    // ========================================================

    const cargarProgreso = useCallback(async () => {
        try {
            setCargando(true);

            // --------------------------------------------------
            // USUARIO ACTUAL
            // --------------------------------------------------

            const {
                data: authData,

                error: authError,
            } = await supabase.auth.getUser();

            if (authError) {
                throw authError;
            }

            const usuario = authData.user;

            if (!usuario) {
                setRegistrosDiario([]);

                setCuestionariosCompletados([]);

                return;
            }

            // --------------------------------------------------
            // CARGAR DIARIO + CUESTIONARIOS
            // --------------------------------------------------

            const [registros, resultadoCuestionarios] = await Promise.all([
                obtenerHistorialDiario(3650),

                supabase
                    .from("ejecucion_test")
                    .select(
                        `
                    id_ejecucion,
                    id_usuario,
                    estado,
                    fecha_fin
                  `,
                    )
                    .eq("id_usuario", usuario.id)
                    .eq("estado", "completado")
                    .not("fecha_fin", "is", null)
                    .order("fecha_fin", {
                        ascending: false,
                    }),
            ]);

            setRegistrosDiario(registros);

            if (resultadoCuestionarios.error) {
                throw resultadoCuestionarios.error;
            }

            setCuestionariosCompletados(
                (resultadoCuestionarios.data ?? []) as EjecucionTestCompletada[],
            );
        } catch (error) {
            console.error("Error al cargar el progreso del usuario:", error);

            setRegistrosDiario([]);

            setCuestionariosCompletados([]);
        } finally {
            setCargando(false);
        }
    }, []);

    // ========================================================
    // RECARGAR AL VOLVER AL HOME
    // ========================================================

    useFocusEffect(
        useCallback(() => {
            cargarProgreso();
        }, [cargarProgreso]),
    );

    // ========================================================
    // UNIFICAR ACTIVIDADES
    // ========================================================

    const actividades = useMemo(() => {
        const actividadesDiario: ActividadRacha[] = registrosDiario.map(
            (registro) => ({
                fecha: registro.fecha_inicio,

                tipo: "diario",
            }),
        );

        const actividadesCuestionario: ActividadRacha[] = cuestionariosCompletados
            .filter((item) => Boolean(item.fecha_fin))
            .map((item) => ({
                fecha: item.fecha_fin as string,

                tipo: "cuestionario",
            }));

        return [...actividadesDiario, ...actividadesCuestionario];
    }, [registrosDiario, cuestionariosCompletados]);

    // ========================================================
    // RACHA
    // ========================================================

    const rachaActual = useMemo(() => calcularRacha(actividades), [actividades]);

    // ========================================================
    // DÍAS
    // ========================================================

    const diasSemana = useMemo(
        () => obtenerUltimosSieteDias(actividades),
        [actividades],
    );

    // ========================================================
    // ACTIVIDAD HOY
    // ========================================================

    const actividadHoy = useMemo(() => {
        const hoy = obtenerClaveFecha(new Date());

        return actividades.some(
            (actividad) => obtenerClaveFecha(new Date(actividad.fecha)) === hoy,
        );
    }, [actividades]);

    // ========================================================
    // RESULTADO
    // ========================================================

    return {
        cargando,

        rachaActual,

        actividadHoy,

        diasSemana,

        totalRegistros: registrosDiario.length,

        totalCuestionarios: cuestionariosCompletados.length,

        totalActividades: actividades.length,
    };
}
