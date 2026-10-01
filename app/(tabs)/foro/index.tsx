import React, { useCallback, useMemo, useRef, useState } from "react";

import {
    ActivityIndicator,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";

import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect, useRouter } from "expo-router";

import FiltroEmociones from "@/components/foro/FiltroEmociones";
import PreguntaSemana from "@/components/foro/PreguntaSemana";
import PublicacionCard from "@/components/foro/PublicacionCard";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useAuth } from "@/services/authProvider";

import { obtenerPublicaciones } from "@/services/foro/foroService";

import type { PublicacionForo } from "@/types/foro";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function ForoScreen() {
    const router = useRouter();

    const insets = useSafeAreaInsets();

    const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

    const { profile, loading: authLoading } = useAuth();

    // ========================================================
    // REFERENCIAS
    // ========================================================

    const primeraCargaRef = useRef(true);

    const cargaEnCursoRef = useRef(false);

    // ========================================================
    // ESTADOS
    // ========================================================

    const [publicaciones, setPublicaciones] = useState<PublicacionForo[]>([]);

    const [cargando, setCargando] = useState(true);

    const [refrescando, setRefrescando] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [filtroActivo, setFiltroActivo] = useState("Todo");

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

    const accentColor = useThemeColor({}, "accent");

    const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

    // ========================================================
    // RESPONSIVE
    // ========================================================

    const paddingHorizontal = esEscritorio
        ? PADDING_RESPONSIVE.escritorio
        : esTablet
            ? PADDING_RESPONSIVE.tablet
            : PADDING_RESPONSIVE.telefono;

    const maxWidthContenido = esEscritorio
        ? MAX_WIDTHS.dashboard
        : esTablet
            ? MAX_WIDTHS.contenido
            : undefined;

    /*
     * El feed no ocupa todo el dashboard en escritorio.
     * Esto evita líneas de texto demasiado largas.
     */
    const maxWidthFeed = esEscritorio ? 900 : esTablet ? 760 : undefined;

    const paddingTop = esEscritorio ? 28 : esTablet ? 24 : 20;

    /*
     * En escritorio no existe la barra inferior,
     * así que el FAB puede quedar más cerca del borde.
     */
    const posicionBoton = esEscritorio ? 32 : Math.max(insets.bottom + 72, 92);

    const espacioInferiorScroll = esEscritorio
        ? 130
        : Math.max(posicionBoton + 120, 220);

    const tamanioFab = esEscritorio ? 64 : esTablet ? 70 : 68;

    // ========================================================
    // CARGAR PUBLICACIONES
    // ========================================================

    const cargarPublicaciones = useCallback(
        async (mostrarCargaPrincipal = false) => {
            if (cargaEnCursoRef.current) {
                return;
            }

            cargaEnCursoRef.current = true;

            try {
                if (mostrarCargaPrincipal) {
                    setCargando(true);
                }

                setError(null);

                const data = await obtenerPublicaciones(profile?.id_usuario);

                setPublicaciones(data);
            } catch (e) {
                console.error("Error cargando publicaciones del foro:", e);

                setError(
                    e instanceof Error
                        ? e.message
                        : "No se pudieron cargar las publicaciones.",
                );
            } finally {
                cargaEnCursoRef.current = false;

                if (mostrarCargaPrincipal) {
                    setCargando(false);
                }
            }
        },
        [profile?.id_usuario],
    );

    // ========================================================
    // RECARGAR AL ENTRAR / VOLVER
    // ========================================================

    useFocusEffect(
        useCallback(() => {
            if (authLoading) {
                return;
            }

            const mostrarCargaPrincipal = primeraCargaRef.current;

            primeraCargaRef.current = false;

            cargarPublicaciones(mostrarCargaPrincipal);
        }, [authLoading, cargarPublicaciones]),
    );

    // ========================================================
    // PULL TO REFRESH
    // ========================================================

    const refrescar = useCallback(async () => {
        if (authLoading || refrescando || cargaEnCursoRef.current) {
            return;
        }

        try {
            setRefrescando(true);

            await cargarPublicaciones(false);
        } finally {
            setRefrescando(false);
        }
    }, [authLoading, refrescando, cargarPublicaciones]);

    // ========================================================
    // FILTRADO
    // ========================================================

    const publicacionesFiltradas = useMemo(() => {
        if (filtroActivo === "Todo") {
            return publicaciones;
        }

        return publicaciones.filter((publicacion) =>
            publicacion.emociones?.some((emocion) => emocion.nombre === filtroActivo),
        );
    }, [filtroActivo, publicaciones]);

    // ========================================================
    // CARGANDO
    // ========================================================

    if (authLoading || cargando) {
        return (
            <SafeAreaView
                edges={[]}
                style={{
                    flex: 1,

                    backgroundColor,
                }}
            >
                <View
                    style={{
                        flex: 1,

                        alignItems: "center",

                        justifyContent: "center",

                        paddingHorizontal: paddingHorizontal,
                    }}
                >
                    <View
                        style={{
                            width: 72,

                            height: 72,

                            borderRadius: 36,

                            alignItems: "center",

                            justifyContent: "center",

                            backgroundColor: surfaceColor,

                            borderWidth: 1,

                            borderColor,
                        }}
                    >
                        <ActivityIndicator size="large" color={primaryColor} />
                    </View>

                    <Text
                        style={{
                            marginTop: 18,

                            fontFamily: "Nunito-Bold",

                            fontSize: 18,

                            color: textColor,
                        }}
                    >
                        Cargando comunidad
                    </Text>

                    <Text
                        style={{
                            marginTop: 7,

                            maxWidth: 320,

                            textAlign: "center",

                            fontFamily: "Nunito-Medium",

                            fontSize: 14,

                            lineHeight: 20,

                            color: textSecondaryColor,
                        }}
                    >
                        Estamos preparando las publicaciones del foro.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ========================================================
    // UI
    // ========================================================

    return (
        <SafeAreaView
            edges={[]}
            style={{
                flex: 1,

                backgroundColor,
            }}
        >
            <View
                style={{
                    flex: 1,

                    backgroundColor,
                }}
            >
                {/* ==================================================
            CONTENIDO
        ================================================== */}

                <ScrollView
                    style={{
                        flex: 1,

                        backgroundColor,
                    }}
                    contentContainerStyle={{
                        paddingTop,

                        paddingBottom: espacioInferiorScroll,

                        flexGrow: 1,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            refreshing={refrescando}
                            onRefresh={refrescar}
                            tintColor={primaryColor}
                            colors={[primaryColor]}
                        />
                    }
                >
                    {/* ==================================================
              CONTENEDOR GENERAL
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
                CABECERA DESKTOP
            ================================================== */}

                        {esEscritorio && (
                            <View
                                style={{
                                    width: "100%",

                                    maxWidth: maxWidthFeed,

                                    alignSelf: "center",

                                    marginBottom: 22,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",

                                        fontSize: 30,

                                        color: textColor,
                                    }}
                                >
                                    Foro comunitario
                                </Text>

                                <Text
                                    style={{
                                        marginTop: 4,

                                        fontFamily: "Nunito-Medium",

                                        fontSize: 15,

                                        lineHeight: 21,

                                        color: textSecondaryColor,
                                    }}
                                >
                                    Comparte experiencias y conecta con otras personas de la
                                    comunidad.
                                </Text>
                            </View>
                        )}

                        {/* ==================================================
                FEED
            ================================================== */}

                        <View
                            style={{
                                width: "100%",

                                maxWidth: maxWidthFeed,

                                alignSelf: "center",
                            }}
                        >
                            {/* ==============================================
                  PREGUNTA DE LA SEMANA
              ============================================== */}

                            <PreguntaSemana />

                            {/* ==============================================
                  ENCABEZADO
              ============================================== */}

                            <Text
                                style={{
                                    marginTop: esEscritorio ? 34 : 30,

                                    marginBottom: 18,

                                    fontFamily: "Nunito-Bold",

                                    fontSize: esEscritorio ? 22 : 21,

                                    color: textColor,
                                }}
                            >
                                Lo que otros comparten
                            </Text>

                            {/* ==============================================
                  FILTROS
              ============================================== */}

                            <FiltroEmociones
                                seleccionada={filtroActivo}
                                onSeleccionar={setFiltroActivo}
                            />

                            {/* ==============================================
                  ERROR
              ============================================== */}

                            {error && (
                                <View
                                    style={{
                                        marginTop: 22,

                                        paddingHorizontal: 16,

                                        paddingVertical: 14,

                                        borderRadius: 16,

                                        borderWidth: 1,

                                        borderColor,

                                        backgroundColor: surfaceColor,

                                        flexDirection: "row",

                                        alignItems: "center",
                                    }}
                                >
                                    <Ionicons
                                        name="alert-circle-outline"
                                        size={22}
                                        color={accentColor}
                                    />

                                    <Text
                                        style={{
                                            flex: 1,

                                            marginLeft: 10,

                                            fontFamily: "Nunito-Medium",

                                            fontSize: 14,

                                            lineHeight: 20,

                                            color: textSecondaryColor,
                                        }}
                                    >
                                        {error}
                                    </Text>

                                    <Pressable
                                        hitSlop={8}
                                        onPress={() => cargarPublicaciones(false)}
                                        style={({ pressed }) => ({
                                            width: 38,

                                            height: 38,

                                            borderRadius: 12,

                                            alignItems: "center",

                                            justifyContent: "center",

                                            backgroundColor: pressed
                                                ? primarySoftColor
                                                : "transparent",
                                        })}
                                    >
                                        <Ionicons
                                            name="refresh-outline"
                                            size={22}
                                            color={primaryColor}
                                        />
                                    </Pressable>
                                </View>
                            )}

                            {/* ==============================================
                  CONTADOR
              ============================================== */}

                            <View
                                style={{
                                    marginTop: 26,

                                    marginBottom: 20,

                                    flexDirection: "row",

                                    alignItems: "center",

                                    justifyContent: "space-between",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",

                                        alignItems: "center",
                                    }}
                                >
                                    {/* AVATARES DECORATIVOS */}

                                    <View
                                        style={{
                                            marginRight: 12,

                                            flexDirection: "row",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 32,

                                                height: 32,

                                                borderRadius: 16,

                                                borderWidth: 1,

                                                borderColor: primaryColor,

                                                alignItems: "center",

                                                justifyContent: "center",

                                                backgroundColor: primarySoftColor,
                                            }}
                                        >
                                            <Ionicons
                                                name="person-outline"
                                                size={15}
                                                color={primaryColor}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                width: 32,

                                                height: 32,

                                                borderRadius: 16,

                                                marginLeft: -7,

                                                borderWidth: 1,

                                                borderColor: primaryColor,

                                                alignItems: "center",

                                                justifyContent: "center",

                                                backgroundColor: surfaceColor,
                                            }}
                                        >
                                            <Ionicons
                                                name="person-outline"
                                                size={15}
                                                color={primaryColor}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                width: 32,

                                                height: 32,

                                                borderRadius: 16,

                                                marginLeft: -7,

                                                borderWidth: 1,

                                                borderColor: primaryColor,

                                                alignItems: "center",

                                                justifyContent: "center",

                                                backgroundColor: surfaceSecondaryColor,
                                            }}
                                        >
                                            <Ionicons
                                                name="person-outline"
                                                size={15}
                                                color={primaryColor}
                                            />
                                        </View>
                                    </View>

                                    <Text
                                        style={{
                                            fontFamily: "Nunito-Medium",

                                            fontSize: 14,

                                            color: textSecondaryColor,
                                        }}
                                    >
                                        {publicacionesFiltradas.length}{" "}
                                        {publicacionesFiltradas.length === 1
                                            ? "publicación"
                                            : "publicaciones"}
                                    </Text>
                                </View>

                                {filtroActivo !== "Todo" && (
                                    <Pressable
                                        onPress={() => setFiltroActivo("Todo")}
                                        style={({ pressed }) => ({
                                            paddingHorizontal: 10,

                                            paddingVertical: 7,

                                            borderRadius: 10,

                                            backgroundColor: pressed
                                                ? primarySoftColor
                                                : "transparent",
                                        })}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-SemiBold",

                                                fontSize: 12,

                                                color: primaryColor,
                                            }}
                                        >
                                            Limpiar filtro
                                        </Text>
                                    </Pressable>
                                )}
                            </View>

                            {/* ==============================================
                  PUBLICACIONES
              ============================================== */}

                            {publicacionesFiltradas.length > 0 ? (
                                <View
                                    style={{
                                        width: "100%",

                                        gap: esEscritorio ? 16 : 14,
                                    }}
                                >
                                    {publicacionesFiltradas.map((publicacion) => (
                                        <PublicacionCard
                                            key={publicacion.id_publicacion}
                                            publicacion={publicacion}
                                        />
                                    ))}
                                </View>
                            ) : (
                                <View
                                    style={{
                                        width: "100%",

                                        minHeight: esEscritorio ? 260 : 220,

                                        paddingVertical: 40,

                                        paddingHorizontal: 24,

                                        borderRadius: 22,

                                        borderWidth: 1,

                                        borderColor,

                                        alignItems: "center",

                                        justifyContent: "center",

                                        backgroundColor: surfaceColor,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 64,

                                            height: 64,

                                            borderRadius: 32,

                                            alignItems: "center",

                                            justifyContent: "center",

                                            backgroundColor: primarySoftColor,
                                        }}
                                    >
                                        <Ionicons
                                            name={
                                                filtroActivo === "Todo"
                                                    ? "chatbubbles-outline"
                                                    : "filter-outline"
                                            }
                                            size={30}
                                            color={primaryColor}
                                        />
                                    </View>

                                    <Text
                                        style={{
                                            marginTop: 15,

                                            maxWidth: 360,

                                            textAlign: "center",

                                            fontFamily: "Nunito-Bold",

                                            fontSize: 17,

                                            color: textColor,
                                        }}
                                    >
                                        {filtroActivo === "Todo"
                                            ? "Todavía no hay publicaciones"
                                            : "No hay publicaciones con esta emoción"}
                                    </Text>

                                    <Text
                                        style={{
                                            marginTop: 7,

                                            maxWidth: 390,

                                            textAlign: "center",

                                            fontFamily: "Nunito-Medium",

                                            fontSize: 14,

                                            lineHeight: 21,

                                            color: textSecondaryColor,
                                        }}
                                    >
                                        {filtroActivo === "Todo"
                                            ? "Puedes ser la primera persona en compartir algo con la comunidad."
                                            : "Prueba seleccionando otra emoción o vuelve a mostrar todas las publicaciones."}
                                    </Text>

                                    {filtroActivo !== "Todo" && (
                                        <Pressable
                                            onPress={() => setFiltroActivo("Todo")}
                                            style={({ pressed }) => ({
                                                marginTop: 18,

                                                minHeight: 42,

                                                paddingHorizontal: 16,

                                                borderRadius: 12,

                                                alignItems: "center",

                                                justifyContent: "center",

                                                backgroundColor: primaryColor,

                                                opacity: pressed ? 0.8 : 1,
                                            })}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: "Nunito-SemiBold",

                                                    fontSize: 13,

                                                    color: textOnPrimaryColor,
                                                }}
                                            >
                                                Mostrar todas
                                            </Text>
                                        </Pressable>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {/* ==================================================
            BOTÓN FLOTANTE
        ================================================== */}

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Crear nueva publicación"
                    accessibilityHint="Abre la pantalla para crear una nueva publicación en el foro"
                    onPress={() => router.push("/(tabs)/foro/crear")}
                    style={({ pressed }) => ({
                        position: "absolute",

                        right: esEscritorio ? 32 : esTablet ? 28 : 20,

                        bottom: posicionBoton,

                        width: tamanioFab,

                        height: tamanioFab,

                        borderRadius: tamanioFab / 2,

                        alignItems: "center",

                        justifyContent: "center",

                        backgroundColor: accentColor,

                        opacity: pressed ? 0.82 : 1,

                        ...(Platform.OS === "web"
                            ? {
                                boxShadow: "0px 6px 12px rgba(0,0,0,0.22)",
                            }
                            : {
                                shadowColor: "#000000",

                                shadowOffset: {
                                    width: 0,

                                    height: 6,
                                },

                                shadowOpacity: 0.22,

                                shadowRadius: 9,

                                elevation: 12,
                            }),

                        zIndex: 9999,
                    })}
                >
                    <Ionicons
                        name="add"
                        size={esEscritorio ? 32 : 36}
                        color={textOnPrimaryColor}
                    />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
