import { supabase } from "@/lib/supabase";

import type {
    BaremoTest,
    OpcionTest,
    PreguntaTest,
    RangoBaremo,
    SubescalaTest,
    Test,
} from "@/types/cuestionarios";

// ==========================================================
// TIPOS AUXILIARES
// ==========================================================

/**
 * Test utilizado por el panel administrativo.
 *
 * Incluye el número de preguntas registradas.
 */
export interface TestAdmin extends Test {
    pregunta_test?: {
        count: number;
    }[];
}

/**
 * Resumen utilizado en las tarjetas/KPI del módulo.
 */
export interface ResumenCuestionariosAdmin {
    total: number;
    activos: number;
    inactivos: number;
}

/**
 * Datos requeridos para crear un test.
 */
export interface CrearTestAdmin {
    codigo: string;
    nombre: string;
    descripcion: string | null;
    instrucciones: string | null;
    poblacion_objetivo: string | null;
    tipo_aplicacion: string | null;
    tiene_subescalas: boolean;
    version: string | null;
    estado?: boolean;
}

/**
 * Campos que pueden modificarse en un test.
 */
export interface ActualizarTestAdmin {
    codigo?: string;
    nombre?: string;
    descripcion?: string | null;
    instrucciones?: string | null;
    poblacion_objetivo?: string | null;
    tipo_aplicacion?: string | null;
    tiene_subescalas?: boolean;
    version?: string | null;
    estado?: boolean;
}

/**
 * Datos requeridos para crear una subescala.
 */
export interface CrearSubescalaAdmin {
    id_test: string;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    orden: number;
    incluye_total: boolean;
    estado?: boolean;
}

/**
 * Campos editables de una subescala.
 */
export interface ActualizarSubescalaAdmin {
    codigo?: string;
    nombre?: string;
    descripcion?: string | null;
    orden?: number;
    incluye_total?: boolean;
    estado?: boolean;
}

/**
 * Datos requeridos para crear una pregunta.
 */
export interface CrearPreguntaAdmin {
    id_test: string;
    id_subescala: string | null;

    codigo: string;

    enunciado: string;
    descripcion_apoyo: string | null;

    tipo_pregunta: PreguntaTest["tipo_pregunta"];

    orden: number;

    obligatoria: boolean;
    puntua: boolean;
    es_observacional: boolean;
    permite_comentario: boolean;

    estado?: boolean;
}

/**
 * Campos editables de una pregunta.
 */
export interface ActualizarPreguntaAdmin {
    id_subescala?: string | null;

    codigo?: string;

    enunciado?: string;
    descripcion_apoyo?: string | null;

    tipo_pregunta?: PreguntaTest["tipo_pregunta"];

    orden?: number;

    obligatoria?: boolean;
    puntua?: boolean;
    es_observacional?: boolean;
    permite_comentario?: boolean;

    estado?: boolean;
}

/**
 * Datos requeridos para crear una opción.
 */
export interface CrearOpcionAdmin {
    id_pregunta: string;

    codigo: string;

    etiqueta: string;

    valor_puntaje: number | null;

    orden: number;

    estado?: boolean;
}

/**
 * Campos editables de una opción.
 */
export interface ActualizarOpcionAdmin {
    codigo?: string;

    etiqueta?: string;

    valor_puntaje?: number | null;

    orden?: number;

    estado?: boolean;
}

/**
 * Datos requeridos para crear un baremo.
 */
export interface CrearBaremoAdmin {
    id_test: string;

    codigo: string;
    nombre: string;

    descripcion: string | null;

    poblacion: string | null;

    sexo_aplicable: string | null;

    edad_minima: number | null;
    edad_maxima: number | null;

    tipo_valor: string | null;

    version: string | null;

    fuente: string | null;

    estado?: boolean;
}

/**
 * Campos editables de un baremo.
 */
export interface ActualizarBaremoAdmin {
    codigo?: string;
    nombre?: string;

