import { Ionicons } from "@expo/vector-icons";

import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

import { useAuth } from "@/services/authProvider";

import {
    obtenerPreguntaSemanaActiva,
    obtenerRespuestasPreguntaSemana,
    responderPreguntaSemana,
} from "@/services/foro/foroService";

import type {
    PreguntaSemanaForo,
    RespuestaPreguntaSemanaConUsuario,
} from "@/types/foro";


// ==========================================================
// COMPONENTE
// ==========================================================

export default function PreguntaSemana() {

    const {
        profile,
        loading: authLoading,
    } = useAuth();


    // ========================================================
    // ESTADOS
    // ========================================================

    const [
        preguntaSemana,
        setPreguntaSemana,
    ] = useState<PreguntaSemanaForo | null>(
        null
    );


    const [
        respuesta,
        setRespuesta,
    ] = useState(
        ""
    );


    const [
        respuestas,
        setRespuestas,
    ] = useState<
        RespuestaPreguntaSemanaConUsuario[]
    >(
        []
    );


    const [
        cargando,
        setCargando,
    ] = useState(
        true
    );


    const [
        enviando,
        setEnviando,
    ] = useState(
        false
    );


    const [
        cargandoRespuestas,
        setCargandoRespuestas,
    ] = useState(
        false
    );


    const [
        mostrarRespuestas,
        setMostrarRespuestas,
    ] = useState(
        false
    );


    const [
        error,
        setError,
    ] = useState<string | null>(
        null
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


    const placeholderColor =
        useThemeColor(
            {},
            "placeholder"
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


    const secondarySoftColor =
        useThemeColor(
            {},
            "secondarySoft"
        );


    const dangerColor =
        useThemeColor(
            {},
            "danger"
        );


    // ========================================================
    // FORMATEAR FECHA
    // ========================================================

    function formatearFecha(
        fecha: string
    ): string {

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
                (
                    1000 *
                    60
                )
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


        if (
            dias < 7
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


    // ========================================================
    // CARGAR RESPUESTAS
    // ========================================================

    const cargarRespuestas =
        useCallback(
            async (
                idPreguntaSemana: string
            ) => {

                if (
                    !idPreguntaSemana
                ) {
                    return;
                }


                try {

                    setCargandoRespuestas(
                        true
                    );


                    const data =
                        await obtenerRespuestasPreguntaSemana(
                            idPreguntaSemana
                        );


                    setRespuestas(
                        data
                    );


                } catch (
                    e
                ) {

                    console.error(
                        "Error cargando respuestas de la semana:",
                        e
                    );


                    Alert.alert(
                        "No se pudieron cargar las respuestas",
                        e instanceof Error
                            ? e.message
                            : "Ocurrió un error al consultar las respuestas."
                    );


                } finally {

                    setCargandoRespuestas(
                        false
                    );

                }

            },
            []
        );


    // ========================================================
    // CARGAR PREGUNTA
    // ========================================================

    const cargarPreguntaSemana =
        useCallback(
            async () => {

                try {

                    setCargando(
                        true
                    );


                    setError(
                        null
                    );


                    const data =
                        await obtenerPreguntaSemanaActiva();


                    setPreguntaSemana(
                        data
                    );


                    // =================================================
                    // SI NO HAY PREGUNTA ACTIVA
                    // =================================================

                    if (
                        !data
                    ) {

                        setRespuestas(
                            []
                        );


                        setMostrarRespuestas(
                            false
                        );


                        setRespuesta(
                            ""
                        );

                    }


                } catch (
                    e
                ) {

                    console.error(
                        "Error cargando pregunta de la semana:",
                        e
                    );


                    setPreguntaSemana(
                        null
                    );


                    setRespuestas(
                        []
                    );


                    setMostrarRespuestas(
                        false
                    );


                    setError(
                        e instanceof Error
                            ? e.message
                            : "No se pudo cargar la pregunta de la semana."
                    );


                } finally {

                    setCargando(
                        false
                    );

                }

            },
            []
        );


    // ========================================================
    // CARGA INICIAL
    // ========================================================

    useEffect(
        () => {

            cargarPreguntaSemana();

        },
        [
            cargarPreguntaSemana,
        ]
    );


    // ========================================================
    // MOSTRAR / OCULTAR RESPUESTAS
    // ========================================================

    async function manejarVerRespuestas() {

        if (
            !preguntaSemana
        ) {
            return;
        }


        if (
            mostrarRespuestas
        ) {

            setMostrarRespuestas(
                false
            );

            return;

        }


        setMostrarRespuestas(
            true
        );


        await cargarRespuestas(
            preguntaSemana.id_pregunta_semana
        );

    }


    // ========================================================
    // ENVIAR RESPUESTA
    // ========================================================

    async function manejarEnviar() {

        if (
            enviando
        ) {
            return;
        }


        if (
            authLoading
        ) {

            Alert.alert(
                "Espera un momento",
                "Estamos verificando tu sesión."
            );

            return;

        }


        if (
            !profile?.id_usuario
        ) {

            Alert.alert(
                "Sesión requerida",
                "Debes iniciar sesión para responder la pregunta."
            );

            return;

        }


        if (
            !preguntaSemana
        ) {

            Alert.alert(
                "Pregunta no disponible",
                "No hay una pregunta activa en este momento."
            );

            return;

        }


        const respuestaLimpia =
            respuesta.trim();


        if (
            !respuestaLimpia
        ) {

            Alert.alert(
                "Respuesta vacía",
                "Escribe una respuesta antes de enviarla."
            );

            return;

        }


        if (
            respuestaLimpia.length > 500
        ) {

            Alert.alert(
                "Respuesta demasiado larga",
                "La respuesta no puede superar los 500 caracteres."
            );

            return;

        }


        try {

            setEnviando(
                true
            );


            await responderPreguntaSemana({
                idPreguntaSemana:
                    preguntaSemana.id_pregunta_semana,

                idUsuario:
                    profile.id_usuario,

                respuesta:
                    respuestaLimpia,
            });


            setRespuesta(
                ""
            );


            // =================================================
            // ACTUALIZAR RESPUESTAS
            // =================================================

            if (
                mostrarRespuestas
            ) {

                await cargarRespuestas(
                    preguntaSemana.id_pregunta_semana
                );

            }


            Alert.alert(
                "Respuesta enviada",
                "Tu respuesta fue guardada correctamente."
            );


        } catch (
            e
        ) {

            console.error(
                "Error enviando respuesta semanal:",
                e
            );


            Alert.alert(
                "No se pudo enviar",
                e instanceof Error
                    ? e.message
                    : "Ocurrió un error al guardar tu respuesta."
            );


        } finally {

            setEnviando(
                false
            );

        }

    }


    // ========================================================
    // CARGANDO
    // ========================================================

    if (
        cargando
    ) {

        return (

            <View>

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


                <View
                    style={{
                        minHeight:
                            220,

                        borderRadius:
                            22,

                        borderWidth:
                            1,

                        borderColor,

                        backgroundColor:
                            surfaceColor,

                        alignItems:
                            "center",

                        justifyContent:
                            "center",
                    }}
                >

                    <ActivityIndicator
                        size="large"

                        color={
                            primaryColor
                        }
                    />


                    <Text
                        style={{
                            marginTop:
                                12,

                            fontFamily:
                                "Nunito-Medium",

                            color:
                                textSecondaryColor,
                        }}
                    >
                        Cargando pregunta...
                    </Text>

                </View>

            </View>

        );

    }


    // ========================================================
    // ERROR
    // ========================================================

    if (
        error
    ) {

        return (

            <View>

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


                <View
                    style={{
                        padding:
                            22,

                        borderRadius:
                            22,

                        borderWidth:
                            1,

                        borderColor,

                        backgroundColor:
                            surfaceColor,

                        alignItems:
                            "center",
                    }}
                >

                    <View
                        style={{
                            width:
                                60,

                            height:
                                60,

                            borderRadius:
                                30,

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            backgroundColor:
                                surfaceSecondaryColor,
                        }}
                    >

                        <Ionicons
                            name="alert-circle-outline"
                            size={32}

                            color={
                                dangerColor
                            }
                        />

                    </View>


                    <Text
                        style={{
                            marginTop:
                                12,

                            fontFamily:
                                "Nunito-Bold",

                            fontSize:
                                15,

                            textAlign:
                                "center",

                            color:
                                textColor,
                        }}
                    >
                        No pudimos cargar la pregunta
                    </Text>


                    <Text
                        style={{
                            marginTop:
                                6,

                            fontFamily:
                                "Nunito-Medium",

                            fontSize:
                                13,

                            lineHeight:
                                19,

                            textAlign:
                                "center",

                            color:
                                textSecondaryColor,
                        }}
                    >
                        {error}
                    </Text>


                    <Pressable
                        onPress={
                            cargarPreguntaSemana
                        }

                        style={({
                            pressed,
                        }) => ({
                            minHeight:
                                44,

                            marginTop:
                                18,

                            paddingHorizontal:
                                18,

                            borderRadius:
                                14,

                            flexDirection:
                                "row",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            opacity:
                                pressed
                                    ? 0.75
                                    : 1,

                            backgroundColor:
                                primaryColor,
                        })}
                    >

                        <Ionicons
                            name="refresh-outline"
                            size={19}
                            color="#FFFFFF"
                        />


                        <Text
                            style={{
                                marginLeft:
                                    7,

                                fontFamily:
                                    "Nunito-Bold",

                                fontSize:
                                    14,

                                color:
                                    "#FFFFFF",
                            }}
                        >
                            Reintentar
                        </Text>

                    </Pressable>

                </View>

            </View>

        );

    }


    // ========================================================
    // SIN PREGUNTA ACTIVA
    // ========================================================

    if (
        !preguntaSemana
    ) {

        return (

            <View>

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


                <View
                    style={{
                        padding:
                            22,

                        borderRadius:
                            22,

                        borderWidth:
                            1,

                        borderColor,

                        backgroundColor:
                            surfaceColor,

                        alignItems:
                            "center",
                    }}
                >

                    <View
                        style={{
                            width:
                                60,

                            height:
                                60,

                            borderRadius:
                                30,

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            backgroundColor:
                                primarySoftColor,
                        }}
                    >

                        <Ionicons
                            name="chatbubble-ellipses-outline"
                            size={30}

                            color={
                                primaryColor
                            }
                        />

                    </View>


                    <Text
                        style={{
                            marginTop:
                                14,

                            fontFamily:
                                "Nunito-SemiBold",

                            fontSize:
                                15,

                            textAlign:
                                "center",

                            color:
                                textColor,
                        }}
                    >
                        No hay una pregunta activa en este momento.
                    </Text>


                    <Text
                        style={{
                            marginTop:
                                6,

                            fontFamily:
                                "Nunito-Medium",

                            fontSize:
                                13,

                            lineHeight:
                                19,

                            textAlign:
                                "center",

                            color:
                                textSecondaryColor,
                        }}
                    >
                        Puedes intentar actualizarla nuevamente.
                    </Text>


                    <Pressable
                        onPress={
                            cargarPreguntaSemana
                        }

                        style={({
                            pressed,
                        }) => ({
                            minHeight:
                                44,

                            marginTop:
                                18,

                            paddingHorizontal:
                                18,

                            borderRadius:
                                14,

                            flexDirection:
                                "row",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            opacity:
                                pressed
                                    ? 0.75
                                    : 1,

                            backgroundColor:
                                primaryColor,
                        })}
                    >

                        <Ionicons
                            name="refresh-outline"
                            size={19}
                            color="#FFFFFF"
                        />


                        <Text
                            style={{
                                marginLeft:
                                    7,

                                fontFamily:
                                    "Nunito-Bold",

                                fontSize:
                                    14,

                                color:
                                    "#FFFFFF",
                            }}
                        >
                            Actualizar
                        </Text>

                    </Pressable>

                </View>

            </View>

        );

    }


    // ========================================================
    // UI PRINCIPAL
    // ========================================================

    return (

        <View>

            {/* =================================================
                TÍTULO
            ================================================= */}

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


            {/* =================================================
                TARJETA
            ================================================= */}

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


                    <View
                        style={{
                            marginLeft:
                                16,
                        }}
                    >

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
                    {preguntaSemana.pregunta}
                </Text>


                {/* =================================================
                    RESPUESTAS / ACCIÓN
                ================================================= */}

                <View
                    style={{
                        marginBottom:
                            16,

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
                        }}
                    >

                        {
                            [0, 1, 2].map(
                                indice => {

                                    const usuario =
                                        respuestas[indice]
                                            ?.usuario;


                                    const foto =
                                        usuario
                                            ?.foto_perfil ??
                                        null;


                                    return (

                                        <View
                                            key={
                                                indice
                                            }

                                            style={{
                                                width:
                                                    32,

                                                height:
                                                    32,

                                                marginLeft:
                                                    indice === 0
                                                        ? 0
                                                        : -8,

                                                borderRadius:
                                                    16,

                                                borderWidth:
                                                    1,

                                                borderColor:
                                                    primaryColor,

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                overflow:
                                                    "hidden",

                                                backgroundColor:
                                                    surfaceSecondaryColor,
                                            }}
                                        >

                                            {
                                                foto

                                                    ? (

                                                        <Image
                                                            source={{
                                                                uri:
                                                                    foto,
                                                            }}

                                                            style={{
                                                                width:
                                                                    "100%",

                                                                height:
                                                                    "100%",
                                                            }}
                                                        />

                                                    )

                                                    : (

                                                        <Ionicons
                                                            name="person-outline"
                                                            size={15}

                                                            color={
                                                                primaryColor
                                                            }
                                                        />

                                                    )
                                            }

                                        </View>

                                    );

                                }
                            )
                        }

                    </View>


                    <Pressable
                        onPress={
                            manejarVerRespuestas
                        }

                        disabled={
                            cargandoRespuestas
                        }

                        style={({
                            pressed,
                        }) => ({
                            minHeight:
                                40,

                            paddingHorizontal:
                                13,

                            borderRadius:
                                12,

                            flexDirection:
                                "row",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            opacity:
                                pressed
                                    ? 0.75
                                    : 1,

                            backgroundColor:
                                primarySoftColor,
                        })}
                    >

                        {
                            cargandoRespuestas

                                ? (

                                    <ActivityIndicator
                                        size="small"

                                        color={
                                            primaryColor
                                        }
                                    />

                                )

                                : (

                                    <Ionicons
                                        name={
                                            mostrarRespuestas
                                                ? "chevron-up-outline"
                                                : "chatbubbles-outline"
                                        }

                                        size={17}

                                        color={
                                            primaryColor
                                        }
                                    />

                                )
                        }


                        <Text
                            style={{
                                marginLeft:
                                    6,

                                fontFamily:
                                    "Nunito-SemiBold",

                                fontSize:
                                    13,

                                color:
                                    primaryColor,
                            }}
                        >
                            {
                                mostrarRespuestas
                                    ? "Ocultar"
                                    : "Ver respuestas"
                            }
                        </Text>

                    </Pressable>

                </View>


                {/* =================================================
                    CAMPO RESPUESTA
                ================================================= */}

                <View
                    style={{
                        minHeight:
                            58,

                        flexDirection:
                            "row",

                        alignItems:
                            "center",

                        borderRadius:
                            18,

                        paddingLeft:
                            16,

                        paddingRight:
                            6,

                        backgroundColor:
                            secondarySoftColor,

                        borderWidth:
                            1,

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

                        editable={
                            !enviando
                        }

                        placeholder="Escribe tu respuesta..."

                        placeholderTextColor={
                            placeholderColor
                        }

                        selectionColor={
                            primaryColor
                        }

                        maxLength={
                            500
                        }

                        returnKeyType="send"

                        onSubmitEditing={
                            manejarEnviar
                        }

                        style={{
                            minHeight:
                                54,

                            flex:
                                1,

                            paddingVertical:
                                10,

                            fontFamily:
                                "Nunito-Medium",

                            fontSize:
                                15,

                            color:
                                textColor,
                        }}
                    />


                    <Pressable
                        onPress={
                            manejarEnviar
                        }

                        disabled={
                            enviando ||
                            !respuesta.trim()
                        }

                        accessibilityRole="button"

                        accessibilityLabel="Enviar respuesta"

                        style={({
                            pressed,
                        }) => ({
                            width:
                                46,

                            height:
                                46,

                            borderRadius:
                                15,

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            opacity:
                                enviando ||
                                !respuesta.trim()
                                    ? 0.45
                                    : pressed
                                        ? 0.75
                                        : 1,

                            backgroundColor:
                                primaryColor,
                        })}
                    >

                        {
                            enviando

                                ? (

                                    <ActivityIndicator
                                        size="small"
                                        color="#FFFFFF"
                                    />

                                )

                                : (

                                    <Ionicons
                                        name="send"
                                        size={21}
                                        color="#FFFFFF"
                                    />

                                )
                        }

                    </Pressable>

                </View>


                {/* =================================================
                    CONTADOR
                ================================================= */}

                <Text
                    style={{
                        marginTop:
                            7,

                        textAlign:
                            "right",

                        fontFamily:
                            "Nunito-Medium",

                        fontSize:
                            11,

                        color:
                            textMutedColor,
                    }}
                >
                    {respuesta.length}/500
                </Text>


                {/* =================================================
                    LISTADO DE RESPUESTAS
                ================================================= */}

                {
                    mostrarRespuestas && (

                        <View
                            style={{
                                marginTop:
                                    20,

                                paddingTop:
                                    18,

                                borderTopWidth:
                                    1,

                                borderTopColor:
                                    dividerColor,
                            }}
                        >

                            {/* =========================================
                                HEADER RESPUESTAS
                            ========================================= */}

                            <View
                                style={{
                                    marginBottom:
                                        14,

                                    flexDirection:
                                        "row",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "space-between",
                                }}
                            >

                                <Text
                                    style={{
                                        fontFamily:
                                            "Nunito-Bold",

                                        fontSize:
                                            17,

                                        color:
                                            textColor,
                                    }}
                                >
                                    Respuestas
                                </Text>


                                <View
                                    style={{
                                        minWidth:
                                            30,

                                        height:
                                            30,

                                        paddingHorizontal:
                                            8,

                                        borderRadius:
                                            15,

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        backgroundColor:
                                            primarySoftColor,
                                    }}
                                >

                                    <Text
                                        style={{
                                            fontFamily:
                                                "Nunito-Bold",

                                            fontSize:
                                                12,

                                            color:
                                                primaryColor,
                                        }}
                                    >
                                        {respuestas.length}
                                    </Text>

                                </View>

                            </View>


                            {/* =========================================
                                CARGANDO RESPUESTAS
                            ========================================= */}

                            {
                                cargandoRespuestas

                                    ? (

                                        <View
                                            style={{
                                                paddingVertical:
                                                    28,

                                                alignItems:
                                                    "center",
                                            }}
                                        >

                                            <ActivityIndicator
                                                size="small"

                                                color={
                                                    primaryColor
                                                }
                                            />

                                        </View>

                                    )

                                    : respuestas.length === 0

                                        ? (

                                            <View
                                                style={{
                                                    paddingVertical:
                                                        24,

                                                    alignItems:
                                                        "center",
                                                }}
                                            >

                                                <Ionicons
                                                    name="chatbubble-ellipses-outline"
                                                    size={30}

                                                    color={
                                                        textMutedColor
                                                    }
                                                />


                                                <Text
                                                    style={{
                                                        marginTop:
                                                            9,

                                                        fontFamily:
                                                            "Nunito-Medium",

                                                        fontSize:
                                                            14,

                                                        textAlign:
                                                            "center",

                                                        color:
                                                            textSecondaryColor,
                                                    }}
                                                >
                                                    Aún no hay respuestas.
                                                </Text>

                                            </View>

                                        )

                                        : (

                                            respuestas.map(
                                                item => {

                                                    const nombre =
                                                        item.usuario
                                                            ?.nombre_preferido
                                                            ?.trim() ||

                                                        item.usuario
                                                            ?.nombres
                                                            ?.trim() ||

                                                        "Usuario";


                                                    const fotoPerfil =
                                                        item.usuario
                                                            ?.foto_perfil ??
                                                        null;


                                                    return (

                                                        <View
                                                            key={
                                                                item.id_respuesta
                                                            }

                                                            style={{
                                                                marginBottom:
                                                                    10,

                                                                padding:
                                                                    14,

                                                                borderRadius:
                                                                    16,

                                                                borderWidth:
                                                                    1,

                                                                borderColor,

                                                                backgroundColor:
                                                                    surfaceSecondaryColor,
                                                            }}
                                                        >

                                                            {/* =================================
                                                                USUARIO
                                                            ================================= */}

                                                            <View
                                                                style={{
                                                                    flexDirection:
                                                                        "row",

                                                                    alignItems:
                                                                        "center",
                                                                }}
                                                            >

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
                                                                                        38,

                                                                                    height:
                                                                                        38,

                                                                                    borderRadius:
                                                                                        19,

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
                                                                                        38,

                                                                                    height:
                                                                                        38,

                                                                                    borderRadius:
                                                                                        19,

                                                                                    borderWidth:
                                                                                        1,

                                                                                    borderColor,

                                                                                    alignItems:
                                                                                        "center",

                                                                                    justifyContent:
                                                                                        "center",

                                                                                    backgroundColor:
                                                                                        surfaceColor,
                                                                                }}
                                                                            >

                                                                                <Ionicons
                                                                                    name="person-outline"
                                                                                    size={18}

                                                                                    color={
                                                                                        iconColor
                                                                                    }
                                                                                />

                                                                            </View>

                                                                        )
                                                                }


                                                                <View
                                                                    style={{
                                                                        flex:
                                                                            1,

                                                                        marginLeft:
                                                                            10,
                                                                    }}
                                                                >

                                                                    <Text
                                                                        numberOfLines={
                                                                            1
                                                                        }

                                                                        style={{
                                                                            fontFamily:
                                                                                "Nunito-Bold",

                                                                            fontSize:
                                                                                14,

                                                                            color:
                                                                                textColor,
                                                                        }}
                                                                    >
                                                                        {nombre}
                                                                    </Text>


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
                                                                        {
                                                                            formatearFecha(
                                                                                item.fecha_respuesta
                                                                            )
                                                                        }
                                                                    </Text>

                                                                </View>

                                                            </View>


                                                            {/* =================================
                                                                RESPUESTA
                                                            ================================= */}

                                                            <Text
                                                                style={{
                                                                    marginTop:
                                                                        10,

                                                                    fontFamily:
                                                                        "Nunito-Medium",

                                                                    fontSize:
                                                                        14,

                                                                    lineHeight:
                                                                        21,

                                                                    color:
                                                                        textSecondaryColor,
                                                                }}
                                                            >
                                                                {item.respuesta}
                                                            </Text>

                                                        </View>

                                                    );

                                                }
                                            )

                                        )
                            }

                        </View>

                    )
                }

            </View>

        </View>

    );

}