import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Platform, Pressable, Text, View } from "react-native";

import Logo from "@/components/ui/Logo_izq";

import { useThemeMode } from "@/contexts/ThemeModeContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useAuth } from "@/services/authProvider";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function AdminHeader() {
    const router = useRouter();

    const { profile, user } = useAuth();

    const { isDarkMode, toggleDarkMode } = useThemeMode();

    const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

    const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);

    // ========================================================
    // TEMA
    // ========================================================

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

    // ========================================================
    // USUARIO
    // ========================================================

    const nombreUsuario = useMemo(() => {
        const nombrePreferido = profile?.nombre_preferido?.trim();

        const nombres = profile?.nombres?.trim();

        const metadata =
            user?.user_metadata?.nombre_preferido?.trim?.() ||
            user?.user_metadata?.nombres?.trim?.() ||
            user?.user_metadata?.nombre?.trim?.();

        return nombrePreferido || nombres || metadata || "Usuario";
    }, [profile?.nombre_preferido, profile?.nombres, user?.user_metadata]);

    const nombreCompleto = useMemo(() => {
        const nombres =
            profile?.nombres?.trim() || user?.user_metadata?.nombres?.trim?.() || "";

        const apellidos =
            profile?.apellidos?.trim() ||
            user?.user_metadata?.apellidos?.trim?.() ||
            "";

        return `${nombres} ${apellidos}`.trim() || nombreUsuario;
    }, [
        profile?.nombres,
        profile?.apellidos,
        user?.user_metadata,
        nombreUsuario,
    ]);

    const fotoPerfil =
        profile?.foto_perfil ?? user?.user_metadata?.foto_perfil ?? null;

    // ========================================================
    // RESPONSIVE
    // ========================================================

    const alturaHeader = esEscritorio ? 82 : esTablet ? 68 : 62;

    const paddingHorizontal = esEscritorio ? 28 : esTablet ? 18 : 12;

    const tamañoAvatar = esEscritorio ? 40 : 34;

    // ========================================================
    // UI
    // ========================================================

    return (
        <View
            style={{
                minHeight: alturaHeader,

                paddingHorizontal,

                borderBottomWidth: 1,
                borderBottomColor: borderColor,

                backgroundColor: surfaceColor,

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",

                zIndex: 5000,
                overflow: "visible",
            }}
        >
            {/* ==================================================
          IZQUIERDA
      ================================================== */}

            {esEscritorio ? (
                <View
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: "Nunito-Bold",
                            fontSize: 22,
                            color: textColor,
                        }}
                    >
                        Hola, {nombreUsuario} (Superadministrador)
                    </Text>

                    <Text
                        style={{
                            marginTop: 3,

                            fontFamily: "Nunito-Medium",
                            fontSize: 13,

                            color: textSecondaryColor,
                        }}
                    >
                        Bienvenido a Kiri
                    </Text>
                </View>
            ) : (
                <View
                    style={{
                        flex: 1,
                        minWidth: 0,

                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Logo ancho={esTelefono ? 68 : 78} alto={esTelefono ? 30 : 34} />

                    <View
                        style={{
                            flex: 1,
                            minWidth: 0,

                            marginLeft: 9,
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                fontFamily: "Nunito-Bold",

                                fontSize: esTelefono ? 14 : 16,

                                color: textColor,
                            }}
                        >
                            Hola, {nombreUsuario}
                        </Text>

                        <Text
                            numberOfLines={1}
                            style={{
                                marginTop: 1,

                                fontFamily: "Nunito-Medium",
                                fontSize: 10,

                                color: textMutedColor,
                            }}
                        >
                            Superadministrador
                        </Text>
                    </View>
                </View>
            )}

            {/* ==================================================
          ACCIONES
      ================================================== */}

            <View
                style={{
                    marginLeft: 8,

                    flexDirection: "row",
                    alignItems: "center",

                    gap: esEscritorio ? 12 : 5,
                }}
            >
                {/* TEMA */}

                <Pressable
                    onPress={toggleDarkMode}
                    accessibilityRole="button"
                    accessibilityLabel={
                        isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
                    }
                    style={({ pressed }) => ({
                        minWidth: esEscritorio ? undefined : 40,

                        minHeight: 40,

                        paddingHorizontal: esEscritorio ? 12 : 3,

                        borderRadius: 12,

                        borderWidth: 1,
                        borderColor,

                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",

                        backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,
                    })}
                >
                    <View
                        style={{
                            width: esEscritorio ? 28 : 32,

                            height: esEscritorio ? 28 : 32,

                            borderRadius: 9,

                            alignItems: "center",
                            justifyContent: "center",

                            backgroundColor: primarySoftColor,
                        }}
                    >
                        <Ionicons
                            name={isDarkMode ? "moon-outline" : "sunny-outline"}
                            size={18}
                            color={primaryColor}
                        />
                    </View>

                    {esEscritorio && (
                        <>
                            <Text
                                style={{
                                    marginLeft: 8,

                                    fontFamily: "Nunito-SemiBold",
                                    fontSize: 12,

                                    color: textSecondaryColor,
                                }}
                            >
                                {isDarkMode ? "Oscuro" : "Claro"}
                            </Text>

                            <Ionicons
                                name="swap-horizontal-outline"
                                size={14}
                                color={textMutedColor}
                                style={{
                                    marginLeft: 7,
                                }}
                            />
                        </>
                    )}
                </Pressable>

                {/* ESTADO SISTEMA - SOLO ESCRITORIO */}

                {esEscritorio && (
                    <View
                        style={{
                            minHeight: 34,

                            paddingHorizontal: 15,

                            borderRadius: 999,

                            flexDirection: "row",
                            alignItems: "center",

                            backgroundColor: secondarySoftColor,
                        }}
                    >
                        <View
                            style={{
                                width: 7,
                                height: 7,

                                borderRadius: 4,

                                marginRight: 8,

                                backgroundColor: secondaryColor,
                            }}
                        />

                        <Text
                            style={{
                                fontFamily: "Nunito-SemiBold",
                                fontSize: 12,
                                color: secondaryColor,
                            }}
                        >
                            Sistema Operativo 100%
                        </Text>
                    </View>
                )}

                {/* NOTIFICACIONES - TABLET / ESCRITORIO */}

                {!esTelefono && (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Ver notificaciones"
                        style={({ pressed }) => ({
                            width: 40,
                            height: 40,

                            borderRadius: 12,

                            alignItems: "center",
                            justifyContent: "center",

                            backgroundColor: pressed ? surfaceSecondaryColor : "transparent",
                        })}
                    >
                        <Ionicons
                            name="notifications-outline"
                            size={20}
                            color={textSecondaryColor}
                        />

                        <View
                            style={{
                                position: "absolute",

                                top: 7,
                                right: 8,

                                width: 7,
                                height: 7,

                                borderRadius: 4,

                                backgroundColor: "#DC2626",

                                borderWidth: 1.5,
                                borderColor: surfaceColor,
                            }}
                        />
                    </Pressable>
                )}

                {/* ==================================================
            PERFIL
        ================================================== */}

                <View
                    style={{
                        position: "relative",

                        zIndex: 6000,

                        ...(Platform.OS === "android"
                            ? {
                                elevation: 30,
                            }
                            : {}),
                    }}
                >
                    <Pressable
                        onPress={() => setMenuPerfilAbierto((actual) => !actual)}
                        style={({ pressed }) => ({
                            minWidth: esEscritorio ? 220 : 42,

                            minHeight: esEscritorio ? 56 : 42,

                            paddingHorizontal: esEscritorio ? 10 : 4,

                            borderRadius: 13,

                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",

                            backgroundColor: menuPerfilAbierto
                                ? primarySoftColor
                                : pressed
                                    ? surfaceSecondaryColor
                                    : "transparent",
                        })}
                    >
                        {fotoPerfil ? (
                            <Image
                                source={{
                                    uri: fotoPerfil,
                                }}
                                style={{
                                    width: tamañoAvatar,
                                    height: tamañoAvatar,

                                    borderRadius: tamañoAvatar / 2,

                                    borderWidth: 1,
                                    borderColor,
                                }}
                            />
                        ) : (
                            <View
                                style={{
                                    width: tamañoAvatar,
                                    height: tamañoAvatar,

                                    borderRadius: tamañoAvatar / 2,

                                    alignItems: "center",
                                    justifyContent: "center",

                                    backgroundColor: surfaceSecondaryColor,

                                    borderWidth: 1,
                                    borderColor,
                                }}
                            >
                                <Ionicons
                                    name="person-outline"
                                    size={18}
                                    color={primaryColor}
                                />
                            </View>
                        )}

                        {esEscritorio && (
                            <>
                                <View
                                    style={{
                                        flex: 1,
                                        minWidth: 0,

                                        marginLeft: 10,
                                    }}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: "Nunito-Bold",
                                            fontSize: 13,
                                            color: textColor,
                                        }}
                                    >
                                        {nombreCompleto}
                                    </Text>

                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            marginTop: 1,

                                            fontFamily: "Nunito-Medium",
                                            fontSize: 11,

                                            color: textMutedColor,
                                        }}
                                    >
                                        Superadministrador
                                    </Text>
                                </View>

                                <Ionicons
                                    name={menuPerfilAbierto ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color={textMutedColor}
                                />
                            </>
                        )}
                    </Pressable>

                    {/* DROPDOWN */}

                    {menuPerfilAbierto && (
                        <View
                            style={{
                                position: "absolute",

                                top: esEscritorio ? 62 : 48,

                                right: 0,

                                width: esTelefono ? 175 : 210,

                                padding: 6,

                                borderRadius: 13,

                                borderWidth: 1,
                                borderColor,

                                backgroundColor: surfaceColor,

                                zIndex: 9999,

                                ...(Platform.OS === "web"
                                    ? ({
                                        boxShadow: "0px 8px 24px rgba(0,0,0,0.14)",
                                    } as any)
                                    : {}),

                                ...(Platform.OS === "ios"
                                    ? {
                                        shadowColor: "#000000",

                                        shadowOffset: {
                                            width: 0,
                                            height: 8,
                                        },

                                        shadowOpacity: 0.14,
                                        shadowRadius: 12,
                                    }
                                    : {}),

                                ...(Platform.OS === "android"
                                    ? {
                                        elevation: 25,
                                    }
                                    : {}),
                            }}
                        >
                            <Pressable
                                onPress={() => {
                                    setMenuPerfilAbierto(false);

                                    router.push("/superadmin/perfil" as never);
                                }}
                                style={({ pressed }) => ({
                                    minHeight: 40,

                                    paddingHorizontal: 10,

                                    borderRadius: 9,

                                    flexDirection: "row",
                                    alignItems: "center",

                                    backgroundColor: pressed
                                        ? surfaceSecondaryColor
                                        : "transparent",
                                })}
                            >
                                <Ionicons
                                    name="person-outline"
                                    size={18}
                                    color={textSecondaryColor}
                                />

                                <Text
                                    style={{
                                        marginLeft: 9,

                                        fontFamily: "Nunito-Medium",
                                        fontSize: 12,

                                        color: textSecondaryColor,
                                    }}
                                >
                                    Mi perfil
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    setMenuPerfilAbierto(false);

                                    router.push("/superadmin/configuracion" as never);
                                }}
                                style={({ pressed }) => ({
                                    minHeight: 40,

                                    paddingHorizontal: 10,

                                    borderRadius: 9,

                                    flexDirection: "row",
                                    alignItems: "center",

                                    backgroundColor: pressed
                                        ? surfaceSecondaryColor
                                        : "transparent",
                                })}
                            >
                                <Ionicons
                                    name="settings-outline"
                                    size={18}
                                    color={textSecondaryColor}
                                />

                                <Text
                                    style={{
                                        marginLeft: 9,

                                        fontFamily: "Nunito-Medium",
                                        fontSize: 12,

                                        color: textSecondaryColor,
                                    }}
                                >
                                    Preferencias
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
