import { supabase } from "@/lib/supabase";

import type {
    BaremoTest,
    OpcionTest,
    PreguntaTest,
    RangoBaremo,
    SubescalaTest,
    Test,
    TipoValorBaremo,
} from "@/types/cuestionarios";

// ==========================================================
// TIPOS ADMINISTRATIVOS
// ==========================================================

export interface TestAdmin extends Test {
    pregunta_test?: {
        count: number;
    }[];
}

export interface ResumenCuestionariosAdmin {
    total: number;
    activos: number;
    inactivos: number;
}

export interface CrearTestAdmin {
    codigo: string;
    nombre: string;
    descripcion: string | null;
    instrucciones: string | null;
    poblacion_objetivo: string | null;
    tipo_aplicacion: Test["tipo_aplicacion"];
    tiene_subescalas: boolean;
    version: string | null;
    estado?: boolean;
}

export type ActualizarTestAdmin = Partial<CrearTestAdmin>;

export interface CrearSubescalaAdmin {
    id_test: string;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    orden: number;
    incluye_total: boolean;
    estado?: boolean;
}

export type ActualizarSubescalaAdmin = Partial<
    Omit<CrearSubescalaAdmin, "id_test">
>;

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

export type ActualizarPreguntaAdmin = Partial<
    Omit<CrearPreguntaAdmin, "id_test">
>;

export interface CrearOpcionAdmin {
    id_pregunta: string;
    codigo: string;
    etiqueta: string;
    valor_puntaje: number | null;
    orden: number;
    estado?: boolean;
}

export type ActualizarOpcionAdmin = Partial<
    Omit<CrearOpcionAdmin, "id_pregunta">
>;

export interface CrearBaremoAdmin {
    id_test: string;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    poblacion: string | null;
    sexo_aplicable: string | null;
    edad_minima: number | null;
    edad_maxima: number | null;
    tipo_valor: TipoValorBaremo;
    version: string | null;
    fuente: string | null;
    estado?: boolean;
}

export type ActualizarBaremoAdmin = Partial<Omit<CrearBaremoAdmin, "id_test">>;

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

export type ActualizarRangoBaremoAdmin = Partial<
    Omit<CrearRangoBaremoAdmin, "id_baremo">
>;

export interface OpcionAdmin extends OpcionTest { }

export interface PreguntaAdmin extends PreguntaTest {
    opcion_test?: OpcionAdmin[];
}

export interface RangoBaremoAdmin extends RangoBaremo {
    estado: boolean;
}

export interface TestCompletoAdmin extends Test {
    subescala?: SubescalaTest[];
    pregunta_test?: PreguntaAdmin[];
    baremo_test?: BaremoTest[];
}

export interface ValidacionPublicacionTest {
    valido: boolean;
    errores: string[];
}

// ==========================================================
// UTILIDADES
// ==========================================================

function ahora(): string {
    return new Date().toISOString();
}

function textoOpcional(valor: string | null | undefined): string | null {
    return valor?.trim() || null;
}

export function normalizarCodigoTest(codigo: string): string {
    return codigo.trim().toUpperCase().replace(/\s+/g, "-");
}

function exigirTexto(valor: string, campo: string): string {
    const limpio = valor.trim();

    if (!limpio) {
        throw new Error(`El campo ${campo} es obligatorio.`);
    }

    return limpio;
}

function exigirOrden(valor: number): number {
    if (!Number.isInteger(valor) || valor < 1) {
        throw new Error("El orden debe ser un entero mayor que cero.");
    }

    return valor;
}

function comprobarEdades(minima: number | null, maxima: number | null): void {
    for (const edad of [minima, maxima]) {
        if (edad !== null && (!Number.isInteger(edad) || edad < 0)) {
            throw new Error("Las edades deben ser enteros no negativos.");
        }
    }

    if (minima !== null && maxima !== null && minima > maxima) {
        throw new Error("La edad mínima no puede superar la máxima.");
    }
}

