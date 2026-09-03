import type { BaremoTest, RangoBaremo, SubescalaTest, Test } from "@/types/cuestionarios";

import type { PreguntaTestConOpciones, RespuestaSeleccionada } from "@/services/cuestionarios/cuestionarios.service";

// ==========================================================
// EDAD
// ==========================================================

export function calcularEdad(
    fechaNacimiento: string | null
): number | null {

    if (!fechaNacimiento) {
        return null;
    }

    const nacimiento =
        new Date(`${fechaNacimiento}T00:00:00`);

    if (Number.isNaN(nacimiento.getTime())) {
        return null;
    }

    const hoy = new Date();

    let edad =
        hoy.getFullYear() -
        nacimiento.getFullYear();

    const diferenciaMes =
        hoy.getMonth() -
        nacimiento.getMonth();

    if (
        diferenciaMes < 0 ||
        (
            diferenciaMes === 0 &&
            hoy.getDate() < nacimiento.getDate()
        )
    ) {
        edad--;
    }

    return edad;
}


// ==========================================================
// SUBESCALAS
// ==========================================================

export function obtenerSubescalaPregunta(
    pregunta: PreguntaTestConOpciones,
    subescalas: SubescalaTest[]
): SubescalaTest | null {

    if (!pregunta.id_subescala) {
        return null;
    }

    return (
        subescalas.find(
            (subescala) =>
                subescala.id_subescala ===
                pregunta.id_subescala
        ) ?? null
    );
}


export function incluirPreguntaEnTotal(
    pregunta: PreguntaTestConOpciones,
    subescalas: SubescalaTest[]
): boolean {

    if (!pregunta.puntua) {
        return false;
    }

    const subescala =
        obtenerSubescalaPregunta(
            pregunta,
            subescalas
        );

    if (!subescala) {
        return true;
    }

    return subescala.incluye_total;
}


// ==========================================================
// PUNTAJES
// ==========================================================

export function calcularPuntajeDirecto(
    preguntas: PreguntaTestConOpciones[],
    respuestas: Record<string, RespuestaSeleccionada>,
    subescalas: SubescalaTest[]
): number {

    return preguntas.reduce(
        (total, pregunta) => {

            if (
                !incluirPreguntaEnTotal(
                    pregunta,
                    subescalas
                )
            ) {
                return total;
            }

            return (
                total +
                (
                    respuestas[
                        pregunta.id_pregunta
                    ]?.valor ?? 0
                )
            );
        },
        0
    );
}


export function calcularPuntajeSubescala(
    idSubescala: string,
    preguntas: PreguntaTestConOpciones[],
    respuestas: Record<string, RespuestaSeleccionada>
): number {

    return preguntas
        .filter(
            (pregunta) =>
                pregunta.id_subescala === idSubescala &&
                pregunta.puntua
        )
        .reduce(
            (total, pregunta) =>
                total +
                (
                    respuestas[
                        pregunta.id_pregunta
                    ]?.valor ?? 0
                ),
            0
        );
}


// ==========================================================
// TRANSFORMACIÓN DEL PUNTAJE
// ==========================================================

export function transformarPuntajeTotal(
    codigoTest: string,
    puntajeDirecto: number
): number {

    if (
        codigoTest === "COOPERSMITH_NINOS" ||
        codigoTest === "COOPERSMITH_ADULTOS"
    ) {
        return puntajeDirecto * 2;
    }

    return puntajeDirecto;
}


// ==========================================================
// VALIDEZ
// ==========================================================

