import React from "react";

import {
    Pressable,
    ScrollView,
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
    seleccionada: string;

    onSeleccionar: (emocion: string) => void;
}


// ==========================================================
// EMOCIONES
// ==========================================================

const EMOCIONES = [
    "Todo",
    "Frustración",
    "Miedo",
    "Ansiedad",
    "Alegría",
    "Esperanza",
    "Calma",
    "Enojo",
    "Tristeza",
];


// ==========================================================
// COMPONENTE
// ==========================================================

export default function FiltroEmociones({
    seleccionada,
    onSeleccionar,
}: Props) {

    // ========================================================
    // TEMA
    // ========================================================

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

    const borderColor =
        useThemeColor(
            {},
            "border"
        );

    const textSecondaryColor =
        useThemeColor(
            {},
            "textSecondary"
        );


    // ========================================================
    // UI
    // ========================================================

    return (
        <View>

            <ScrollView
                horizontal

                showsHorizontalScrollIndicator={
                    false
                }

                contentContainerStyle={{
                    gap: 10,
                    paddingHorizontal: 2,
                }}
            >

                {
                    EMOCIONES.map(
                        emocion => {

                            const activa =
                                seleccionada ===
                                emocion;


                            return (

                                <Pressable
                                    key={
                                        emocion
                                    }

                                    onPress={() =>
                                        onSeleccionar(
                                            emocion
                                        )
                                    }

                                    style={{
                                        borderRadius:
                                            999,

                                        borderWidth:
                                            1,

                                        paddingHorizontal:
                                            20,

                                        paddingVertical:
                                            12,

                                        borderColor:
                                            activa
                                                ? primaryColor
                                                : borderColor,

                                        backgroundColor:
                                            activa
                                                ? primaryColor
                                                : surfaceSecondaryColor,
                                    }}
                                >

                                    <Text
                                        style={{
                                            fontFamily:
                                                activa
                                                    ? "Nunito-SemiBold"
                                                    : "Nunito-Medium",

                                            fontSize:
                                                16,

                                            color:
                                                activa
                                                    ? "#FFFFFF"
                                                    : textSecondaryColor,
                                        }}
                                    >
                                        {emocion}
                                    </Text>

                                </Pressable>

                            );

                        }
                    )
                }

            </ScrollView>

        </View>
    );

}