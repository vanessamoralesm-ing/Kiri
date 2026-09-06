import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";

import { Image, Pressable, Text, View } from "react-native";

import { useThemeMode } from "@/contexts/ThemeModeContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/services/authProvider";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function AdminHeader() {
    const router = useRouter();

    const { profile, user } = useAuth();

    const { isDarkMode, toggleDarkMode } = useThemeMode();

    const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);

    // ======================================================
    // TEMA
    // ======================================================

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

    // ======================================================
    // DATOS DEL USUARIO AUTENTICADO
    // ======================================================

    const nombreUsuario = useMemo(() => {
        const nombrePreferido = profile?.nombre_preferido?.trim();

        const nombres = profile?.nombres?.trim();

        const nombreMetadata =
            user?.user_metadata?.nombre_preferido?.trim?.() ||
            user?.user_metadata?.nombres?.trim?.() ||
            user?.user_metadata?.nombre?.trim?.();

        return nombrePreferido || nombres || nombreMetadata || "Usuario";
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

    // ======================================================
    // UI
    // ======================================================

    return (
        <View
            style={{
                minHeight: 82,
                paddingHorizontal: 28,
                borderBottomWidth: 1,
                borderBottomColor: borderColor,
                backgroundColor: surfaceColor,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 100,
            }}
        >
            {/* ==================================================
                SALUDO
            ================================================== */}

            <View>
                <Text
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

            {/* ==================================================
                ACCIONES
            ================================================== */}

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                {/* ==============================================
                    SELECTOR DE TEMA
                ============================================== */}

                <Pressable
                    onPress={toggleDarkMode}
                    accessibilityRole="button"
                    accessibilityLabel={
                        isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
                    }
                    style={({ pressed }) => ({
                        minHeight: 40,
                        paddingHorizontal: 12,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,
                    })}
                >
                    <View
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 9,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: primarySoftColor,
                        }}
                    >
                        <Ionicons
                            name={isDarkMode ? "moon-outline" : "sunny-outline"}
                            size={17}
                            color={primaryColor}
                        />
                    </View>

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
                </Pressable>

                {/* ==============================================
                    ESTADO DEL SISTEMA
                ============================================== */}

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

                {/* ==============================================
                    NOTIFICACIONES
                ============================================== */}

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Ver notificaciones"
                    style={({ pressed }) => ({
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: pressed ? surfaceSecondaryColor : "transparent",
                    })}
                >
                    <Ionicons
                        name="notifications-outline"
                        size={21}
                        color={textSecondaryColor}
                    />

                    <View
                        style={{
                            position: "absolute",
                            top: 8,
                            right: 9,
                            width: 7,
                            height: 7,
                            borderRadius: 4,
                            backgroundColor: "#DC2626",
                            borderWidth: 1.5,
                            borderColor: surfaceColor,
                        }}
                    />
                </Pressable>

                {/* ==============================================
                    PERFIL
                ============================================== */}

                <View
                    style={{
                        position: "relative",
                    }}
                >
                    <Pressable
                        onPress={() => setMenuPerfilAbierto((actual) => !actual)}
                        style={({ pressed }) => ({
                            minWidth: 220,
                            minHeight: 56,
                            paddingHorizontal: 10,
                            borderRadius: 14,
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: pressed ? surfaceSecondaryColor : "transparent",
                        })}
                    >
                        {fotoPerfil ? (
                            <Image
                                source={{
                                    uri: fotoPerfil,
                                }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor,
                                }}
                            />
                        ) : (
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: surfaceSecondaryColor,
                                    borderWidth: 1,
                                    borderColor,
                                }}
                            >
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color={primaryColor}
                                />
                            </View>
                        )}

                        <View
                            style={{
                                flex: 1,
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
                    </Pressable>

                    {/* ==========================================
                        DROPDOWN
                    ========================================== */}

                    {menuPerfilAbierto && (
                        <View
                            style={{
                                position: "absolute",
                                top: 62,
                                right: 0,
                                width: 220,
                                padding: 8,
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor,
                                backgroundColor: surfaceColor,
                                boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                                zIndex: 999,
                            }}
                        >
                            <Pressable
                                onPress={() => {
                                    setMenuPerfilAbierto(false);

                                    router.push("/superadmin/perfil" as never);
                                }}
                                style={({ pressed }) => ({
                                    minHeight: 42,
                                    paddingHorizontal: 12,
                                    borderRadius: 10,
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
                                        marginLeft: 10,
                                        fontFamily: "Nunito-Medium",
                                        fontSize: 13,
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
                                    minHeight: 42,
                                    paddingHorizontal: 12,
                                    borderRadius: 10,
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
                                        marginLeft: 10,
                                        fontFamily: "Nunito-Medium",
                                        fontSize: 13,
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
