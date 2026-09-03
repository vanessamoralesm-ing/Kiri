import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import React, { useEffect, useMemo, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import ReglasForo from "@/components/foro/ReglasForo";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useAuth } from "@/services/authProvider";

import {
    crearPublicacion,
    obtenerEmocionesActivas,
} from "@/services/foro/foroService";

import type { EmocionForo } from "@/types/foro";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function CrearPublicacionScreen() {
    const router = useRouter();

    const { profile, loading: authLoading } = useAuth();

    // ======================================================
    // ESTADOS
    // ======================================================

    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");

    const [emociones, setEmociones] = useState<EmocionForo[]>([]);

    const [idEmocionSeleccionada, setIdEmocionSeleccionada] = useState<
        string | null
    >(null);

    const [cargandoEmociones, setCargandoEmociones] = useState(true);

    const [publicando, setPublicando] = useState(false);

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
    const placeholderColor = useThemeColor({}, "placeholder");
    const iconColor = useThemeColor({}, "icon");
    const primaryColor = useThemeColor({}, "primary");
    const primarySoftColor = useThemeColor({}, "primarySoft");
    const dangerColor = useThemeColor({}, "danger");

    // ======================================================
    // DATOS DERIVADOS
    // ======================================================

    const emocionSeleccionada = useMemo(
        () =>
            emociones.find(
                (emocion) => emocion.id_emocion_foro === idEmocionSeleccionada,
            ) ?? null,
        [emociones, idEmocionSeleccionada],
    );

    const nombreUsuario = useMemo(
        () =>
            profile?.nombre_preferido?.trim() ||
            profile?.nombres?.trim() ||
            "Usuario",
        [profile?.nombre_preferido, profile?.nombres],
    );

    const formularioValido = Boolean(
        titulo.trim() &&
        contenido.trim() &&
        idEmocionSeleccionada &&
        profile?.id_usuario,
    );

    // ======================================================
    // CARGAR EMOCIONES
    // ======================================================

    useEffect(() => {
        let activo = true;

        async function cargarEmociones() {
            try {
                setCargandoEmociones(true);

                const data = await obtenerEmocionesActivas();

                if (activo) {
                    setEmociones(data);
                }
            } catch (error) {
                console.error("Error cargando emociones:", error);

                if (activo) {
                    Alert.alert(
                        "No se pudieron cargar las emociones",
                        error instanceof Error
                            ? error.message
                            : "Ocurrió un error al cargar las emociones.",
                    );
                }
            } finally {
                if (activo) {
                    setCargandoEmociones(false);
                }
            }
        }

        cargarEmociones();

        return () => {
            activo = false;
        };
    }, []);

    // ======================================================
    // SELECCIONAR EMOCIÓN
    // ======================================================

    function seleccionarEmocion(idEmocion: string) {
        if (publicando) {
            return;
        }

        setIdEmocionSeleccionada((actual) =>
            actual === idEmocion ? null : idEmocion,
        );
    }

    // ======================================================
    // PUBLICAR
    // ======================================================

    async function manejarPublicar() {
        if (publicando) {
            return;
        }

        if (authLoading) {
            Alert.alert("Espera un momento", "Estamos verificando tu sesión.");

            return;
        }

        if (!profile?.id_usuario) {
            Alert.alert("Sesión no disponible", "No pudimos identificar tu usuario.");

            return;
        }

        if (!titulo.trim()) {
            Alert.alert("Título requerido", "Escribe un título para tu publicación.");

            return;
        }

        if (!contenido.trim()) {
            Alert.alert("Contenido requerido", "Escribe algo que quieras compartir.");

            return;
        }

        if (!idEmocionSeleccionada) {
            Alert.alert(
                "Selecciona una emoción",
                "Selecciona la emoción que mejor represente tu publicación.",
            );

            return;
        }

        try {
            setPublicando(true);

            await crearPublicacion({
                idUsuario: profile.id_usuario,
                titulo,
                contenido,
                emociones: [idEmocionSeleccionada],
            });

            router.replace("/(tabs)/foro");
        } catch (error) {
            console.error("Error creando publicación:", error);

            Alert.alert(
                "No se pudo publicar",
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al crear la publicación.",
            );
        } finally {
            setPublicando(false);
        }
    }

    // ======================================================
    // UI
    // ======================================================

    return (
        <SafeAreaView
            edges={["top", "bottom"]}
            style={{
                flex: 1,
                backgroundColor,
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 18,
                    paddingBottom: 60,
                }}
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <View
                    style={{
                        marginBottom: 28,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Pressable
                        disabled={publicando}
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
                            fontFamily: "Nunito-Bold",
                            fontSize: 25,
                            color: textColor,
                        }}
                    >
                        Nueva publicación
                    </Text>

                    {profile?.foto_perfil ? (
                        <Image
                            source={{
                                uri: profile.foto_perfil,
                            }}
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                borderWidth: 1,
                                borderColor,
                            }}
                        />
                    ) : (
                        <View
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 1,
                                borderColor,
                                backgroundColor: surfaceSecondaryColor,
                            }}
                        >
                            <Ionicons name="person-outline" size={21} color={iconColor} />
                        </View>
                    )}
                </View>

                {/* ==================================================
                    TARJETA
                ================================================== */}

                <View
                    style={{
                        borderRadius: 22,
                        borderWidth: 1,
                        borderColor,
                        backgroundColor: surfaceColor,
                        padding: 20,
                    }}
                >
                    {/* USUARIO */}

                    <View
                        style={{
                            marginBottom: 20,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        {profile?.foto_perfil ? (
                            <Image
                                source={{
                                    uri: profile.foto_perfil,
                                }}
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 28,
                                    borderWidth: 1,
                                    borderColor,
                                }}
                            />
                        ) : (
                            <View
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 28,
                                    borderWidth: 1,
                                    borderColor,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: surfaceSecondaryColor,
                                }}
                            >
                                <Ionicons name="person-outline" size={26} color={iconColor} />
                            </View>
                        )}

                        <View
                            style={{
                                flex: 1,
                                marginLeft: 14,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Nunito-Bold",
                                    fontSize: 18,
                                    color: textColor,
                                }}
                            >
                                {nombreUsuario}
                            </Text>

                            {emocionSeleccionada && (
                                <View
                                    style={{
                                        alignSelf: "flex-start",
                                        marginTop: 6,
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 999,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: primarySoftColor,
                                    }}
                                >
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={15}
                                        color={primaryColor}
                                    />

                                    <Text
                                        style={{
                                            marginLeft: 5,
                                            fontFamily: "Nunito-SemiBold",
                                            fontSize: 13,
                                            color: primaryColor,
                                        }}
                                    >
                                        {emocionSeleccionada.nombre}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* ==================================================
                        TÍTULO
                    ================================================== */}

                    <TextInput
                        value={titulo}
                        onChangeText={setTitulo}
                        editable={!publicando}
                        placeholder="Título de tu publicación"
                        placeholderTextColor={placeholderColor}
                        selectionColor={primaryColor}
                        maxLength={150}
                        style={{
                            marginBottom: 14,
                            paddingHorizontal: 4,
                            paddingBottom: 13,
                            borderBottomWidth: 1,
                            borderBottomColor: borderColor,
                            fontFamily: "Nunito-Bold",
                            fontSize: 18,
                            color: textColor,
                        }}
                    />

                    {/* ==================================================
                        CONTENIDO
                    ================================================== */}

                    <TextInput
                        value={contenido}
                        onChangeText={setContenido}
                        editable={!publicando}
                        placeholder="¿Qué quieres compartir con la comunidad?"
                        placeholderTextColor={placeholderColor}
                        selectionColor={primaryColor}
                        multiline
                        textAlignVertical="top"
                        maxLength={3000}
                        style={{
                            minHeight: 230,
                            paddingHorizontal: 4,
                            fontFamily: "Nunito-Medium",
                            fontSize: 16,
                            lineHeight: 24,
                            color: textColor,
                        }}
                    />

                    <Text
                        style={{
                            marginTop: 8,
                            textAlign: "right",
                            fontFamily: "Nunito-Medium",
                            fontSize: 13,
                            color: textMutedColor,
                        }}
                    >
                        {contenido.length}/3000 caracteres
                    </Text>
                </View>

                {/* ==================================================
                    EMOCIONES
                ================================================== */}

                <Text
                    style={{
                        marginTop: 30,
                        marginBottom: 16,
                        fontFamily: "Nunito-SemiBold",
                        fontSize: 17,
                        lineHeight: 24,
                        color: primaryColor,
                    }}
                >
                    Selecciona la emoción que mejor describa tu publicación
                </Text>

                {cargandoEmociones ? (
                    <View
                        style={{
                            minHeight: 80,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ActivityIndicator size="small" color={primaryColor} />

                        <Text
                            style={{
                                marginLeft: 10,
                                fontFamily: "Nunito-Medium",
                                color: textSecondaryColor,
                            }}
                        >
                            Cargando emociones...
                        </Text>
                    </View>
                ) : emociones.length > 0 ? (
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 10,
                        }}
                    >
                        {emociones.map((emocion) => {
                            const seleccionada =
                                emocion.id_emocion_foro === idEmocionSeleccionada;

                            return (
                                <TouchableOpacity
                                    key={emocion.id_emocion_foro}
                                    activeOpacity={0.8}
                                    disabled={publicando}
                                    onPress={() => seleccionarEmocion(emocion.id_emocion_foro)}
                                    style={{
                                        minHeight: 44,
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: 999,
                                        borderWidth: seleccionada ? 2 : 1,
                                        borderColor: seleccionada ? primaryColor : borderColor,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: seleccionada
                                            ? primaryColor
                                            : surfaceSecondaryColor,
                                    }}
                                >
                                    {seleccionada && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={18}
                                            color="#FFFFFF"
                                        />
                                    )}

                                    <Text
                                        style={{
                                            marginLeft: seleccionada ? 7 : 0,
                                            fontFamily: seleccionada
                                                ? "Nunito-Bold"
                                                : "Nunito-Medium",
                                            fontSize: 15,
                                            color: seleccionada ? "#FFFFFF" : textSecondaryColor,
                                        }}
                                    >
                                        {emocion.nombre}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ) : (
                    <View
                        style={{
                            padding: 16,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor,
                            backgroundColor: surfaceSecondaryColor,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons
                            name="alert-circle-outline"
                            size={22}
                            color={dangerColor}
                        />

                        <Text
                            style={{
                                flex: 1,
                                marginLeft: 10,
                                fontFamily: "Nunito-Medium",
                                color: textSecondaryColor,
                            }}
                        >
                            No hay emociones disponibles.
                        </Text>
                    </View>
                )}

                {/* ==================================================
                    REGLAS
                ================================================== */}

                <ReglasForo />

                {/* ==================================================
                    BOTÓN PUBLICAR
                ================================================== */}

                <TouchableOpacity
                    activeOpacity={0.82}
                    onPress={manejarPublicar}
                    disabled={
                        publicando || authLoading || cargandoEmociones || !formularioValido
                    }
                    style={{
                        width: "100%",
                        minHeight: 58,
                        marginTop: 34,
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor: formularioValido ? primaryColor : borderColor,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: formularioValido
                            ? primaryColor
                            : surfaceSecondaryColor,
                        opacity: publicando ? 0.7 : 1,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {publicando ? (
                            <>
                                <ActivityIndicator size="small" color="#FFFFFF" />

                                <Text
                                    style={{
                                        marginLeft: 10,
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 17,
                                        color: "#FFFFFF",
                                    }}
                                >
                                    Publicando...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",
                                        fontSize: 18,
                                        color: formularioValido ? "#FFFFFF" : textMutedColor,
                                    }}
                                >
                                    Publicar
                                </Text>

                                <Ionicons
                                    name="send"
                                    size={21}
                                    color={formularioValido ? "#FFFFFF" : textMutedColor}
                                    style={{
                                        marginLeft: 10,
                                    }}
                                />
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
