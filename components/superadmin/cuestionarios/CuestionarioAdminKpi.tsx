import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

interface Props {
    titulo: string;
    valor: number;

    icono: keyof typeof Ionicons.glyphMap;

    descripcion?: string;

    variante?: "primary" | "success" | "neutral";
}

export default function CuestionariosAdminKpi({
    titulo,
    valor,
    icono,
    descripcion,
    variante = "primary",
}: Props) {
    const surfaceColor = useThemeColor({}, "surface");

    const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

    const borderColor = useThemeColor({}, "border");

    const textColor = useThemeColor({}, "text");

    const textSecondaryColor = useThemeColor({}, "textSecondary");

    const primaryColor = useThemeColor({}, "primary");

    const primarySoftColor = useThemeColor({}, "primarySoft");

    const successColor = useThemeColor({}, "success");

    const colorIcono =
        variante === "success"
            ? successColor
            : variante === "neutral"
                ? textSecondaryColor
                : primaryColor;

    const fondoIcono =
        variante === "primary" ? primarySoftColor : surfaceSecondaryColor;

    return (
        <View
            style={{
                flex: 1,

                minWidth: 0,

                minHeight: 126,

                padding: 18,

                borderWidth: 1,
                borderColor,

                borderRadius: 18,

                backgroundColor: surfaceColor,
            }}
        >
            <View
                style={{
                    flexDirection: "row",

                    alignItems: "flex-start",

                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        flex: 1,

                        minWidth: 0,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Nunito-SemiBold",

                            fontSize: 13,

                            color: textSecondaryColor,
                        }}
                    >
                        {titulo}
                    </Text>

                    <Text
                        style={{
                            marginTop: 8,

                            fontFamily: "Nunito-Bold",

                            fontSize: 30,

                            lineHeight: 36,

                            color: textColor,
                        }}
                    >
                        {valor}
                    </Text>
                </View>

                <View
                    style={{
                        width: 44,
                        height: 44,

                        marginLeft: 12,

                        borderRadius: 14,

                        alignItems: "center",
                        justifyContent: "center",

                        backgroundColor: fondoIcono,
                    }}
                >
                    <Ionicons name={icono} size={22} color={colorIcono} />
                </View>
            </View>

            {descripcion ? (
                <Text
                    style={{
                        marginTop: 8,

                        fontFamily: "Nunito-Medium",

                        fontSize: 12,
                        lineHeight: 17,

                        color: textSecondaryColor,
                    }}
                >
                    {descripcion}
                </Text>
            ) : null}
        </View>
    );
}