    descripcion?: string | null;

    poblacion?: string | null;

    sexo_aplicable?: string | null;

    edad_minima?: number | null;
    edad_maxima?: number | null;

    tipo_valor?: string | null;

    version?: string | null;

    fuente?: string | null;

    estado?: boolean;
}

/**
 * Datos necesarios para crear un rango de baremo.
 */
export interface CrearRangoBaremoAdmin {
    id_baremo: string;

    id_subescala: string | null;

    nivel: string;

    valor_minimo: number;
    valor_maximo: number;

    interpretacion: string | null;

    orden: number;

    estado?: boolean;
}

/**
 * Campos editables de un rango.
 */
export interface ActualizarRangoBaremoAdmin {
    id_subescala?: string | null;

    nivel?: string;

    valor_minimo?: number;
    valor_maximo?: number;

    interpretacion?: string | null;

    orden?: number;

    estado?: boolean;
}

/**
 * Opción incluida dentro de una pregunta para el editor.
 */
export interface OpcionAdmin extends OpcionTest { }

/**
 * Pregunta junto con sus opciones.
 */
export interface PreguntaAdmin extends PreguntaTest {
    opcion_test?: OpcionAdmin[];
}

/**
 * Estructura completa utilizada por el editor administrativo.
 */
export interface TestCompletoAdmin extends Test {
    subescala?: SubescalaTest[];

    pregunta_test?: PreguntaAdmin[];

    baremo_test?: BaremoTest[];
}

// ==========================================================
// UTILIDADES
// ==========================================================

/**
 * Fecha actual en formato ISO para fecha_actualizacion.
 */
function obtenerFechaActual(): string {
    return new Date().toISOString();
}

/**
 * Normaliza códigos para evitar espacios y diferencias
 * accidentales entre mayúsculas/minúsculas.
 *
 * Ej:
 * " phq 9 " -> "PHQ-9"
 */
export function normalizarCodigoTest(codigo: string): string {
    return codigo.trim().toUpperCase().replace(/\s+/g, "-");
}

// ==========================================================
// TESTS - LECTURA
// ==========================================================

/**
 * Obtener TODOS los tests para administración.
 *
 * A diferencia de obtenerTests(), esta consulta incluye
 * tanto registros activos como inactivos.
 */
export async function obtenerTestsAdmin(): Promise<TestAdmin[]> {
    const { data, error } = await supabase
        .from("test")
        .select(
            `
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
        `,
        )
        .order("nombre", {
            ascending: true,
        });

    if (error) {
        console.error("Error al obtener tests para administración:", error);

        throw error;
    }

    return (data ?? []) as TestAdmin[];
}

/**
 * Obtener un test mediante su UUID.
 *
 * En administración NO se filtra por estado.
 */
export async function obtenerTestAdminPorId(
    idTest: string,
): Promise<Test | null> {
    const { data, error } = await supabase
        .from("test")
        .select("*")
        .eq("id_test", idTest)
        .maybeSingle();

    if (error) {
        console.error("Error al obtener test para administración:", error);

        throw error;
    }

    return data as Test | null;
}

/**
 * Obtener un test mediante su código.
 *
 * Incluye registros inactivos.
 */
export async function obtenerTestAdminPorCodigo(
    codigo: string,
): Promise<Test | null> {
    const codigoNormalizado = normalizarCodigoTest(codigo);

    const { data, error } = await supabase
        .from("test")
        .select("*")
        .eq("codigo", codigoNormalizado)
        .maybeSingle();

    if (error) {
        console.error("Error al obtener test por código:", error);

        throw error;
    }

    return data as Test | null;
}

// ==========================================================
// TESTS - RESUMEN
// ==========================================================

/**
 * Obtener estadísticas generales del módulo.
 */
