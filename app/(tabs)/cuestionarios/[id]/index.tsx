import OpcionRespuesta from "@/components/cuestionarios/OpcionRespuesta";

import ProgresoCuestionario from "@/components/cuestionarios/ProgresoCuestionario";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import {
    completarEjecucion,
    guardarRespuestaTest,
    guardarResultadoSubescala,
    guardarResultadoTest,
    obtenerBaremosPorTest,
    obtenerOCrearEjecucion,
    obtenerPreguntasConOpciones,
    obtenerRangosPorBaremo,
    obtenerRespuestasEjecucion,
    obtenerSubescalasPorTest,
    obtenerTestPorCodigo,
    obtenerUsuarioCuestionario,
} from "@/services/cuestionarios/cuestionarios.service";

import type {
    OpcionRespuestaTest,
    PreguntaTestConOpciones,
    RespuestaSeleccionada,
    UsuarioCuestionario,
} from "@/services/cuestionarios/cuestionarios.service";

import type { RangoBaremo, SubescalaTest, Test } from "@/types/cuestionarios";

import {
    buscarRango,
    calcularPuntajeDirecto,
    calcularPuntajeSubescala,
    evaluarValidezInstrumento,
    obtenerValorBaremo,
    seleccionarBaremo,
    transformarPuntajeTotal,
    validarConfiguracionEAG,
    validarRespuestasObligatorias,
} from "@/utils/cuestionarios/cuestionarioUtils";

import { Ionicons } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";

