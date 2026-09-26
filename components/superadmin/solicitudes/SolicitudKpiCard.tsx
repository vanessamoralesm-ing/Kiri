import { Ionicons } from "@expo/vector-icons";

import React from "react";

import { Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

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
                flex: 1,
                minHeight: 170,
                padding: 20,
                borderWidth: 1,
                borderColor,
                borderRadius: 18,
                backgroundColor: surfaceColor,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Text
                    style={{
                        fontFamily: "Nunito-SemiBold",
                        fontSize: 11,
                        color: textSecondaryColor,
                    }}
                >
                    {titulo}
                </Text>

                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colores.fondo,
                    }}
                >
                    <Ionicons name={icono} size={19} color={colores.color} />
                </View>
            </View>

            <View
                style={{
                    marginTop: 18,
                    flexDirection: "row",
                    alignItems: "baseline",
                }}
            >
                <Text
                    style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 34,
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
                            fontSize: 15,
                            color: textColor,
                        }}
                    >
                        {sufijo}
                    </Text>
                )}
            </View>

            <View
                style={{
                    marginTop: "auto",
                    paddingTop: 15,
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
                        fontSize: 11,
                        color: descripcionDestacada ? colores.color : textMutedColor,
                    }}
                >
                    {descripcion}
                </Text>
            </View>
        </View>
    );
}