export async function obtenerResumenCuestionariosAdmin(): Promise<ResumenCuestionariosAdmin> {
    const { data, error } = await supabase.from("test").select(`
            id_test,
            estado
        `);

    if (error) {
        console.error("Error al obtener resumen de cuestionarios:", error);

        throw error;
    }

    const tests = data ?? [];

    const activos = tests.filter((test) => test.estado === true).length;

    return {
        total: tests.length,

        activos,

        inactivos: tests.length - activos,
    };
}

// ==========================================================
// TESTS - CREACIÓN
// ==========================================================

/**
 * Crear un test.
 *
 * Por defecto se crea INACTIVO para evitar publicar
 * cuestionarios incompletos.
 */
export async function crearTestAdmin(datos: CrearTestAdmin): Promise<Test> {
    const codigo = normalizarCodigoTest(datos.codigo);

    const testExistente = await obtenerTestAdminPorCodigo(codigo);

    if (testExistente) {
        throw new Error(`Ya existe un cuestionario con el código "${codigo}".`);
    }

    const { data, error } = await supabase
        .from("test")
        .insert({
            codigo,

            nombre: datos.nombre.trim(),

            descripcion: datos.descripcion,

            instrucciones: datos.instrucciones,

            poblacion_objetivo: datos.poblacion_objetivo,

            tipo_aplicacion: datos.tipo_aplicacion,

            tiene_subescalas: datos.tiene_subescalas,

            version: datos.version,

            estado: datos.estado ?? false,
        })
        .select("*")
        .single();

    if (error) {
        console.error("Error al crear test:", error);

        throw error;
    }

    return data as Test;
}

// ==========================================================
// TESTS - ACTUALIZACIÓN
// ==========================================================

/**
 * Actualizar información general de un test.
 */
export async function actualizarTestAdmin(
    idTest: string,
    cambios: ActualizarTestAdmin,
): Promise<Test> {
    const datosActualizados: Record<string, unknown> = {
        ...cambios,

        fecha_actualizacion: obtenerFechaActual(),
    };

    if (cambios.codigo !== undefined) {
        datosActualizados.codigo = normalizarCodigoTest(cambios.codigo);
    }

    if (cambios.nombre !== undefined) {
        datosActualizados.nombre = cambios.nombre.trim();
    }

    const { data, error } = await supabase
        .from("test")
        .update(datosActualizados)
        .eq("id_test", idTest)
        .select("*")
        .single();

    if (error) {
        console.error("Error al actualizar test:", error);

        throw error;
    }

    return data as Test;
}

/**
 * Activar o desactivar un test.
 *
 * No elimina registros para mantener el historial.
 */
export async function cambiarEstadoTestAdmin(
    idTest: string,
    estado: boolean,
): Promise<Test> {
    return actualizarTestAdmin(idTest, {
        estado,
    });
}

// ==========================================================
// SUBESCALAS - LECTURA
// ==========================================================

/**
 * Obtener todas las subescalas de un test,
 * incluyendo las inactivas.
 */
export async function obtenerSubescalasAdmin(
    idTest: string,
): Promise<SubescalaTest[]> {
    const { data, error } = await supabase
        .from("subescala")
        .select(
            `
            id_subescala,
            id_test,
            codigo,
            nombre,
            descripcion,
            orden,
            incluye_total,
            estado
        `,
        )
        .eq("id_test", idTest)
        .order("orden", {
            ascending: true,
        });

    if (error) {
        console.error("Error al obtener subescalas para administración:", error);

        throw error;
    }

    return (data ?? []) as SubescalaTest[];
}

// ==========================================================
// SUBESCALAS - CREACIÓN
// ==========================================================

export async function crearSubescalaAdmin(
    datos: CrearSubescalaAdmin,
): Promise<SubescalaTest> {
    const { data, error } = await supabase
        .from("subescala")
        .insert({
            id_test: datos.id_test,

            codigo: normalizarCodigoTest(datos.codigo),

            nombre: datos.nombre.trim(),

            descripcion: datos.descripcion,

            orden: datos.orden,

            incluye_total: datos.incluye_total,

            estado: datos.estado ?? true,
        })
        .select(
            `
            id_subescala,
            id_test,
            codigo,
            nombre,
            descripcion,
            orden,
            incluye_total,
            estado
        `,
        )
        .single();

    if (error) {
        console.error("Error al crear subescala:", error);

        throw error;
    }

    return data as SubescalaTest;
}

