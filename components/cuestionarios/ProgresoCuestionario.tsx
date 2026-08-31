import React from "react";

import {
    Text,
    View,
} from "react-native";

import {
    useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// PROPS
// ==========================================================

interface Props {
    paginaActual: number;

    totalPaginas: number;

    respondidas: number;

    totalPreguntas: number;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function ProgresoCuestionario({
    paginaActual,
    totalPaginas,
    respondidas,
    totalPreguntas,
}: Props) {

    // ========================================================
    // TEMA
    // ========================================================

    const textSecondaryColor =
        useThemeColor(
            {},
            "textSecondary"
        );

    const primaryColor =
        useThemeColor(
            {},
            "primary"
        );

    const surfaceSecondaryColor =
        useThemeColor(
            {},
            "surfaceSecondary"
        );


    // ========================================================
    // PORCENTAJE
    // ========================================================

    const porcentaje =
        totalPreguntas === 0
            ? 0
            : Math.round(
                (
                    respondidas /
                    totalPreguntas
                ) * 100
            );


    // ========================================================
    // UI
    // ========================================================

    return (
        <View className="mb-8">

            {/* Información */}

            <View className="flex-row justify-between mb-2">

                <Text
                    style={{
                        fontFamily:
                            "Nunito-Medium",

                        fontSize:
                            12,

                        color:
                            textSecondaryColor,
                    }}
                >
                    {paginaActual} de {totalPaginas}
                </Text>


                <Text
                    style={{
                        fontFamily:
                            "Nunito-Medium",

                        fontSize:
                            12,

                        color:
                            primaryColor,
                    }}
                >
                    {porcentaje}% completado
                </Text>

            </View>


            {/* Barra de progreso */}

            <View
                style={{
                    height:
                        8,

                    borderRadius:
                        999,

                    overflow:
                        "hidden",

                    backgroundColor:
                        surfaceSecondaryColor,
                }}
            >

                <View
                    style={{
                        height:
                            "100%",

                        width:
                            `${porcentaje}%`,

                        borderRadius:
                            999,

                        backgroundColor:
                            primaryColor,
                    }}
                />

            </View>

        </View>
    );

}