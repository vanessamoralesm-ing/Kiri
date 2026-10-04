import React, { useEffect, useState } from "react";

import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/services/authProvider";

import { reaccionarPublicacion } from "@/services/foro/foroService";

import type { PublicacionForo, TipoReaccion } from "@/types/foro";

// ==========================================================
// PROPS
// ==========================================================

interface PublicacionCardProps {
    publicacion: PublicacionForo;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function PublicacionCard({ publicacion }: PublicacionCardProps) {
    const router = useRouter();

    const { profile } = useAuth();

    // ======================================================
    // ESTADOS
    // ======================================================

    const [reaccionActual, setReaccionActual] = useState<TipoReaccion | null>(
        publicacion.reaccion_usuario ?? null,
    );

    const [totalReacciones, setTotalReacciones] = useState(
        publicacion.total_reacciones ?? 0,
    );

    const [procesandoReaccion, setProcesandoReaccion] = useState(false);

    const [errorFotoPerfil, setErrorFotoPerfil] = useState(false);

    // ======================================================
    // SINCRONIZAR REACCIONES
    // ======================================================

    useEffect(() => {
        setReaccionActual(publicacion.reaccion_usuario ?? null);

        setTotalReacciones(publicacion.total_reacciones ?? 0);
    }, [publicacion.reaccion_usuario, publicacion.total_reacciones]);

    // ======================================================
    // USUARIO
    // ======================================================

    const usuario = publicacion.usuario;

    const nombreUsuario =
        usuario?.nombre_preferido?.trim() || usuario?.nombres?.trim() || "Usuario";

    const fotoPerfil = usuario?.foto_perfil?.trim() || null;

    // ======================================================
    // DEBUG USUARIO
    // ======================================================

    useEffect(() => {
        console.log("👤 DATOS USUARIO CARD:", {
            idPublicacion: publicacion.id_publicacion,

            idUsuario: publicacion.id_usuario,

            nombreMostrado: nombreUsuario,

            tieneFoto: Boolean(fotoPerfil),

            usuario,
        });
    }, [
        publicacion.id_publicacion,
        publicacion.id_usuario,
        nombreUsuario,
        fotoPerfil,
        usuario,
    ]);

    // ======================================================
    // REINICIAR ERROR DE FOTO
    // ======================================================

    useEffect(() => {
        setErrorFotoPerfil(false);
    }, [fotoPerfil]);

    const mostrarFotoPerfil = Boolean(fotoPerfil) && !errorFotoPerfil;

    // ======================================================
    // COLORES
    // ======================================================

    const surfaceColor = useThemeColor({}, "surface");

    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const textMutedColor = useThemeColor({}, "textMuted");

    const iconColor = useThemeColor({}, "icon");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const accentColor = useThemeColor({}, "accent");

    const accentSoftColor = useThemeColor({}, "accentSoft");

    // ======================================================
    // OTROS DATOS
    // ======================================================

    const emociones = publicacion.emociones ?? [];

    const totalComentarios = publicacion.total_comentarios ?? 0;

    const reaccionMeGusta = reaccionActual === "me_gusta";

    // ======================================================
    // FECHA
    // ======================================================

    function formatearFecha(fecha: string) {
        const fechaPublicacion = new Date(fecha);

        if (Number.isNaN(fechaPublicacion.getTime())) {
            return "";
        }

        const ahora = new Date();

        const diferencia = Math.max(
            0,
            ahora.getTime() - fechaPublicacion.getTime(),
        );

        const minutos = Math.floor(diferencia / (1000 * 60));

        const horas = Math.floor(minutos / 60);

        const dias = Math.floor(horas / 24);

        if (minutos < 1) {
            return "Ahora";
        }

        if (minutos < 60) {
            return `${minutos} min`;
        }

        if (horas < 24) {
            return `${horas} h`;
        }

        if (dias < 7) {
            return `${dias} d`;
        }

        return fechaPublicacion.toLocaleDateString("es-NI", {
            day: "2-digit",
            month: "short",
        });
    }

    const fecha = formatearFecha(publicacion.fecha_publicacion);

    // ======================================================
    // ABRIR PUBLICACIÓN
    // ======================================================

    function abrirPublicacion() {
        router.push({
            pathname: "/(tabs)/foro/[id]",

            params: {
                id: publicacion.id_publicacion,
            },
        });
    }

    // ======================================================
    // REACCIONAR
    // ======================================================

    async function manejarReaccion() {
        if (procesandoReaccion) {
            return;
        }

        if (!profile?.id_usuario) {
            Alert.alert(
                "Sesión requerida",
                "Debes iniciar sesión para reaccionar a una publicación.",
            );

            return;
        }

        const reaccionAnterior = reaccionActual;

        const totalAnterior = totalReacciones;

        // --------------------------------------------------
        // ACTUALIZACIÓN OPTIMISTA
        // --------------------------------------------------

        if (reaccionAnterior === "me_gusta") {
            setReaccionActual(null);

            setTotalReacciones((actual) => Math.max(0, actual - 1));
        } else {
            setReaccionActual("me_gusta");

            if (reaccionAnterior === null) {
                setTotalReacciones((actual) => actual + 1);
            }
        }

        try {
            setProcesandoReaccion(true);

            const nuevaReaccion = await reaccionarPublicacion(
                publicacion.id_publicacion,
                profile.id_usuario,
                "me_gusta",
            );

            setReaccionActual(nuevaReaccion);
        } catch (error) {
            console.error("Error reaccionando a publicación:", error);

            setReaccionActual(reaccionAnterior);

            setTotalReacciones(totalAnterior);

            Alert.alert(
                "No se pudo reaccionar",
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al registrar tu reacción.",
            );
        } finally {
            setProcesandoReaccion(false);
        }
    }

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: surfaceColor,
                    borderColor,
                },
            ]}
        >
            {/* ==================================================
          ENCABEZADO
      ================================================== */}

            <View style={styles.encabezado}>
                {/* ==================================================
            FOTO
        ================================================== */}

                <View
                    style={[
                        styles.avatarContainer,
                        {
                            borderColor,
                        },
                    ]}
                >
                    {mostrarFotoPerfil && fotoPerfil ? (
                        <Image
                            source={{
                                uri: fotoPerfil,
                            }}
                            style={styles.avatar}
                            contentFit="cover"
                            cachePolicy="none"
                            transition={150}
                            accessibilityRole="image"
                            accessibilityLabel={`Foto de perfil de ${nombreUsuario}`}
                            onLoad={() => {
                                console.log("🟢 AVATAR CARGADO", {
                                    idUsuario: publicacion.id_usuario,
                                    usuario: nombreUsuario,
                                });
                            }}
                            onError={(event) => {
                                console.error("🔴 ERROR CARGANDO AVATAR", {
                                    idUsuario: publicacion.id_usuario,
                                    usuario: nombreUsuario,
                                    error: event,
                                });

                                setErrorFotoPerfil(true);
                            }}
                        />
                    ) : (
                        <View
                            style={[
                                styles.avatarPlaceholder,
                                {
                                    backgroundColor: surfaceSecondaryColor,
                                },
                            ]}
                        >
                            <Ionicons name="person-outline" size={22} color={iconColor} />
                        </View>
                    )}
                </View>

                {/* ==================================================
            INFORMACIÓN DEL USUARIO
        ================================================== */}

                <View style={styles.informacionUsuario}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                            styles.nombreUsuario,
                            {
                                color: textColor,
                            },
                        ]}
                    >
                        {nombreUsuario}
                    </Text>

                    <View style={styles.metaUsuario}>
                        {fecha && (
                            <Text
                                style={[
                                    styles.fecha,
                                    {
                                        color: textSecondaryColor,
                                    },
                                ]}
                            >
                                {fecha}
                            </Text>
                        )}

                        {publicacion.editada && (
                            <>
                                {fecha && (
                                    <Text
                                        style={[
                                            styles.separadorMeta,
                                            {
                                                color: textMutedColor,
                                            },
                                        ]}
                                    >
                                        •
                                    </Text>
                                )}

                                <Text
                                    style={[
                                        styles.editada,
                                        {
                                            color: textMutedColor,
                                        },
                                    ]}
                                >
                                    Editada
                                </Text>
                            </>
                        )}
                    </View>
                </View>

                {/* ==================================================
            OPCIONES
        ================================================== */}

                <Pressable
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Opciones de publicación"
                    style={({ pressed }) => [
                        styles.botonOpciones,
                        {
                            backgroundColor: pressed ? surfaceSecondaryColor : "transparent",
                        },
                    ]}
                >
                    <Ionicons name="ellipsis-horizontal" size={21} color={iconColor} />
                </Pressable>
            </View>

            {/* ==================================================
          EMOCIONES
      ================================================== */}

            {emociones.length > 0 && (
                <View style={styles.contenedorEmociones}>
                    {emociones.map((emocion) => (
                        <View
                            key={emocion.id_emocion_foro}
                            style={[
                                styles.chipEmocion,
                                {
                                    backgroundColor: accentSoftColor,
                                    borderColor: accentColor,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.textoEmocion,
                                    {
                                        color: accentColor,
                                    },
                                ]}
                            >
                                {emocion.nombre}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* ==================================================
          CONTENIDO
      ================================================== */}

            <Pressable
                onPress={abrirPublicacion}
                accessibilityRole="button"
                accessibilityLabel={`Abrir publicación ${publicacion.titulo}`}
                style={({ pressed }) => [
                    styles.contenidoPublicacion,
                    {
                        opacity: pressed ? 0.82 : 1,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.titulo,
                        {
                            color: textColor,
                        },
                    ]}
                >
                    {publicacion.titulo}
                </Text>

                <Text
                    numberOfLines={8}
                    style={[
                        styles.contenido,
                        {
                            color: textSecondaryColor,
                        },
                    ]}
                >
                    {publicacion.contenido}
                </Text>
            </Pressable>

            {/* ==================================================
          ACCIONES
      ================================================== */}

            <View
                style={[
                    styles.acciones,
                    {
                        borderTopColor: borderColor,
                    },
                ]}
            >
                <Pressable
                    disabled={procesandoReaccion}
                    onPress={manejarReaccion}
                    accessibilityRole="button"
                    accessibilityLabel={
                        reaccionMeGusta ? "Quitar Me gusta" : "Dar Me gusta"
                    }
                    accessibilityState={{
                        disabled: procesandoReaccion,
                    }}
                    hitSlop={6}
                    style={({ pressed }) => [
                        styles.botonAccion,
                        {
                            opacity: procesandoReaccion ? 0.55 : pressed ? 0.7 : 1,

                            backgroundColor: reaccionMeGusta
                                ? primarySoftColor
                                : "transparent",
                        },
                    ]}
                >
                    <Ionicons
                        name={reaccionMeGusta ? "heart" : "heart-outline"}
                        size={23}
                        color={reaccionMeGusta ? primaryColor : iconColor}
                    />

                    <Text
                        style={[
                            styles.numeroAccion,
                            {
                                color: reaccionMeGusta ? primaryColor : textSecondaryColor,
                            },
                        ]}
                    >
                        {totalReacciones}
                    </Text>
                </Pressable>

                <Pressable
                    onPress={abrirPublicacion}
                    accessibilityRole="button"
                    accessibilityLabel={
                        totalComentarios === 0
                            ? "Comentar publicación"
                            : `Ver ${totalComentarios} comentarios`
                    }
                    hitSlop={6}
                    style={({ pressed }) => [
                        styles.botonAccion,
                        {
                            opacity: pressed ? 0.7 : 1,

                            backgroundColor: pressed ? surfaceSecondaryColor : "transparent",
                        },
                    ]}
                >
                    <Ionicons name="chatbubble-outline" size={22} color={iconColor} />

                    <Text
                        style={[
                            styles.numeroAccion,
                            {
                                color: textSecondaryColor,
                            },
                        ]}
                    >
                        {totalComentarios}
                    </Text>
                </Pressable>

                <View style={styles.espacioAcciones} />
            </View>
        </View>
    );
}

// ==========================================================
// ESTILOS
// ==========================================================

const styles = StyleSheet.create({
    card: {
        width: "100%",
        marginBottom: 4,
        padding: 20,
        borderRadius: 22,
        borderWidth: 1,
    },

    encabezado: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },

    avatarContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,
        overflow: "hidden",
        borderWidth: 1,
        flexShrink: 0,
    },

    avatar: {
        width: "100%",
        height: "100%",
        backgroundColor: "#dddddd",
    },

    avatarPlaceholder: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },

    informacionUsuario: {
        flex: 1,
        minWidth: 0,
        marginLeft: 12,
        paddingRight: 4,
    },

    nombreUsuario: {
        fontFamily: "Nunito-Bold",
        fontSize: 16,
        lineHeight: 20,
        flexShrink: 1,
    },

    metaUsuario: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: 3,
    },

    fecha: {
        fontFamily: "Nunito-Medium",
        fontSize: 13,
        lineHeight: 18,
    },

    separadorMeta: {
        marginHorizontal: 5,
        fontSize: 12,
    },

    editada: {
        fontFamily: "Nunito-Medium",
        fontSize: 12,
        lineHeight: 18,
    },

    botonOpciones: {
        width: 40,
        height: 40,
        marginLeft: 4,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },

    contenedorEmociones: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 16,
        gap: 8,
    },

    chipEmocion: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 999,
        borderWidth: 1,
    },

    textoEmocion: {
        fontFamily: "Nunito-Medium",
        fontSize: 13,
        lineHeight: 18,
    },

    contenidoPublicacion: {
        width: "100%",
    },

    titulo: {
        marginBottom: 8,
        fontFamily: "Nunito-Bold",
        fontSize: 18,
        lineHeight: 25,
    },

    contenido: {
        fontFamily: "Nunito-Medium",
        fontSize: 15,
        lineHeight: 23,
    },

    acciones: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        minHeight: 48,
        marginTop: 18,
        paddingTop: 10,
        borderTopWidth: 1,
    },

    botonAccion: {
        minHeight: 40,
        paddingHorizontal: 10,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
    },

    numeroAccion: {
        marginLeft: 7,
        fontFamily: "Nunito-SemiBold",
        fontSize: 15,
        lineHeight: 20,
    },

    espacioAcciones: {
        flex: 1,
    },
});
