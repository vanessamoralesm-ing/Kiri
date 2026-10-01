import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

interface SolicitudKpiCardProps {
    titulo: string;
    valor: string | number;
    sufijo?: string;
    descripcion: string;
    icono: keyof typeof Ionicons.glyphMap;
    variante: "primary" | "secondary" | "accent";
    descripcionDestacada?: boolean;
}

export default function SolicitudKpiCard({
    titulo,
    valor,
    sufijo,
    descripcion,
    icono,
    variante,
    descripcionDestacada = false,
}: SolicitudKpiCardProps) {
    const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

    const surfaceColor = useThemeColor({}, "surface");

    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const textMutedColor = useThemeColor({}, "textMuted");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const secondaryColor = useThemeColor({}, "secondary");

    const secondarySoftColor = useThemeColor({}, "secondarySoft");

    const accentColor = useThemeColor({}, "accent");

    const accentSoftColor = useThemeColor({}, "accentSoft");

    const colores = {
        primary: {
            color: primaryColor,

            fondo: primarySoftColor,
        },

        secondary: {
            color: secondaryColor,

            fondo: secondarySoftColor,
        },

        accent: {
            color: accentColor,

            fondo: accentSoftColor,
        },
    }[variante];

    return (
        <View
            style={{
                width: "100%",

                minHeight: esTelefono ? 155 : 170,

                padding: esTelefono ? 16 : 20,

                borderWidth: 1,

                borderColor,

                borderRadius: 18,

                backgroundColor: surfaceColor,
            }}
        >
            {/* SUPERIOR */}

            <View
                style={{
                    flexDirection: "row",

                    alignItems: "flex-start",

                    justifyContent: "space-between",
                }}
            >
                <Text
                    style={{
                        flex: 1,

                        marginRight: 12,

                        fontFamily: "Nunito-SemiBold",

                        fontSize: esTelefono ? 11 : 11,

                        lineHeight: 16,

                        color: textSecondaryColor,
                    }}
                >
                    {titulo}
                </Text>

                <View
                    style={{
                        width: esTelefono ? 42 : 40,

                        height: esTelefono ? 42 : 40,

                        borderRadius: 12,

                        flexShrink: 0,

                        alignItems: "center",

                        justifyContent: "center",

                        backgroundColor: colores.fondo,
                    }}
                >
                    <Ionicons
                        name={icono}
                        size={esTelefono ? 20 : 19}
                        color={colores.color}
                    />
                </View>
            </View>

            {/* VALOR */}

            <View
                style={{
                    marginTop: esTelefono ? 14 : 18,

                    flexDirection: "row",

                    flexWrap: "wrap",

                    alignItems: "baseline",
                }}
            >
                <Text
                    style={{
                        fontFamily: "Nunito-Bold",

                        fontSize: esTelefono ? 31 : 34,

                        color: textColor,
                    }}
                >
                    {valor}
                </Text>

                {sufijo && (
                    <Text
                        style={{
                            marginLeft: 6,

                            fontFamily: "Nunito-SemiBold",

                            fontSize: esTelefono ? 13 : 15,

                            color: textColor,
                        }}
                    >
                        {sufijo}
                    </Text>
                )}
            </View>

            {/* DESCRIPCIÓN */}

            <View
                style={{
                    marginTop: "auto",

                    paddingTop: 14,

                    borderTopWidth: 1,

                    borderTopColor: borderColor,

                    flexDirection: "row",

                    alignItems: "center",
                }}
            >
                <Ionicons
                    name={
                        variante === "secondary"
                            ? "trending-up-outline"
                            : variante === "accent"
                                ? "checkbox-outline"
                                : "time-outline"
                    }
                    size={16}
                    color={descripcionDestacada ? colores.color : textMutedColor}
                />

                <Text
                    style={{
                        flex: 1,

                        marginLeft: 7,

                        fontFamily: "Nunito-Medium",

                        fontSize: esTelefono ? 11 : 11,

                        lineHeight: 16,

                        color: descripcionDestacada ? colores.color : textMutedColor,
                    }}
                >
                    {descripcion}
                </Text>
            </View>
        </View>
    );
}
