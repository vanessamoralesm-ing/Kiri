// ==========================================================
// TEST
// ==========================================================

export interface Test {
    id_test: string;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    instrucciones: string | null;
    poblacion_objetivo: string | null;

    tipo_aplicacion:
        | "autoadministrado"
        | "profesional";

    tiene_subescalas: boolean;
    version: string | null;
    estado: boolean;

    fecha_creacion: string;
    fecha_actualizacion: string;
}


// ==========================================================
// SUBESCALAS
// ==========================================================

export interface SubescalaTest {
    id_subescala: string;
    id_test: string;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    orden: number;
    incluye_total: boolean;
    estado: boolean;
}


// ==========================================================
// OPCIONES
// ==========================================================

export interface OpcionTest {
    id_opcion: string;
    id_pregunta: string;
    codigo: string;
    etiqueta: string;

    valor_puntaje:
        number | string | null;

    orden: number;
    estado: boolean;
}


// ==========================================================
// PREGUNTAS
// ==========================================================

export type TipoPregunta =
    | "opcion_unica"
    | "opcion_multiple"
    | "texto"
    | "numero"
    | "escala";


export interface PreguntaTest {
    id_pregunta: string;
    id_test: string;
    id_subescala: string | null;
    codigo: string;
    enunciado: string;
    descripcion_apoyo: string | null;
    tipo_pregunta: TipoPregunta;
    orden: number;
    obligatoria: boolean;
    puntua: boolean;
    es_observacional: boolean;
    permite_comentario: boolean;
    estado: boolean;
    fecha_creacion: string;
    fecha_actualizacion: string;
}


// ==========================================================
// EJECUCIÓN
// ==========================================================

export type EstadoEjecucionTest =
    | "en_progreso"
    | "completado"
    | "abandonado";


export interface EjecucionTest {
    id_ejecucion: string;
    id_usuario: string;
    id_test: string;
    estado: EstadoEjecucionTest;
    fecha_inicio: string;
    fecha_fin: string | null;
}


// ==========================================================
// BAREMOS
// ==========================================================

export type TipoValorBaremo =
    | "puntaje_directo"
    | "puntaje_total"
    | "percentil"
    | "puntaje_t"
    | "eneatipo";


export interface BaremoTest {
    id_baremo: string;
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
    estado: boolean;
}


export interface RangoBaremo {
    id_rango: string;
    id_baremo: string;
    id_subescala: string | null;
    nivel: string;
    valor_minimo: number | string | null;
    valor_maximo: number | string | null;
    interpretacion: string | null;
    orden: number;
}


// ==========================================================
// RESULTADO DEL TEST
// ==========================================================

export type TipoFinalizacionTest =
    | "completa"
    | "regla_instrumento";


export interface ResultadoTest {
    id_resultado: string;
    id_ejecucion: string;

    puntaje_directo:
        number | string | null;

    puntaje_total:
        number | string | null;

    nivel_cualitativo:
        string | null;

    interpretacion_texto:
        string | null;

    es_valido: boolean;

    observaciones:
        string | null;

    fecha_generacion: string;

    id_baremo:
        string | null;

    id_rango_baremo:
        string | null;

    tipo_finalizacion:
        TipoFinalizacionTest;
}


// ==========================================================
// RESULTADOS DE SUBESCALAS
// ==========================================================

export interface SubescalaRelacion {
    codigo: string;
    nombre: string;
    descripcion: string | null;
    orden: number;
}


export interface ResultadoSubescala {
    id_resultado_subescala: string;
    id_resultado: string;
    id_subescala: string;

    puntaje_directo:
        number | string | null;

    puntaje_transformado:
        number | string | null;

    nivel_cualitativo:
        string | null;

    interpretacion_texto:
        string | null;

    subescala:
        SubescalaRelacion | null;
}