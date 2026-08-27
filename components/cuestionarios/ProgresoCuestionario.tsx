import React from "react";

import {
    Text,
    View,
} from "react-native";

interface Props {
    paginaActual: number;
    totalPaginas: number;
    respondidas: number;
    totalPreguntas: number;
}

export default function ProgresoCuestionario({
    paginaActual,
    totalPaginas,
    respondidas,
    totalPreguntas,
}: Props) {
    const porcentaje =
        totalPreguntas === 0
            ? 0
            : Math.round(
                (respondidas / totalPreguntas) * 100
            );

    return (
        <View className="mb-8">
            <View className="flex-row justify-between mb-2">
                <Text
                    style={{
                        fontFamily: "Nunito-Medium",
                        fontSize: 12,
                        color: "#475569",
                    }}
                >
                    {paginaActual} de {totalPaginas}
                </Text>

                <Text
                    style={{
                        fontFamily: "Nunito-Medium",
                        fontSize: 12,
                        color: "#4F8EF7",
                    }}
                >
                    {porcentaje}% completado
                </Text>
            </View>

            <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                        width: `${porcentaje}%`,
                    }}
                />
            </View>
        </View>
    );
}