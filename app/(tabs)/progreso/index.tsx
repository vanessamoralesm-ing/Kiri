import React from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useProgresoHome } from "@/hooks/useProgresoHome";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useResumenBienestar } from "@/hooks/useResumenBienestar";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function ProgresoScreen() {
    const router = useRouter();

    const insets = useSafeAreaInsets();

    const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

    // ========================================================
    // DATOS
    // ========================================================

    const { resumen } = useResumenBienestar();

    const {
        cargando,

        rachaActual,

        actividadHoy,

        diasSemana,

        totalRegistros,

        totalCuestionarios,

        totalActividades,
    } = useProgresoHome();

    const totalActividadesPlan = resumen?.actividades?.length ?? 0;

    // ========================================================
    // TEMA
    // ========================================================

    const backgroundColor = useThemeColor({}, "background");

    const surfaceColor = useThemeColor({}, "surface");

    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const textMutedColor = useThemeColor({}, "textMuted");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const secondaryColor = useThemeColor({}, "secondary");

    const secondarySoftColor = useThemeColor({}, "secondarySoft");

    const accentColor = useThemeColor({}, "accent");

    const accentSoftColor = useThemeColor({}, "accentSoft");

    const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

    // ========================================================
    // RESPONSIVE
    // ========================================================

    const paddingHorizontal = esEscritorio
        ? PADDING_RESPONSIVE.escritorio
        : esTablet
            ? PADDING_RESPONSIVE.tablet
            : PADDING_RESPONSIVE.telefono;

    const maxWidthContenido = esEscritorio ? 1100 : MAX_WIDTHS.contenido;

    const paddingBottom = esEscritorio ? 64 : Math.max(insets.bottom + 130, 150);

    // ========================================================
    // UI
    // ========================================================

    return (
        <View
            style={{
                flex: 1,
                backgroundColor,
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: esEscritorio ? 30 : 20,

                    paddingBottom,
                }}
            >
                <View
                    style={{
                        width: "100%",

                        maxWidth: maxWidthContenido,

                        alignSelf: "center",

                        paddingHorizontal,
                    }}
                >
                    {/* ==================================================
              HEADER
          ================================================== */}

                    <View
                        style={{
                            flexDirection: "row",

                            alignItems: "center",

                            marginBottom: esEscritorio ? 30 : 24,
                        }}
                    >
                        <Pressable
                            onPress={() => router.back()}
                            hitSlop={8}
                            style={({ pressed }) => ({
                                width: 46,
                                height: 46,

                                borderRadius: 15,

                                borderWidth: 1,

                                borderColor,

                                alignItems: "center",

                                justifyContent: "center",

                                backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,
                            })}
                        >
                            <Ionicons name="arrow-back" size={21} color={textColor} />
                        </Pressable>

                        <View
                            style={{
                                flex: 1,

                                marginLeft: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",

                                    fontSize: esEscritorio ? 30 : 25,

                                    color: textColor,
                                }}
                            >
                                Mi progreso
                            </Text>

                            <Text
                                style={{
                                    marginTop: 3,

                                    fontFamily: "Nunito-Medium",

                                    fontSize: 14,

                                    color: textSecondaryColor,
                                }}
                            >
                                Revisa tu constancia y actividad dentro de Kiri.
                            </Text>
                        </View>
                    </View>

                    {/* ==================================================
              CARGANDO
          ================================================== */}

                    {cargando ? (
                        <View
                            style={{
                                minHeight: 360,

                                alignItems: "center",

                                justifyContent: "center",
                            }}
                        >
                            <ActivityIndicator size="large" color={primaryColor} />

                            <Text
                                style={{
                                    marginTop: 14,

                                    fontFamily: "Nunito-Medium",

                                    fontSize: 14,

                                    color: textMutedColor,
                                }}
                            >
                                Preparando tu progreso...
                            </Text>
                        </View>
                    ) : (
                        <>
                            {/* ==================================================
                  RACHA
              ================================================== */}

                            <View
                                style={{
                                    width: "100%",

                                    padding: esEscritorio ? 28 : 22,

                                    borderRadius: 26,

                                    marginBottom: 20,

                                    backgroundColor: primaryColor,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: esEscritorio ? "row" : "column",

                                        alignItems: esEscritorio ? "center" : "stretch",

                                        justifyContent: "space-between",

                                        gap: 24,
                                    }}
                                >
                                    {/* ==========================================
                      RACHA ACTUAL
                  ========================================== */}

                                    <View>
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-SemiBold",

                                                fontSize: 13,

                                                color: "#EAF2FF",
                                            }}
                                        >
                                            Racha emocional actual
                                        </Text>

                                        <View
                                            style={{
                                                marginTop: 8,

                                                flexDirection: "row",

                                                alignItems: "center",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 54,
                                                    height: 54,

                                                    borderRadius: 27,

                                                    alignItems: "center",

                                                    justifyContent: "center",

                                                    backgroundColor: "rgba(255,255,255,0.16)",
                                                }}
                                            >
                                                <Ionicons
                                                    name={actividadHoy ? "flame" : "flame-outline"}
                                                    size={29}
                                                    color={textOnPrimaryColor}
                                                />
                                            </View>

                                            <Text
                                                style={{
                                                    marginLeft: 14,

                                                    fontFamily: "Nunito-Bold",

                                                    fontSize: esEscritorio ? 44 : 38,

                                                    color: textOnPrimaryColor,
                                                }}
                                            >
                                                {rachaActual}
                                            </Text>

                                            <Text
                                                style={{
                                                    marginLeft: 7,

                                                    fontFamily: "Nunito-Medium",

                                                    fontSize: 15,

                                                    color: textOnPrimaryColor,
                                                }}
                                            >
                                                {rachaActual === 1 ? "día" : "días"}
                                            </Text>
                                        </View>

                                        <Text
                                            style={{
                                                marginTop: 12,

                                                maxWidth: 390,

                                                fontFamily: "Nunito-Medium",

                                                fontSize: 13,

                                                lineHeight: 19,

                                                color: "#EAF2FF",
                                            }}
                                        >
                                            {actividadHoy
                                                ? "Ya realizaste al menos una actividad hoy. ¡Sigue así!"
                                                : rachaActual > 0
                                                    ? "Realiza una actividad hoy para mantener tu racha."
                                                    : "Completa una actividad para comenzar una nueva racha."}
                                        </Text>
                                    </View>

                                    {/* ==========================================
                      ÚLTIMOS 7 DÍAS
                  ========================================== */}

                                    <View>
                                        <Text
                                            style={{
                                                marginBottom: 12,

                                                fontFamily: "Nunito-SemiBold",

                                                fontSize: 13,

                                                color: "#EAF2FF",
                                            }}
                                        >
                                            Últimos 7 días
                                        </Text>

                                        <View
                                            style={{
                                                flexDirection: "row",

                                                flexWrap: "wrap",

                                                gap: 8,
                                            }}
                                        >
                                            {diasSemana.map((dia) => (
                                                <View
                                                    key={dia.fecha}
                                                    style={{
                                                        alignItems: "center",

                                                        gap: 5,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            width: esTelefono ? 36 : 42,

                                                            height: esTelefono ? 36 : 42,

                                                            borderRadius: 999,

                                                            alignItems: "center",

                                                            justifyContent: "center",

                                                            borderWidth: dia.esHoy ? 2 : 0,

                                                            borderColor: "#FFFFFF",

                                                            backgroundColor: dia.completado
                                                                ? secondaryColor
                                                                : "rgba(255,255,255,0.18)",
                                                        }}
                                                    >
                                                        {dia.completado ? (
                                                            <Ionicons
                                                                name="checkmark"
                                                                size={18}
                                                                color="#FFFFFF"
                                                            />
                                                        ) : (
                                                            <Text
                                                                style={{
                                                                    fontFamily: "Nunito-Bold",

                                                                    fontSize: 12,

                                                                    color: "#FFFFFF",
                                                                }}
                                                            >
                                                                {dia.etiqueta}
                                                            </Text>
                                                        )}
                                                    </View>

                                                    <Text
                                                        style={{
                                                            fontFamily: "Nunito-Medium",

                                                            fontSize: 10,

                                                            color: "#EAF2FF",
                                                        }}
                                                    >
                                                        {dia.etiqueta}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* ==================================================
                  TÍTULO MÉTRICAS
              ================================================== */}

                            <View
                                style={{
                                    marginTop: 8,

                                    marginBottom: 14,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",

                                        fontSize: esEscritorio ? 21 : 19,

                                        color: textColor,
                                    }}
                                >
                                    Tu actividad
                                </Text>

                                <Text
                                    style={{
                                        marginTop: 3,

                                        fontFamily: "Nunito-Medium",

                                        fontSize: 13,

                                        color: textSecondaryColor,
                                    }}
                                >
                                    Un resumen de las actividades que has realizado.
                                </Text>
                            </View>

                            {/* ==================================================
                  MÉTRICAS
              ================================================== */}

                            <View
                                style={{
                                    width: "100%",

                                    flexDirection: esEscritorio
                                        ? "row"
                                        : esTablet
                                            ? "row"
                                            : "column",

                                    flexWrap: esTablet ? "wrap" : "nowrap",

                                    gap: 16,

                                    marginBottom: 26,
                                }}
                            >
                                {/* ==========================================
                    TOTAL ACTIVIDADES
                ========================================== */}

                                <TarjetaMetrica
                                    titulo="Actividades"
                                    valor={totalActividades}
                                    descripcion="Actividades registradas que actualmente cuentan para tu progreso."
                                    icono="checkmark-circle-outline"
                                    colorIcono={secondaryColor}
                                    fondoIcono={secondarySoftColor}
                                    esEscritorio={esEscritorio}
                                    esTablet={esTablet}
                                />

                                {/* ==========================================
                    AUTORREGISTROS
                ========================================== */}

                                <TarjetaMetrica
                                    titulo="Autorregistros"
                                    valor={totalRegistros}
                                    descripcion="Entradas que has realizado en tu módulo de autorregistro."
                                    icono="book-outline"
                                    colorIcono={primaryColor}
                                    fondoIcono={primarySoftColor}
                                    esEscritorio={esEscritorio}
                                    esTablet={esTablet}
                                />

                                {/* ==========================================
                    CUESTIONARIOS
                ========================================== */}

                                <TarjetaMetrica
                                    titulo="Cuestionarios"
                                    valor={totalCuestionarios}
                                    descripcion="Cuestionarios que has completado correctamente."
                                    icono="document-text-outline"
                                    colorIcono={accentColor}
                                    fondoIcono={accentSoftColor}
                                    esEscritorio={esEscritorio}
                                    esTablet={esTablet}
                                />
                            </View>

                            {/* ==================================================
                  PLAN DE BIENESTAR
              ================================================== */}

                            <View
                                style={{
                                    width: "100%",

                                    padding: esEscritorio ? 24 : 20,

                                    borderRadius: 24,

                                    borderWidth: 1,

                                    borderColor,

                                    backgroundColor: surfaceColor,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: esEscritorio ? "row" : "column",

                                        alignItems: esEscritorio ? "center" : "stretch",

                                        gap: 18,
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,

                                            flexDirection: "row",

                                            alignItems: "center",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 52,
                                                height: 52,

                                                borderRadius: 16,

                                                alignItems: "center",

                                                justifyContent: "center",

                                                backgroundColor: primarySoftColor,
                                            }}
                                        >
                                            <Ionicons
                                                name="sparkles-outline"
                                                size={25}
                                                color={primaryColor}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                flex: 1,

                                                marginLeft: 15,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: "Nunito-Bold",

                                                    fontSize: 17,

                                                    color: textColor,
                                                }}
                                            >
                                                Plan de bienestar
                                            </Text>

                                            <Text
                                                style={{
                                                    marginTop: 4,

                                                    fontFamily: "Nunito-Medium",

                                                    fontSize: 13,

                                                    lineHeight: 19,

                                                    color: textSecondaryColor,
                                                }}
                                            >
                                                {totalActividadesPlan === 0
                                                    ? "Todavía no tienes actividades recomendadas en tu plan."
                                                    : `Actualmente tienes ${totalActividadesPlan} ${totalActividadesPlan === 1
                                                        ? "actividad recomendada"
                                                        : "actividades recomendadas"
                                                    } en tu plan.`}
                                            </Text>
                                        </View>
                                    </View>

                                    {resumen?.id_entrevista && (
                                        <Pressable
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/(tabs)/entrevistas/[id]/plan",

                                                    params: {
                                                        id: resumen.id_entrevista,
                                                    },
                                                })
                                            }
                                            style={({ pressed }) => ({
                                                minHeight: 44,

                                                paddingHorizontal: 18,

                                                borderRadius: 13,

                                                flexDirection: "row",

                                                alignItems: "center",

                                                justifyContent: "center",

                                                gap: 7,

                                                backgroundColor: pressed
                                                    ? surfaceSecondaryColor
                                                    : primarySoftColor,
                                            })}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: "Nunito-SemiBold",

                                                    fontSize: 13,

                                                    color: primaryColor,
                                                }}
                                            >
                                                Ver mi plan
                                            </Text>

                                            <Ionicons
                                                name="arrow-forward"
                                                size={17}
                                                color={primaryColor}
                                            />
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

