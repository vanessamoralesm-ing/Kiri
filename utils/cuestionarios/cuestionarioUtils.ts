import type {
    BaremoTest,
    RangoBaremo,
    SubescalaTest,
    Test,
} from "@/types/cuestionarios";

import type {
    PreguntaTestConOpciones,
    RespuestaSeleccionada,
} from "@/services/cuestionarios/cuestionarios.service";

type Respuestas = Record<string, RespuestaSeleccionada>;

// ==========================================================
// EDAD
// ==========================================================

export function calcularEdad(fechaNacimiento: string | null): number | null {
    if (!fechaNacimiento) return null;

    const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);

    if (Number.isNaN(nacimiento.getTime())) {
        return null;
    }

    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();

    if (
        diferenciaMes < 0 ||
        (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())
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
    subescalas: SubescalaTest[],
): SubescalaTest | null {
    if (!pregunta.id_subescala) return null;

    return (
        subescalas.find(
            (subescala) => subescala.id_subescala === pregunta.id_subescala,
        ) ?? null
    );
}

export function incluirPreguntaEnTotal(
    pregunta: PreguntaTestConOpciones,
    subescalas: SubescalaTest[],
): boolean {
    if (!pregunta.puntua) return false;

    const subescala = obtenerSubescalaPregunta(pregunta, subescalas);

    if (!subescala) return true;

    return subescala.incluye_total;
}

// ==========================================================
// VALIDACIÓN DE RESPUESTAS
// ==========================================================

export function validarRespuestasObligatorias(
    preguntas: PreguntaTestConOpciones[],
    respuestas: Respuestas,
): void {
    for (const pregunta of preguntas) {
        if (pregunta.obligatoria && !respuestas[pregunta.id_pregunta]) {
            throw new Error(`Debes responder la pregunta ${pregunta.orden}.`);
        }

        const respuesta = respuestas[pregunta.id_pregunta];

        if (!respuesta) continue;

        const opcion = pregunta.opciones.find(
            (item) => item.id === respuesta.idOpcion,
        );

        if (!opcion) {
            throw new Error(
                `La respuesta de la pregunta ${pregunta.orden} no es válida.`,
            );
        }

        if (
            pregunta.puntua &&
            (opcion.valor === null || !Number.isFinite(opcion.valor))
        ) {
            throw new Error(
                `La pregunta ${pregunta.orden} no tiene una puntuación válida.`,
            );
        }
    }
}

// ==========================================================
// VALIDACIÓN ESPECÍFICA DE LA EAG
// ==========================================================

export function validarConfiguracionEAG(
    preguntas: PreguntaTestConOpciones[],
    respuestas: Respuestas,
): void {
    const puntuables = preguntas.filter((pregunta) => pregunta.puntua);

    if (puntuables.length !== 11) {
        throw new Error("La EAG debe tener exactamente 11 preguntas puntuables.");
    }

    for (const pregunta of puntuables) {
        const respuesta = respuestas[pregunta.id_pregunta];

        if (!respuesta) {
            throw new Error(`Falta responder la pregunta ${pregunta.orden}.`);
        }

        if (pregunta.opciones.length !== 7) {
            throw new Error(
                `La pregunta ${pregunta.orden} debe tener siete opciones activas.`,
            );
        }

        const opcion = pregunta.opciones.find(
            (item) => item.id === respuesta.idOpcion,
        );

        if (
            !opcion ||
            opcion.valor === null ||
            !Number.isInteger(opcion.valor) ||
            opcion.valor < 1 ||
            opcion.valor > 7
        ) {
            throw new Error(
                `La pregunta ${pregunta.orden} tiene una puntuación inválida.`,
            );
        }

        // Verifica que las siete opciones cubran los
        // valores 1, 2, 3, 4, 5, 6 y 7.
        const valores = pregunta.opciones
            .map((item) => item.valor)
            .sort((a, b) => Number(a) - Number(b));

        if (valores.some((valor, indice) => valor !== indice + 1)) {
            throw new Error(
                `Revisa la configuración de puntuaciones de la pregunta ${pregunta.orden}.`,
            );
        }

        // La inversión de los ítems 1, 3 y 10 debe
        // estar registrada en valor_puntaje.
        // Aquí NO se invierte nuevamente.
    }
}

// ==========================================================
// PUNTAJES
// ==========================================================

