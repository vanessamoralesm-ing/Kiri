import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import React, { useCallback, useMemo, useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import FiltroEmociones from "@/components/foro/FiltroEmociones";
import PreguntaSemana from "@/components/foro/PreguntaSemana";
import PublicacionCard from "@/components/foro/PublicacionCard";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useAuth } from "@/services/authProvider";
import { obtenerPublicaciones } from "@/services/foro/foroService";

import type { PublicacionForo } from "@/types/foro";

// ==========================================================
// UTILIDADES
// ==========================================================

function normalizarTexto(valor: unknown): string {
    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

// ==========================================================
// OBTENER NOMBRE DE EMOCIÓN
// ==========================================================

function obtenerNombreEmocion(valor: unknown): string {
    if (valor === null || valor === undefined) {
        return "";
    }

    if (typeof valor === "string" || typeof valor === "number") {
        return String(valor);
    }

    if (typeof valor === "object") {
        const objeto = valor as Record<string, unknown>;

        const nombre =
            objeto.nombre ??
            objeto.name ??
            objeto.label ??
            objeto.emocion ??
            objeto.emotion ??
            objeto.nombre_emocion ??
            objeto.emotion_name;

        if (nombre !== null && nombre !== undefined) {
            return String(nombre);
        }
    }

    return "";
}

// ==========================================================
// OBTENER EMOCIONES
// ==========================================================

function obtenerEmocionesPublicacion(publicacion: PublicacionForo): string[] {
    const resultado: string[] = [];

    const agregarEmocion = (valor: unknown) => {
        const nombre = obtenerNombreEmocion(valor);

        if (!nombre) {
            return;
        }

        const yaExiste = resultado.some(
            (existente) => normalizarTexto(existente) === normalizarTexto(nombre),
        );

        if (!yaExiste) {
            resultado.push(nombre);
        }
    };

    const emociones = (publicacion as any)?.emociones;

    if (Array.isArray(emociones)) {
        emociones.forEach(agregarEmocion);
    } else if (emociones !== null && emociones !== undefined) {
        agregarEmocion(emociones);
    }

    const posiblesValores = [
        (publicacion as any)?.emocion,
        (publicacion as any)?.emotion,
        (publicacion as any)?.emocion_nombre,
        (publicacion as any)?.emotion_name,
        (publicacion as any)?.nombre_emocion,
        (publicacion as any)?.nombreEmocion,
        (publicacion as any)?.emocionNombre,
    ];

    posiblesValores.forEach(agregarEmocion);

    return resultado;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function ForoScreen() {
    useAuth();

    const { width, esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

    // ========================================================
    // COLORES
    // ========================================================

    const backgroundColor = useThemeColor({}, "background");

    const cardColor = useThemeColor({}, "card");

    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const textMutedColor = useThemeColor({}, "textMuted");

    const primaryColor = useThemeColor({}, "primary");

    const accentColor = useThemeColor({}, "accent");

    const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

    const dividerColor = useThemeColor({}, "divider");

    // ========================================================
    // ESTADO
    // ========================================================

    const [publicaciones, setPublicaciones] = useState<PublicacionForo[]>([]);

    const [refrescando, setRefrescando] = useState(false);

    const [cargando, setCargando] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const [emocionSeleccionada, setEmocionSeleccionada] = useState<string | null>(
        null,
    );

    // ========================================================
    // CARGAR PUBLICACIONES
    // ========================================================

    const cargarPublicaciones = useCallback(async () => {
        try {
            setError(null);

            const resultado = await obtenerPublicaciones();

            if (Array.isArray(resultado)) {
                setPublicaciones(resultado as PublicacionForo[]);
            } else {
                setPublicaciones([]);
            }
        } catch (err) {
            console.error("Error cargando publicaciones:", err);

            setError("No pudimos cargar las publicaciones. Intenta nuevamente.");
        } finally {
            setCargando(false);
            setRefrescando(false);
        }
    }, []);

    // ========================================================
    // CARGAR AL ENTRAR
    // ========================================================

    useFocusEffect(
        useCallback(() => {
            void cargarPublicaciones();
        }, [cargarPublicaciones]),
    );

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = useCallback(async () => {
        setRefrescando(true);

        await cargarPublicaciones();
    }, [cargarPublicaciones]);

    // ========================================================
    // FILTRO
    // ========================================================

    const handleSeleccionarEmocion = useCallback((valor: string) => {
        const normalizado = normalizarTexto(valor);

        if (!normalizado || normalizado === "todo" || normalizado === "todos") {
            setEmocionSeleccionada(null);
            return;
        }

        setEmocionSeleccionada(valor.trim());
    }, []);

    // ========================================================
    // PUBLICACIONES FILTRADAS
    // ========================================================

    const publicacionesFiltradas = useMemo(() => {
        if (!emocionSeleccionada) {
            return publicaciones;
        }

        const emocionBuscada = normalizarTexto(emocionSeleccionada);

        if (
            !emocionBuscada ||
            emocionBuscada === "todo" ||
            emocionBuscada === "todos"
        ) {
            return publicaciones;
        }

        return publicaciones.filter((publicacion) => {
            const emociones = obtenerEmocionesPublicacion(publicacion);

            return emociones.some(
                (emocion) => normalizarTexto(emocion) === emocionBuscada,
            );
        });
    }, [publicaciones, emocionSeleccionada]);

    // ========================================================
    // RESPONSIVE
    // ========================================================

    const paddingHorizontal = esTelefono
        ? PADDING_RESPONSIVE.telefono
        : esTablet
            ? PADDING_RESPONSIVE.tablet
            : PADDING_RESPONSIVE.escritorio;

    const anchoContenido = Math.min(
        width - paddingHorizontal * 2,
        esEscritorio ? MAX_WIDTHS.contenido : 760,
    );

    /*
     * La tab bar ya forma parte del layout de React Navigation.
     *
     * No necesitamos calcular su altura aquí porque
     * este ScrollView vive dentro del área de contenido
     * reservada por Tabs.
     *
     * Dejamos espacio adicional al final para que la
     * última publicación no quede pegada al FAB.
     */
    const espacioInferiorScroll = esTelefono ? 150 : esTablet ? 140 : 100;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <SafeAreaView
            edges={[]}
            style={[
                styles.safeArea,
                {
                    backgroundColor,
                },
            ]}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingHorizontal,
                        paddingBottom: espacioInferiorScroll,
                    },
                ]}
                refreshControl={
                    <RefreshControl
                        refreshing={refrescando}
                        onRefresh={handleRefresh}
                        tintColor={primaryColor}
                        colors={[primaryColor]}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={[
                        styles.contenido,
                        {
                            width: anchoContenido,
                        },
                    ]}
                >
                    {/* =================================================
                        HEADER DESKTOP
                    ================================================= */}

                    {esEscritorio && (
                        <View
                            style={[
                                styles.headerDesktop,
                                {
                                    borderBottomColor: dividerColor,
                                },
                            ]}
                        >
                            <View style={styles.headerDesktopTexto}>
                                <Text
                                    style={[
                                        styles.titulo,
                                        {
                                            color: textColor,
                                        },
                                    ]}
                                >
                                    Foro
                                </Text>

                                <Text
                                    style={[
                                        styles.subtitulo,
                                        {
                                            color: textSecondaryColor,
                                        },
                                    ]}
                                >
                                    Comparte, pregunta y conversa con la comunidad.
                                </Text>
                            </View>

                            <Ionicons
                                name="chatbubbles-outline"
                                size={34}
                                color={primaryColor}
                            />
                        </View>
                    )}

                    {/* =================================================
                        PREGUNTA DE LA SEMANA
                    ================================================= */}

                    <PreguntaSemana />

                    {/* =================================================
                        FILTROS
                    ================================================= */}

                    <View style={styles.filtrosContainer}>
                        <FiltroEmociones
                            seleccionada={emocionSeleccionada ?? "Todo"}
                            onSeleccionar={handleSeleccionarEmocion}
                        />
                    </View>

                    {/* =================================================
                        CARGANDO
                    ================================================= */}

                    {cargando ? (
                        <View style={styles.estadoContainer}>
                            <ActivityIndicator size="large" color={primaryColor} />

                            <Text
                                style={[
                                    styles.estadoTexto,
                                    {
                                        color: textSecondaryColor,
                                    },
                                ]}
                            >
                                Cargando publicaciones...
                            </Text>
                        </View>
                    ) : error ? (
                        /* =================================================
                                        ERROR
                                    ================================================= */

                        <View
                            style={[
                                styles.estadoCard,
                                {
                                    backgroundColor: cardColor,
                                    borderColor,
                                },
                            ]}
                        >
                            <Ionicons
                                name="alert-circle-outline"
                                size={42}
                                color={accentColor}
                            />

                            <Text
                                style={[
                                    styles.estadoTitulo,
                                    {
                                        color: textColor,
                                    },
                                ]}
                            >
                                Ocurrió un problema
                            </Text>

                            <Text
                                style={[
                                    styles.estadoTexto,
                                    {
                                        color: textSecondaryColor,
                                    },
                                ]}
                            >
                                {error}
                            </Text>

                            <Pressable
                                onPress={cargarPublicaciones}
                                style={({ pressed }) => [
                                    styles.reintentarButton,
                                    {
                                        backgroundColor: primaryColor,
                                        opacity: pressed ? 0.8 : 1,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.reintentarTexto,
                                        {
                                            color: textOnPrimaryColor,
                                        },
                                    ]}
                                >
                                    Reintentar
                                </Text>
                            </Pressable>
                        </View>
                    ) : publicacionesFiltradas.length === 0 ? (
                        /* =================================================
                                        SIN RESULTADOS
                                    ================================================= */

                        <View
                            style={[
                                styles.estadoCard,
                                {
                                    backgroundColor: cardColor,
                                    borderColor,
                                },
                            ]}
                        >
                            <Ionicons
                                name="chatbubble-ellipses-outline"
                                size={46}
                                color={textMutedColor}
                            />

                            <Text
                                style={[
                                    styles.estadoTitulo,
                                    {
                                        color: textColor,
                                    },
                                ]}
                            >
                                No hay publicaciones
                            </Text>

                            <Text
                                style={[
                                    styles.estadoTexto,
                                    {
                                        color: textSecondaryColor,
                                    },
                                ]}
                            >
                                {emocionSeleccionada
                                    ? "No encontramos publicaciones con este filtro."
                                    : "Sé la primera persona en compartir algo con la comunidad."}
                            </Text>

                            {emocionSeleccionada && (
                                <Pressable
                                    onPress={() => setEmocionSeleccionada(null)}
                                    style={({ pressed }) => [
                                        styles.quitarFiltroButton,
                                        {
                                            backgroundColor: primaryColor,
                                            opacity: pressed ? 0.8 : 1,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.quitarFiltroTexto,
                                            {
                                                color: textOnPrimaryColor,
                                            },
                                        ]}
                                    >
                                        Ver todas
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    ) : (
                        /* =================================================
                                        PUBLICACIONES
                                    ================================================= */

                        <View style={styles.listaPublicaciones}>
                            {publicacionesFiltradas.map((publicacion, index) => (
                                <PublicacionCard
                                    key={publicacion.id_publicacion ?? `publicacion-${index}`}
                                    publicacion={publicacion}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ==========================================================
// ESTILOS
// ==========================================================

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
    },

    contenido: {
        alignSelf: "center",

        maxWidth: MAX_WIDTHS.contenido,
    },

    // ========================================================
    // HEADER
    // ========================================================

    headerDesktop: {
        minHeight: 82,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        paddingBottom: 20,

        marginBottom: 22,

        borderBottomWidth: 1,
    },

    headerDesktopTexto: {
        flex: 1,
    },

    titulo: {
        fontSize: 30,

        fontWeight: "800",

        marginBottom: 5,
    },

    subtitulo: {
        fontSize: 15,

        lineHeight: 22,
    },

    // ========================================================
    // FILTROS
    // ========================================================

    filtrosContainer: {
        marginTop: 18,

        marginBottom: 18,
    },

    // ========================================================
    // PUBLICACIONES
    // ========================================================

    listaPublicaciones: {
        width: "100%",

        gap: 16,
    },

    // ========================================================
    // ESTADOS
    // ========================================================

    estadoContainer: {
        minHeight: 260,

        alignItems: "center",

        justifyContent: "center",

        paddingVertical: 40,
    },

    estadoCard: {
        width: "100%",

        minHeight: 240,

        borderWidth: 1,

        borderRadius: 18,

        alignItems: "center",

        justifyContent: "center",

        paddingHorizontal: 28,

        paddingVertical: 32,
    },

    estadoTitulo: {
        fontSize: 19,

        fontWeight: "700",

        textAlign: "center",

        marginTop: 14,

        marginBottom: 8,
    },

    estadoTexto: {
        fontSize: 14,

        lineHeight: 21,

        textAlign: "center",

        maxWidth: 460,
    },

    // ========================================================
    // BOTONES
    // ========================================================

    reintentarButton: {
        minHeight: 44,

        paddingHorizontal: 24,

        borderRadius: 12,

        alignItems: "center",

        justifyContent: "center",

        marginTop: 20,
    },

    reintentarTexto: {
        fontSize: 14,

        fontWeight: "700",
    },

    quitarFiltroButton: {
        minHeight: 44,

        paddingHorizontal: 24,

        borderRadius: 12,

        alignItems: "center",

        justifyContent: "center",

        marginTop: 20,
    },

    quitarFiltroTexto: {
        fontSize: 14,

        fontWeight: "700",
    },
});
