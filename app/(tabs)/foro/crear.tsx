import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import React, { useEffect, useMemo, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import ReglasForo from "@/components/foro/ReglasForo";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

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

    const insets = useSafeAreaInsets();

    const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

    const { profile, loading: authLoading } = useAuth();

    // ========================================================
    // ESTADOS
    // ========================================================

    const [titulo, setTitulo] = useState("");

    const [contenido, setContenido] = useState("");

    const [emociones, setEmociones] = useState<EmocionForo[]>([]);

    const [idEmocionSeleccionada, setIdEmocionSeleccionada] = useState<
        string | null
    >(null);

    const [cargandoEmociones, setCargandoEmociones] = useState(true);

    const [publicando, setPublicando] = useState(false);

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

    const placeholderColor = useThemeColor({}, "placeholder");

    const iconColor = useThemeColor({}, "icon");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const dangerColor = useThemeColor({}, "danger");

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
     * Aunque el dashboard sea ancho, mantenemos el formulario
     * con un ancho cómodo de lectura/escritura.
     */
    const maxWidthFormulario = esEscritorio ? 860 : esTablet ? 760 : undefined;

    const paddingTop = esEscritorio ? 28 : esTablet ? 24 : 18;

    const paddingBottom = esEscritorio ? 64 : Math.max(insets.bottom + 90, 110);

    // ========================================================
    // DATOS DERIVADOS
    // ========================================================

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

    // ========================================================
    // CARGAR EMOCIONES
    // ========================================================

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

    // ========================================================
    // SELECCIONAR EMOCIÓN
    // ========================================================

    function seleccionarEmocion(idEmocion: string) {
        if (publicando) {
            return;
        }

        setIdEmocionSeleccionada((actual) =>
            actual === idEmocion ? null : idEmocion,
        );
    }

    // ========================================================
    // PUBLICAR
    // ========================================================

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
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingTop,

                    paddingBottom,
                }}
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
              FORMULARIO
          ================================================== */}

                    <View
                        style={{
                            width: "100%",

                            maxWidth: maxWidthFormulario,

                            alignSelf: "center",
                        }}
                    >
                        {/* ==================================================
                HEADER
            ================================================== */}

                        <View
                            style={{
                                marginBottom: esEscritorio ? 28 : 24,

                                flexDirection: "row",

                                alignItems: "center",
                            }}
                        >
                            <Pressable
                                disabled={publicando}
                                onPress={() => router.back()}
                                hitSlop={8}
                                style={({ pressed }) => ({
                                    width: 46,

                                    height: 46,

                                    flexShrink: 0,

                                    borderRadius: 15,

                                    borderWidth: 1,

                                    borderColor,

                                    alignItems: "center",

                                    justifyContent: "center",

                                    backgroundColor: pressed
                                        ? surfaceSecondaryColor
                                        : surfaceColor,

                                    opacity: publicando ? 0.5 : pressed ? 0.8 : 1,

                                    ...Platform.select({
                                        web: {
                                            boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                                        },

                                        ios: {
                                            shadowColor: "#000000",

                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },

                                            shadowOpacity: 0.05,

                                            shadowRadius: 5,
                                        },

                                        android: {
                                            elevation: 2,
                                        },
                                    }),
                                })}
                            >
                                <Ionicons name="arrow-back" size={22} color={iconColor} />
                            </Pressable>

                            <View
                                style={{
                                    flex: 1,

                                    minWidth: 0,

                                    marginLeft: 15,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Nunito-Bold",

                                        fontSize: esEscritorio ? 29 : esTablet ? 27 : 24,

                                        color: textColor,
                                    }}
                                >
                                    Nueva publicación
                                </Text>

                                {!esTelefono && (
                                    <Text
                                        style={{
                                            marginTop: 3,

                                            fontFamily: "Nunito-Medium",

                                            fontSize: 13,

                                            color: textSecondaryColor,
                                        }}
                                    >
                                        Comparte una experiencia con la comunidad.
                                    </Text>
                                )}
                            </View>

                            {/* PERFIL */}

                            {profile?.foto_perfil ? (
                                <Image
                                    source={{
                                        uri: profile.foto_perfil,
                                    }}
                                    style={{
                                        width: 46,

                                        height: 46,

                                        borderRadius: 23,

                                        borderWidth: 1,

                                        borderColor,
                                    }}
                                />
                            ) : (
                                <View
                                    style={{
                                        width: 46,

                                        height: 46,

                                        borderRadius: 23,

                                        alignItems: "center",

                                        justifyContent: "center",

                                        borderWidth: 1,

                                        borderColor,

                                        backgroundColor: surfaceColor,
                                    }}
                                >
                                    <Ionicons name="person-outline" size={21} color={iconColor} />
                                </View>
                            )}
                        </View>

                        {/* ==================================================
                TARJETA DE PUBLICACIÓN
            ================================================== */}

                        <View
                            style={{
                                width: "100%",

                                borderRadius: 24,

                                borderWidth: 1,

                                borderColor,

                                backgroundColor: surfaceColor,

                                padding: esEscritorio ? 24 : 20,

                                ...Platform.select({
                                    web: {
                                        boxShadow: "0px 3px 10px rgba(0,0,0,0.04)",
                                    },

                                    ios: {
                                        shadowColor: "#000000",

                                        shadowOffset: {
                                            width: 0,

                                            height: 3,
                                        },

                                        shadowOpacity: 0.05,

                                        shadowRadius: 7,
                                    },

                                    android: {
                                        elevation: 2,
                                    },
                                }),
                            }}
                        >
                            {/* ==============================================
                  USUARIO
              ============================================== */}

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
                                        <Ionicons
                                            name="person-outline"
                                            size={26}
                                            color={iconColor}
                                        />
                                    </View>
                                )}

                                <View
                                    style={{
                                        flex: 1,

                                        minWidth: 0,

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

                            {/* ==============================================
                  TÍTULO
              ============================================== */}

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

                                    fontSize: esEscritorio ? 19 : 18,

                                    color: textColor,

                                    outlineStyle: "none" as any,
                                }}
                            />

                            {/* ==============================================
                  CONTENIDO
              ============================================== */}

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
                                    minHeight: esEscritorio ? 260 : esTablet ? 240 : 220,

                                    paddingHorizontal: 4,

                                    fontFamily: "Nunito-Medium",

                                    fontSize: 16,

                                    lineHeight: 24,

                                    color: textColor,

                                    outlineStyle: "none" as any,
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
                                {contenido.length}
                                /3000 caracteres
                            </Text>
                        </View>

                        {/* ==================================================
                EMOCIONES
            ================================================== */}

                        <View
                            style={{
                                marginTop: esEscritorio ? 30 : 26,
                            }}
                        >
                            <Text
                                style={{
                                    marginBottom: 6,

                                    fontFamily: "Nunito-Bold",

                                    fontSize: esEscritorio ? 18 : 17,

                                    lineHeight: 24,

                                    color: textColor,
                                }}
                            >
                                ¿Cómo te hace sentir esta publicación?
                            </Text>

                            <Text
                                style={{
                                    marginBottom: 16,

                                    fontFamily: "Nunito-Medium",

                                    fontSize: 13,

                                    lineHeight: 19,

                                    color: textSecondaryColor,
                                }}
                            >
                                Selecciona la emoción que mejor describa lo que quieres
                                compartir.
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

                                        gap: esEscritorio ? 12 : 10,
                                    }}
                                >
                                    {emociones.map((emocion) => {
                                        const seleccionada =
                                            emocion.id_emocion_foro === idEmocionSeleccionada;

                                        return (
                                            <Pressable
                                                key={emocion.id_emocion_foro}
                                                disabled={publicando}
                                                onPress={() =>
                                                    seleccionarEmocion(emocion.id_emocion_foro)
                                                }
                                                style={({ pressed }) => ({
                                                    minHeight: 44,

                                                    paddingHorizontal: 16,

                                                    paddingVertical: 10,

                                                    borderRadius: 999,

                                                    borderWidth: seleccionada ? 2 : 1,

                                                    borderColor: seleccionada
                                                        ? primaryColor
                                                        : borderColor,

                                                    flexDirection: "row",

                                                    alignItems: "center",

                                                    justifyContent: "center",

                                                    backgroundColor: seleccionada
                                                        ? primaryColor
                                                        : surfaceColor,

                                                    opacity: publicando ? 0.5 : pressed ? 0.78 : 1,
                                                })}
                                            >
                                                {seleccionada && (
                                                    <Ionicons
                                                        name="checkmark-circle"
                                                        size={18}
                                                        color={textOnPrimaryColor}
                                                    />
                                                )}

                                                <Text
                                                    style={{
                                                        marginLeft: seleccionada ? 7 : 0,

                                                        fontFamily: seleccionada
                                                            ? "Nunito-Bold"
                                                            : "Nunito-Medium",

                                                        fontSize: 14,

                                                        color: seleccionada
                                                            ? textOnPrimaryColor
                                                            : textSecondaryColor,
                                                    }}
                                                >
                                                    {emocion.nombre}
                                                </Text>
                                            </Pressable>
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

                                        backgroundColor: surfaceColor,

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
                        </View>

                        {/* ==================================================
                REGLAS
            ================================================== */}

                        <View
                            style={{
                                marginTop: esEscritorio ? 30 : 26,
                            }}
                        >
                            <ReglasForo />
                        </View>

                        {/* ==================================================
                BOTÓN PUBLICAR
            ================================================== */}

                        <Pressable
                            onPress={manejarPublicar}
                            disabled={
                                publicando ||
                                authLoading ||
                                cargandoEmociones ||
                                !formularioValido
                            }
                            style={({ pressed }) => ({
                                width: "100%",

                                minHeight: 56,

                                marginTop: 30,

                                borderRadius: 16,

                                borderWidth: 1,

                                borderColor: formularioValido ? primaryColor : borderColor,

                                alignItems: "center",

                                justifyContent: "center",

                                backgroundColor: formularioValido ? primaryColor : surfaceColor,

                                opacity: publicando
                                    ? 0.7
                                    : pressed && formularioValido
                                        ? 0.82
                                        : 1,
                            })}
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
                                        <ActivityIndicator
                                            size="small"
                                            color={textOnPrimaryColor}
                                        />

                                        <Text
                                            style={{
                                                marginLeft: 10,

                                                fontFamily: "Nunito-Bold",

                                                fontSize: 16,

                                                color: textOnPrimaryColor,
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

                                                fontSize: 16,

                                                color: formularioValido
                                                    ? textOnPrimaryColor
                                                    : textMutedColor,
                                            }}
                                        >
                                            Publicar
                                        </Text>

                                        <Ionicons
                                            name="send"
                                            size={19}
                                            color={
                                                formularioValido ? textOnPrimaryColor : textMutedColor
                                            }
                                            style={{
                                                marginLeft: 9,
                                            }}
                                        />
                                    </>
                                )}
                            </View>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
