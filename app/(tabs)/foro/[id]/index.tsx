import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import ComentarioCard from "@/components/foro/ComentarioCard";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/services/authProvider";

import {
    crearComentario,
    crearReporte,
    eliminarComentario,
    obtenerComentarios,
    obtenerPublicacionPorId,
    reaccionarPublicacion,
} from "@/services/foro/foroService";

import type {
    ComentarioForo,
    MotivoReporte,
    PublicacionForo,
    TipoReaccion,
} from "@/types/foro";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function DetallePublicacionScreen() {
    const router = useRouter();

    const { id } = useLocalSearchParams<{
        id: string;
    }>();

    const { profile, loading: authLoading } = useAuth();

    // ======================================================
    // ESTADOS
    // ======================================================

    const [publicacion, setPublicacion] = useState<PublicacionForo | null>(null);

    const [comentarios, setComentarios] = useState<ComentarioForo[]>([]);

    const [nuevoComentario, setNuevoComentario] = useState("");

    const [cargando, setCargando] = useState(true);

    const [refrescando, setRefrescando] = useState(false);

    const [publicandoComentario, setPublicandoComentario] = useState(false);

    const [procesandoReaccion, setProcesandoReaccion] = useState(false);

    const [error, setError] = useState<string | null>(null);

    // ======================================================
    // TEMA
    // ======================================================

    const backgroundColor = useThemeColor({}, "background");
    const surfaceColor = useThemeColor({}, "surface");
    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");
    const borderColor = useThemeColor({}, "border");
    const dividerColor = useThemeColor({}, "divider");
    const textColor = useThemeColor({}, "text");
    const textSecondaryColor = useThemeColor({}, "textSecondary");
    const textMutedColor = useThemeColor({}, "textMuted");
    const placeholderColor = useThemeColor({}, "placeholder");
    const iconColor = useThemeColor({}, "icon");
    const primaryColor = useThemeColor({}, "primary");
    const primarySoftColor = useThemeColor({}, "primarySoft");
    const accentColor = useThemeColor({}, "accent");
    const accentSoftColor = useThemeColor({}, "accentSoft");

    // ======================================================
    // DATOS DERIVADOS
    // ======================================================

    const nombreUsuario = useMemo(
        () =>
            publicacion?.usuario?.nombre_preferido?.trim() ||
            publicacion?.usuario?.nombres?.trim() ||
            "Usuario",
        [publicacion],
    );

    const reaccionActual = publicacion?.reaccion_usuario ?? null;

    const reaccionMeGusta = reaccionActual === "me_gusta";

    const totalReacciones = publicacion?.total_reacciones ?? 0;

    // ======================================================
    // FECHA
    // ======================================================

    function formatearFecha(fecha: string) {
        const valor = new Date(fecha);

        if (Number.isNaN(valor.getTime())) {
            return "";
        }

        return valor.toLocaleDateString("es-NI", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // ======================================================
    // CARGAR DETALLE
    // ======================================================

    const cargarDetalle = useCallback(
        async (mostrarCargaPrincipal = true) => {
            if (!id) {
                return;
            }

            try {
                if (mostrarCargaPrincipal) {
                    setCargando(true);
                }

                setError(null);

                const [datosPublicacion, datosComentarios] = await Promise.all([
                    obtenerPublicacionPorId(id, profile?.id_usuario),
                    obtenerComentarios(id),
                ]);

                if (!datosPublicacion) {
                    setPublicacion(null);
                    setComentarios([]);

                    setError("La publicación no está disponible.");

                    return;
                }

                setPublicacion(datosPublicacion);
                setComentarios(datosComentarios);
            } catch (e) {
                console.error("Error cargando detalle de publicación:", e);

                setError(
                    e instanceof Error ? e.message : "No se pudo cargar la publicación.",
                );
            } finally {
                if (mostrarCargaPrincipal) {
                    setCargando(false);
                }
            }
        },
        [id, profile?.id_usuario],
    );

    // ======================================================
    // CARGA INICIAL
    // ======================================================

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!id) {
            setError("No se recibió el identificador de la publicación.");

            setCargando(false);

            return;
        }

        cargarDetalle();
    }, [authLoading, id, cargarDetalle]);

    // ======================================================
    // REFRESH
    // ======================================================

    const refrescar = useCallback(async () => {
        if (authLoading || refrescando) {
            return;
        }

        try {
            setRefrescando(true);

            await cargarDetalle(false);
        } finally {
            setRefrescando(false);
        }
    }, [authLoading, refrescando, cargarDetalle]);

    // ======================================================
    // REACCIONAR
    // ======================================================

    async function manejarReaccion() {
        if (!publicacion || procesandoReaccion) {
            return;
        }

        if (!profile?.id_usuario) {
            Alert.alert("Sesión requerida", "Debes iniciar sesión para reaccionar.");

            return;
        }

        const reaccionAnterior = publicacion.reaccion_usuario ?? null;

        const totalAnterior = publicacion.total_reacciones ?? 0;

        let nuevaReaccionLocal: TipoReaccion | null;

        let nuevoTotal = totalAnterior;

        if (reaccionAnterior === "me_gusta") {
            nuevaReaccionLocal = null;

            nuevoTotal = Math.max(0, totalAnterior - 1);
        } else {
            nuevaReaccionLocal = "me_gusta";

            if (reaccionAnterior === null) {
                nuevoTotal = totalAnterior + 1;
            }
        }

        setPublicacion((actual) =>
            actual
                ? {
                    ...actual,
                    reaccion_usuario: nuevaReaccionLocal,
                    total_reacciones: nuevoTotal,
                }
                : actual,
        );

        try {
            setProcesandoReaccion(true);

            const resultado = await reaccionarPublicacion(
                publicacion.id_publicacion,
                profile.id_usuario,
                "me_gusta",
            );

            setPublicacion((actual) =>
                actual
                    ? {
                        ...actual,
                        reaccion_usuario: resultado,
                    }
                    : actual,
            );
        } catch (e) {
            setPublicacion((actual) =>
                actual
                    ? {
                        ...actual,
                        reaccion_usuario: reaccionAnterior,
                        total_reacciones: totalAnterior,
                    }
                    : actual,
            );

            Alert.alert(
                "No se pudo reaccionar",
                e instanceof Error
                    ? e.message
                    : "Ocurrió un error al registrar tu reacción.",
            );
        } finally {
            setProcesandoReaccion(false);
        }
    }

    // ======================================================
    // CREAR COMENTARIO
    // ======================================================

    async function manejarPublicarComentario() {
        if (publicandoComentario) {
            return;
        }

        if (!profile?.id_usuario) {
            Alert.alert("Sesión requerida", "Debes iniciar sesión para comentar.");

            return;
        }

        if (!id) {
            return;
        }

        if (!nuevoComentario.trim()) {
            Alert.alert(
                "Comentario vacío",
                "Escribe algo antes de publicar tu comentario.",
            );

            return;
        }

        try {
            setPublicandoComentario(true);

            const comentario = await crearComentario({
                idPublicacion: id,
                idUsuario: profile.id_usuario,
                contenido: nuevoComentario,
            });

            setComentarios((actuales) => [...actuales, comentario]);

            setNuevoComentario("");

            setPublicacion((actual) =>
                actual
                    ? {
                        ...actual,
                        total_comentarios: (actual.total_comentarios ?? 0) + 1,
                    }
                    : actual,
            );
        } catch (e) {
            Alert.alert(
                "No se pudo comentar",
                e instanceof Error
                    ? e.message
                    : "Ocurrió un error al publicar tu comentario.",
            );
        } finally {
            setPublicandoComentario(false);
        }
    }

    // ======================================================
    // ELIMINAR COMENTARIO
    // ======================================================

    function manejarEliminarComentario(comentario: ComentarioForo) {
        if (!profile?.id_usuario) {
            return;
        }

        Alert.alert(
            "Eliminar comentario",
            "¿Seguro que deseas eliminar este comentario?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    style: "destructive",

                    onPress: async () => {
                        try {
                            await eliminarComentario(
                                comentario.id_comentario,
                                profile.id_usuario,
                            );

                            setComentarios((actuales) =>
                                actuales.filter(
                                    (item) => item.id_comentario !== comentario.id_comentario,
                                ),
                            );

                            setPublicacion((actual) =>
                                actual
                                    ? {
                                        ...actual,
                                        total_comentarios: Math.max(
                                            0,
                                            (actual.total_comentarios ?? 0) - 1,
                                        ),
                                    }
                                    : actual,
                            );
                        } catch (e) {
                            Alert.alert(
                                "No se pudo eliminar",
                                e instanceof Error
                                    ? e.message
                                    : "Ocurrió un error al eliminar el comentario.",
                            );
                        }
                    },
                },
            ],
        );
    }

    // ======================================================
    // EDITAR COMENTARIO
    // ======================================================

    function manejarEditarComentario(_comentario: ComentarioForo) {
        Alert.alert(
            "Editar comentario",
            "La edición del comentario se integrará en el siguiente paso.",
        );
    }

    // ======================================================
    // REPORTAR COMENTARIO
    // ======================================================

    function manejarReportarComentario(comentario: ComentarioForo) {
        if (!profile?.id_usuario) {
            Alert.alert(
                "Sesión requerida",
                "Debes iniciar sesión para reportar contenido.",
            );

            return;
        }

        Alert.alert("Reportar comentario", "Selecciona el motivo del reporte.", [
            {
                text: "Contenido inapropiado",
                onPress: () =>
                    enviarReporteComentario(comentario, "contenido_inapropiado"),
            },
            {
                text: "Acoso",
                onPress: () => enviarReporteComentario(comentario, "acoso"),
            },
            {
                text: "Spam",
                onPress: () => enviarReporteComentario(comentario, "spam"),
            },
            {
                text: "Cancelar",
                style: "cancel",
            },
        ]);
    }

    async function enviarReporteComentario(
        comentario: ComentarioForo,
        motivo: MotivoReporte,
    ) {
        if (!profile?.id_usuario) {
            return;
        }

        try {
            await crearReporte({
                idUsuarioReporta: profile.id_usuario,
                idComentario: comentario.id_comentario,
                motivo,
            });

            Alert.alert("Reporte enviado", "Gracias. Revisaremos este contenido.");
        } catch (e) {
            Alert.alert(
                "No se pudo reportar",
                e instanceof Error
                    ? e.message
                    : "Ocurrió un error al enviar el reporte.",
            );
        }
    }

    // ======================================================
    // CARGANDO
    // ======================================================

    if (authLoading || cargando) {
        return (
            <SafeAreaView
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
                    }}
                >
                    <ActivityIndicator size="large" color={primaryColor} />

                    <Text
                        style={{
                            marginTop: 14,
                            fontFamily: "Nunito-SemiBold",
                            color: textSecondaryColor,
                        }}
                    >
                        Cargando publicación...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ======================================================
    // ERROR
    // ======================================================

    if (error || !publicacion) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 24,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Ionicons
                        name="alert-circle-outline"
                        size={52}
                        color={textMutedColor}
                    />

                    <Text
                        style={{
                            marginTop: 16,
                            fontFamily: "Nunito-Bold",
                            fontSize: 20,
                            textAlign: "center",
                            color: textColor,
                        }}
                    >
                        No pudimos cargar esta publicación
                    </Text>

                    <Text
                        style={{
                            marginTop: 8,
                            fontFamily: "Nunito-Medium",
                            fontSize: 14,
                            lineHeight: 21,
                            textAlign: "center",
                            color: textSecondaryColor,
                        }}
                    >
                        {error ?? "La publicación no está disponible."}
                    </Text>

                    <Pressable
                        onPress={() => cargarDetalle()}
                        style={{
                            marginTop: 24,
                            minHeight: 48,
                            paddingHorizontal: 22,
                            borderRadius: 16,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: primaryColor,
                        }}
                    >
                        <Ionicons name="refresh-outline" size={19} color="#FFFFFF" />

                        <Text
                            style={{
                                marginLeft: 8,
                                fontFamily: "Nunito-Bold",
                                color: "#FFFFFF",
                            }}
                        >
                            Intentar nuevamente
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // ======================================================
    // UI
    // ======================================================

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor,
            }}
        >
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <View
                    style={{
                        minHeight: 64,
                        paddingHorizontal: 18,
                        flexDirection: "row",
                        alignItems: "center",
                        borderBottomWidth: 1,
                        borderBottomColor: dividerColor,
                        backgroundColor,
                    }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        style={{
                            width: 44,
                            height: 44,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Ionicons name="arrow-back" size={27} color={iconColor} />
                    </Pressable>

                    <Text
                        style={{
                            flex: 1,
                            marginLeft: 8,
                            fontFamily: "Nunito-Bold",
                            fontSize: 22,
                            color: textColor,
                        }}
                    >
                        Publicación
                    </Text>
                </View>

                {/* ==================================================
                    CONTENIDO
                ================================================== */}

                <ScrollView
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
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingTop: 20,
                        paddingBottom: 28,
                    }}
                >
                    {/* ==================================================
                        PUBLICACIÓN
                    ================================================== */}

                    <View
                        style={{
                            padding: 20,
                            borderRadius: 24,
                            borderWidth: 1,
                            borderColor,
                            backgroundColor: surfaceColor,
                        }}
                    >
                        {/* AUTOR */}

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            {publicacion.usuario?.foto_perfil ? (
                                <Image
                                    source={{
                                        uri: publicacion.usuario.foto_perfil,
                                    }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        borderWidth: 1,
                                        borderColor,
                                    }}
                                />
                            ) : (
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderWidth: 1,
                                        borderColor,
                                        backgroundColor: surfaceSecondaryColor,
                                    }}
                                >
                                    <Ionicons name="person-outline" size={24} color={iconColor} />
                                </View>
                            )}

                            <View
                                style={{
                                    flex: 1,
                                    marginLeft: 13,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 16,
                                        color: textColor,
                                    }}
                                >
                                    {nombreUsuario}
                                </Text>

                                <Text
                                    style={{
                                        marginTop: 2,
                                        fontFamily: "Nunito-Medium",
                                        fontSize: 12,
                                        color: textMutedColor,
                                    }}
                                >
                                    {formatearFecha(publicacion.fecha_publicacion)}

                                    {publicacion.editada ? " · Editada" : ""}
                                </Text>
                            </View>
                        </View>

                        {/* EMOCIONES */}

                        {(publicacion.emociones ?? []).length > 0 && (
                            <View
                                style={{
                                    marginTop: 18,
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: 8,
                                }}
                            >
                                {(publicacion.emociones ?? []).map((emocion) => (
                                    <View
                                        key={emocion.id_emocion_foro}
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingVertical: 5,
                                            borderRadius: 999,
                                            borderWidth: 1,
                                            borderColor: accentColor,
                                            backgroundColor: accentSoftColor,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Nunito-Medium",
                                                fontSize: 13,
                                                color: accentColor,
                                            }}
                                        >
                                            {emocion.nombre}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* TÍTULO */}

                        <Text
                            style={{
                                marginTop: 18,
                                fontFamily: "Nunito-Bold",
                                fontSize: 22,
                                lineHeight: 29,
                                color: textColor,
                            }}
                        >
                            {publicacion.titulo}
                        </Text>

                        {/* CONTENIDO */}

                        <Text
                            style={{
                                marginTop: 10,
                                fontFamily: "Nunito-Medium",
                                fontSize: 16,
                                lineHeight: 25,
                                color: textSecondaryColor,
                            }}
                        >
                            {publicacion.contenido}
                        </Text>

                        {/* ACCIONES */}

                        <View
                            style={{
                                marginTop: 22,
                                paddingTop: 14,
                                borderTopWidth: 1,
                                borderTopColor: dividerColor,
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Pressable
                                disabled={procesandoReaccion}
                                onPress={manejarReaccion}
                                style={{
                                    minHeight: 42,
                                    paddingHorizontal: 12,
                                    borderRadius: 13,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: reaccionMeGusta
                                        ? primarySoftColor
                                        : "transparent",
                                }}
                            >
                                <Ionicons
                                    name={reaccionMeGusta ? "heart" : "heart-outline"}
                                    size={22}
                                    color={primaryColor}
                                />

                                <Text
                                    style={{
                                        marginLeft: 7,
                                        fontFamily: "Nunito-SemiBold",
                                        color: primaryColor,
                                    }}
                                >
                                    {totalReacciones}
                                </Text>
                            </Pressable>

                            <View
                                style={{
                                    marginLeft: 14,
                                    minHeight: 42,
                                    paddingHorizontal: 12,
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Ionicons
                                    name="chatbubble-outline"
                                    size={20}
                                    color={iconColor}
                                />

                                <Text
                                    style={{
                                        marginLeft: 7,
                                        fontFamily: "Nunito-Medium",
                                        color: textSecondaryColor,
                                    }}
                                >
                                    {comentarios.length}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* ==================================================
                        COMENTARIOS
                    ================================================== */}

                    <View
                        style={{
                            marginTop: 30,
                            marginBottom: 16,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",
                                fontSize: 20,
                                color: textColor,
                            }}
                        >
                            Comentarios
                        </Text>

                        <Text
                            style={{
                                fontFamily: "Nunito-Medium",
                                fontSize: 14,
                                color: textMutedColor,
                            }}
                        >
                            {comentarios.length}
                        </Text>
                    </View>

                    {comentarios.length === 0 ? (
                        <View
                            style={{
                                paddingVertical: 35,
                                alignItems: "center",
                            }}
                        >
                            <Ionicons
                                name="chatbubble-ellipses-outline"
                                size={38}
                                color={textMutedColor}
                            />

                            <Text
                                style={{
                                    marginTop: 10,
                                    fontFamily: "Nunito-Medium",
                                    fontSize: 14,
                                    lineHeight: 21,
                                    textAlign: "center",
                                    color: textSecondaryColor,
                                }}
                            >
                                Aún no hay comentarios. Puedes ser la primera persona en
                                responder.
                            </Text>
                        </View>
                    ) : (
                        comentarios.map((comentario) => {
                            const esPropio = comentario.id_usuario === profile?.id_usuario;

                            return (
                                <ComentarioCard
                                    key={comentario.id_comentario}
                                    comentario={comentario}
                                    esPropio={esPropio}
                                    onEditar={() => manejarEditarComentario(comentario)}
                                    onEliminar={() => manejarEliminarComentario(comentario)}
                                    onReportar={() => manejarReportarComentario(comentario)}
                                />
                            );
                        })
                    )}
                </ScrollView>

                {/* ==================================================
                    NUEVO COMENTARIO
                ================================================== */}

                <View
                    style={{
                        paddingHorizontal: 16,
                        paddingTop: 10,
                        paddingBottom: 12,
                        borderTopWidth: 1,
                        borderTopColor: dividerColor,
                        backgroundColor,
                    }}
                >
                    <View
                        style={{
                            minHeight: 52,
                            paddingLeft: 16,
                            paddingRight: 6,
                            borderRadius: 18,
                            borderWidth: 1,
                            borderColor,
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: surfaceColor,
                        }}
                    >
                        <TextInput
                            value={nuevoComentario}
                            onChangeText={setNuevoComentario}
                            editable={!publicandoComentario}
                            placeholder="Escribe un comentario..."
                            placeholderTextColor={placeholderColor}
                            selectionColor={primaryColor}
                            multiline
                            maxLength={1000}
                            style={{
                                flex: 1,
                                maxHeight: 110,
                                paddingVertical: 12,
                                fontFamily: "Nunito-Medium",
                                fontSize: 15,
                                color: textColor,
                            }}
                        />

                        <Pressable
                            disabled={publicandoComentario || !nuevoComentario.trim()}
                            onPress={manejarPublicarComentario}
                            accessibilityRole="button"
                            accessibilityLabel="Publicar comentario"
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 15,
                                alignItems: "center",
                                justifyContent: "center",
                                opacity:
                                    publicandoComentario || !nuevoComentario.trim() ? 0.45 : 1,
                                backgroundColor: primaryColor,
                            }}
                        >
                            {publicandoComentario ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Ionicons name="send" size={20} color="#FFFFFF" />
                            )}
                        </Pressable>
                    </View>

                    <Text
                        style={{
                            marginTop: 5,
                            marginRight: 4,
                            textAlign: "right",
                            fontFamily: "Nunito-Medium",
                            fontSize: 11,
                            color: textMutedColor,
                        }}
                    >
                        {nuevoComentario.length}/1000
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