export function evaluarValidezInstrumento(
    test: Test,
    subescalas: SubescalaTest[],
    preguntas: PreguntaTestConOpciones[],
    respuestas: Record<string, RespuestaSeleccionada>
): {
    esValido: boolean;
    observaciones: string | null;
} {

    let esValido = true;
    let observaciones: string | null = null;

    if (test.codigo === "COOPERSMITH_NINOS") {

        const escalaMentiras =
            subescalas.find(
                (subescala) =>
                    subescala.codigo === "L"
            );

        if (escalaMentiras) {

            const puntajeMentiras =
                calcularPuntajeSubescala(
                    escalaMentiras.id_subescala,
                    preguntas,
                    respuestas
                );

            if (puntajeMentiras > 5) {

                esValido = false;

                observaciones =
                    `La Escala de Mentiras obtuvo ${puntajeMentiras} puntos. ` +
                    "De acuerdo con la regla del instrumento, una puntuación superior a 5 indica falta de consistencia en las respuestas.";
            }
        }
    }

    return {
        esValido,
        observaciones,
    };
}


// ==========================================================
// SELECCIÓN DE BAREMO
// ==========================================================

function obtenerEspecificidadBaremo(
    baremo: BaremoTest
): number {

    let puntos = 0;

    if (
        baremo.sexo_aplicable &&
        baremo.sexo_aplicable
            .trim()
            .toLowerCase() !== "todos"
    ) {
        puntos += 2;
    }

    if (baremo.edad_minima !== null) {
        puntos++;
    }

    if (baremo.edad_maxima !== null) {
        puntos++;
    }

    return puntos;
}


export function seleccionarBaremo(
    baremos: BaremoTest[],
    fechaNacimiento: string | null,
    generoUsuario: string | null
): BaremoTest | null {

    if (baremos.length === 0) {
        return null;
    }

    const edad =
        calcularEdad(fechaNacimiento);

    const genero =
        generoUsuario
            ?.trim()
            .toLowerCase();

    const candidatos =
        baremos.filter((baremo) => {

            const cumpleEdadMinima =
                baremo.edad_minima === null ||
                edad === null ||
                edad >= baremo.edad_minima;

            const cumpleEdadMaxima =
                baremo.edad_maxima === null ||
                edad === null ||
                edad <= baremo.edad_maxima;

            const sexoBaremo =
                baremo.sexo_aplicable
                    ?.trim()
                    .toLowerCase();

            const cumpleSexo =
                !sexoBaremo ||
                sexoBaremo === "todos" ||
                !genero ||
                sexoBaremo === genero;

            return (
                cumpleEdadMinima &&
                cumpleEdadMaxima &&
                cumpleSexo
            );
        });

    if (candidatos.length === 0) {
        return null;
    }

    return [...candidatos]
        .sort(
            (a, b) =>
                obtenerEspecificidadBaremo(b) -
                obtenerEspecificidadBaremo(a)
        )[0];
}


// ==========================================================
// RANGOS
// ==========================================================

export function buscarRango(
    rangos: RangoBaremo[],
    valor: number,
    idSubescala: string | null
): RangoBaremo | null {

    return (
        rangos.find((rango) => {

            const mismoAmbito =
                idSubescala === null
                    ? rango.id_subescala === null
                    : rango.id_subescala === idSubescala;

            if (!mismoAmbito) {
                return false;
            }

            const minimo =
                rango.valor_minimo === null
                    ? null
                    : Number(rango.valor_minimo);

            const maximo =
                rango.valor_maximo === null
                    ? null
                    : Number(rango.valor_maximo);

            const cumpleMinimo =
                minimo === null ||
                valor >= minimo;

            const cumpleMaximo =
                maximo === null ||
                valor <= maximo;

            return (
                cumpleMinimo &&
                cumpleMaximo
            );
        }) ?? null
    );
}


// ==========================================================
// VALOR DEL BAREMO
// ==========================================================

export function obtenerValorBaremo(
    baremo: BaremoTest,
    puntajeDirecto: number,
    puntajeTotal: number
): number | null {

    switch (baremo.tipo_valor) {

        case "puntaje_directo":
            return puntajeDirecto;

        case "puntaje_total":
            return puntajeTotal;

        case "percentil":
        case "puntaje_t":
        case "eneatipo":
            return null;

        default:
            return null;
    }
}