// ==========================================================
// SUBESCALAS - ACTUALIZACIÓN
// ==========================================================

export async function actualizarSubescalaAdmin(
    idSubescala: string,
    cambios: ActualizarSubescalaAdmin,
): Promise<SubescalaTest> {
    const datosActualizados = {
        ...cambios,
    };

    if (cambios.codigo !== undefined) {
        datosActualizados.codigo = normalizarCodigoTest(cambios.codigo);
    }

    const { data, error } = await supabase
        .from("subescala")
        .update(datosActualizados)
        .eq("id_subescala", idSubescala)
        .select(
            `
            id_subescala,
            id_test,
            codigo,
            nombre,
            descripcion,
            orden,
            incluye_total,
            estado
        `,
        )
        .single();

    if (error) {
        console.error("Error al actualizar subescala:", error);

        throw error;
    }

    return data as SubescalaTest;
}

export async function cambiarEstadoSubescalaAdmin(
    idSubescala: string,
    estado: boolean,
): Promise<SubescalaTest> {
    return actualizarSubescalaAdmin(idSubescala, {
        estado,
    });
}

// ==========================================================
// PREGUNTAS - LECTURA
// ==========================================================

/**
 * Obtener todas las preguntas de un test,
 * incluyendo preguntas inactivas.
 */
export async function obtenerPreguntasAdmin(
    idTest: string,
): Promise<PreguntaAdmin[]> {
    const { data, error } = await supabase
        .from("pregunta_test")
        .select(
            `
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
        `,
        )
        .eq("id_test", idTest)
        .order("orden", {
            ascending: true,
        });

    if (error) {
        console.error("Error al obtener preguntas para administración:", error);

        throw error;
    }

    return (data ?? []).map((pregunta) => ({
        ...pregunta,

        opcion_test: (pregunta.opcion_test ?? []).sort(
            (a: OpcionTest, b: OpcionTest) => a.orden - b.orden,
        ),
    })) as PreguntaAdmin[];
}

// ==========================================================
// PREGUNTAS - CREACIÓN
// ==========================================================

export async function crearPreguntaAdmin(
    datos: CrearPreguntaAdmin,
): Promise<PreguntaTest> {
    const { data, error } = await supabase
        .from("pregunta_test")
        .insert({
            id_test: datos.id_test,

            id_subescala: datos.id_subescala,

            codigo: normalizarCodigoTest(datos.codigo),

            enunciado: datos.enunciado.trim(),

            descripcion_apoyo: datos.descripcion_apoyo,

            tipo_pregunta: datos.tipo_pregunta,

            orden: datos.orden,

            obligatoria: datos.obligatoria,

            puntua: datos.puntua,

            es_observacional: datos.es_observacional,

            permite_comentario: datos.permite_comentario,

            estado: datos.estado ?? true,
        })
        .select("*")
        .single();

    if (error) {
        console.error("Error al crear pregunta:", error);

        throw error;
    }

    return data as PreguntaTest;
}

// ==========================================================
// PREGUNTAS - ACTUALIZACIÓN
// ==========================================================

export async function actualizarPreguntaAdmin(
    idPregunta: string,
    cambios: ActualizarPreguntaAdmin,
): Promise<PreguntaTest> {
    const datosActualizados: Record<string, unknown> = {
        ...cambios,

        fecha_actualizacion: obtenerFechaActual(),
    };

    if (cambios.codigo !== undefined) {
        datosActualizados.codigo = normalizarCodigoTest(cambios.codigo);
    }

    if (cambios.enunciado !== undefined) {
        datosActualizados.enunciado = cambios.enunciado.trim();
    }

    const { data, error } = await supabase
        .from("pregunta_test")
        .update(datosActualizados)
        .eq("id_pregunta", idPregunta)
        .select("*")
        .single();

    if (error) {
        console.error("Error al actualizar pregunta:", error);

        throw error;
    }

    return data as PreguntaTest;
}

