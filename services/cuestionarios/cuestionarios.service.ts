import { supabase } from "@/lib/supabase";

import type { BaremoTest, EjecucionTest, OpcionTest, PreguntaTest, RangoBaremo, ResultadoTest, SubescalaTest, Test } from "@/types/cuestionarios";

// ==========================================================
// TIPOS AUXILIARES
// ==========================================================

export interface UsuarioCuestionario {
    id_usuario: string;
    fecha_nacimiento: string | null;
    genero: string | null;
    estado: string;
}

export interface OpcionRespuestaTest {
    id: string;
    codigo: string;
    texto: string;
    valor: number | null;
    orden: number;
}

export interface PreguntaTestConOpciones extends PreguntaTest {
    opciones: OpcionRespuestaTest[];
}

export interface RespuestaSeleccionada {
    idOpcion: string;
    valor: number | null;
}

export type ResultadoGuardado =
    Pick<
        ResultadoTest,
        "id_resultado" | "id_ejecucion"
    >;

// ==========================================================
// TESTS
// ==========================================================

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

    return (data ?? []) as Test[];
}


/**
 * Obtener un test mediante su código.
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

    return data as Test | null;
}


// ==========================================================
// USUARIO
// ==========================================================

/**
 * Obtener los datos del usuario autenticado
 * necesarios para responder un cuestionario.
 */
export async function obtenerUsuarioCuestionario():
Promise<UsuarioCuestionario> {

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
        console.error(
            "Error al obtener usuario autenticado:",
            authError
        );

        throw authError;
    }

    if (!user) {
        throw new Error(
            "Debes iniciar sesión para responder este cuestionario."
        );
    }

    const { data, error } = await supabase
        .from("usuario")
        .select(`
            id_usuario,
            fecha_nacimiento,
            genero,
            estado
        `)
        .eq("id_usuario", user.id)
        .maybeSingle();

    if (error) {
        console.error(
            "Error al obtener datos del usuario:",
            error
        );

        throw error;
    }

    if (!data) {
        throw new Error(
            "No fue posible encontrar tu perfil de usuario."
        );
    }

    if (data.estado !== "activo") {
        throw new Error(
            "La cuenta no se encuentra activa."
        );
    }

    return data as UsuarioCuestionario;
}


// ==========================================================
// EJECUCIONES
// ==========================================================

/**
 * Obtener una ejecución en progreso.
 * Si no existe, crear una nueva.
 */
export async function obtenerOCrearEjecucion(
    idUsuario: string,
    idTest: string
): Promise<EjecucionTest> {

    const {
        data: existente,
        error: errorExistente,
    } = await supabase
        .from("ejecucion_test")
        .select(`
            id_ejecucion,
            id_usuario,
            id_test,
            estado,
            fecha_inicio,
            fecha_fin
        `)
        .eq("id_usuario", idUsuario)
        .eq("id_test", idTest)
        .eq("estado", "en_progreso")
        .maybeSingle();

    if (errorExistente) {
        console.error(
            "Error al buscar ejecución:",
            errorExistente
        );

        throw errorExistente;
    }

    if (existente) {
        return existente as EjecucionTest;
    }

    const {
        data: nueva,
        error: errorNueva,
    } = await supabase
        .from("ejecucion_test")
        .insert({
            id_usuario: idUsuario,
            id_test: idTest,
            estado: "en_progreso",
        })
        .select(`
            id_ejecucion,
            id_usuario,
            id_test,
            estado,
            fecha_inicio,
            fecha_fin
        `)
        .single();

    if (errorNueva) {
        console.error(
            "Error al crear ejecución:",
            errorNueva
        );

        throw errorNueva;
    }

    return nueva as EjecucionTest;
}


/**
 * Completar una ejecución.
 */
export async function completarEjecucion(
    idEjecucion: string
): Promise<void> {

    const { error } = await supabase
        .from("ejecucion_test")
        .update({
            estado: "completado",
            fecha_fin: new Date().toISOString(),
        })
        .eq(
            "id_ejecucion",
            idEjecucion
        );

    if (error) {
        console.error(
            "Error al completar la ejecución:",
            error
        );

        throw error;
    }
}


// ==========================================================
// SUBESCALAS
// ==========================================================

/**
 * Obtener las subescalas activas de un test.
 */
export async function obtenerSubescalasPorTest(
    idTest: string
): Promise<SubescalaTest[]> {

    const { data, error } = await supabase
        .from("subescala")
        .select(`
            id_subescala,
            id_test,
            codigo,
            nombre,
            descripcion,
            orden,
            incluye_total,
            estado
        `)
        .eq("id_test", idTest)
        .eq("estado", true)
        .order("orden", {
            ascending: true,
        });

    if (error) {
        console.error(
            "Error al obtener subescalas:",
            error
        );

        throw error;
    }

    return (data ?? []) as SubescalaTest[];
}


