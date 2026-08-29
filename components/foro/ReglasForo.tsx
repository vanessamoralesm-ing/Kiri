import {
    Ionicons,
} from "@expo/vector-icons";

import React, {
    useState,
} from "react";

import {
    Pressable,
    Text,
    View,
} from "react-native";

import {
    useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// REGLAS
// ==========================================================

const REGLAS = [
    {
        titulo:
            "Comparte con autenticidad",

        descripcion:
            "Habla desde tu experiencia personal y evita emitir diagnósticos o recomendaciones sobre la salud mental de otras personas.",
    },

    {
        titulo:
            "Respeta a la comunidad",

        descripcion:
            "Mantén una comunicación amable y empática. No se permiten mensajes ofensivos, discriminatorios o que promuevan el acoso.",
    },

    {
        titulo:
            "Cuida la privacidad",

        descripcion:
            "No compartas información personal o sensible, ni tuya ni de otros usuarios.",
    },

    {
        titulo:
            "Ayúdanos a mantener un espacio seguro",

        descripcion:
            "Reporta cualquier contenido que incumpla las normas o pueda representar un riesgo para la comunidad.",
    },

    {
        titulo:
            "Kiri es un espacio de acompañamiento",

        descripcion:
            "Las herramientas y conversaciones dentro de Kiri tienen un propósito educativo y preventivo. Si necesitas ayuda especializada, busca el apoyo de un profesional de la salud mental.",
    },
];


// ==========================================================
// COMPONENTE
// ==========================================================

export default function ReglasForo() {

    const [
        abiertas,
        setAbiertas,
    ] =
        useState(false);


    // ========================================================
    // TEMA
    // ========================================================

    const primaryColor =
        useThemeColor(
            {},
            "primary"
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

    const iconColor =
        useThemeColor(
            {},
            "icon"
        );

    const surfaceSecondaryColor =
        useThemeColor(
            {},
            "surfaceSecondary"
        );


    // ========================================================
    // UI
    // ========================================================

    return (
        <View className="mt-8">

            {/* Encabezado */}

            <Pressable
                onPress={() =>
                    setAbiertas(
                        valor =>
                            !valor
                    )
                }

                className="flex-row items-center justify-between"
            >

                <Text
                    style={{
                        fontFamily:
                            "Nunito-Bold",

                        fontSize:
                            27,

                        color:
                            primaryColor,
                    }}
                >
                    Reglas del Foro
                </Text>


                <Ionicons
                    name={
                        abiertas
                            ? "chevron-up"
                            : "chevron-down"
                    }

                    size={30}

                    color={
                        primaryColor
                    }
                />

            </Pressable>


            {/* Contenido */}

            {
                abiertas && (

                    <View className="mt-6">

                        <Text
                            style={{
                                marginBottom:
                                    28,

                                textAlign:
                                    "center",

                                fontFamily:
                                    "Nunito-Medium",

                                fontSize:
                                    17,

                                lineHeight:
                                    24,

                                color:
                                    textSecondaryColor,
                            }}
                        >
                            Queremos que este sea un espacio seguro, respetuoso y de apoyo para todas las personas. Antes de publicar, te invitamos a seguir estas recomendaciones.
                        </Text>


                        {
                            REGLAS.map(
                                regla => (

                                    <View
                                        key={
                                            regla.titulo
                                        }

                                        className="mb-6 flex-row"
                                    >

                                        {/* Icono */}

                                        <View
                                            style={{
                                                marginRight:
                                                    16,

                                                marginTop:
                                                    4,

                                                height:
                                                    48,

                                                width:
                                                    48,

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                borderRadius:
                                                    12,

                                                backgroundColor:
                                                    surfaceSecondaryColor,
                                            }}
                                        >

                                            <Ionicons
                                                name="shield-checkmark-outline"
                                                size={23}
                                                color={
                                                    iconColor
                                                }
                                            />

                                        </View>


                                        {/* Texto */}

                                        <View className="flex-1">

                                            <Text
                                                style={{
                                                    marginBottom:
                                                        4,

                                                    fontFamily:
                                                        "Nunito-SemiBold",

                                                    fontSize:
                                                        18,

                                                    color:
                                                        textColor,
                                                }}
                                            >
                                                {regla.titulo}
                                            </Text>


                                            <Text
                                                style={{
                                                    fontFamily:
                                                        "Nunito-Medium",

                                                    fontSize:
                                                        15,

                                                    lineHeight:
                                                        20,

                                                    color:
                                                        textSecondaryColor,
                                                }}
                                            >
                                                {regla.descripcion}
                                            </Text>

                                        </View>

                                    </View>

                                )
                            )
                        }

                    </View>

                )
            }

        </View>
    );

}