export async function cambiarEstadoPreguntaAdmin(
    idPregunta: string,
    estado: boolean,
): Promise<PreguntaTest> {
    return actualizarPreguntaAdmin(idPregunta, {
        estado,
    });
}

// ==========================================================
// OPCIONES - LECTURA
// ==========================================================

export async function obtenerOpcionesAdmin(
    idPregunta: string,
): Promise<OpcionTest[]> {
    const { data, error } = await supabase
        .from("opcion_test")
        .select(
            `
            id_opcion,
            id_pregunta,
            codigo,
            etiqueta,
            valor_puntaje,
            orden,
            estado
        `,
        )
        .eq("id_pregunta", idPregunta)
        .order("orden", {
            ascending: true,
        });

    if (error) {
        console.error("Error al obtener opciones:", error);

        throw error;
    }

    return (data ?? []) as OpcionTest[];
}

// ==========================================================
// OPCIONES - CREACIÓN
// ==========================================================

export async function crearOpcionAdmin(
    datos: CrearOpcionAdmin,
): Promise<OpcionTest> {
    const { data, error } = await supabase
        .from("opcion_test")
        .insert({
            id_pregunta: datos.id_pregunta,

            codigo: normalizarCodigoTest(datos.codigo),

            etiqueta: datos.etiqueta.trim(),

            valor_puntaje: datos.valor_puntaje,

            orden: datos.orden,

            estado: datos.estado ?? true,
        })
        .select(
            `
            id_opcion,
            id_pregunta,
            codigo,
            etiqueta,
            valor_puntaje,
            orden,
            estado
        `,
        )
        .single();

    if (error) {
        console.error("Error al crear opción:", error);

        throw error;
    }

    return data as OpcionTest;
}

// ==========================================================
// OPCIONES - ACTUALIZACIÓN
// ==========================================================

export async function actualizarOpcionAdmin(
    idOpcion: string,
    cambios: ActualizarOpcionAdmin,
): Promise<OpcionTest> {
    const datosActualizados = {
        ...cambios,
    };

    if (cambios.codigo !== undefined) {
        datosActualizados.codigo = normalizarCodigoTest(cambios.codigo);
    }

    const { data, error } = await supabase
        .from("opcion_test")
        .update(datosActualizados)
        .eq("id_opcion", idOpcion)
        .select(
            `
            id_opcion,
            id_pregunta,
            codigo,
            etiqueta,
            valor_puntaje,
            orden,
            estado
        `,
        )
        .single();

    if (error) {
        console.error("Error al actualizar opción:", error);

        throw error;
    }

    return data as OpcionTest;
}

export async function cambiarEstadoOpcionAdmin(
    idOpcion: string,
    estado: boolean,
): Promise<OpcionTest> {
    return actualizarOpcionAdmin(idOpcion, {
        estado,
    });
}

// ==========================================================
// BAREMOS - LECTURA
// ==========================================================

/**
 * Obtener todos los baremos del test,
 * incluyendo los inactivos.
 */
export async function obtenerBaremosAdmin(
    idTest: string,
): Promise<BaremoTest[]> {
    const { data, error } = await supabase
        .from("baremo_test")
        .select(
            `
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
        `,
        )
        .eq("id_test", idTest)
        .order("nombre", {
            ascending: true,
        });

    if (error) {
        console.error("Error al obtener baremos para administración:", error);

        throw error;
    }

    return (data ?? []) as BaremoTest[];
}

// ==========================================================
// BAREMOS - CREACIÓN
// ==========================================================

