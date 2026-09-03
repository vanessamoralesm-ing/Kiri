import React, { useCallback, useMemo, useRef, useState } from "react";

import {
    ActivityIndicator,
    Platform,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
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

    const { profile, loading: authLoading } = useAuth();

    // ======================================================
    // REFERENCIAS
    // ======================================================

    const primeraCargaRef = useRef(true);
    const cargaEnCursoRef = useRef(false);

    // ======================================================
    // ESTADOS
    // ======================================================

    const [publicaciones, setPublicaciones] = useState<PublicacionForo[]>([]);

    const [cargando, setCargando] = useState(true);
    const [refrescando, setRefrescando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filtroActivo, setFiltroActivo] = useState("Todo");

    // ======================================================
    // TEMA
    // ======================================================

    const backgroundColor = useThemeColor({}, "background");
    const surfaceColor = useThemeColor({}, "surface");
    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");
    const borderColor = useThemeColor({}, "border");
    const textColor = useThemeColor({}, "text");
    const textSecondaryColor = useThemeColor({}, "textSecondary");
    const textMutedColor = useThemeColor({}, "textMuted");
    const primaryColor = useThemeColor({}, "primary");
    const accentColor = useThemeColor({}, "accent");

    // ======================================================
    // CARGAR PUBLICACIONES
    // ======================================================

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

    // ======================================================
    // RECARGAR AL ENTRAR / VOLVER AL FORO
    // ======================================================

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

    // ======================================================
    // PULL TO REFRESH
    // ======================================================

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

    // ======================================================
    // FILTRADO
    // ======================================================

    const publicacionesFiltradas = useMemo(() => {
        if (filtroActivo === "Todo") {
            return publicaciones;
        }

        return publicaciones.filter((publicacion) =>
            publicacion.emociones?.some((emocion) => emocion.nombre === filtroActivo),
        );
    }, [filtroActivo, publicaciones]);

    // ======================================================
    // ESPACIOS PARA NAVBAR Y FAB
    // ======================================================

    const posicionBoton = Math.max(insets.bottom + 72, 92);

    const espacioInferiorScroll = Math.max(posicionBoton + 120, 220);

    // ======================================================
    // CARGANDO
    // ======================================================

    if (authLoading || cargando) {
        return (
            <SafeAreaView
                edges={["top"]}
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
                        paddingHorizontal: 32,
                    }}
                >
                    <View
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: 36,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: surfaceSecondaryColor,
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
                            maxWidth: 290,
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

    // ======================================================
    // UI
    // ======================================================

    return (
        <SafeAreaView
            edges={["top"]}
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
                        paddingHorizontal: 20,
                        paddingTop: 24,
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
                    {/* PREGUNTA DE LA SEMANA */}

                    <PreguntaSemana />

                    {/* ENCABEZADO */}

                    <Text
                        style={{
                            marginTop: 32,
                            marginBottom: 20,
                            fontFamily: "Nunito-Bold",
                            fontSize: 24,
                            color: textColor,
                        }}
                    >
                        Lo que otros comparten
                    </Text>

                    {/* FILTROS */}

                    <FiltroEmociones
                        seleccionada={filtroActivo}
                        onSeleccionar={setFiltroActivo}
                    />

                    {/* ERROR */}

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

                            <TouchableOpacity
                                activeOpacity={0.75}
                                onPress={() => cargarPublicaciones(false)}
                            >
                                <Ionicons
                                    name="refresh-outline"
                                    size={23}
                                    color={primaryColor}
                                />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* CONTADOR */}

                    <View
                        style={{
                            marginTop: 28,
                            marginBottom: 24,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                marginRight: 14,
                                flexDirection: "row",
                            }}
                        >
                            <View
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 17,
                                    borderWidth: 1,
                                    borderColor: primaryColor,
                                    backgroundColor: surfaceSecondaryColor,
                                }}
                            />

                            <View
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 17,
                                    marginLeft: -8,
                                    borderWidth: 1,
                                    borderColor: primaryColor,
                                    backgroundColor: surfaceSecondaryColor,
                                }}
                            />

                            <View
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 17,
                                    marginLeft: -8,
                                    borderWidth: 1,
                                    borderColor: primaryColor,
                                    backgroundColor: surfaceSecondaryColor,
                                }}
                            />
                        </View>

                        <Text
                            style={{
                                fontFamily: "Nunito-Medium",
                                fontSize: 15,
                                color: textSecondaryColor,
                            }}
                        >
                            {publicacionesFiltradas.length}{" "}
                            {publicacionesFiltradas.length === 1
                                ? "publicación"
                                : "publicaciones"}
                        </Text>
                    </View>

                    {/* PUBLICACIONES */}

                    {publicacionesFiltradas.length > 0 ? (
                        publicacionesFiltradas.map((publicacion) => (
                            <PublicacionCard
                                key={publicacion.id_publicacion}
                                publicacion={publicacion}
                            />
                        ))
                    ) : (
                        <View
                            style={{
                                alignItems: "center",
                                paddingVertical: 48,
                            }}
                        >
                            <Ionicons
                                name={
                                    filtroActivo === "Todo"
                                        ? "chatbubbles-outline"
                                        : "filter-outline"
                                }
                                size={44}
                                color={textMutedColor}
                            />

                            <Text
                                style={{
                                    marginTop: 12,
                                    maxWidth: 290,
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
                                    maxWidth: 290,
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
                        </View>
                    )}
                </ScrollView>

                {/* ==================================================
                    BOTÓN FLOTANTE
                ================================================== */}

                <TouchableOpacity
                    activeOpacity={0.78}
                    accessibilityRole="button"
                    accessibilityLabel="Crear nueva publicación"
                    accessibilityHint="Abre la pantalla para crear una nueva publicación en el foro"
                    onPress={() => router.push("/(tabs)/foro/crear")}
                    style={{
                        position: "absolute",
                        right: 24,
                        bottom: posicionBoton,
                        width: 78,
                        height: 78,
                        borderRadius: 39,
                        backgroundColor: "#B8A8F8",
                        alignItems: "center",
                        justifyContent: "center",

                        ...(Platform.OS === "web"
                            ? {
                                boxShadow: "0px 6px 9px rgba(0, 0, 0, 0.28)",
                            }
                            : {
                                shadowColor: "#000000",
                                shadowOffset: {
                                    width: 0,
                                    height: 6,
                                },
                                shadowOpacity: 0.28,
                                shadowRadius: 9,
                                elevation: 18,
                            }),

                        zIndex: 9999,
                    }}
                >
                    <Ionicons name="add" size={42} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
