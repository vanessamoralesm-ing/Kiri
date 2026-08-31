import React, {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Image,
    Pressable,
    Text,
    View,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    useRouter,
} from "expo-router";

import type {
    PublicacionForo,
    TipoReaccion,
} from "@/types/foro";

import {
    useThemeColor,
} from "@/hooks/use-theme-color";

import {
    useAuth,
} from "@/services/authProvider";

import {
    reaccionarPublicacion,
} from "@/services/foro/foroService";


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

    const router =
        useRouter();


    const {
        profile,
    } =
        useAuth();


    // ========================================================
    // ESTADOS
    // ========================================================

    const [
        reaccionActual,
        setReaccionActual,
    ] =
        useState<
            TipoReaccion | null
        >(
            publicacion.reaccion_usuario ??
            null
        );


    const [
        totalReacciones,
        setTotalReacciones,
    ] =
        useState(
            publicacion.total_reacciones ??
            0
        );


    const [
        procesandoReaccion,
        setProcesandoReaccion,
    ] =
        useState(
            false
        );


    // ========================================================
    // SINCRONIZAR CON PROPS
    // ========================================================

    useEffect(
        () => {

            setReaccionActual(
                publicacion.reaccion_usuario ??
                null
            );


            setTotalReacciones(
                publicacion.total_reacciones ??
                0
            );

        },
        [
            publicacion.reaccion_usuario,
            publicacion.total_reacciones,
        ]
    );


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


    const primarySoftColor =
        useThemeColor(
            {},
            "primarySoft"
        );


    // ========================================================
    // DATOS VISUALES
    // ========================================================

    const nombreUsuario =
        publicacion.usuario
            ?.nombre_preferido
            ?.trim() ||

        publicacion.usuario
            ?.nombres
            ?.trim() ||

        "Usuario";


    const fotoPerfil =
        publicacion.usuario
            ?.foto_perfil ??
        null;


    const emociones =
        publicacion.emociones ??
        [];


    const totalComentarios =
        publicacion.total_comentarios ??
        0;


    const reaccionMeGusta =
        reaccionActual ===
        "me_gusta";


    // ========================================================
    // FORMATEAR FECHA
    // ========================================================

    function formatearFecha(
        fecha: string
    ) {

        const fechaPublicacion =
            new Date(
                fecha
            );


        if (
            Number.isNaN(
                fechaPublicacion.getTime()
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
                fechaPublicacion.getTime()
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


        return fechaPublicacion
            .toLocaleDateString(
                "es-NI",
                {
                    day:
                        "2-digit",

                    month:
                        "short",
                }
            );

    }


    const fecha =
        formatearFecha(
            publicacion.fecha_publicacion
        );


    // ========================================================
    // ABRIR PUBLICACIÓN
    // ========================================================

    function abrirPublicacion() {

        router.push({
            pathname:
                "/(tabs)/foro/[id]",

            params: {
                id:
                    publicacion.id_publicacion,
            },
        });

    }


    // ========================================================
    // REACCIONAR
    // ========================================================

    async function manejarReaccion() {

        if (
            procesandoReaccion
        ) {
            return;
        }


        if (
            !profile?.id_usuario
        ) {

            Alert.alert(
                "Sesión requerida",
                "Debes iniciar sesión para reaccionar a una publicación."
            );

            return;

        }


        const reaccionAnterior =
            reaccionActual;


        const totalAnterior =
            totalReacciones;


        /*
         * Actualización optimista:
         *
         * Sin reacción -> me gusta:
         * +1
         *
         * me gusta -> quitar:
         * -1
         *
         * otra reacción -> me gusta:
         * total permanece igual
         */

        if (
            reaccionAnterior ===
            "me_gusta"
        ) {

            setReaccionActual(
                null
            );


            setTotalReacciones(
                actual =>
                    Math.max(
                        0,
                        actual - 1
                    )
            );

        } else {

            setReaccionActual(
                "me_gusta"
            );


            if (
                reaccionAnterior ===
                null
            ) {

                setTotalReacciones(
                    actual =>
                        actual + 1
                );

            }

        }


        try {

            setProcesandoReaccion(
                true
            );


            const nuevaReaccion =
                await reaccionarPublicacion(
                    publicacion.id_publicacion,
                    profile.id_usuario,
                    "me_gusta"
                );


            setReaccionActual(
                nuevaReaccion
            );


        } catch (
        error
        ) {

            console.error(
                "Error reaccionando a publicación:",
                error
            );


            /*
             * Si Supabase falla,
             * revertimos el cambio visual.
             */

            setReaccionActual(
                reaccionAnterior
            );


            setTotalReacciones(
                totalAnterior
            );


            Alert.alert(
                "No se pudo reaccionar",
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al registrar tu reacción."
            );


        } finally {

            setProcesandoReaccion(
                false
            );

        }

    }


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
                                        46,

                                    height:
                                        46,

                                    borderRadius:
                                        23,

                                    marginRight:
                                        12,

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

                                    borderWidth:
                                        1,

                                    borderColor,
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

                        )
                }


                {/* =================================================
            NOMBRE Y FECHA
        ================================================= */}

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
                                    "70%",

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


                        {
                            fecha && (

                                <>

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

                                </>

                            )
                        }

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


                {/* =================================================
            OPCIONES
        ================================================= */}

                <Pressable
                    hitSlop={
                        8
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
                emociones.length >
                0 && (

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
                                            {
                                                emocion.nombre
                                            }
                                        </Text>

                                    </View>

                                )
                            )
                        }

                    </View>

                )
            }


            {/* ===================================================
          CONTENIDO DE LA PUBLICACIÓN
      =================================================== */}

            <Pressable
                onPress={
                    abrirPublicacion
                }

                style={({
                    pressed,
                }) => ({
                    opacity:
                        pressed
                            ? 0.82
                            : 1,
                })}
            >

                {/* =================================================
            TÍTULO
        ================================================= */}

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
                    {
                        publicacion.titulo
                    }
                </Text>


                {/* =================================================
            CONTENIDO
        ================================================= */}

                <Text
                    numberOfLines={
                        8
                    }

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
                    {
                        publicacion.contenido
                    }
                </Text>

            </Pressable>


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
                }}
            >

                {/* =================================================
            REACCIONES
        ================================================= */}

                <Pressable
                    disabled={
                        procesandoReaccion
                    }

                    onPress={
                        manejarReaccion
                    }

                    accessibilityRole="button"

                    accessibilityLabel={
                        reaccionMeGusta
                            ? "Quitar Me gusta"
                            : "Dar Me gusta"
                    }

                    style={({
                        pressed,
                    }) => ({
                        minHeight:
                            40,

                        paddingHorizontal:
                            10,

                        borderRadius:
                            12,

                        flexDirection:
                            "row",

                        alignItems:
                            "center",

                        gap:
                            7,

                        opacity:
                            procesandoReaccion
                                ? 0.55
                                : pressed
                                    ? 0.75
                                    : 1,

                        backgroundColor:
                            reaccionMeGusta
                                ? primarySoftColor
                                : "transparent",
                    })}
                >

                    <Ionicons
                        name={
                            reaccionMeGusta
                                ? "heart"
                                : "heart-outline"
                        }

                        size={22}

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
                        {
                            totalReacciones
                        }
                    </Text>

                </Pressable>


                {/* =================================================
            COMENTARIOS
        ================================================= */}

                <Pressable
                    onPress={
                        abrirPublicacion
                    }

                    accessibilityRole="button"

                    accessibilityLabel="Ver comentarios"

                    style={({
                        pressed,
                    }) => ({
                        marginLeft:
                            14,

                        minHeight:
                            40,

                        paddingHorizontal:
                            10,

                        borderRadius:
                            12,

                        flexDirection:
                            "row",

                        alignItems:
                            "center",

                        gap:
                            7,

                        opacity:
                            pressed
                                ? 0.7
                                : 1,

                        backgroundColor:
                            pressed
                                ? surfaceSecondaryColor
                                : "transparent",
                    })}
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
                        {
                            totalComentarios
                        }
                    </Text>

                </Pressable>

            </View>

        </View>

    );

}