export async function crearBaremoAdmin(
    datos: CrearBaremoAdmin,
): Promise<BaremoTest> {
    const { data, error } = await supabase
        .from("baremo_test")
        .insert({
            id_test: datos.id_test,

            codigo: normalizarCodigoTest(datos.codigo),

            nombre: datos.nombre.trim(),

            descripcion: datos.descripcion,

            poblacion: datos.poblacion,

            sexo_aplicable: datos.sexo_aplicable,

            edad_minima: datos.edad_minima,

            edad_maxima: datos.edad_maxima,

            tipo_valor: datos.tipo_valor,

            version: datos.version,

            fuente: datos.fuente,

            estado: datos.estado ?? true,
        })
        .select(
            `
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
        `,
        )
        .single();

    if (error) {
        console.error("Error al crear baremo:", error);

        throw error;
    }

    return data as BaremoTest;
}

// ==========================================================
// BAREMOS - ACTUALIZACIÓN
// ==========================================================

export async function actualizarBaremoAdmin(
    idBaremo: string,
    cambios: ActualizarBaremoAdmin,
): Promise<BaremoTest> {
    const datosActualizados = {
        ...cambios,
    };

    if (cambios.codigo !== undefined) {
        datosActualizados.codigo = normalizarCodigoTest(cambios.codigo);
    }

    const { data, error } = await supabase
        .from("baremo_test")
        .update(datosActualizados)
        .eq("id_baremo", idBaremo)
        .select(
            `
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
        `,
        )
        .single();

    if (error) {
        console.error("Error al actualizar baremo:", error);

        throw error;
    }

    return data as BaremoTest;
}

export async function cambiarEstadoBaremoAdmin(
    idBaremo: string,
    estado: boolean,
): Promise<BaremoTest> {
    return actualizarBaremoAdmin(idBaremo, {
        estado,
    });
}

// ==========================================================
// RANGOS DE BAREMO - LECTURA
// ==========================================================

export async function obtenerRangosBaremoAdmin(
    idBaremo: string,
): Promise<RangoBaremo[]> {
    const { data, error } = await supabase
        .from("rango_baremo")
        .select(
            `
            id_rango,
            id_baremo,
            id_subescala,
            nivel,
            valor_minimo,
            valor_maximo,
            interpretacion,
            orden,
            estado
        `,
        )
        .eq("id_baremo", idBaremo)
        .order("orden", {
            ascending: true,
        });

    if (error) {
        console.error("Error al obtener rangos del baremo:", error);

        throw error;
    }

    return (data ?? []) as RangoBaremo[];
}

// ==========================================================
// RANGOS DE BAREMO - CREACIÓN
// ==========================================================

export async function crearRangoBaremoAdmin(
    datos: CrearRangoBaremoAdmin,
): Promise<RangoBaremo> {
    const { data, error } = await supabase
        .from("rango_baremo")
        .insert({
            id_baremo: datos.id_baremo,

            id_subescala: datos.id_subescala,

            nivel: datos.nivel.trim(),

            valor_minimo: datos.valor_minimo,

            valor_maximo: datos.valor_maximo,

            interpretacion: datos.interpretacion,

            orden: datos.orden,

            estado: datos.estado ?? true,
        })
        .select(
            `
            id_rango,
            id_baremo,
            id_subescala,
            nivel,
            valor_minimo,
            valor_maximo,
            interpretacion,
            orden,
            estado
        `,
        )
        .single();

    if (error) {
        console.error("Error al crear rango de baremo:", error);

        throw error;
    }

    return data as RangoBaremo;
}

// ==========================================================
// RANGOS DE BAREMO - ACTUALIZACIÓN
// ==========================================================

export async function actualizarRangoBaremoAdmin(
    idRango: string,
    cambios: ActualizarRangoBaremoAdmin,
): Promise<RangoBaremo> {
    const { data, error } = await supabase
        .from("rango_baremo")
        .update(cambios)
        .eq("id_rango", idRango)
        .select(
            `
            id_rango,
            id_baremo,
            id_subescala,
            nivel,
            valor_minimo,
            valor_maximo,
            interpretacion,
            orden,
            estado
        `,
        )
        .single();

    if (error) {
        console.error("Error al actualizar rango de baremo:", error);

        throw error;
    }

    return data as RangoBaremo;
}

