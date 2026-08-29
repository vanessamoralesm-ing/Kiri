import React from "react";

import {
    Image,
    Pressable,
    Text,
    View,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    useThemeColor,
} from "@/hooks/use-theme-color";

import type {
    ComentarioForo,
} from "@/types/foro";


// ==========================================================
// PROPS
// ==========================================================

interface ComentarioCardProps {
    comentario: ComentarioForo;

    esPropio: boolean;

    onEditar: () => void;

    onEliminar: () => void;

    onReportar: () => void;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function ComentarioCard({
    comentario,
    esPropio,
    onEditar,
    onEliminar,
    onReportar,
}: ComentarioCardProps) {

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


    const dividerColor =
        useThemeColor(
            {},
            "divider"
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


    const primarySoftColor =
        useThemeColor(
            {},
            "primarySoft"
        );


    const dangerColor =
        useThemeColor(
            {},
            "danger"
        );


    // ========================================================
    // ESTADO DEL MENÚ
    // ========================================================

    const [
        menuAbierto,
        setMenuAbierto,
    ] =
        React.useState(
            false
        );


    // ========================================================
    // DATOS VISUALES
    // ========================================================

    const nombreUsuario =
        comentario.usuario
            ?.nombre_preferido
            ?.trim() ||

        comentario.usuario
            ?.nombres
            ?.trim() ||

        "Usuario";


    const fotoPerfil =
        comentario.usuario
            ?.foto_perfil ??
        null;


    // ========================================================
    // FECHA
    // ========================================================

    function formatearFecha(
        fecha: string
    ) {

        const valor =
            new Date(
                fecha
            );


        if (
            Number.isNaN(
                valor.getTime()
            )
        ) {

            return "";

        }


        const ahora =
            new Date();


        const diferencia =
            Math.max(
                0,
                ahora.getTime() -
                valor.getTime()
            );


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
            minutos <
            1
        ) {

            return "Ahora";

        }


        if (
            minutos <
            60
        ) {

            return `${minutos} min`;

        }


        if (
            horas <
            24
        ) {

            return `${horas} h`;

        }


        if (
            dias <
            7
        ) {

            return `${dias} d`;

        }


        return valor.toLocaleDateString(
            "es-NI",
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric",
            }
        );

    }


    const fecha =
        formatearFecha(
            comentario.fecha_comentario
        );


    // ========================================================
    // ACCIONES
    // ========================================================

    function manejarEditar() {

        setMenuAbierto(
            false
        );


        onEditar();

    }


    function manejarEliminar() {

        setMenuAbierto(
            false
        );


        onEliminar();

    }


    function manejarReportar() {

        setMenuAbierto(
            false
        );


        onReportar();

    }


    // ========================================================
    // UI
    // ========================================================