// ==========================================================
// PREGUNTAS
// ==========================================================

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

    return (data ?? []) as PreguntaTest[];
}


/**
 * Obtener las preguntas junto con sus opciones.
 */
export async function obtenerPreguntasConOpciones(
    idTest: string
): Promise<PreguntaTestConOpciones[]> {

    const { data, error } = await supabase
        .from("pregunta_test")
        .select(`
            id_pregunta,
            id_test,
            id_subescala,
            codigo,
            enunciado,
            descripcion_apoyo,
            tipo_pregunta,
            orden,
            obligatoria,
            puntua,
            es_observacional,
            permite_comentario,
            estado,
            fecha_creacion,
            fecha_actualizacion,

            opcion_test (
                id_opcion,
                id_pregunta,
                codigo,
                etiqueta,
                valor_puntaje,
                orden,
                estado
            )
        `)
        .eq("id_test", idTest)
        .eq("estado", true)
        .eq("opcion_test.estado", true)
        .order("orden", {
            ascending: true,
        });

    if (error) {
        console.error(
            "Error al obtener preguntas con opciones:",
            error
        );

        throw error;
    }

    return (data ?? []).map(
        (pregunta): PreguntaTestConOpciones => {

            const opcionesDB =
                (
                    pregunta.opcion_test ??
                    []
                ) as OpcionTest[];

            const opciones =
                opcionesDB
                    .filter(
                        (opcion) =>
                            opcion.estado
                    )
                    .sort(
                        (a, b) =>
                            a.orden - b.orden
                    )
                    .map(
                        (
                            opcion
                        ): OpcionRespuestaTest => ({
                            id:
                                opcion.id_opcion,

                            codigo:
                                opcion.codigo,

                            texto:
                                opcion.etiqueta,

                            valor:
                                opcion.valor_puntaje === null
                                    ? null
                                    : Number(
                                        opcion.valor_puntaje
                                    ),

                            orden:
                                opcion.orden,
                        })
                    );

            return {
                id_pregunta:
                    pregunta.id_pregunta,

                id_test:
                    pregunta.id_test,

                id_subescala:
                    pregunta.id_subescala,

                codigo:
                    pregunta.codigo,

                enunciado:
                    pregunta.enunciado,

                descripcion_apoyo:
                    pregunta.descripcion_apoyo,

                tipo_pregunta:
                    pregunta.tipo_pregunta as
                        PreguntaTest["tipo_pregunta"],

                orden:
                    pregunta.orden,

                obligatoria:
                    pregunta.obligatoria,

                puntua:
                    pregunta.puntua,

                es_observacional:
                    pregunta.es_observacional,

                permite_comentario:
                    pregunta.permite_comentario,

                estado:
                    pregunta.estado,

                fecha_creacion:
                    pregunta.fecha_creacion,

                fecha_actualizacion:
                    pregunta.fecha_actualizacion,

                opciones,
            };
        }
    );
}


// ==========================================================
// RESPUESTAS
// ==========================================================

/**
 * Obtener las respuestas previamente guardadas
 * de una ejecución.
 */
export async function obtenerRespuestasEjecucion(
    idEjecucion: string
) {

    const { data, error } = await supabase
        .from("respuesta_test")
        .select(`
            id_pregunta,
            id_opcion,
            valor_numerico
        `)
        .eq(
            "id_ejecucion",
            idEjecucion
        );

    if (error) {
        console.error(
            "Error al obtener respuestas:",
            error
        );

        throw error;
    }

    return data ?? [];
}


/**
 * Guardar o actualizar una respuesta.
 */
export async function guardarRespuestaTest({
    idEjecucion,
    idPregunta,
    idOpcion,
}: {
    idEjecucion: string;
    idPregunta: string;
    idOpcion: string;
}): Promise<void> {

    const { error } = await supabase
        .from("respuesta_test")
        .upsert(
            {
                id_ejecucion:
                    idEjecucion,

                id_pregunta:
                    idPregunta,

                id_opcion:
                    idOpcion,

                texto_respuesta:
                    null,

                valor_numerico:
                    null,
            },
            {
                onConflict:
                    "id_ejecucion,id_pregunta",
            }
        );

    if (error) {
        console.error(
            "Error al guardar respuesta:",
            error
        );

        throw error;
    }
}


// ==========================================================
// BAREMOS
// ==========================================================

/**
 * Obtener todos los baremos activos de un test.
 */
