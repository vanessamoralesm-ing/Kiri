import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeMode } from "@/contexts/ThemeModeContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { supabase } from "@/lib/supabase";

import type {
    BaremoTest,
    EjecucionTest,
    RangoBaremo,
    ResultadoSubescala,
    ResultadoTest,
    Test,
} from "@/types/cuestionarios";

import { Ionicons } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";

import React, { useEffect, useMemo, useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function ResultadoCuestionario() {
    const router = useRouter();

    // ======================================================
    // RESPONSIVE
    // ======================================================

    const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

    // ======================================================
    // TEMA
    // ======================================================

    const { isDarkMode } = useThemeMode();

    const backgroundColor = useThemeColor({}, "background");

    const surfaceColor = useThemeColor({}, "surface");

    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const textMutedColor = useThemeColor({}, "textMuted");

    const borderColor = useThemeColor({}, "border");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const secondaryColor = useThemeColor({}, "secondary");

    const secondarySoftColor = useThemeColor({}, "secondarySoft");

    const accentColor = useThemeColor({}, "accent");

    const accentSoftColor = useThemeColor({}, "accentSoft");

    const dangerColor = useThemeColor({}, "danger");

    const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

    // ======================================================
    // COLORES SEMÁNTICOS
    // ======================================================

    /*
     * Estos colores todavía no forman parte del theme.ts.
     * Se adaptan manualmente según el tema.
     *
     * Más adelante pueden moverse a constants/theme.ts como:
     * success / successSoft
     * warning / warningSoft
     * dangerSoft
     */

    const successColor = isDarkMode ? "#34D399" : "#059669";

    const successSoftColor = isDarkMode ? "#14352B" : "#ECFDF5";

    const warningColor = isDarkMode ? "#FBBF24" : "#F59E0B";

    const warningSoftColor = isDarkMode ? "#3A3018" : "#FFFBEB";

    const dangerSoftColor = isDarkMode ? "#3B2025" : "#FEF2F2";

    const infoSoftColor = isDarkMode ? "#172D4F" : "#DBEAFE";

    const infoTextColor = isDarkMode ? "#BFDBFE" : "#475569";

    // ======================================================
    // PARÁMETROS
    // ======================================================

    const { idResultado } = useLocalSearchParams<{
        id: string;
        idResultado: string;
    }>();

    // ======================================================
    // ESTADOS
    // ======================================================

    const [cuestionario, setCuestionario] = useState<Test | null>(null);

    const [resultado, setResultado] = useState<ResultadoTest | null>(null);

    const [baremo, setBaremo] = useState<BaremoTest | null>(null);

    const [rangoAplicado, setRangoAplicado] = useState<RangoBaremo | null>(null);

    const [rangosGlobales, setRangosGlobales] = useState<RangoBaremo[]>([]);

    const [resultadosSubescalas, setResultadosSubescalas] = useState<
        ResultadoSubescala[]
    >([]);

    const [cargando, setCargando] = useState(true);

    const [error, setError] = useState<string | null>(null);

    // ======================================================
    // VALORES RESPONSIVE
    // ======================================================

    const paddingHorizontal = esEscritorio
        ? PADDING_RESPONSIVE.escritorio
        : esTablet
            ? PADDING_RESPONSIVE.tablet
            : PADDING_RESPONSIVE.telefono;

    const maxWidthContenido = esEscritorio
        ? MAX_WIDTHS.contenido
        : esTablet
            ? 900
            : undefined;

    const gapSecciones = esEscritorio ? 20 : esTablet ? 16 : 0;

    const tamanoTituloPrincipal = esEscritorio ? 34 : esTablet ? 31 : 28;

    // ======================================================
    // CARGAR RESULTADO
    // ======================================================

    useEffect(() => {
        if (!idResultado) {
            setError("No se recibió el identificador del resultado.");

            setCargando(false);

            return;
        }

        cargarResultado();
    }, [idResultado]);

    // ======================================================
    // CARGAR INFORMACIÓN COMPLETA
    // ======================================================

    const cargarResultado = async () => {
        try {
            setCargando(true);

            setError(null);

            // ==================================================
            // 1. RESULTADO PRINCIPAL
            // ==================================================

            const { data: resultadoData, error: resultadoError } = await supabase
                .from("resultado_test")
                .select(
                    `
                    id_resultado,
                    id_ejecucion,
                    puntaje_directo,
                    puntaje_total,
                    nivel_cualitativo,
                    interpretacion_texto,
                    es_valido,
                    observaciones,
                    fecha_generacion,
                    fecha_actualizacion,
                    id_baremo,
                    id_rango_baremo,
                    tipo_finalizacion
                `,
                )
                .eq("id_resultado", idResultado)
                .maybeSingle();

            if (resultadoError) {
                throw resultadoError;
            }

            if (!resultadoData) {
                throw new Error("No se encontró el resultado solicitado.");
            }

            const resultadoPreparado = resultadoData as ResultadoTest;

            setResultado(resultadoPreparado);

            // ==================================================
            // 2. EJECUCIÓN
            // ==================================================

            const { data: ejecucionData, error: ejecucionError } = await supabase
                .from("ejecucion_test")
                .select(
                    `
                    id_ejecucion,
                    id_usuario,
                    id_test,
                    estado,
                    fecha_inicio,
                    fecha_fin,
                    fecha_actualizacion
                `,
                )
                .eq("id_ejecucion", resultadoPreparado.id_ejecucion)
                .maybeSingle();

            if (ejecucionError) {
                throw ejecucionError;
            }

            if (!ejecucionData) {
                throw new Error("No se encontró la ejecución asociada al resultado.");
            }

            const ejecucionPreparada = ejecucionData as EjecucionTest;

            // ==================================================
            // 3. TEST
            // ==================================================

            const { data: testData, error: testError } = await supabase
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
                    fecha_actualizacion
                `,
                )
                .eq("id_test", ejecucionPreparada.id_test)
                .maybeSingle();

            if (testError) {
                throw testError;
            }

            if (!testData) {
                throw new Error("No se encontró la información del cuestionario.");
            }

            setCuestionario(testData as Test);

            // ==================================================
            // 4. BAREMO UTILIZADO
            // ==================================================

            if (resultadoPreparado.id_baremo) {
                const { data: baremoData, error: baremoError } = await supabase
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
                        estado,
                        fecha_creacion,
                        fecha_actualizacion
                    `,
                    )
                    .eq("id_baremo", resultadoPreparado.id_baremo)
                    .maybeSingle();

                if (baremoError) {
                    throw baremoError;
                }

                if (baremoData) {
                    setBaremo(baremoData as BaremoTest);

                    // ==========================================
                    // RANGOS GLOBALES
                    // ==========================================

                    const { data: rangosData, error: rangosError } = await supabase
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
                            estado,
                            fecha_creacion,
                            fecha_actualizacion
                        `,
                        )
                        .eq("id_baremo", resultadoPreparado.id_baremo)
                        .is("id_subescala", null)
                        .eq("estado", true)
                        .order("orden", {
                            ascending: true,
                        });

                    if (rangosError) {
                        throw rangosError;
                    }

                    setRangosGlobales((rangosData ?? []) as RangoBaremo[]);
                }
            }

            // ==================================================
            // 5. RANGO APLICADO
            // ==================================================

            if (resultadoPreparado.id_rango_baremo) {
                const { data: rangoData, error: rangoError } = await supabase
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
                        estado,
                        fecha_creacion,
                        fecha_actualizacion
                    `,
                    )
                    .eq("id_rango", resultadoPreparado.id_rango_baremo)
                    .maybeSingle();

                if (rangoError) {
                    throw rangoError;
                }

                if (rangoData) {
                    setRangoAplicado(rangoData as RangoBaremo);
                }
            }

            // ==================================================
            // 6. RESULTADOS DE SUBESCALAS
            // ==================================================

            const { data: subescalasData, error: subescalasError } = await supabase
                .from("resultado_subescala")
                .select(
                    `
                    id_resultado_subescala,
                    id_resultado,
                    id_subescala,
                    puntaje_directo,
                    puntaje_transformado,
                    nivel_cualitativo,
                    interpretacion_texto,

                    subescala (
                        codigo,
                        nombre,
                        descripcion,
                        orden
                    )
                `,
                )
                .eq("id_resultado", resultadoPreparado.id_resultado);

            if (subescalasError) {
                throw subescalasError;
            }

            const subescalasPreparadas = (subescalasData ??
                []) as unknown as ResultadoSubescala[];

            subescalasPreparadas.sort(
                (a, b) => (a.subescala?.orden ?? 0) - (b.subescala?.orden ?? 0),
            );

            setResultadosSubescalas(subescalasPreparadas);
        } catch (error) {
            console.error("Error cargando resultado:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "No fue posible cargar el resultado.",
            );
        } finally {
            setCargando(false);
        }
    };

    // ======================================================
    // PUNTAJES
    // ======================================================

    const puntajeDirecto = Number(resultado?.puntaje_directo ?? 0);

    const puntajeTotal = Number(
        resultado?.puntaje_total ?? resultado?.puntaje_directo ?? 0,
    );

    // ======================================================
    // RANGO TEÓRICO / VISUAL
    // ======================================================

    const rangoVisual = useMemo(() => {
        if (rangosGlobales.length === 0) {
            return {
                minimo: null as number | null,

                maximo: null as number | null,

                porcentaje: null as number | null,

                tieneRangoNegativo: false,
            };
        }

        const limitesInferiores = rangosGlobales
            .map((rango) => {
                if (rango.valor_minimo === null) {
                    return null;
                }

                const valor = Number(rango.valor_minimo);

                return Number.isNaN(valor) ? null : valor;
            })
            .filter((valor): valor is number => valor !== null);

        const limitesSuperiores = rangosGlobales
            .map((rango) => {
                if (rango.valor_maximo === null) {
                    return null;
                }

                const valor = Number(rango.valor_maximo);

                return Number.isNaN(valor) ? null : valor;
            })
            .filter((valor): valor is number => valor !== null);

        if (limitesInferiores.length === 0 || limitesSuperiores.length === 0) {
            return {
                minimo: null,

                maximo: null,

                porcentaje: null,

                tieneRangoNegativo: false,
            };
        }

        const minimo = Math.min(...limitesInferiores);

        const maximo = Math.max(...limitesSuperiores);

        const tieneRangoNegativo = minimo < 0;

        if (maximo <= minimo) {
            return {
                minimo,

                maximo,

                porcentaje: null,

                tieneRangoNegativo,
            };
        }

        const posicion = (puntajeTotal - minimo) / (maximo - minimo);

        const porcentaje = Math.round(Math.max(0, Math.min(1, posicion)) * 100);

        return {
            minimo,

            maximo,

            porcentaje,

            tieneRangoNegativo,
        };
    }, [rangosGlobales, puntajeTotal]);

    // ======================================================
    // FORMATEAR PUNTAJE
    // ======================================================

    const formatearPuntaje = (valor: number) => {
        if (rangoVisual.tieneRangoNegativo && valor > 0) {
            return `+${valor}`;
        }

        return valor.toString();
    };

    // ======================================================
    // PRESENTACIÓN RESULTADO
    // ======================================================

    const presentacionResultado = useMemo(() => {
        if (resultado?.tipo_finalizacion === "regla_instrumento") {
            return {
                icono: "flag-outline" as const,

                color: warningColor,

                fondo: warningSoftColor,
            };
        }

        if (resultado && !resultado.es_valido) {
            return {
                icono: "warning-outline" as const,

                color: dangerColor,

                fondo: dangerSoftColor,
            };
        }

        return {
            icono: "analytics-outline" as const,

            color: primaryColor,

            fondo: primarySoftColor,
        };
    }, [
        resultado,
        warningColor,
        warningSoftColor,
        dangerColor,
        dangerSoftColor,
        primaryColor,
        primarySoftColor,
    ]);

    // ======================================================
    // TEXTO DE FINALIZACIÓN
    // ======================================================

    const textoTipoFinalizacion =
        resultado?.tipo_finalizacion === "regla_instrumento"
            ? "Aplicación finalizada según una regla establecida por el instrumento."
            : "Aplicación completada normalmente.";

    // ======================================================
    // VOLVER A CUESTIONARIOS
    // ======================================================

    const volverACuestionarios = () => {
        router.replace("/cuestionarios" as any);
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
                        fontFamily: "Nunito-Medium",

                        fontSize: 15,

                        color: textSecondaryColor,

                        marginTop: 12,
                    }}
                >
                    Cargando resultado...
                </Text>
            </View>
        );
    }

    // ======================================================
    // ERROR
    // ======================================================

    if (error || !resultado || !cuestionario) {
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
                            fontFamily: "Nunito-Bold",

                            fontSize: 20,

                            color: textColor,

                            marginTop: 12,

                            textAlign: "center",
                        }}
                    >
                        {error ?? "No fue posible obtener el resultado."}
                    </Text>

                    <Pressable
                        onPress={volverACuestionarios}
                        style={{
                            backgroundColor: primaryColor,

                            paddingHorizontal: 24,

                            paddingVertical: 12,

                            borderRadius: 12,

                            marginTop: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",

                                fontSize: 14,

                                color: textOnPrimaryColor,
                            }}
                        >
                            Volver a cuestionarios
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
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    paddingTop: esEscritorio ? 32 : 18,

                    paddingBottom: 120,
                }}
                showsVerticalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
            >
                {/* ==================================================
                    CONTENEDOR RESPONSIVE
                ================================================== */}

                <View
                    style={{
                        width: "100%",

                        maxWidth: maxWidthContenido,

                        alignSelf: "center",

                        paddingHorizontal,
                    }}
                >
                    {/* ==================================================
                        VOLVER
                    ================================================== */}

                    <Pressable
                        onPress={volverACuestionarios}
                        style={{
                            width: 40,

                            height: 40,

                            alignItems: "center",

                            justifyContent: "center",

                            marginBottom: 8,
                        }}
                    >
                        <Ionicons
                            name="arrow-back-outline"
                            size={25}
                            color={textSecondaryColor}
                        />
                    </Pressable>

                    {/* ==================================================
                        CABECERA
                    ================================================== */}

                    <Text
                        style={{
                            fontFamily: "Nunito-Bold",

                            fontSize: tamanoTituloPrincipal,

                            color: textColor,
                        }}
                    >
                        Tus resultados
                    </Text>

                    <Text
                        style={{
                            fontFamily: "Nunito-Medium",

                            fontSize: 15,

                            lineHeight: 21,

                            color: textSecondaryColor,

                            marginTop: 8,
                        }}
                    >
                        {cuestionario.nombre}
                    </Text>

                    <Text
                        style={{
                            fontFamily: "Nunito-Medium",

                            fontSize: 14,

                            lineHeight: 20,

                            color: textMutedColor,

                            marginTop: 5,

                            marginBottom: 24,

                            maxWidth: esEscritorio ? 760 : undefined,
                        }}
                    >
                        El resultado mostrado corresponde a la evaluación realizada y
                        conserva la interpretación registrada al momento de finalizar el
                        instrumento.
                    </Text>

                    {/* ==================================================
                        RESULTADO PRINCIPAL
                    ================================================== */}

                    <View
                        style={{
                            backgroundColor: surfaceColor,

                            borderRadius: 24,

                            padding: esEscritorio ? 32 : 24,

                            marginBottom: 20,

                            alignItems: "center",

                            borderWidth: 1,

                            borderColor,
                        }}
                    >
                        <View
                            style={{
                                width: esEscritorio ? 144 : 128,

                                height: esEscritorio ? 144 : 128,

                                borderRadius: 999,

                                backgroundColor: primarySoftColor,

                                alignItems: "center",

                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",

                                    fontSize: esEscritorio ? 40 : 36,

                                    color: primaryColor,
                                }}
                            >
                                {formatearPuntaje(puntajeTotal)}
                            </Text>

                            {rangoVisual.minimo !== null && rangoVisual.maximo !== null && (
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Medium",

                                        fontSize: 13,

                                        color: textSecondaryColor,

                                        marginTop: 2,
                                    }}
                                >
                                    {rangoVisual.tieneRangoNegativo
                                        ? `${formatearPuntaje(
                                            rangoVisual.minimo,
                                        )} a ${formatearPuntaje(rangoVisual.maximo)}`
                                        : `de ${rangoVisual.maximo}`}
                                </Text>
                            )}
                        </View>

                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",

                                fontSize: 12,

                                color: textMutedColor,

                                marginTop: 15,

                                textTransform: "uppercase",
                            }}
                        >
                            Puntuación total
                        </Text>

                        {rangoVisual.porcentaje !== null &&
                            rangoVisual.minimo !== null &&
                            rangoVisual.maximo !== null && (
                                <>
                                    <View
                                        style={{
                                            width: "100%",

                                            maxWidth: esEscritorio ? 760 : undefined,

                                            height: 8,

                                            backgroundColor: surfaceSecondaryColor,

                                            borderRadius: 999,

                                            marginTop: 20,

                                            overflow: "hidden",
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: "100%",

                                                width: `${rangoVisual.porcentaje}%`,

                                                backgroundColor: primaryColor,

                                                borderRadius: 999,
                                            }}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            width: "100%",

                                            maxWidth: esEscritorio ? 760 : undefined,

                                            flexDirection: "row",

                                            justifyContent: "space-between",

                                            marginTop: 8,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Medium",

                                                fontSize: 11,

                                                color: textMutedColor,
                                            }}
                                        >
                                            {formatearPuntaje(rangoVisual.minimo)}
                                        </Text>

                                        {rangoVisual.tieneRangoNegativo && (
                                            <Text
                                                style={{
                                                    fontFamily: "Nunito-Medium",

                                                    fontSize: 11,

                                                    color: textMutedColor,
                                                }}
                                            >
                                                0
                                            </Text>
                                        )}

                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Medium",

                                                fontSize: 11,

                                                color: textMutedColor,
                                            }}
                                        >
                                            {formatearPuntaje(rangoVisual.maximo)}
                                        </Text>
                                    </View>

                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Medium",

                                            fontSize: 12,

                                            color: textMutedColor,

                                            marginTop: 7,

                                            textAlign: "center",
                                        }}
                                    >
                                        Posición dentro del rango de la escala:{" "}
                                        {rangoVisual.porcentaje}%
                                    </Text>
                                </>
                            )}

                        {resultado.puntaje_directo !== null &&
                            puntajeDirecto !== puntajeTotal && (
                                <View
                                    style={{
                                        backgroundColor: surfaceSecondaryColor,

                                        borderRadius: 12,

                                        paddingHorizontal: 16,

                                        paddingVertical: 8,

                                        marginTop: 16,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Medium",

                                            fontSize: 12,

                                            color: textSecondaryColor,
                                        }}
                                    >
                                        Puntaje directo: {formatearPuntaje(puntajeDirecto)}
                                    </Text>
                                </View>
                            )}
                    </View>

                    {/* ==================================================
                        INTERPRETACIÓN + ESTADO
                    ================================================== */}

                    <View
                        style={{
                            width: "100%",

                            flexDirection: esTelefono ? "column" : "row",

                            gap: gapSecciones,

                            alignItems: "stretch",
                        }}
                    >
                        {/* INTERPRETACIÓN */}

                        <View
                            style={{
                                flex: esTelefono ? undefined : 1,

                                width: esTelefono ? "100%" : undefined,

                                marginBottom: 20,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,

                                    borderRadius: 24,

                                    padding: 20,

                                    backgroundColor: presentacionResultado.fondo,

                                    borderWidth: 1,

                                    borderColor: presentacionResultado.color,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",

                                        alignItems: "flex-start",
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 48,

                                            height: 48,

                                            borderRadius: 16,

                                            backgroundColor: surfaceColor,

                                            alignItems: "center",

                                            justifyContent: "center",
                                        }}
                                    >
                                        <Ionicons
                                            name={presentacionResultado.icono}
                                            size={27}
                                            color={presentacionResultado.color}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            flex: 1,

                                            marginLeft: 12,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Bold",

                                                fontSize: 18,

                                                lineHeight: 23,

                                                color: textColor,
                                            }}
                                        >
                                            {resultado.nivel_cualitativo ??
                                                rangoAplicado?.nivel ??
                                                "Resultado de la evaluación"}
                                        </Text>

                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Medium",

                                                fontSize: 14,

                                                lineHeight: 21,

                                                color: textSecondaryColor,

                                                marginTop: 9,
                                            }}
                                        >
                                            {resultado.interpretacion_texto ??
                                                rangoAplicado?.interpretacion ??
                                                "El instrumento no tiene una interpretación cualitativa configurada para este resultado."}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* ESTADO */}

                        <View
                            style={{
                                flex: esTelefono ? undefined : 1,

                                width: esTelefono ? "100%" : undefined,

                                marginBottom: 20,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,

                                    backgroundColor: surfaceColor,

                                    borderRadius: 24,

                                    padding: 20,

                                    borderWidth: 1,

                                    borderColor,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",

                                        alignItems: "flex-start",
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 48,

                                            height: 48,

                                            borderRadius: 16,

                                            alignItems: "center",

                                            justifyContent: "center",

                                            backgroundColor:
                                                resultado.tipo_finalizacion === "regla_instrumento"
                                                    ? warningSoftColor
                                                    : successSoftColor,
                                        }}
                                    >
                                        <Ionicons
                                            name={
                                                resultado.tipo_finalizacion === "regla_instrumento"
                                                    ? "flag-outline"
                                                    : "checkmark-circle-outline"
                                            }
                                            size={24}
                                            color={
                                                resultado.tipo_finalizacion === "regla_instrumento"
                                                    ? warningColor
                                                    : successColor
                                            }
                                        />
                                    </View>

                                    <View
                                        style={{
                                            flex: 1,

                                            marginLeft: 12,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Bold",

                                                fontSize: 17,

                                                color: textColor,
                                            }}
                                        >
                                            Estado de la aplicación
                                        </Text>

                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Medium",

                                                fontSize: 14,

                                                lineHeight: 20,

                                                color: textSecondaryColor,

                                                marginTop: 6,
                                            }}
                                        >
                                            {textoTipoFinalizacion}
                                        </Text>

                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Medium",

                                                fontSize: 13,

                                                color: resultado.es_valido ? successColor : dangerColor,

                                                marginTop: 7,
                                            }}
                                        >
                                            {resultado.es_valido
                                                ? "Resultado válido"
                                                : "Resultado marcado como no válido"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* ==================================================
                        SUBESCALAS
                    ================================================== */}

                    {resultadosSubescalas.length > 0 && (
                        <View
                            style={{
                                marginBottom: 24,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",

                                    fontSize: esEscritorio ? 22 : 20,

                                    color: textColor,

                                    marginBottom: 14,
                                }}
                            >
                                Resultados por área
                            </Text>

                            <View
                                style={{
                                    width: "100%",

                                    flexDirection: "row",

                                    flexWrap: "wrap",

                                    gap: 16,
                                }}
                            >
                                {resultadosSubescalas.map((subResultado) => {
                                    const puntajeSubescala = Number(
                                        subResultado.puntaje_transformado ??
                                        subResultado.puntaje_directo ??
                                        0,
                                    );

                                    return (
                                        <View
                                            key={subResultado.id_resultado_subescala}
                                            style={{
                                                width: esTelefono ? "100%" : "48%",

                                                backgroundColor: surfaceColor,

                                                borderRadius: 24,

                                                padding: 20,

                                                borderWidth: 1,

                                                borderColor,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",

                                                    alignItems: "flex-start",

                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontFamily: "Nunito-Bold",

                                                            fontSize: 18,

                                                            color: textColor,
                                                        }}
                                                    >
                                                        {subResultado.subescala?.nombre ?? "Área evaluada"}
                                                    </Text>

                                                    {subResultado.subescala?.descripcion && (
                                                        <Text
                                                            style={{
                                                                fontFamily: "Nunito-Medium",

                                                                fontSize: 13,

                                                                lineHeight: 18,

                                                                color: textMutedColor,

                                                                marginTop: 4,
                                                            }}
                                                        >
                                                            {subResultado.subescala.descripcion}
                                                        </Text>
                                                    )}
                                                </View>

                                                <View
                                                    style={{
                                                        backgroundColor: primarySoftColor,

                                                        borderRadius: 12,

                                                        paddingHorizontal: 12,

                                                        paddingVertical: 8,

                                                        marginLeft: 12,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontFamily: "Nunito-Bold",

                                                            fontSize: 16,

                                                            color: primaryColor,
                                                        }}
                                                    >
                                                        {puntajeSubescala}
                                                    </Text>
                                                </View>
                                            </View>

                                            {subResultado.nivel_cualitativo && (
                                                <Text
                                                    style={{
                                                        fontFamily: "Nunito-Bold",

                                                        fontSize: 14,

                                                        color: textColor,

                                                        marginTop: 12,
                                                    }}
                                                >
                                                    {subResultado.nivel_cualitativo}
                                                </Text>
                                            )}

                                            {subResultado.interpretacion_texto && (
                                                <Text
                                                    style={{
                                                        fontFamily: "Nunito-Medium",

                                                        fontSize: 14,

                                                        lineHeight: 20,

                                                        color: textSecondaryColor,

                                                        marginTop: 7,
                                                    }}
                                                >
                                                    {subResultado.interpretacion_texto}
                                                </Text>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* ==================================================
                        BAREMO + INFORMACIÓN
                    ================================================== */}

                    <View
                        style={{
                            width: "100%",

                            flexDirection: esTelefono ? "column" : "row",

                            gap: gapSecciones,

                            alignItems: "stretch",
                        }}
                    >
                        {/* BAREMO */}

                        {baremo && (
                            <View
                                style={{
                                    flex: esTelefono ? undefined : 1,

                                    width: esTelefono ? "100%" : undefined,

                                    marginBottom: 20,
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,

                                        backgroundColor: surfaceColor,

                                        borderRadius: 24,

                                        padding: 20,

                                        borderWidth: 1,

                                        borderColor,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",

                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 48,

                                                height: 48,

                                                backgroundColor: accentSoftColor,

                                                borderRadius: 16,

                                                alignItems: "center",

                                                justifyContent: "center",
                                            }}
                                        >
                                            <Ionicons
                                                name="analytics-outline"
                                                size={24}
                                                color={accentColor}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                flex: 1,

                                                marginLeft: 12,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: "Nunito-Bold",

                                                    fontSize: 17,

                                                    color: textColor,
                                                }}
                                            >
                                                Baremo utilizado
                                            </Text>

                                            <Text
                                                style={{
                                                    fontFamily: "Nunito-SemiBold",

                                                    fontSize: 14,

                                                    color: textSecondaryColor,

                                                    marginTop: 7,
                                                }}
                                            >
                                                {baremo.nombre}
                                            </Text>

                                            {baremo.version && (
                                                <Text
                                                    style={{
                                                        fontFamily: "Nunito-Medium",

                                                        fontSize: 13,

                                                        color: textSecondaryColor,

                                                        marginTop: 4,
                                                    }}
                                                >
                                                    Versión: {baremo.version}
                                                </Text>
                                            )}

                                            <Text
                                                style={{
                                                    fontFamily: "Nunito-Medium",

                                                    fontSize: 13,

                                                    color: textSecondaryColor,

                                                    marginTop: 4,
                                                }}
                                            >
                                                Valor interpretado: {baremo.tipo_valor}
                                            </Text>

                                            {rangoAplicado && (
                                                <Text
                                                    style={{
                                                        fontFamily: "Nunito-Medium",

                                                        fontSize: 13,

                                                        color: textSecondaryColor,

                                                        marginTop: 4,
                                                    }}
                                                >
                                                    Rango aplicado:{" "}
                                                    {rangoAplicado.valor_minimo === null
                                                        ? "Sin límite inferior"
                                                        : formatearPuntaje(
                                                            Number(rangoAplicado.valor_minimo),
                                                        )}
                                                    {" – "}
                                                    {rangoAplicado.valor_maximo === null
                                                        ? "Sin límite superior"
                                                        : formatearPuntaje(
                                                            Number(rangoAplicado.valor_maximo),
                                                        )}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* INFORMACIÓN */}

                        <View
                            style={{
                                flex: esTelefono ? undefined : 1,

                                width: esTelefono ? "100%" : undefined,

                                marginBottom: 20,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,

                                    backgroundColor: surfaceColor,

                                    borderRadius: 24,

                                    padding: 20,

                                    borderWidth: 1,

                                    borderColor,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",

                                        fontSize: 17,

                                        color: textColor,

                                        marginBottom: 14,
                                    }}
                                >
                                    Información de la evaluación
                                </Text>

                                <View
                                    style={{
                                        flexDirection: "row",

                                        alignItems: "center",

                                        marginBottom: 12,
                                    }}
                                >
                                    <Ionicons
                                        name="document-text-outline"
                                        size={18}
                                        color={textSecondaryColor}
                                    />

                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Medium",

                                            fontSize: 14,

                                            color: textSecondaryColor,

                                            marginLeft: 8,
                                        }}
                                    >
                                        Código: {cuestionario.codigo}
                                    </Text>
                                </View>

                                {cuestionario.version && (
                                    <View
                                        style={{
                                            flexDirection: "row",

                                            alignItems: "center",

                                            marginBottom: 12,
                                        }}
                                    >
                                        <Ionicons
                                            name="layers-outline"
                                            size={18}
                                            color={textSecondaryColor}
                                        />

                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Medium",

                                                fontSize: 14,

                                                color: textSecondaryColor,

                                                marginLeft: 8,
                                            }}
                                        >
                                            Versión: {cuestionario.version}
                                        </Text>
                                    </View>
                                )}

                                <View
                                    style={{
                                        flexDirection: "row",

                                        alignItems: "center",

                                        marginBottom: 12,
                                    }}
                                >
                                    <Ionicons
                                        name={
                                            cuestionario.tipo_aplicacion === "profesional"
                                                ? "medkit-outline"
                                                : "person-outline"
                                        }
                                        size={18}
                                        color={textSecondaryColor}
                                    />

                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Medium",

                                            fontSize: 14,

                                            color: textSecondaryColor,

                                            marginLeft: 8,
                                        }}
                                    >
                                        Aplicación:{" "}
                                        {cuestionario.tipo_aplicacion === "profesional"
                                            ? "Profesional"
                                            : "Autoadministrada"}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "row",

                                        alignItems: "center",
                                    }}
                                >
                                    <Ionicons
                                        name="calendar-outline"
                                        size={18}
                                        color={textSecondaryColor}
                                    />

                                    <Text
                                        style={{
                                            flex: 1,

                                            fontFamily: "Nunito-Medium",

                                            fontSize: 14,

                                            color: textSecondaryColor,

                                            marginLeft: 8,
                                        }}
                                    >
                                        Resultado generado:{" "}
                                        {new Date(resultado.fecha_generacion).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* ==================================================
                        OBSERVACIONES
                    ================================================== */}

                    {resultado.observaciones && (
                        <View
                            style={{
                                backgroundColor: warningSoftColor,

                                borderRadius: 24,

                                padding: 20,

                                marginBottom: 20,

                                borderWidth: 1,

                                borderColor: warningColor,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",

                                    alignItems: "flex-start",
                                }}
                            >
                                <Ionicons
                                    name="reader-outline"
                                    size={24}
                                    color={warningColor}
                                />

                                <View
                                    style={{
                                        flex: 1,

                                        marginLeft: 12,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",

                                            fontSize: 16,

                                            color: textColor,
                                        }}
                                    >
                                        Observaciones
                                    </Text>

                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Medium",

                                            fontSize: 14,

                                            lineHeight: 20,

                                            color: textSecondaryColor,

                                            marginTop: 7,
                                        }}
                                    >
                                        {resultado.observaciones}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* ==================================================
                        REPORTE + AVISO
                    ================================================== */}

                    <View
                        style={{
                            width: "100%",

                            flexDirection: esTelefono ? "column" : "row",

                            gap: gapSecciones,

                            alignItems: "stretch",
                        }}
                    >
                        {/* REPORTE */}

                        <View
                            style={{
                                flex: esTelefono ? undefined : 1,

                                width: esTelefono ? "100%" : undefined,

                                marginBottom: 20,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,

                                    backgroundColor: primaryColor,

                                    borderRadius: 24,

                                    padding: 20,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",

                                        alignItems: "center",

                                        marginBottom: 12,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 44,

                                            height: 44,

                                            backgroundColor: "rgba(255,255,255,0.20)",

                                            borderRadius: 12,

                                            alignItems: "center",

                                            justifyContent: "center",
                                        }}
                                    >
                                        <Ionicons
                                            name="document-text-outline"
                                            size={24}
                                            color={textOnPrimaryColor}
                                        />
                                    </View>

                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",

                                            fontSize: 20,

                                            color: textOnPrimaryColor,

                                            marginLeft: 12,
                                        }}
                                    >
                                        Compartir reporte
                                    </Text>
                                </View>

                                <Text
                                    style={{
                                        fontFamily: "Nunito-Medium",

                                        fontSize: 14,

                                        lineHeight: 20,

                                        color: isDarkMode ? "#E2ECFF" : "#DBEAFE",
                                    }}
                                >
                                    Próximamente podrás generar un informe detallado con los datos
                                    de esta evaluación para conservarlo o compartirlo con un
                                    profesional autorizado.
                                </Text>

                                <Pressable
                                    disabled
                                    style={{
                                        backgroundColor: isDarkMode
                                            ? "rgba(255,255,255,0.16)"
                                            : "rgba(255,255,255,0.70)",

                                        borderRadius: 12,

                                        paddingVertical: 12,

                                        marginTop: 20,

                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-SemiBold",

                                            fontSize: 14,

                                            color: isDarkMode ? "#E2E8F0" : "#64748B",
                                        }}
                                    >
                                        Exportar a PDF
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* AVISO */}

                        <View
                            style={{
                                flex: esTelefono ? undefined : 1,

                                width: esTelefono ? "100%" : undefined,

                                marginBottom: 20,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,

                                    backgroundColor: infoSoftColor,

                                    borderRadius: 24,

                                    padding: 20,

                                    flexDirection: "row",

                                    alignItems: "flex-start",

                                    borderWidth: 1,

                                    borderColor: primaryColor,
                                }}
                            >
                                <Ionicons
                                    name="information-circle-outline"
                                    size={28}
                                    color={primaryColor}
                                />

                                <View
                                    style={{
                                        flex: 1,

                                        marginLeft: 12,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Bold",

                                            fontSize: 15,

                                            color: textColor,
                                        }}
                                    >
                                        AVISO IMPORTANTE
                                    </Text>

                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Medium",

                                            fontSize: 14,

                                            lineHeight: 20,

                                            color: infoTextColor,

                                            marginTop: 7,
                                        }}
                                    >
                                        Los resultados deben interpretarse según las características
                                        y criterios del instrumento aplicado. La puntuación obtenida
                                        no constituye por sí sola un diagnóstico médico o
                                        psicológico y no sustituye una valoración profesional cuando
                                        esta sea necesaria.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* ==================================================
                        VOLVER
                    ================================================== */}

                    <Pressable
                        onPress={volverACuestionarios}
                        style={{
                            width: "100%",

                            maxWidth: esEscritorio ? 480 : undefined,

                            alignSelf: "center",

                            backgroundColor: primaryColor,

                            borderRadius: 12,

                            paddingVertical: 16,

                            marginTop: 4,

                            flexDirection: "row",

                            alignItems: "center",

                            justifyContent: "center",
                        }}
                    >
                        <Ionicons
                            name="document-text-outline"
                            size={18}
                            color={textOnPrimaryColor}
                        />

                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",

                                fontSize: 15,

                                color: textOnPrimaryColor,

                                marginLeft: 7,
                            }}
                        >
                            Volver a cuestionarios
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}
