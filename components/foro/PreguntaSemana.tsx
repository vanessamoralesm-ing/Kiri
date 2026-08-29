import {
    Ionicons,
} from "@expo/vector-icons";

import React, {
    useState,
} from "react";

import {
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// COMPONENTE
// ==========================================================

export default function PreguntaSemana() {

    const [
        respuesta,
        setRespuesta,
    ] =
        useState("");


    // ========================================================
    // TEMA
    // ========================================================

    const surfaceColor =
        useThemeColor(
            {},
            "surface"
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

    const textColor =
        useThemeColor(
            {},
            "text"
        );

    const textSecondaryColor =
        useThemeColor(
            {},
            "textSecondary"
        );

    const placeholderColor =
        useThemeColor(
            {},
            "placeholder"
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

    const secondarySoftColor =
        useThemeColor(
            {},
            "secondarySoft"
        );


    // ========================================================
    // UI
    // ========================================================

    return (
        <View>

            {/* Título */}

            <Text
                style={{
                    marginBottom:
                        16,

                    fontFamily:
                        "Nunito-Bold",

                    fontSize:
                        24,

                    color:
                        textColor,
                }}
            >
                La pregunta de la semana
            </Text>


            {/* Tarjeta */}

            <View
                style={{
                    borderRadius:
                        22,

                    borderWidth:
                        1,

                    borderColor,

                    backgroundColor:
                        surfaceColor,

                    padding:
                        20,
                }}
            >

                {/* =================================================
            ENCABEZADO
        ================================================= */}

                <View className="mb-4 flex-row items-center">

                    <View
                        style={{
                            height:
                                70,

                            width:
                                70,

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            borderRadius:
                                35,

                            backgroundColor:
                                surfaceSecondaryColor,
                        }}
                    >

                        <Ionicons
                            name="heart-outline"
                            size={32}
                            color={
                                primaryColor
                            }
                        />

                    </View>


                    <View className="ml-4">

                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-Bold",

                                fontSize:
                                    22,

                                color:
                                    textColor,
                            }}
                        >
                            Kiri
                        </Text>


                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-Medium",

                                fontSize:
                                    15,

                                color:
                                    textSecondaryColor,
                            }}
                        >
                            Todos
                        </Text>

                    </View>

                </View>


                {/* =================================================
            PREGUNTA
        ================================================= */}

                <Text
                    style={{
                        marginBottom:
                            20,

                        fontFamily:
                            "Nunito-SemiBold",

                        fontSize:
                            18,

                        lineHeight:
                            24,

                        color:
                            primaryColor,
                    }}
                >
                    ¿Qué señal te avisa que necesitas bajar el ritmo?
                </Text>


                {/* =================================================
            ZONA INFERIOR
        ================================================= */}

                <View className="mb-4 flex-row items-center justify-between">

                    <View className="flex-row">

                        <View
                            style={{
                                height:
                                    32,

                                width:
                                    32,

                                borderRadius:
                                    16,

                                borderWidth:
                                    1,

                                borderColor:
                                    primaryColor,

                                backgroundColor:
                                    surfaceSecondaryColor,
                            }}
                        />


                        <View
                            style={{
                                height:
                                    32,

                                width:
                                    32,

                                marginLeft:
                                    -8,

                                borderRadius:
                                    16,

                                borderWidth:
                                    1,

                                borderColor:
                                    primaryColor,

                                backgroundColor:
                                    surfaceSecondaryColor,
                            }}
                        />


                        <View
                            style={{
                                height:
                                    32,

                                width:
                                    32,

                                marginLeft:
                                    -8,

                                borderRadius:
                                    16,

                                borderWidth:
                                    1,

                                borderColor:
                                    primaryColor,

                                backgroundColor:
                                    surfaceSecondaryColor,
                            }}
                        />

                    </View>


                    <View
                        style={{
                            height:
                                32,

                            width:
                                80,

                            borderRadius:
                                12,

                            backgroundColor:
                                primarySoftColor,
                        }}
                    />

                </View>


                {/* =================================================
            RESPUESTA RÁPIDA
        ================================================= */}

                <View
                    style={{
                        flexDirection:
                            "row",

                        alignItems:
                            "center",

                        borderRadius:
                            18,

                        paddingHorizontal:
                            16,

                        backgroundColor:
                            secondarySoftColor,

                        borderWidth:
                            1,

                        borderColor:
                            borderColor,
                    }}
                >

                    <TextInput
                        value={
                            respuesta
                        }

                        onChangeText={
                            setRespuesta
                        }

                        placeholder="Escribe tu respuesta..."

                        placeholderTextColor={
                            placeholderColor
                        }

                        selectionColor={
                            primaryColor
                        }

                        style={{
                            minHeight:
                                54,

                            flex:
                                1,

                            fontFamily:
                                "Nunito-Medium",

                            fontSize:
                                15,

                            color:
                                textColor,
                        }}
                    />


                    <Pressable
                        className="h-11 w-11 items-center justify-center"

                        onPress={() => {

                            console.log(
                                "Respuesta:",
                                respuesta
                            );

                        }}
                    >

                        <Ionicons
                            name="send"
                            size={28}
                            color={
                                primaryColor
                            }
                        />

                    </Pressable>

                </View>

            </View>

        </View>
    );

}