function comprobarRango(minimo: number, maximo: number): void {
    if (!Number.isFinite(minimo) || !Number.isFinite(maximo) || minimo > maximo) {
        throw new Error(
            "Los límites del rango deben ser números " +
            "y el mínimo no puede superar al máximo.",
        );
    }
}

// ==========================================================
// TESTS - LECTURA
// ==========================================================

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

    if (error) throw error;

    return (data ?? []) as TestAdmin[];
}

export async function obtenerTestAdminPorId(
    idTest: string,
): Promise<Test | null> {
    const { data, error } = await supabase
        .from("test")
        .select("*")
        .eq("id_test", idTest)
        .maybeSingle();

    if (error) throw error;

    return data as Test | null;
}

export async function obtenerTestAdminPorCodigo(
    codigo: string,
): Promise<Test | null> {
    const { data, error } = await supabase
        .from("test")
        .select("*")
        .eq("codigo", normalizarCodigoTest(codigo))
        .maybeSingle();

    if (error) throw error;

    return data as Test | null;
}

export async function obtenerResumenCuestionariosAdmin(): Promise<ResumenCuestionariosAdmin> {
    const { data, error } = await supabase.from("test").select("id_test, estado");

    if (error) throw error;

    const lista = data ?? [];

    const activos = lista.filter((item) => item.estado === true).length;

    return {
        total: lista.length,
        activos,
        inactivos: lista.length - activos,
    };
}

// ==========================================================
// TESTS - CREACIÓN
// ==========================================================

export async function crearTestAdmin(datos: CrearTestAdmin): Promise<Test> {
    const codigo = normalizarCodigoTest(exigirTexto(datos.codigo, "código"));

    const nombre = exigirTexto(datos.nombre, "nombre");

    if (!["autoadministrado", "profesional"].includes(datos.tipo_aplicacion)) {
        throw new Error("Tipo de aplicación no válido.");
    }

    const existente = await obtenerTestAdminPorCodigo(codigo);

    if (existente) {
        throw new Error(`Ya existe un cuestionario con el código "${codigo}".`);
    }

    // Se crea inactivo hasta que
    // supere la validación de publicación.

    const { data, error } = await supabase
        .from("test")
        .insert({
            codigo,
            nombre,

            descripcion: textoOpcional(datos.descripcion),

            instrucciones: textoOpcional(datos.instrucciones),

            poblacion_objetivo: textoOpcional(datos.poblacion_objetivo),

            tipo_aplicacion: datos.tipo_aplicacion,

            tiene_subescalas: datos.tiene_subescalas,

            version: textoOpcional(datos.version),

            estado: false,
        })
        .select("*")
        .single();

    if (error) throw error;

    return data as Test;
}

// ==========================================================
// TESTS - ACTUALIZACIÓN
// ==========================================================

export async function actualizarTestAdmin(
    idTest: string,
    cambios: ActualizarTestAdmin,
): Promise<Test> {
    // Una activación siempre debe pasar
    // por la validación de publicación.

    if (cambios.estado === true) {
        const { estado: _estado, ...resto } = cambios;

        if (Object.keys(resto).length > 0) {
            await actualizarTestAdmin(idTest, resto);
        }

        return publicarTestAdmin(idTest);
    }

    const patch: Record<string, unknown> = {
        ...cambios,
        fecha_actualizacion: ahora(),
    };

    if (cambios.codigo !== undefined) {
        patch.codigo = normalizarCodigoTest(exigirTexto(cambios.codigo, "código"));
    }

    if (cambios.nombre !== undefined) {
        patch.nombre = exigirTexto(cambios.nombre, "nombre");
    }

    for (const campo of [
        "descripcion",
        "instrucciones",
        "poblacion_objetivo",
        "version",
    ] as const) {
        if (cambios[campo] !== undefined) {
            patch[campo] = textoOpcional(cambios[campo]);
        }
    }

    const { data, error } = await supabase
        .from("test")
        .update(patch)
        .eq("id_test", idTest)
        .select("*")
        .single();

    if (error) throw error;

    return data as Test;
}

