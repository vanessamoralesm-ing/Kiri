import { supabase } from "@/lib/supabase";

import {
    PreguntaTest,
    Test,
} from "@/types/cuestionarios";

/**
 * Obtener todos los tests activos.
 */
export async function obtenerTests(): Promise<Test[]> {
    const { data, error } = await supabase
        .from("test")
        .select("*")
        .eq("estado", true)
        .order("nombre", {
            ascending: true,
        });

    if (error) {
        console.error(
            "Error al obtener los tests:",
            error
        );

        throw error;
    }

    return data ?? [];
}

/**
 * Obtener un test mediante su código.
 *
 * Ejemplo:
 * RATHUS
 * FSS
 * COOPERSMITH_ADULTOS
 */
export async function obtenerTestPorCodigo(
    codigo: string
): Promise<Test | null> {
    const { data, error } = await supabase
        .from("test")
        .select("*")
        .eq("codigo", codigo)
        .eq("estado", true)
        .maybeSingle();

    if (error) {
        console.error(
            "Error al obtener el test:",
            error
        );

        throw error;
    }

    return data;
}

/**
 * Obtener preguntas de un test mediante su UUID.
 */
export async function obtenerPreguntasPorTest(
    idTest: string
): Promise<PreguntaTest[]> {
    const { data, error } = await supabase
        .from("pregunta_test")
        .select("*")
        .eq("id_test", idTest)
        .eq("estado", true)
        .order("orden", {
            ascending: true,
        });

    if (error) {
        console.error(
            "Error al obtener preguntas:",
            error
        );

        throw error;
    }

    return data ?? [];
}