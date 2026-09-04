import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";

import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/services/authProvider";

const LOGO_KIRI = require("@/assets/images/splash-icon-ps.png");

// ==========================================================
// TIPOS
// ==========================================================

interface MenuItem {
    label: string;
    route: string;
    icon: keyof typeof Ionicons.glyphMap;
}

// ==========================================================
// MENÚ
// ==========================================================

const MENU_ITEMS: MenuItem[] = [
    {
        label: "Dashboard",
        route: "/superadmin",
        icon: "grid-outline",
    },
    {
        label: "Solicitudes",
        route: "/superadmin/solicitudes",
        icon: "mail-outline",
    },
    {
        label: "Instituciones",
        route: "/superadmin/instituciones",
        icon: "business-outline",
    },
    {
        label: "Catálogo oficial",
        route: "/superadmin/catalogo-oficial",
        icon: "library-outline",
    },
    {
        label: "Gestión de usuarios",
        route: "/superadmin/usuarios",
        icon: "people-outline",
    },
    {
        label: "Gestión de contenido",
        route: "/superadmin/contenido",
        icon: "documents-outline",
    },
    {
        label: "Cuestionarios",
        route: "/superadmin/cuestionarios",
        icon: "clipboard-outline",
    },
    {
        label: "Reportes globales",
        route: "/superadmin/reportes",
        icon: "analytics-outline",
    },
    {
        label: "Configuración",
        route: "/superadmin/configuracion",
        icon: "settings-outline",
    },
];

// ==========================================================
// COMPONENTE
// ==========================================================

export default function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const { signOut } = useAuth();

    const [cerrandoSesion, setCerrandoSesion] = useState(false);

    // ======================================================
    // TEMA
    // ======================================================

    const surfaceColor = useThemeColor({}, "surface");
    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");
    const borderColor = useThemeColor({}, "border");
    const textSecondaryColor = useThemeColor({}, "textSecondary");
    const textMutedColor = useThemeColor({}, "textMuted");
    const primaryColor = useThemeColor({}, "primary");
    const primarySoftColor = useThemeColor({}, "primarySoft");

    // ======================================================
    // RUTA ACTIVA
    // ======================================================

    const rutaActual = useMemo(() => {
        if (pathname === "/superadmin" || pathname === "/superadmin/") {
            return "/superadmin";
        }

        return pathname;
    }, [pathname]);

    function estaActiva(route: string) {
        if (route === "/superadmin") {
            return rutaActual === "/superadmin";
        }

        return rutaActual === route || rutaActual.startsWith(`${route}/`);
    }

    // ======================================================
    // NAVEGACIÓN
    // ======================================================

    function navegar(route: string) {
        if (rutaActual === route) {
            return;
        }

        router.push(route as never);
    }

    // ======================================================
    // CERRAR SESIÓN
    // ======================================================

    async function manejarCerrarSesion() {
        if (cerrandoSesion) {
            return;
        }

        try {
            setCerrandoSesion(true);

            await signOut();

            router.replace("/login" as never);
        } catch (error) {
            console.error("Error cerrando sesión:", error);
        } finally {
            setCerrandoSesion(false);
        }
    }

    // ======================================================
    // UI
    // ======================================================

    return (
        <View
            style={{
                width: 270,
                minWidth: 270,
                height: "100%",
                paddingHorizontal: 14,
                paddingTop: 20,
                paddingBottom: 18,
                borderRightWidth: 1,
                borderRightColor: borderColor,
                backgroundColor: surfaceColor,
            }}
        >
            {/* ==================================================
                MARCA
            ================================================== */}

            <View
                style={{
                    minHeight: 64,
                    marginBottom: 22,
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Image
                    source={LOGO_KIRI}
                    resizeMode="contain"
                    style={{
                        width: 105,
                        height: 46,
                    }}
                />

                <View
                    style={{
                        marginLeft: 10,
                    }}
                >
                    <View
                        style={{
                            paddingHorizontal: 7,
                            paddingVertical: 3,
                            borderRadius: 999,
                            backgroundColor: primarySoftColor,
                            alignSelf: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Nunito-Bold",
                                fontSize: 8,
                                color: primaryColor,
                            }}
                        >
                            ADMIN
                        </Text>
                    </View>

                    <Text
                        style={{
                            marginTop: 4,
                            fontFamily: "Nunito-Bold",
                            fontSize: 9,
                            letterSpacing: 0.8,
                            color: textMutedColor,
                        }}
                    >
                        SUPERADMIN
                    </Text>
                </View>
            </View>

            {/* ==================================================
                MENÚ
            ================================================== */}

            <View
                style={{
                    gap: 4,
                }}
            >
                {MENU_ITEMS.map((item) => {
                    const activa = estaActiva(item.route);

                    return (
                        <Pressable
                            key={item.route}
                            onPress={() => navegar(item.route)}
                            style={({ pressed }) => ({
                                minHeight: 46,
                                paddingHorizontal: 14,
                                borderRadius: 12,
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: activa
                                    ? primaryColor
                                    : pressed
                                        ? surfaceSecondaryColor
                                        : "transparent",
                            })}
                        >
                            <Ionicons
                                name={item.icon}
                                size={19}
                                color={activa ? "#FFFFFF" : textSecondaryColor}
                            />

                            <Text
                                style={{
                                    flex: 1,
                                    marginLeft: 12,
                                    fontFamily: activa ? "Nunito-Bold" : "Nunito-Medium",
                                    fontSize: 14,
                                    color: activa ? "#FFFFFF" : textSecondaryColor,
                                }}
                            >
                                {item.label}
                            </Text>

                            {activa && (
                                <Ionicons name="chevron-forward" size={15} color="#FFFFFF" />
                            )}
                        </Pressable>
                    );
                })}
            </View>

            {/* ==================================================
                ESPACIADOR
            ================================================== */}

            <View style={{ flex: 1 }} />

            {/* ==================================================
                AYUDA
            ================================================== */}

            <Pressable
                onPress={() => {
                    console.log("Abrir documentación");
                }}
                style={({ pressed }) => ({
                    minHeight: 44,
                    paddingHorizontal: 14,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: pressed ? surfaceSecondaryColor : "transparent",
                })}
            >
                <Ionicons name="help-circle-outline" size={19} color={textMutedColor} />

                <Text
                    style={{
                        marginLeft: 12,
                        fontFamily: "Nunito-Medium",
                        fontSize: 13,
                        color: textSecondaryColor,
                    }}
                >
                    Ayuda y Docs
                </Text>
            </Pressable>

            {/* ==================================================
                CERRAR SESIÓN
            ================================================== */}

            <Pressable
                disabled={cerrandoSesion}
                onPress={manejarCerrarSesion}
                style={({ pressed }) => ({
                    minHeight: 46,
                    marginTop: 4,
                    paddingHorizontal: 14,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    opacity: cerrandoSesion ? 0.6 : 1,
                    backgroundColor: pressed ? "rgba(220, 38, 38, 0.08)" : "transparent",
                })}
            >
                {cerrandoSesion ? (
                    <ActivityIndicator size="small" color="#DC2626" />
                ) : (
                    <Ionicons name="log-out-outline" size={19} color="#DC2626" />
                )}

                <Text
                    style={{
                        marginLeft: 12,
                        fontFamily: "Nunito-SemiBold",
                        fontSize: 13,
                        color: "#DC2626",
                    }}
                >
                    {cerrandoSesion ? "Cerrando sesión..." : "Cerrar sesión"}
                </Text>
            </Pressable>
        </View>
    );
}
