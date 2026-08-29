import React from "react";

import {
    Pressable,
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
    texto: string;

    seleccionada: boolean;

    onPress: () => void;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function OpcionRespuesta({
    texto,
    seleccionada,
    onPress,
}: Props) {

    // ========================================================
    // TEMA
    // ========================================================

    const surfaceColor =
        useThemeColor(
            {},
            "surface"
        );

    const borderColor =
        useThemeColor(
            {},
            "border"
        );

    const textColor =
        useThemeColor(
            {},
            "text"
        );

    const primaryColor =
        useThemeColor(
            {},
            "primary"
        );

    const primarySoftColor =
        useThemeColor(
            {},
            "primarySoft"
        );


    // ========================================================
    // UI
    // ========================================================

    return (
        <Pressable
            onPress={
                onPress
            }

            style={{
                width:
                    "100%",

                borderRadius:
                    16,

                borderWidth:
                    1,

                paddingHorizontal:
                    16,

                paddingVertical:
                    16,

                marginBottom:
                    12,

                backgroundColor:
                    seleccionada
                        ? primarySoftColor
                        : surfaceColor,

                borderColor:
                    seleccionada
                        ? primaryColor
                        : borderColor,

                shadowColor:
                    "#000000",

                shadowOffset: {
                    width:
                        0,

                    height:
                        2,
                },

                shadowOpacity:
                    0.08,

                shadowRadius:
                    3,

                elevation:
                    2,
            }}
        >

            <View className="flex-row items-center">

                {/* Indicador */}

                <View
                    style={{
                        width:
                            20,

                        height:
                            20,

                        borderRadius:
                            10,

                        borderWidth:
                            2,

                        marginRight:
                            12,

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        borderColor:
                            seleccionada
                                ? primaryColor
                                : borderColor,
                    }}
                >

                    {
                        seleccionada && (

                            <View
                                style={{
                                    width:
                                        10,

                                    height:
                                        10,

                                    borderRadius:
                                        5,

                                    backgroundColor:
                                        primaryColor,
                                }}
                            />

                        )
                    }

                </View>


                {/* Texto */}

                <Text
                    style={{
                        flex:
                            1,

                        fontFamily:
                            seleccionada
                                ? "Nunito-SemiBold"
                                : "Nunito-Medium",

                        fontSize:
                            15,

                        lineHeight:
                            20,

                        color:
                            seleccionada
                                ? primaryColor
                                : textColor,
                    }}
                >
                    {texto}
                </Text>

            </View>

        </Pressable>
    );

}