// ==========================================================
// TESTS - CAMBIO DE ESTADO
// ==========================================================

export async function cambiarEstadoTestAdmin(
    idTest: string,
    estado: boolean,
): Promise<Test> {
    try {
        console.log("Cambiando estado del cuestionario:", {
            idTest,
            nuevoEstado: estado,
        });

        const resultado = estado
            ? await publicarTestAdmin(idTest)
            : await actualizarTestAdmin(idTest, {
                estado: false,
            });

        console.log("Estado actualizado:", {
            idTest: resultado.id_test,
            estado: resultado.estado,
        });

        return resultado;
    } catch (error) {
        console.error("Error al cambiar estado:", error);

        throw error;
    }
}

// ==========================================================
// SUBESCALAS - LECTURA
// ==========================================================

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

    if (error) throw error;

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
            ...datos,

            codigo: normalizarCodigoTest(exigirTexto(datos.codigo, "código")),

            nombre: exigirTexto(datos.nombre, "nombre"),

            descripcion: textoOpcional(datos.descripcion),

            orden: exigirOrden(datos.orden),

            estado: datos.estado ?? true,
        })
        .select("*")
        .single();

    if (error) throw error;

    return data as SubescalaTest;
}

// ==========================================================
// SUBESCALAS - ACTUALIZACIÓN
// ==========================================================