export function calcularPuntajeDirecto(
    preguntas: PreguntaTestConOpciones[],
    respuestas: Respuestas,
    subescalas: SubescalaTest[],
): number {
    return preguntas.reduce((total, pregunta) => {
        if (!incluirPreguntaEnTotal(pregunta, subescalas)) {
            return total;
        }

        const respuesta = respuestas[pregunta.id_pregunta];

        if (!respuesta) {
            if (pregunta.obligatoria) {
                throw new Error(`Falta responder la pregunta ${pregunta.orden}.`);
            }

            return total;
        }

        const opcion = pregunta.opciones.find(
            (item) => item.id === respuesta.idOpcion,
        );

        if (!opcion || opcion.valor === null || !Number.isFinite(opcion.valor)) {
            throw new Error(
                `La pregunta ${pregunta.orden} no tiene una puntuación válida.`,
            );
        }

        return total + opcion.valor;
    }, 0);
}

export function calcularPuntajeSubescala(
    idSubescala: string,
    preguntas: PreguntaTestConOpciones[],
    respuestas: Respuestas,
): number {
    return preguntas
        .filter(
            (pregunta) => pregunta.id_subescala === idSubescala && pregunta.puntua,
        )
        .reduce((total, pregunta) => {
            const respuesta = respuestas[pregunta.id_pregunta];

            if (!respuesta) {
                if (pregunta.obligatoria) {
                    throw new Error(`Falta responder la pregunta ${pregunta.orden}.`);
                }

                return total;
            }

            const opcion = pregunta.opciones.find(
                (item) => item.id === respuesta.idOpcion,
            );

            if (!opcion || opcion.valor === null || !Number.isFinite(opcion.valor)) {
                throw new Error(
                    `Puntuación inválida en la pregunta ${pregunta.orden}.`,
                );
            }

            return total + opcion.valor;
        }, 0);
}

// ==========================================================
// TRANSFORMACIÓN
// ==========================================================

export function transformarPuntajeTotal(
    codigoTest: string,
    puntajeDirecto: number,
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
    respuestas: Respuestas,
): {
    esValido: boolean;
    observaciones: string | null;
} {
    let esValido = true;
    let observaciones: string | null = null;

    if (test.codigo === "COOPERSMITH_NINOS") {
        const escalaMentiras = subescalas.find(
            (subescala) => subescala.codigo === "L",
        );

        if (escalaMentiras) {
            const puntajeMentiras = calcularPuntajeSubescala(
                escalaMentiras.id_subescala,
                preguntas,
                respuestas,
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

function obtenerEspecificidadBaremo(baremo: BaremoTest): number {
    let puntos = 0;

    const sexo = baremo.sexo_aplicable?.trim().toLowerCase();

    if (sexo && sexo !== "todos") {
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
    generoUsuario: string | null,
): BaremoTest | null {
    if (baremos.length === 0) return null;

    const edad = calcularEdad(fechaNacimiento);

    const genero = generoUsuario?.trim().toLowerCase();

    const candidatos = baremos.filter((baremo) => {
        const tieneEdadRestringida =
            baremo.edad_minima !== null || baremo.edad_maxima !== null;

        // Si el baremo exige una edad y no
        // conocemos la del usuario, no se aplica.
        if (tieneEdadRestringida && edad === null) {
            return false;
        }

        if (
            baremo.edad_minima !== null &&
            edad !== null &&
            edad < baremo.edad_minima
        ) {
            return false;
        }

        if (
            baremo.edad_maxima !== null &&
            edad !== null &&
            edad > baremo.edad_maxima
        ) {
            return false;
        }

        const sexoBaremo = baremo.sexo_aplicable?.trim().toLowerCase();

        if (sexoBaremo && sexoBaremo !== "todos") {
            if (!genero) return false;

            if (sexoBaremo !== genero) {
                return false;
            }
        }

        return true;
    });

    if (candidatos.length === 0) {
        return null;
    }

    return [...candidatos].sort(
        (a, b) => obtenerEspecificidadBaremo(b) - obtenerEspecificidadBaremo(a),
    )[0];
}

// ==========================================================
// RANGOS
// ==========================================================

export function buscarRango(
    rangos: RangoBaremo[],
    valor: number,
    idSubescala: string | null,
): RangoBaremo | null {
    if (!Number.isFinite(valor)) return null;

    return (
        rangos.find((rango) => {
            const mismoAmbito =
                idSubescala === null
                    ? rango.id_subescala === null
                    : rango.id_subescala === idSubescala;

            if (!mismoAmbito) return false;

            const minimo =
                rango.valor_minimo === null ? -Infinity : Number(rango.valor_minimo);

            const maximo =
                rango.valor_maximo === null ? Infinity : Number(rango.valor_maximo);

            if (Number.isNaN(minimo) || Number.isNaN(maximo)) {
                return false;
            }

            return valor >= minimo && valor <= maximo;
        }) ?? null
    );
}

// ==========================================================
// VALOR DEL BAREMO
// ==========================================================

export function obtenerValorBaremo(
    baremo: BaremoTest,
    puntajeDirecto: number,
    puntajeTotal: number,
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