export async function obtenerBaremosPorTest(
    idTest: string
): Promise<BaremoTest[]> {

    const { data, error } = await supabase
        .from("baremo_test")
        .select(`
            id_baremo,
            id_test,
            codigo,
            nombre,
            descripcion,
            poblacion,
            sexo_aplicable,
            edad_minima,
            edad_maxima,
            tipo_valor,
            version,
            fuente,
            estado
        `)
        .eq(
            "id_test",
            idTest
        )
        .eq(
            "estado",
            true
        );

    if (error) {
        console.error(
            "Error al obtener baremos:",
            error
        );

        throw error;
    }

    return (data ?? []) as BaremoTest[];
}


/**
 * Obtener los rangos activos de un baremo.
 */
export async function obtenerRangosPorBaremo(
    idBaremo: string
): Promise<RangoBaremo[]> {

    const { data, error } = await supabase
        .from("rango_baremo")
        .select(`
            id_rango,
            id_baremo,
            id_subescala,
            nivel,
            valor_minimo,
            valor_maximo,
            interpretacion,
            orden
        `)
        .eq(
            "id_baremo",
            idBaremo
        )
        .eq(
            "estado",
            true
        )
        .order(
            "orden",
            {
                ascending: true,
            }
        );

    if (error) {
        console.error(
            "Error al obtener rangos:",
            error
        );

        throw error;
    }

    return (data ?? []) as RangoBaremo[];
}


// ==========================================================
// RESULTADOS
// ==========================================================

/**
 * Guardar o actualizar el resultado principal.
 */
export async function guardarResultadoTest({
    idEjecucion,
    puntajeDirecto,
    puntajeTotal,
    nivel,
    interpretacion,
    esValido,
    observaciones,
    idBaremo,
    idRangoBaremo,
}: {
    idEjecucion: string;
    puntajeDirecto: number;
    puntajeTotal: number;
    nivel: string | null;
    interpretacion: string | null;
    esValido: boolean;
    observaciones: string | null;
    idBaremo: string | null;
    idRangoBaremo: string | null;
}): Promise<ResultadoGuardado> {

    const { data, error } = await supabase
        .from("resultado_test")
        .upsert(
            {
                id_ejecucion:
                    idEjecucion,

                puntaje_directo:
                    puntajeDirecto,

                puntaje_total:
                    puntajeTotal,

                nivel_cualitativo:
                    nivel,

                interpretacion_texto:
                    interpretacion,

                es_valido:
                    esValido,

                observaciones,

                id_baremo:
                    idBaremo,

                id_rango_baremo:
                    idRangoBaremo,

                tipo_finalizacion:
                    "completa",
            },
            {
                onConflict:
                    "id_ejecucion",
            }
        )
        .select(`
            id_resultado,
            id_ejecucion
        `)
        .single();

    if (error) {
        console.error(
            "Error al guardar resultado:",
            error
        );

        throw error;
    }

    return data as ResultadoGuardado;
}


/**
 * Guardar o actualizar el resultado de una subescala.
 */
export async function guardarResultadoSubescala({
    idResultado,
    idSubescala,
    puntajeDirecto,
    nivel,
    interpretacion,
}: {
    idResultado: string;
    idSubescala: string;
    puntajeDirecto: number;
    nivel: string | null;
    interpretacion: string | null;
}): Promise<void> {

    const { error } = await supabase
        .from("resultado_subescala")
        .upsert(
            {
                id_resultado:
                    idResultado,

                id_subescala:
                    idSubescala,

                puntaje_directo:
                    puntajeDirecto,

                puntaje_transformado:
                    null,

                nivel_cualitativo:
                    nivel,

                interpretacion_texto:
                    interpretacion,
            },
            {
                onConflict:
                    "id_resultado,id_subescala",
            }
        );

    if (error) {
        console.error(
            "Error al guardar resultado de subescala:",
            error
        );

        throw error;
    }
}

// ==========================================================
// TIPO PARA LISTADO DE CUESTIONARIOS
// ==========================================================

export interface TestConConteoPreguntas extends Test {
    pregunta_test?: {
        count: number;
    }[];
}


// ==========================================================
// LISTADO DE TESTS CON NÚMERO DE PREGUNTAS
// ==========================================================

export async function obtenerTestsConConteoPreguntas():
Promise<TestConConteoPreguntas[]> {

    const { data, error } = await supabase
        .from("test")
        .select(`
            id_test,
            codigo,
            nombre,
            descripcion,
            instrucciones,
            poblacion_objetivo,
            tipo_aplicacion,
            tiene_subescalas,
            version,
            estado,
            fecha_creacion,
            fecha_actualizacion,

            pregunta_test(count)
        `)
        .eq("estado", true)
        .order("nombre", {
            ascending: true,
        });

    if (error) {
        console.error(
            "Error al obtener tests con conteo de preguntas:",
            error
        );

        throw error;
    }

    return (
        data ?? []
    ) as TestConConteoPreguntas[];
}