export async function actualizarSubescalaAdmin(
    idSubescala: string,
    cambios: ActualizarSubescalaAdmin,
): Promise<SubescalaTest> {
    const patch: Record<string, unknown> = {
        ...cambios,
    };

    if (cambios.codigo !== undefined) {
        patch.codigo = normalizarCodigoTest(exigirTexto(cambios.codigo, "código"));
    }

    if (cambios.nombre !== undefined) {
        patch.nombre = exigirTexto(cambios.nombre, "nombre");
    }

    if (cambios.descripcion !== undefined) {
        patch.descripcion = textoOpcional(cambios.descripcion);
    }

    if (cambios.orden !== undefined) {
        patch.orden = exigirOrden(cambios.orden);
    }

    const { data, error } = await supabase
        .from("subescala")
        .update(patch)
        .eq("id_subescala", idSubescala)
        .select("*")
        .single();

    if (error) throw error;

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

    if (error) throw error;

    return (data ?? []).map((pregunta) => ({
        ...pregunta,

        opcion_test: [...(pregunta.opcion_test ?? [])].sort(
            (a, b) => a.orden - b.orden,
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
            ...datos,

            codigo: normalizarCodigoTest(exigirTexto(datos.codigo, "código")),

            enunciado: exigirTexto(datos.enunciado, "enunciado"),

            descripcion_apoyo: textoOpcional(datos.descripcion_apoyo),

            orden: exigirOrden(datos.orden),

            estado: datos.estado ?? true,
        })
        .select("*")
        .single();

    if (error) throw error;

    return data as PreguntaTest;
}

// ==========================================================
// PREGUNTAS - ACTUALIZACIÓN
// ==========================================================

export async function actualizarPreguntaAdmin(
    idPregunta: string,
    cambios: ActualizarPreguntaAdmin,
): Promise<PreguntaTest> {
    const patch: Record<string, unknown> = {
        ...cambios,

        fecha_actualizacion: ahora(),
    };

    if (cambios.codigo !== undefined) {
        patch.codigo = normalizarCodigoTest(exigirTexto(cambios.codigo, "código"));
    }

    if (cambios.enunciado !== undefined) {
        patch.enunciado = exigirTexto(cambios.enunciado, "enunciado");
    }

    if (cambios.descripcion_apoyo !== undefined) {
        patch.descripcion_apoyo = textoOpcional(cambios.descripcion_apoyo);
    }

    if (cambios.orden !== undefined) {
        patch.orden = exigirOrden(cambios.orden);
    }

    const { data, error } = await supabase
        .from("pregunta_test")
        .update(patch)
        .eq("id_pregunta", idPregunta)
        .select("*")
        .single();

    if (error) throw error;

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

    if (error) throw error;

    return (data ?? []) as OpcionTest[];
}

// ==========================================================
// OPCIONES - CREACIÓN
// ==========================================================

export async function crearOpcionAdmin(
    datos: CrearOpcionAdmin,
): Promise<OpcionTest> {
    if (datos.valor_puntaje !== null && !Number.isFinite(datos.valor_puntaje)) {
        throw new Error("El puntaje debe ser un número válido.");
    }

    const { data, error } = await supabase
        .from("opcion_test")
        .insert({
            ...datos,

            codigo: normalizarCodigoTest(exigirTexto(datos.codigo, "código")),

            etiqueta: exigirTexto(datos.etiqueta, "etiqueta"),

            orden: exigirOrden(datos.orden),

            estado: datos.estado ?? true,
        })
        .select("*")
        .single();

    if (error) throw error;

    return data as OpcionTest;
}

// ==========================================================
// OPCIONES - ACTUALIZACIÓN
// ==========================================================

export async function actualizarOpcionAdmin(
    idOpcion: string,
    cambios: ActualizarOpcionAdmin,
): Promise<OpcionTest> {
    const patch: Record<string, unknown> = {
        ...cambios,
    };

    if (cambios.codigo !== undefined) {
        patch.codigo = normalizarCodigoTest(exigirTexto(cambios.codigo, "código"));
    }

    if (cambios.etiqueta !== undefined) {
        patch.etiqueta = exigirTexto(cambios.etiqueta, "etiqueta");
    }

    if (cambios.orden !== undefined) {
        patch.orden = exigirOrden(cambios.orden);
    }

    if (
        cambios.valor_puntaje != null &&
        !Number.isFinite(cambios.valor_puntaje)
    ) {
        throw new Error("Puntaje no válido.");
    }

    const { data, error } = await supabase
        .from("opcion_test")
        .update(patch)
        .eq("id_opcion", idOpcion)
        .select("*")
        .single();

    if (error) throw error;

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

    if (error) throw error;

    return (data ?? []) as BaremoTest[];
}

// ==========================================================
// BAREMOS - CREACIÓN
// ==========================================================

export async function crearBaremoAdmin(
    datos: CrearBaremoAdmin,
): Promise<BaremoTest> {
    comprobarEdades(datos.edad_minima, datos.edad_maxima);

    const { data, error } = await supabase
        .from("baremo_test")
        .insert({
            ...datos,

            codigo: normalizarCodigoTest(exigirTexto(datos.codigo, "código")),

            nombre: exigirTexto(datos.nombre, "nombre"),

            descripcion: textoOpcional(datos.descripcion),

            poblacion: textoOpcional(datos.poblacion),

            sexo_aplicable: textoOpcional(datos.sexo_aplicable),

            version: textoOpcional(datos.version),

            fuente: textoOpcional(datos.fuente),

            estado: datos.estado ?? true,
        })
        .select("*")
        .single();

    if (error) throw error;

    return data as BaremoTest;
}

// ==========================================================
// BAREMOS - ACTUALIZACIÓN
// ==========================================================

export async function actualizarBaremoAdmin(
    idBaremo: string,
    cambios: ActualizarBaremoAdmin,
): Promise<BaremoTest> {
    const patch: Record<string, unknown> = {
        ...cambios,
    };

    if (cambios.codigo !== undefined) {
        patch.codigo = normalizarCodigoTest(exigirTexto(cambios.codigo, "código"));
    }

    if (cambios.nombre !== undefined) {
        patch.nombre = exigirTexto(cambios.nombre, "nombre");
    }

    for (const campo of [
        "descripcion",
        "poblacion",
        "sexo_aplicable",
        "version",
        "fuente",
    ] as const) {
        if (cambios[campo] !== undefined) {
            patch[campo] = textoOpcional(cambios[campo]);
        }
    }

    // Recuperar las edades actuales para validar
    // correctamente las actualizaciones parciales.

    const { data: previo, error: errorPrevio } = await supabase
        .from("baremo_test")
        .select("edad_minima, edad_maxima")
        .eq("id_baremo", idBaremo)
        .single();

    if (errorPrevio) {
        throw errorPrevio;
    }

    comprobarEdades(
        cambios.edad_minima === undefined
            ? previo.edad_minima
            : cambios.edad_minima,

        cambios.edad_maxima === undefined
            ? previo.edad_maxima
            : cambios.edad_maxima,
    );

    const { data, error } = await supabase
        .from("baremo_test")
        .update(patch)
        .eq("id_baremo", idBaremo)
        .select("*")
        .single();

    if (error) throw error;

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
// RANGOS - LECTURA
// ==========================================================

export async function obtenerRangosBaremoAdmin(
    idBaremo: string,
): Promise<RangoBaremoAdmin[]> {
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

    if (error) throw error;

    return (data ?? []) as RangoBaremoAdmin[];
}

// ==========================================================
// RANGOS - CREACIÓN
// ==========================================================

export async function crearRangoBaremoAdmin(
    datos: CrearRangoBaremoAdmin,
): Promise<RangoBaremoAdmin> {
    comprobarRango(datos.valor_minimo, datos.valor_maximo);

    const { data, error } = await supabase
        .from("rango_baremo")
        .insert({
            ...datos,

            nivel: exigirTexto(datos.nivel, "nivel"),

            interpretacion: textoOpcional(datos.interpretacion),

            orden: exigirOrden(datos.orden),

            estado: datos.estado ?? true,
        })
        .select("*")
        .single();

    if (error) throw error;

    return data as RangoBaremoAdmin;
}

// ==========================================================
// RANGOS - ACTUALIZACIÓN
// ==========================================================

export async function actualizarRangoBaremoAdmin(
    idRango: string,
    cambios: ActualizarRangoBaremoAdmin,
): Promise<RangoBaremoAdmin> {
    const patch: Record<string, unknown> = {
        ...cambios,
    };

    if (cambios.nivel !== undefined) {
        patch.nivel = exigirTexto(cambios.nivel, "nivel");
    }

    if (cambios.orden !== undefined) {
        patch.orden = exigirOrden(cambios.orden);
    }

    if (cambios.interpretacion !== undefined) {
        patch.interpretacion = textoOpcional(cambios.interpretacion);
    }

    const { data: actual, error: errorActual } = await supabase
        .from("rango_baremo")
        .select(
            `
      valor_minimo,
      valor_maximo
    `,
        )
        .eq("id_rango", idRango)
        .single();

    if (errorActual) {
        throw errorActual;
    }

    comprobarRango(
        cambios.valor_minimo ?? Number(actual.valor_minimo),

        cambios.valor_maximo ?? Number(actual.valor_maximo),
    );

    const { data, error } = await supabase
        .from("rango_baremo")
        .update(patch)
        .eq("id_rango", idRango)
        .select("*")
        .single();

    if (error) throw error;

    return data as RangoBaremoAdmin;
}

export async function cambiarEstadoRangoBaremoAdmin(
    idRango: string,
    estado: boolean,
): Promise<RangoBaremoAdmin> {
    return actualizarRangoBaremoAdmin(idRango, {
        estado,
    });
}

// ==========================================================
// ESTRUCTURA COMPLETA
// ==========================================================

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
// VALIDACIÓN DE PUBLICACIÓN
// ==========================================================

const tiposConOpciones = ["opcion_unica", "opcion_multiple", "escala"] as const;

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

    const preguntas = (test.pregunta_test ?? []).filter(
        (pregunta) => pregunta.estado,
    );

    const subescalas = (test.subescala ?? []).filter(
        (subescala) => subescala.estado,
    );

    if (preguntas.length === 0) {
        errores.push("Debes registrar al menos una pregunta activa.");
    }

    if (test.tiene_subescalas && subescalas.length === 0) {
        errores.push(
            "El cuestionario utiliza subescalas, " + "pero no tiene ninguna activa.",
        );
    }

    // ========================================================
    // PREGUNTAS
    // ========================================================

    for (const pregunta of preguntas) {
        if (!pregunta.codigo?.trim() || !pregunta.enunciado?.trim()) {
            errores.push(
                `La pregunta ${pregunta.orden} necesita código y enunciado.`,
            );
        }

        if (
            test.tiene_subescalas &&
            !subescalas.some(
                (subescala) => subescala.id_subescala === pregunta.id_subescala,
            )
        ) {
            errores.push(
                `La pregunta ${pregunta.orden} debe pertenecer a una subescala activa.`,
            );
        }

        const usaOpciones = tiposConOpciones.some(
            (tipo) => tipo === pregunta.tipo_pregunta,
        );

        if (usaOpciones) {
            const opcionesActivas = (pregunta.opcion_test ?? []).filter(
                (opcion) => opcion.estado,
            );

            if (opcionesActivas.length < 2) {
                errores.push(
                    `La pregunta ${pregunta.orden} necesita al menos dos opciones activas.`,
                );
            }

            if (
                pregunta.puntua &&
                opcionesActivas.some(
                    (opcion) =>
                        opcion.valor_puntaje === null ||
                        opcion.valor_puntaje === "" ||
                        !Number.isFinite(Number(opcion.valor_puntaje)),
                )
            ) {
                errores.push(
                    `Las opciones activas de la pregunta ${pregunta.orden} necesitan puntajes numéricos.`,
                );
            }
        }
    }

    // ========================================================
    // BAREMOS
    // ========================================================

    // Son opcionales. Si existe uno activo,
    // debe tener al menos un rango activo.

    const baremosActivos = (test.baremo_test ?? []).filter(
        (baremo) => baremo.estado,
    );

    for (const baremo of baremosActivos) {
        const rangos = (await obtenerRangosBaremoAdmin(baremo.id_baremo)).filter(
            (rango) => rango.estado,
        );

        if (rangos.length === 0) {
            errores.push(
                `El baremo "${baremo.nombre}" necesita al menos un rango activo.`,
            );
        }

        for (const rango of rangos) {
            const minimo = Number(rango.valor_minimo);

            const maximo = Number(rango.valor_maximo);

            if (
                !Number.isFinite(minimo) ||
                !Number.isFinite(maximo) ||
                minimo > maximo
            ) {
                errores.push(
                    `El rango "${rango.nivel}" del baremo "${baremo.nombre}" tiene límites inválidos.`,
                );
            }

            if (
                rango.id_subescala &&
                !subescalas.some(
                    (subescala) => subescala.id_subescala === rango.id_subescala,
                )
            ) {
                errores.push(
                    `El rango "${rango.nivel}" se asocia a una subescala inexistente o inactiva.`,
                );
            }
        }
    }

    // Las reglas de solapamiento y cobertura
    // dependen del manual de cada instrumento.

    return {
        valido: errores.length === 0,

        errores,
    };
}

// ==========================================================
// PUBLICAR
// ==========================================================

export async function publicarTestAdmin(idTest: string): Promise<Test> {
    const validacion = await validarPublicacionTest(idTest);

    if (!validacion.valido) {
        throw new Error(validacion.errores.join("\n"));
    }

    // Actualización directa para evitar recursión
    // con cambiarEstadoTestAdmin().

    const { data, error } = await supabase
        .from("test")
        .update({
            estado: true,

            fecha_actualizacion: ahora(),
        })
        .eq("id_test", idTest)
        .select("*")
        .single();

    if (error) throw error;

    return data as Test;
}

// ==========================================================
// DESPUBLICAR
// ==========================================================

export async function despublicarTestAdmin(idTest: string): Promise<Test> {
    return cambiarEstadoTestAdmin(idTest, false);
}