// ==========================================================
// TARJETA MÉTRICA
// ==========================================================

type TarjetaMetricaProps = {
    titulo: string;

    valor: number;

    descripcion: string;

    icono: keyof typeof Ionicons.glyphMap;

    colorIcono: string;

    fondoIcono: string;

    esEscritorio: boolean;

    esTablet: boolean;
};

function TarjetaMetrica({
    titulo,
    valor,
    descripcion,
    icono,
    colorIcono,
    fondoIcono,
    esEscritorio,
    esTablet,
}: TarjetaMetricaProps) {
    const surfaceColor = useThemeColor({}, "surface");

    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    return (
        <View
            style={{
                flex: esEscritorio ? 1 : undefined,

                width: esEscritorio ? undefined : esTablet ? "48%" : "100%",

                minWidth: 0,

                minHeight: 190,

                padding: 22,

                borderRadius: 22,

                borderWidth: 1,

                borderColor,

                backgroundColor: surfaceColor,
            }}
        >
            <View
                style={{
                    width: 48,
                    height: 48,

                    borderRadius: 15,

                    alignItems: "center",

                    justifyContent: "center",

                    backgroundColor: fondoIcono,
                }}
            >
                <Ionicons name={icono} size={24} color={colorIcono} />
            </View>

            <Text
                style={{
                    marginTop: 18,

                    fontFamily: "Nunito-Bold",

                    fontSize: 34,

                    color: textColor,
                }}
            >
                {valor}
            </Text>

            <Text
                style={{
                    marginTop: 2,

                    fontFamily: "Nunito-Bold",

                    fontSize: 15,

                    color: textColor,
                }}
            >
                {titulo}
            </Text>

            <Text
                style={{
                    marginTop: 6,

                    fontFamily: "Nunito-Medium",

                    fontSize: 12,

                    lineHeight: 18,

                    color: textSecondaryColor,
                }}
            >
                {descripcion}
            </Text>
        </View>
    );
}
