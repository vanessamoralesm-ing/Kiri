import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { usePathname, useRouter } from "expo-router";
import React, { useState } from "react";

import { Image, Platform, Pressable, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// TIPOS
// ==========================================================

type OpcionSidebar = {
    id: "home" | "diario" | "educacion" | "tecnicas" | "perfil";

    titulo: string;

    icono: keyof typeof Ionicons.glyphMap;

    iconoActivo: keyof typeof Ionicons.glyphMap;

    ruta: string;
};

// ==========================================================
// OPCIONES
// ==========================================================

const OPCIONES_SIDEBAR: OpcionSidebar[] = [
    {
        id: "home",
        titulo: "Inicio",
        icono: "home-outline",
        iconoActivo: "home",
        ruta: "/home",
    },
    {
        id: "diario",
        titulo: "Diario",
        icono: "book-outline",
        iconoActivo: "book",
        ruta: "/diario",
    },
    {
        id: "educacion",
        titulo: "Educación",
        icono: "school-outline",
        iconoActivo: "school",
        ruta: "/educacion",
    },
    {
        id: "tecnicas",
        titulo: "Técnicas",
        icono: "heart-outline",
        iconoActivo: "heart",
        ruta: "/tecnicas",
    },
    {
        id: "perfil",
        titulo: "Perfil",
        icono: "person-outline",
        iconoActivo: "person",
        ruta: "/perfil",
    },
];

// ==========================================================
// COMPONENTE
// ==========================================================

export function SidebarDesktop() {
    const router = useRouter();

    const pathname = usePathname();

    const { dark: isDarkMode } = useTheme();

    const [retraida, setRetraida] = useState(false);

    // ========================================================
    // TEMA
    // ========================================================

    const surfaceColor = useThemeColor({}, "surface");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const borderColor = useThemeColor({}, "border");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    // ========================================================
    // RUTAS SECUNDARIAS
    // ========================================================

    const esRutaSecundariaInicio =
        pathname.startsWith("/cuestionarios") ||
        pathname.startsWith("/foro") ||
        pathname.startsWith("/entrevistas");

    // ========================================================
    // ACTIVO
    // ========================================================

    const estaActiva = (opcion: OpcionSidebar) => {
        if (opcion.id === "home") {
            return pathname === "/" || pathname === "/home" || esRutaSecundariaInicio;
        }

        return pathname.startsWith(`/${opcion.id}`);
    };

    // ========================================================
    // NAVEGACIÓN
    // ========================================================

    const navegar = (ruta: string) => {
        router.push(ruta as any);
    };

    // ========================================================
    // UI
    // ========================================================

    return (
        <View
            style={{
                width: retraida ? 76 : 220,

                minWidth: retraida ? 76 : 220,

                height: "100%",

                backgroundColor: surfaceColor,

                borderRightWidth: 1,

                borderRightColor: borderColor,

                paddingHorizontal: retraida ? 10 : 16,

                paddingTop: 20,

                paddingBottom: 20,

                ...Platform.select({
                    web: {
                        transition: "width 180ms ease",

                        boxShadow: "3px 0px 12px rgba(0, 0, 0, 0.04)",
                    },
                }),
            }}
        >
            {/* ==================================================
          LOGO / BOTÓN RETRAER
      ================================================== */}

            <Pressable
                onPress={() => setRetraida((actual) => !actual)}
                style={({ pressed }) => ({
                    width: "100%",

                    minHeight: 72,

                    alignItems: "center",

                    justifyContent: "center",

                    marginBottom: 24,

                    opacity: pressed ? 0.75 : 1,
                })}
            >
                <Image
                    source={
                        isDarkMode
                            ? require("../../assets/images/splash-icon-ps.png")
                            : require("../../assets/images/splash-icon.png")
                    }
                    resizeMode="contain"
                    style={{
                        width: retraida ? 48 : 125,

                        height: retraida ? 48 : 72,
                    }}
                />
            </Pressable>

            {/* ==================================================
          NAVEGACIÓN
      ================================================== */}

            <View
                style={{
                    gap: 8,
                }}
            >
                {OPCIONES_SIDEBAR.map((opcion) => {
                    const activa = estaActiva(opcion);

                    return (
                        <Pressable
                            key={opcion.id}
                            onPress={() => navegar(opcion.ruta)}
                            style={({ pressed }) => ({
                                width: "100%",

                                minHeight: 48,

                                borderRadius: 13,

                                paddingHorizontal: retraida ? 0 : 14,

                                flexDirection: "row",

                                alignItems: "center",

                                justifyContent: retraida ? "center" : "flex-start",

                                backgroundColor: activa ? primarySoftColor : "transparent",

                                opacity: pressed ? 0.72 : 1,
                            })}
                        >
                            {/* ICONO */}

                            <View
                                style={{
                                    width: 36,

                                    height: 36,

                                    alignItems: "center",

                                    justifyContent: "center",
                                }}
                            >
                                <Ionicons
                                    name={activa ? opcion.iconoActivo : opcion.icono}
                                    size={20}
                                    color={activa ? primaryColor : textSecondaryColor}
                                />
                            </View>

                            {/* TEXTO */}

                            {!retraida && (
                                <Text
                                    style={{
                                        marginLeft: 8,

                                        fontFamily: activa ? "Nunito-Bold" : "Nunito-SemiBold",

                                        fontSize: 14,

                                        color: activa ? primaryColor : textColor,
                                    }}
                                >
                                    {opcion.titulo}
                                </Text>
                            )}
                        </Pressable>
                    );
                })}
            </View>

            {/* ==================================================
          ESPACIADOR
      ================================================== */}

            <View
                style={{
                    flex: 1,
                }}
            />

            {/* ==================================================
          PIE
      ================================================== */}

            {!retraida && (
                <View
                    style={{
                        borderTopWidth: 1,

                        borderTopColor: borderColor,

                        paddingTop: 16,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-SemiBold",

                            fontSize: 12,

                            color: textSecondaryColor,

                            textAlign: "center",
                        }}
                    >
                        Kiri
                    </Text>

                    <Text
                        style={{
                            marginTop: 3,

                            fontFamily: "Nunito-Medium",

                            fontSize: 10,

                            color: textSecondaryColor,

                            textAlign: "center",
                        }}
                    >
                        Bienestar emocional
                    </Text>
                </View>
            )}
        </View>
    );
}