    return (

        <View
            style={{
                position:
                    "relative",

                marginBottom:
                    12,

                padding:
                    16,

                borderRadius:
                    18,

                borderWidth:
                    1,

                borderColor,

                backgroundColor:
                    surfaceColor,

                zIndex:
                    menuAbierto
                        ? 100
                        : 1,
            }}
        >

            {/* ===================================================
          CABECERA
      =================================================== */}

            <View
                style={{
                    flexDirection:
                        "row",

                    alignItems:
                        "center",
                }}
            >

                {/* =================================================
            AVATAR
        ================================================= */}

                {
                    fotoPerfil

                        ? (

                            <Image
                                source={{
                                    uri:
                                        fotoPerfil,
                                }}

                                style={{
                                    width:
                                        40,

                                    height:
                                        40,

                                    borderRadius:
                                        20,

                                    borderWidth:
                                        1,

                                    borderColor,
                                }}
                            />

                        )

                        : (

                            <View
                                style={{
                                    width:
                                        40,

                                    height:
                                        40,

                                    borderRadius:
                                        20,

                                    borderWidth:
                                        1,

                                    borderColor,

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
                                    size={19}

                                    color={
                                        iconColor
                                    }
                                />

                            </View>

                        )
                }


                {/* =================================================
            INFORMACIÓN
        ================================================= */}

                <View
                    style={{
                        flex:
                            1,

                        marginLeft:
                            11,
                    }}
                >

                    <View
                        style={{
                            flexDirection:
                                "row",

                            alignItems:
                                "center",

                            flexWrap:
                                "wrap",
                        }}
                    >

                        <Text
                            numberOfLines={
                                1
                            }

                            style={{
                                maxWidth:
                                    "75%",

                                fontFamily:
                                    "Nunito-Bold",

                                fontSize:
                                    14,

                                color:
                                    textColor,
                            }}
                        >
                            {nombreUsuario}
                        </Text>


                        {
                            esPropio && (

                                <View
                                    style={{
                                        marginLeft:
                                            7,

                                        paddingHorizontal:
                                            7,

                                        paddingVertical:
                                            2,

                                        borderRadius:
                                            999,

                                        backgroundColor:
                                            primarySoftColor,
                                    }}
                                >

                                    <Text
                                        style={{
                                            fontFamily:
                                                "Nunito-SemiBold",

                                            fontSize:
                                                10,

                                            color:
                                                primaryColor,
                                        }}
                                    >
                                        Tú
                                    </Text>

                                </View>

                            )
                        }

                    </View>


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
                        {fecha}

                        {
                            comentario.editada
                                ? " · Editado"
                                : ""
                        }
                    </Text>

                </View>


                {/* =================================================
            TRES PUNTOS
        ================================================= */}

                <Pressable
                    hitSlop={
                        8
                    }

                    onPress={() =>
                        setMenuAbierto(
                            actual =>
                                !actual
                        )
                    }

                    style={({
                        pressed,
                    }) => ({
                        width:
                            40,

                        height:
                            40,

                        borderRadius:
                            20,

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        backgroundColor:
                            pressed
                                ? surfaceSecondaryColor
                                : "transparent",
                    })}
                >

                    <Ionicons
                        name="ellipsis-horizontal"
                        size={20}

                        color={
                            iconColor
                        }
                    />

                </Pressable>

            </View>


            {/* ===================================================
          MENÚ CONTEXTUAL
      =================================================== */}

            {
                menuAbierto && (

                    <View
                        style={{
                            position:
                                "absolute",

                            top:
                                52,

                            right:
                                12,

                            minWidth:
                                165,

                            paddingVertical:
                                6,

                            paddingHorizontal:
                                5,

                            borderRadius:
                                14,

                            borderWidth:
                                1,

                            borderColor,

                            backgroundColor:
                                surfaceColor,

                            shadowColor:
                                "#000000",

                            shadowOffset: {
                                width:
                                    0,

                                height:
                                    4,
                            },

                            shadowOpacity:
                                0.18,

                            shadowRadius:
                                8,

                            elevation:
                                12,

                            zIndex:
                                999,
                        }}
                    >

                        {
                            esPropio

                                ? (

                                    <>

                                        {/* =========================================
                        EDITAR
                    ========================================= */}

                                        <Pressable
                                            onPress={
                                                manejarEditar
                                            }

                                            style={({
                                                pressed,
                                            }) => ({
                                                minHeight:
                                                    44,

                                                paddingHorizontal:
                                                    12,

                                                borderRadius:
                                                    10,

                                                flexDirection:
                                                    "row",

                                                alignItems:
                                                    "center",

                                                backgroundColor:
                                                    pressed
                                                        ? surfaceSecondaryColor
                                                        : "transparent",
                                            })}
                                        >

                                            <Ionicons
                                                name="create-outline"
                                                size={19}

                                                color={
                                                    iconColor
                                                }
                                            />


                                            <Text
                                                style={{
                                                    marginLeft:
                                                        10,

                                                    fontFamily:
                                                        "Nunito-SemiBold",

                                                    fontSize:
                                                        14,

                                                    color:
                                                        textColor,
                                                }}
                                            >
                                                Editar
                                            </Text>

                                        </Pressable>


                                        <View
                                            style={{
                                                height:
                                                    1,

                                                marginHorizontal:
                                                    8,

                                                backgroundColor:
                                                    dividerColor,
                                            }}
                                        />


                                        {/* =========================================
                        ELIMINAR
                    ========================================= */}

                                        <Pressable
                                            onPress={
                                                manejarEliminar
                                            }

                                            style={({
                                                pressed,
                                            }) => ({
                                                minHeight:
                                                    44,

                                                paddingHorizontal:
                                                    12,

                                                borderRadius:
                                                    10,

                                                flexDirection:
                                                    "row",

                                                alignItems:
                                                    "center",

                                                backgroundColor:
                                                    pressed
                                                        ? surfaceSecondaryColor
                                                        : "transparent",
                                            })}
                                        >

                                            <Ionicons
                                                name="trash-outline"
                                                size={19}

                                                color={
                                                    dangerColor
                                                }
                                            />


                                            <Text
                                                style={{
                                                    marginLeft:
                                                        10,

                                                    fontFamily:
                                                        "Nunito-SemiBold",

                                                    fontSize:
                                                        14,

                                                    color:
                                                        dangerColor,
                                                }}
                                            >
                                                Eliminar
                                            </Text>

                                        </Pressable>

                                    </>

                                )

                                : (

                                    /* ===========================================
                                        REPORTAR
                                    =========================================== */

                                    <Pressable
                                        onPress={
                                            manejarReportar
                                        }

                                        style={({
                                            pressed,
                                        }) => ({
                                            minHeight:
                                                44,

                                            paddingHorizontal:
                                                12,

                                            borderRadius:
                                                10,

                                            flexDirection:
                                                "row",

                                            alignItems:
                                                "center",

                                            backgroundColor:
                                                pressed
                                                    ? surfaceSecondaryColor
                                                    : "transparent",
                                        })}
                                    >

                                        <Ionicons
                                            name="flag-outline"
                                            size={19}

                                            color={
                                                iconColor
                                            }
                                        />


                                        <Text
                                            style={{
                                                marginLeft:
                                                    10,

                                                fontFamily:
                                                    "Nunito-SemiBold",

                                                fontSize:
                                                    14,

                                                color:
                                                    textColor,
                                            }}
                                        >
                                            Reportar
                                        </Text>

                                    </Pressable>

                                )
                        }

                    </View>

                )
            }


            {/* ===================================================
          CONTENIDO
      =================================================== */}

            <Text
                style={{
                    marginTop:
                        13,

                    fontFamily:
                        "Nunito-Medium",

                    fontSize:
                        15,

                    lineHeight:
                        22,

                    color:
                        textSecondaryColor,
                }}
            >
                {
                    comentario.contenido
                }
            </Text>

        </View>

    );

}