import React, { useEffect, useRef, useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";

// ==========================================================

// CONFIGURACIÓN

// ==========================================================

const PREGUNTAS_POR_PAGINA = 4;

// ==========================================================

// COMPONENTE

// ==========================================================

export default function CuestionarioDetalle() {
    const router = useRouter();

    const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

    const { id } = useLocalSearchParams<{
        id: string;
    }>();

    // ======================================================

    // TEMA

    // ======================================================

    const backgroundColor = useThemeColor({}, "background");

    const surfaceColor = useThemeColor({}, "surface");

    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const borderColor = useThemeColor({}, "border");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const accentColor = useThemeColor({}, "accent");

    const warningColor = useThemeColor({}, "warning");

    const disabledColor = useThemeColor({}, "disabled");

    // ======================================================

    // REFERENCIAS

    // ======================================================

    const scrollViewRef = useRef<ScrollView>(null);

    // ======================================================

    // ESTADOS

    // ======================================================

    const [cuestionario, setCuestionario] = useState<Test | null>(null);

    const [usuario, setUsuario] = useState<UsuarioCuestionario | null>(null);

    const [preguntas, setPreguntas] = useState<PreguntaTestConOpciones[]>([]);

    const [subescalas, setSubescalas] = useState<SubescalaTest[]>([]);

    const [respuestas, setRespuestas] = useState<
        Record<string, RespuestaSeleccionada>
    >({});

    const [idEjecucion, setIdEjecucion] = useState<string | null>(null);

    const [paginaActual, setPaginaActual] = useState(0);

    const [cargando, setCargando] = useState(true);

    const [finalizando, setFinalizando] = useState(false);
    const [guardadosPendientes, setGuardadosPendientes] = useState(0);
    const [accionError, setAccionError] = useState<string | null>(null);
    const preguntasGuardandoRef = useRef<Set<string>>(new Set());

    const [error, setError] = useState<string | null>(null);

    // ======================================================

    // RESPONSIVE

    // ======================================================

    const paddingHorizontal = esEscritorio
        ? PADDING_RESPONSIVE.escritorio
        : esTablet
            ? PADDING_RESPONSIVE.tablet
            : PADDING_RESPONSIVE.telefono;

    const anchoContenido = esEscritorio
        ? 900
        : esTablet
            ? ("92%" as const)
            : ("100%" as const);

    const tamanoTituloPregunta = esEscritorio ? 22 : esTablet ? 21 : 21;

    // ======================================================

    // CARGA INICIAL

    // ======================================================

    useEffect(() => {
        if (!id) {
            return;
        }

        cargarCuestionario();
    }, [id]);

    // ======================================================

    // SCROLL AL CAMBIAR DE PÁGINA

    // ======================================================

    useEffect(() => {
        requestAnimationFrame(() => {
            scrollViewRef.current?.scrollTo({
                y: 0,

                animated: true,
            });
        });
    }, [paginaActual]);

    // ======================================================

    // CARGAR CUESTIONARIO

    // ======================================================

    const cargarCuestionario = async () => {
        if (!id) {
            return;
        }

        try {
            setCargando(true);

            setError(null);

            // ==========================================

            // TEST

            // ==========================================

            const test = await obtenerTestPorCodigo(id);

            if (!test) {
                throw new Error(
                    "El cuestionario solicitado no se encuentra disponible.",
                );
            }

            // ==========================================

            // USUARIO

            // ==========================================

            const usuarioActual = await obtenerUsuarioCuestionario();

            // ==========================================

            // EJECUCIÓN

            // ==========================================

            const ejecucion = await obtenerOCrearEjecucion(
                usuarioActual.id_usuario,

                test.id_test,
            );

            // ==========================================

            // DATOS DEL CUESTIONARIO

            // ==========================================

            const [subescalasObtenidas, preguntasObtenidas, respuestasExistentes] =
                await Promise.all([
                    obtenerSubescalasPorTest(test.id_test),

                    obtenerPreguntasConOpciones(test.id_test),

                    obtenerRespuestasEjecucion(ejecucion.id_ejecucion),
                ]);

            // ==========================================

            // RECUPERAR RESPUESTAS

            // ==========================================

            const respuestasRecuperadas: Record<string, RespuestaSeleccionada> = {};

            for (const respuesta of respuestasExistentes) {
                if (!respuesta.id_opcion) {
                    continue;
                }

                const pregunta = preguntasObtenidas.find(
                    (item) => item.id_pregunta === respuesta.id_pregunta,
                );

                const opcion = pregunta?.opciones.find(
                    (item) => item.id === respuesta.id_opcion,
                );

                if (pregunta && opcion) {
                    respuestasRecuperadas[pregunta.id_pregunta] = {
                        idOpcion: opcion.id,

                        valor: opcion.valor,
                    };
                }
            }

            // ==========================================

            // ACTUALIZAR ESTADO

            // ==========================================

            setCuestionario(test);

            setUsuario(usuarioActual);

            setIdEjecucion(ejecucion.id_ejecucion);

            setSubescalas(subescalasObtenidas);

            setPreguntas(preguntasObtenidas);

            setRespuestas(respuestasRecuperadas);

            setPaginaActual(0);
        } catch (error) {
            console.error("Error cargando cuestionario:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "No fue posible cargar el cuestionario.",
            );
        } finally {
            setCargando(false);
        }
    };

    // ======================================================

    // SELECCIONAR RESPUESTA

    // ======================================================

    const seleccionarRespuesta = async (
        pregunta: PreguntaTestConOpciones,
        opcion: OpcionRespuestaTest,
    ) => {
        if (!idEjecucion || finalizando) return;
        const idPregunta = pregunta.id_pregunta;
        if (preguntasGuardandoRef.current.has(idPregunta)) return;
        const respuestaAnterior = respuestas[idPregunta];
        preguntasGuardandoRef.current.add(idPregunta);
        setGuardadosPendientes((actual) => actual + 1);
        setAccionError(null);
        setRespuestas((anteriores) => ({
            ...anteriores,
            [idPregunta]: { idOpcion: opcion.id, valor: opcion.valor },
        }));
        try {
            await guardarRespuestaTest({
                idEjecucion,
                idPregunta,
                idOpcion: opcion.id,
            });
        } catch (err) {
            console.error("Error guardando respuesta:", err);
            setRespuestas((anteriores) => {
                const copia = { ...anteriores };
                if (respuestaAnterior) copia[idPregunta] = respuestaAnterior;
                else delete copia[idPregunta];
                return copia;
            });
            setAccionError(
                "No fue posible guardar la respuesta. Inténtalo nuevamente.",
            );
        } finally {
            preguntasGuardandoRef.current.delete(idPregunta);
            setGuardadosPendientes((actual) => Math.max(0, actual - 1));
        }
    };

    // ======================================================

    // FINALIZAR CUESTIONARIO

    // ======================================================

    const finalizarCuestionario = async () => {
        if (
            !cuestionario ||
            !usuario ||
            !idEjecucion ||
            finalizando ||
            guardadosPendientes > 0 ||
            preguntasGuardandoRef.current.size > 0
        ) {
            return;
        }

        try {
            setFinalizando(true);
            setAccionError(null);
            validarRespuestasObligatorias(preguntas, respuestas);
            if (cuestionario.codigo === "EAG")
                validarConfiguracionEAG(preguntas, respuestas);

            // ==========================================

            // 1. PUNTAJES

            // ==========================================

            const puntajeDirecto = calcularPuntajeDirecto(
                preguntas,

                respuestas,

                subescalas,
            );

            const puntajeTotal = transformarPuntajeTotal(
                cuestionario.codigo,

                puntajeDirecto,
            );
            if (
                cuestionario.codigo === "EAG" &&
                (!Number.isInteger(puntajeTotal) ||
                    puntajeTotal < 11 ||
                    puntajeTotal > 77)
            ) {
                throw new Error("La puntuación EAG debe estar entre 11 y 77.");
            }

            // ==========================================

            // 2. VALIDEZ

            // ==========================================

            const { esValido, observaciones } = evaluarValidezInstrumento(
                cuestionario,

                subescalas,

                preguntas,

                respuestas,
            );

            // ==========================================

            // 3. BAREMO

            // ==========================================

            const baremos = await obtenerBaremosPorTest(cuestionario.id_test);

            const baremo =
                cuestionario.codigo === "EAG"
                    ? (baremos.find(
                        (b) =>
                            b.codigo === "EAG-GENERAL" && b.tipo_valor === "puntaje_total",
                    ) ?? null)
                    : seleccionarBaremo(
                        baremos,
                        usuario.fecha_nacimiento,
                        usuario.genero,
                    );

            let rangos: RangoBaremo[] = [];

            let rangoGlobal: RangoBaremo | null = null;

            if (baremo) {
                rangos = await obtenerRangosPorBaremo(baremo.id_baremo);

                const valorBaremo = obtenerValorBaremo(
                    baremo,

                    puntajeDirecto,

                    puntajeTotal,
                );

                if (valorBaremo !== null) {
                    rangoGlobal = buscarRango(rangos, valorBaremo, null);
                }
            }

            if (cuestionario.codigo === "EAG") {
                if (
                    !baremo ||
                    baremo.codigo !== "EAG-GENERAL" ||
                    baremo.tipo_valor !== "puntaje_total"
                )
                    throw new Error(
                        "No se encontró el baremo EAG-GENERAL activo con tipo puntaje_total.",
                    );
                if (!rangoGlobal)
                    throw new Error(
                        "No se encontró un rango activo para la puntuación EAG.",
                    );
            }

            // ==========================================

            // 4. RESULTADO PRINCIPAL

            // ==========================================

            const resultado = await guardarResultadoTest({
                idEjecucion,

                puntajeDirecto,

                puntajeTotal,

                nivel: rangoGlobal?.nivel ?? null,

                interpretacion: rangoGlobal?.interpretacion ?? null,

                esValido,

                observaciones,

                idBaremo: baremo?.id_baremo ?? null,

                idRangoBaremo: rangoGlobal?.id_rango ?? null,
            });

            // ==========================================

            // 5. RESULTADOS DE SUBESCALAS

            // ==========================================

            if (cuestionario.tiene_subescalas) {
                for (const subescala of subescalas) {
                    const tienePreguntas = preguntas.some(
                        (pregunta) =>
                            pregunta.id_subescala === subescala.id_subescala &&
                            pregunta.puntua,
                    );

                    if (!tienePreguntas) {
                        continue;
                    }

                    const puntajeSubescala = calcularPuntajeSubescala(
                        subescala.id_subescala,

                        preguntas,

                        respuestas,
                    );

                    const rangoSubescala = baremo
                        ? buscarRango(rangos, puntajeSubescala, subescala.id_subescala)
                        : null;

                    await guardarResultadoSubescala({
                        idResultado: resultado.id_resultado,

                        idSubescala: subescala.id_subescala,

                        puntajeDirecto: puntajeSubescala,

                        nivel: rangoSubescala?.nivel ?? null,

                        interpretacion: rangoSubescala?.interpretacion ?? null,
                    });
                }
            }

            // ==========================================

            // 6. COMPLETAR EJECUCIÓN

            // ==========================================

            await completarEjecucion(idEjecucion);

            // ==========================================

            // 7. RESULTADO

            // ==========================================

            router.replace({
                pathname: "/cuestionarios/[id]/resultado",

                params: {
                    id: cuestionario.codigo,

                    idResultado: resultado.id_resultado,
                },
            } as any);
        } catch (error) {
            console.error("Error finalizando cuestionario:", error);

            setAccionError(
                error instanceof Error
                    ? error.message
                    : "No fue posible finalizar el cuestionario.",
            );
        } finally {
            setFinalizando(false);
        }
    };

    // ======================================================

    // PAGINACIÓN

    // ======================================================

    const totalPaginas = Math.ceil(preguntas.length / PREGUNTAS_POR_PAGINA);

    const indiceInicial = paginaActual * PREGUNTAS_POR_PAGINA;

    const preguntasPagina = preguntas.slice(
        indiceInicial,

        indiceInicial + PREGUNTAS_POR_PAGINA,
    );

    const todasRespondidasEnPagina = preguntasPagina.every(
        (pregunta) =>
            !pregunta.obligatoria || respuestas[pregunta.id_pregunta] !== undefined,
    );

    const todasRespondidas = preguntas.every(
        (pregunta) =>
            !pregunta.obligatoria || respuestas[pregunta.id_pregunta] !== undefined,
    );

    // ======================================================

    // NAVEGACIÓN

    // ======================================================

    const avanzar = () => {
        if (
            finalizando ||
            guardadosPendientes > 0 ||
            preguntasGuardandoRef.current.size > 0 ||
            !todasRespondidasEnPagina
        ) {
            return;
        }

        if (paginaActual < totalPaginas - 1) {
            setPaginaActual((pagina) => pagina + 1);

            return;
        }

        if (todasRespondidas) {
            finalizarCuestionario();
        }
    };

    const retroceder = () => {
        if (
            finalizando ||
            guardadosPendientes > 0 ||
            preguntasGuardandoRef.current.size > 0
        )
            return;

        if (paginaActual > 0) {
            setPaginaActual((pagina) => pagina - 1);

            return;
        }

        router.back();
    };

    // ======================================================

    // CARGANDO

    // ======================================================

    if (cargando) {
        return (
            <View
                style={{
                    flex: 1,

                    backgroundColor,

                    alignItems: "center",

                    justifyContent: "center",

                    paddingHorizontal,
                }}
            >
                <ActivityIndicator size="large" color={primaryColor} />

                <Text
                    style={{
                        marginTop: 12,

                        fontFamily: "Nunito-Medium",

                        fontSize: 15,

                        color: textSecondaryColor,
                    }}
                >
                    Cargando cuestionario...
                </Text>
            </View>
        );
    }

    // ======================================================

    // ERROR

    // ======================================================

    if (error || !cuestionario) {
        return (
            <View
                style={{
                    flex: 1,

                    backgroundColor,

                    alignItems: "center",

                    justifyContent: "center",

                    paddingHorizontal,
                }}
            >
                <View
                    style={{
                        width: "100%",

                        maxWidth: MAX_WIDTHS.formularioAuth,

                        alignItems: "center",
                    }}
                >
                    <Ionicons name="alert-circle-outline" size={50} color={accentColor} />

                    <Text
                        style={{
                            marginTop: 12,

                            fontFamily: "Nunito-Bold",

                            fontSize: esEscritorio ? 21 : 19,

                            lineHeight: esEscritorio ? 28 : 25,

                            color: textColor,

                            textAlign: "center",
                        }}
                    >
                        {error ?? "Cuestionario no encontrado."}
                    </Text>

                    <Pressable
                        onPress={() => router.back()}

                        style={{
                            marginTop: 20,

                            paddingHorizontal: 24,

                            paddingVertical: 12,

                            borderRadius: 12,

                            backgroundColor: primaryColor,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",

                                fontSize: 14,

                                color: "#FFFFFF",
                            }}
                        >
                            Volver
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    // ======================================================

    // SIN PREGUNTAS

    // ======================================================

    if (preguntas.length === 0) {
        return (
            <View
                style={{
                    flex: 1,

                    backgroundColor,

                    alignItems: "center",

                    justifyContent: "center",

                    paddingHorizontal,
                }}
            >
                <View
                    style={{
                        width: "100%",

                        maxWidth: MAX_WIDTHS.formularioAuth,

                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name="document-text-outline"

                        size={50}

                        color={accentColor}
                    />

                    <Text
                        style={{
                            marginTop: 12,

                            fontFamily: "Nunito-Bold",

                            fontSize: esEscritorio ? 21 : 19,

                            lineHeight: esEscritorio ? 28 : 25,

                            color: textColor,

                            textAlign: "center",
                        }}
                    >
                        Este cuestionario aún no contiene preguntas.
                    </Text>

                    <Pressable
                        onPress={() => router.back()}

                        style={{
                            marginTop: 20,

                            paddingHorizontal: 24,

                            paddingVertical: 12,

                            borderRadius: 12,

                            backgroundColor: primaryColor,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",

                                fontSize: 14,

                                color: "#FFFFFF",
                            }}
                        >
                            Volver
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    // ======================================================

    // INTERFAZ

    // ======================================================

    return (
        <View
            style={{
                flex: 1,

                backgroundColor,
            }}
        >
            <ScrollView
                ref={scrollViewRef}

                style={{
                    flex: 1,
                }}

                contentContainerStyle={{
                    paddingTop: esEscritorio ? 32 : 18,

                    paddingBottom: 120,

                    alignItems: "center",
                }}

                showsVerticalScrollIndicator={false}

                bounces={false}

                overScrollMode="never"

                keyboardShouldPersistTaps="handled"
            >
                {/* ==================================================

                    CONTENEDOR PRINCIPAL RESPONSIVE

                ================================================== */}

                <View
                    style={{
                        width: anchoContenido,

                        alignSelf: "center",

                        paddingHorizontal: esTelefono
                            ? PADDING_RESPONSIVE.telefono
                            : esTablet
                                ? PADDING_RESPONSIVE.tablet
                                : 32,

                        paddingVertical: esEscritorio ? 28 : 0,

                        borderRadius: esEscritorio ? 28 : 0,

                        borderWidth: esEscritorio ? 1 : 0,

                        borderColor,

                        backgroundColor: esEscritorio ? surfaceColor : "transparent",
                    }}
                >
                    {/* ==================================================

                        ENCABEZADO

                    ================================================== */}

                    <View
                        style={{
                            flexDirection: "row",

                            alignItems: "center",

                            marginBottom: esEscritorio ? 24 : 20,
                        }}
                    >
                        <Pressable
                            onPress={retroceder}

                            disabled={finalizando || guardadosPendientes > 0}

                            style={{
                                width: 40,

                                height: 40,

                                alignItems: "center",

                                justifyContent: "center",
                            }}
                        >
                            <Ionicons
                                name="arrow-back-outline"

                                size={24}

                                color={textSecondaryColor}
                            />
                        </Pressable>

                        <Text
                            numberOfLines={2}

                            style={{
                                flex: 1,

                                marginLeft: 8,

                                fontFamily: "Nunito-Bold",

                                fontSize: esEscritorio ? 21 : esTablet ? 20 : 18,

                                lineHeight: esEscritorio ? 28 : 25,

                                color: textColor,
                            }}
                        >
                            {cuestionario.nombre}
                        </Text>
                    </View>

                    {/* ==================================================

                        PROGRESO

                    ================================================== */}

                    <ProgresoCuestionario
                        paginaActual={paginaActual + 1}

                        totalPaginas={totalPaginas}

                        respondidas={Object.keys(respuestas).length}

                        totalPreguntas={preguntas.length}
                    />

                    {/* ==================================================

                        INSTRUCCIONES

                    ================================================== */}

                    {paginaActual === 0 && cuestionario.instrucciones && (
                        <View
                            style={{
                                marginBottom: esEscritorio ? 32 : 28,

                                padding: esEscritorio ? 18 : 16,

                                borderRadius: 16,

                                borderWidth: 1,

                                borderColor,

                                backgroundColor: primarySoftColor,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",

                                    alignItems: "flex-start",
                                }}
                            >
                                <Ionicons
                                    name="information-circle-outline"

                                    size={22}

                                    color={primaryColor}
                                />

                                <Text
                                    style={{
                                        flex: 1,

                                        marginLeft: 8,

                                        fontFamily: "Nunito-Medium",

                                        fontSize: esEscritorio ? 14 : 13,

                                        lineHeight: esEscritorio ? 21 : 19,

                                        color: textSecondaryColor,
                                    }}
                                >
                                    {cuestionario.instrucciones}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* ==================================================

                        PREGUNTAS

                    ================================================== */}

                    {preguntasPagina.map((pregunta, index) => {
                        const numeroPregunta = indiceInicial + index + 1;

                        return (
                            <View
                                key={pregunta.id_pregunta}

                                style={{
                                    marginBottom: 36,

                                    paddingBottom: esEscritorio ? 32 : 0,

                                    borderBottomWidth: esEscritorio ? 1 : 0,

                                    borderBottomColor: borderColor,
                                }}
                            >
                                {/* ==================================

                                            ENUNCIADO

                                        ================================== */}

                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",

                                        fontSize: tamanoTituloPregunta,

                                        lineHeight: esEscritorio ? 30 : 28,

                                        color: textColor,
                                    }}
                                >
                                    {numeroPregunta}. {pregunta.enunciado}
                                </Text>

                                {/* ==================================

                                            DESCRIPCIÓN DE APOYO

                                        ================================== */}

                                {pregunta.descripcion_apoyo && (
                                    <Text
                                        style={{
                                            marginTop: 8,

                                            marginBottom: 16,

                                            fontFamily: "Nunito-Medium",

                                            fontSize: esEscritorio ? 14 : 13,

                                            lineHeight: esEscritorio ? 21 : 19,

                                            color: textSecondaryColor,

                                            textAlign: "left",

                                            maxWidth: esEscritorio ? 720 : undefined,
                                        }}
                                    >
                                        {pregunta.descripcion_apoyo}
                                    </Text>
                                )}

                                {/* ==================================

                                            OPCIONES

                                        ================================== */}

                                <View
                                    style={{
                                        marginTop: pregunta.descripcion_apoyo ? 4 : 20,
                                    }}
                                >
                                    {pregunta.opciones.length > 0 ? (
                                        pregunta.opciones.map((opcion) => (
                                            <OpcionRespuesta
                                                key={opcion.id}

                                                texto={opcion.texto}

                                                seleccionada={
                                                    respuestas[pregunta.id_pregunta]?.idOpcion ===
                                                    opcion.id
                                                }

                                                onPress={() => seleccionarRespuesta(pregunta, opcion)}
                                            />
                                        ))
                                    ) : (
                                        <View
                                            style={{
                                                padding: 16,

                                                borderWidth: 1,

                                                borderColor: warningColor,

                                                borderRadius: 16,

                                                backgroundColor: surfaceSecondaryColor,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",

                                                    alignItems: "flex-start",
                                                }}
                                            >
                                                <Ionicons
                                                    name="information-circle-outline"

                                                    size={20}

                                                    color={warningColor}
                                                />

                                                <Text
                                                    style={{
                                                        flex: 1,

                                                        marginLeft: 8,

                                                        fontFamily: "Nunito-Medium",

                                                        fontSize: 13,

                                                        lineHeight: 18,

                                                        color: textSecondaryColor,
                                                    }}
                                                >
                                                    Esta pregunta no tiene opciones de respuesta
                                                    disponibles.
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}

                    {accionError && (
                        <Text
                            style={{
                                color: warningColor,
                                fontFamily: "Nunito-Medium",
                                textAlign: "center",
                                marginTop: 12,
                            }}
                        >
                            {accionError}
                        </Text>
                    )}

                    {/* ==================================================

                        NAVEGACIÓN

                    ================================================== */}

                    <View
                        style={{
                            width: "100%",

                            maxWidth: esEscritorio ? 620 : undefined,

                            alignSelf: "center",

                            flexDirection: "row",

                            gap: 16,

                            marginTop: esEscritorio ? 4 : 12,
                        }}
                    >
                        {/* ==============================================

                            ANTERIOR

                        ============================================== */}

                        <Pressable
                            onPress={retroceder}

                            disabled={finalizando}

                            style={{
                                flex: 1,

                                paddingVertical: 16,

                                borderRadius: 12,

                                borderWidth: 1,

                                borderColor,

                                backgroundColor: surfaceSecondaryColor,

                                flexDirection: "row",

                                alignItems: "center",

                                justifyContent: "center",
                            }}
                        >
                            <Ionicons
                                name="arrow-back-outline"

                                size={16}

                                color={textSecondaryColor}
                            />

                            <Text
                                style={{
                                    marginLeft: 5,

                                    fontFamily: "Nunito-SemiBold",

                                    fontSize: 14,

                                    color: textSecondaryColor,
                                }}
                            >
                                Anterior
                            </Text>
                        </Pressable>

                        {/* ==============================================

                            SIGUIENTE / FINALIZAR

                        ============================================== */}

                        <Pressable
                            disabled={
                                !todasRespondidasEnPagina ||
                                finalizando ||
                                guardadosPendientes > 0
                            }

                            onPress={avanzar}

                            style={{
                                flex: 1.5,

                                paddingVertical: 16,

                                borderRadius: 12,

                                flexDirection: "row",

                                alignItems: "center",

                                justifyContent: "center",

                                backgroundColor:
                                    todasRespondidasEnPagina &&
                                        !finalizando &&
                                        guardadosPendientes === 0
                                        ? primaryColor
                                        : disabledColor,
                            }}
                        >
                            {finalizando ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-SemiBold",

                                            fontSize: 14,

                                            color: "#FFFFFF",
                                        }}
                                    >
                                        {paginaActual === totalPaginas - 1
                                            ? "Finalizar"
                                            : "Siguiente"}
                                    </Text>

                                    <Ionicons
                                        name={
                                            paginaActual === totalPaginas - 1
                                                ? "checkmark-outline"
                                                : "arrow-forward-outline"
                                        }

                                        size={16}

                                        color="#FFFFFF"

                                        style={{
                                            marginLeft: 5,
                                        }}
                                    />
                                </>
                            )}
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