export async function cambiarEstadoRangoBaremoAdmin(
    idRango: string,
    estado: boolean,
): Promise<RangoBaremo> {
    return actualizarRangoBaremoAdmin(idRango, {
        estado,
    });
}

// ==========================================================
// ESTRUCTURA COMPLETA DE UN TEST
// ==========================================================

/**
 * Obtener toda la estructura necesaria para editar
 * un cuestionario.
 *
 * Devuelve:
 *
 * test
 * ├── subescalas
 * ├── preguntas
 * │   └── opciones
 * └── baremos
 */
export async function obtenerTestCompletoAdmin(
    idTest: string,
): Promise<TestCompletoAdmin | null> {
    const test = await obtenerTestAdminPorId(idTest);

    if (!test) {
        return null;
    }

    const [subescalas, preguntas, baremos] = await Promise.all([
        obtenerSubescalasAdmin(idTest),

        obtenerPreguntasAdmin(idTest),

        obtenerBaremosAdmin(idTest),
    ]);

    return {
        ...test,

        subescala: subescalas,

        pregunta_test: preguntas,

        baremo_test: baremos,
    };
}

// ==========================================================
// VALIDACIÓN PARA PUBLICAR
// ==========================================================

export interface ValidacionPublicacionTest {
    valido: boolean;

    errores: string[];
}

/**
 * Validaciones mínimas antes de permitir activar un test.
 */
export async function validarPublicacionTest(
    idTest: string,
): Promise<ValidacionPublicacionTest> {
    const test = await obtenerTestCompletoAdmin(idTest);

    if (!test) {
        return {
            valido: false,

            errores: ["El cuestionario no existe."],
        };
    }

    const errores: string[] = [];

    if (!test.codigo?.trim()) {
        errores.push("El cuestionario debe tener un código.");
    }

    if (!test.nombre?.trim()) {
        errores.push("El cuestionario debe tener un nombre.");
    }

    if (!test.pregunta_test || test.pregunta_test.length === 0) {
        errores.push("El cuestionario debe contener al menos una pregunta.");
    }

    if (
        test.tiene_subescalas &&
        (!test.subescala || test.subescala.length === 0)
    ) {
        errores.push(
            "El cuestionario indica que utiliza subescalas, pero no tiene ninguna registrada.",
        );
    }

    for (const pregunta of test.pregunta_test ?? []) {
        if (!pregunta.enunciado?.trim()) {
            errores.push(`La pregunta ${pregunta.orden} no tiene enunciado.`);
        }

        /*
         * Las preguntas que utilizan opciones deben
         * tener al menos una opción.
         *
         * Esta validación puede ajustarse cuando confirmemos
         * todos los valores posibles de tipo_pregunta.
         */
        if (
            pregunta.tipo_pregunta !== "texto" &&
            (!pregunta.opcion_test || pregunta.opcion_test.length === 0)
        ) {
            errores.push(
                `La pregunta ${pregunta.orden} no tiene opciones configuradas.`,
            );
        }
    }

    return {
        valido: errores.length === 0,

        errores,
    };
}

// ==========================================================
// PUBLICACIÓN
// ==========================================================

/**
 * Publicar un test después de validar su configuración.
 */
export async function publicarTestAdmin(idTest: string): Promise<Test> {
    const validacion = await validarPublicacionTest(idTest);

    if (!validacion.valido) {
        throw new Error(validacion.errores.join("\n"));
    }

    return cambiarEstadoTestAdmin(idTest, true);
}

/**
 * Despublicar un test.
 */
export async function despublicarTestAdmin(idTest: string): Promise<Test> {
    return cambiarEstadoTestAdmin(idTest, false);
}
