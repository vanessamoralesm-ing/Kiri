import React from "react";

import {
    Pressable,
    Text,
    View,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import type {
    PublicacionForo,
} from "@/types/foro";

import {
    useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// PROPS
// ==========================================================

interface PublicacionCardProps {
    publicacion: PublicacionForo;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function PublicacionCard({
    publicacion,
}: PublicacionCardProps) {

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

    const textMutedColor =
        useThemeColor(
            {},
            "textMuted"
        );

    const iconColor =
        useThemeColor(
            {},
            "icon"
        );

    const primaryColor =
        useThemeColor(
            {},
            "primary"
        );

    const accentColor =
        useThemeColor(
            {},
            "accent"
        );

    const accentSoftColor =
        useThemeColor(
            {},
            "accentSoft"
        );


    // ========================================================
    // DATOS VISUALES
    // ========================================================

    const nombreUsuario =
        publicacion.usuario?.nombre_preferido ||
        publicacion.usuario?.nombres ||
        "Usuario";


    const emociones =
        publicacion.emociones ?? [];


    const totalReacciones =
        publicacion.total_reacciones ?? 0;


    const totalComentarios =
        publicacion.total_comentarios ?? 0;


    // ========================================================
    // FECHA TEMPORAL
    // ========================================================

    function formatearFecha(
        fecha: string
    ) {

        const fechaPublicacion =
            new Date(
                fecha
            );


        const ahora =
            new Date();


        const diferencia =
            ahora.getTime() -
            fechaPublicacion.getTime();


        const minutos =
            Math.floor(
                diferencia /
                (1000 * 60)
            );


        const horas =
            Math.floor(
                minutos /
                60
            );


        const dias =
            Math.floor(
                horas /
                24
            );


        if (
            minutos < 1
        ) {
            return "Ahora";
        }


        if (
            minutos < 60
        ) {
            return `${minutos} min`;
        }


        if (
            horas < 24
        ) {
            return `${horas} h`;
        }


        return `${dias} d`;

    }


    const fecha =
        formatearFecha(
            publicacion.fecha_publicacion
        );


    // ========================================================
    // UI
    // ========================================================

    return (

        <View
            style={{
                marginBottom:
                    20,

                padding:
                    20,

                borderRadius:
                    24,

                borderWidth:
                    1,

                borderColor,

                backgroundColor:
                    surfaceColor,
            }}
        >

            {/* ===================================================
          USUARIO
      =================================================== */}

            <View
                style={{
                    marginBottom:
                        16,

                    flexDirection:
                        "row",

                    alignItems:
                        "center",
                }}
            >

                {/* Avatar */}

                <View
                    style={{
                        width:
                            46,

                        height:
                            46,

                        borderRadius:
                            23,

                        marginRight:
                            12,

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        backgroundColor:
                            surfaceSecondaryColor,
                    }}
                >

                    <Ionicons
                        name="person-outline"
                        size={23}
                        color={
                            iconColor
                        }
                    />

                </View>


                {/* Nombre y fecha */}

                <View
                    style={{
                        flex:
                            1,
                    }}
                >

                    <View
                        style={{
                            flexDirection:
                                "row",

                            alignItems:
                                "center",
                        }}
                    >

                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-Bold",

                                fontSize:
                                    16,

                                color:
                                    textColor,
                            }}
                        >
                            {nombreUsuario}
                        </Text>


                        <Text
                            style={{
                                marginHorizontal:
                                    6,

                                fontFamily:
                                    "Nunito-Medium",

                                color:
                                    textMutedColor,
                            }}
                        >
                            |
                        </Text>


                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-Medium",

                                fontSize:
                                    13,

                                color:
                                    primaryColor,
                            }}
                        >
                            {fecha}
                        </Text>

                    </View>


                    {
                        publicacion.editada && (

                            <Text
                                style={{
                                    marginTop:
                                        2,

                                    fontFamily:
                                        "Nunito-Medium",

                                    fontSize:
                                        11,

                                    color:
                                        textMutedColor,
                                }}
                            >
                                Editada
                            </Text>

                        )
                    }

                </View>


                {/* Opciones */}

                <Pressable
                    style={{
                        width:
                            40,

                        height:
                            40,

                        alignItems:
                            "center",

                        justifyContent:
                            "center",
                    }}
                >

                    <Ionicons
                        name="ellipsis-horizontal"
                        size={21}
                        color={
                            iconColor
                        }
                    />

                </Pressable>

            </View>


            {/* ===================================================
          EMOCIONES
      =================================================== */}

            {
                emociones.length > 0 && (

                    <View
                        style={{
                            marginBottom:
                                14,

                            flexDirection:
                                "row",

                            flexWrap:
                                "wrap",

                            gap:
                                8,
                        }}
                    >

                        {
                            emociones.map(
                                emocion => (

                                    <View
                                        key={
                                            emocion.id_emocion_foro
                                        }

                                        style={{
                                            paddingHorizontal:
                                                12,

                                            paddingVertical:
                                                5,

                                            borderRadius:
                                                999,

                                            backgroundColor:
                                                accentSoftColor,

                                            borderWidth:
                                                1,

                                            borderColor:
                                                accentColor,
                                        }}
                                    >

                                        <Text
                                            style={{
                                                fontFamily:
                                                    "Nunito-Medium",

                                                fontSize:
                                                    13,

                                                color:
                                                    accentColor,
                                            }}
                                        >
                                            {emocion.nombre}
                                        </Text>

                                    </View>

                                )
                            )
                        }

                    </View>

                )
            }


            {/* ===================================================
          TÍTULO
      =================================================== */}

            <Text
                style={{
                    marginBottom:
                        8,

                    fontFamily:
                        "Nunito-Bold",

                    fontSize:
                        18,

                    color:
                        textColor,
                }}
            >
                {publicacion.titulo}
            </Text>


            {/* ===================================================
          CONTENIDO
      =================================================== */}

            <Text
                style={{
                    fontFamily:
                        "Nunito-Medium",

                    fontSize:
                        15,

                    lineHeight:
                        23,

                    color:
                        textSecondaryColor,
                }}
            >
                {publicacion.contenido}
            </Text>


            {/* ===================================================
          ACCIONES
      =================================================== */}

            <View
                style={{
                    marginTop:
                        20,

                    flexDirection:
                        "row",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",
                }}
            >

                <View
                    style={{
                        flexDirection:
                            "row",

                        alignItems:
                            "center",

                        gap:
                            22,
                    }}
                >

                    {/* Reacciones */}

                    <Pressable
                        style={{
                            flexDirection:
                                "row",

                            alignItems:
                                "center",

                            gap:
                                6,
                        }}
                    >

                        <Ionicons
                            name="heart-outline"
                            size={21}
                            color={
                                primaryColor
                            }
                        />


                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-SemiBold",

                                fontSize:
                                    14,

                                color:
                                    primaryColor,
                            }}
                        >
                            {totalReacciones}
                        </Text>

                    </Pressable>


                    {/* Comentarios */}

                    <Pressable
                        style={{
                            flexDirection:
                                "row",

                            alignItems:
                                "center",

                            gap:
                                6,
                        }}
                    >

                        <Ionicons
                            name="chatbubble-outline"
                            size={20}
                            color={
                                iconColor
                            }
                        />


                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-Medium",

                                fontSize:
                                    14,

                                color:
                                    textSecondaryColor,
                            }}
                        >
                            {totalComentarios}
                        </Text>

                    </Pressable>

                </View>


                {/* Guardar */}

                <Pressable>

                    <Ionicons
                        name="bookmark-outline"
                        size={21}
                        color={
                            iconColor
                        }
                    />

                </Pressable>

            </View>

        </View>

    );

}