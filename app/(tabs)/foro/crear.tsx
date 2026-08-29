import {
    Ionicons,
} from "@expo/vector-icons";

import {
    useRouter,
} from "expo-router";

import React, {
    useState,
} from "react";

import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import ReglasForo from "@/components/foro/ReglasForo";

import {
    useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// EMOCIONES
// ==========================================================

const EMOCIONES = [
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

export default function CrearPublicacionScreen() {

    const router =
        useRouter();


    const [
        titulo,
        setTitulo,
    ] =
        useState("");


    const [
        contenido,
        setContenido,
    ] =
        useState("");


    const [
        emocionSeleccionada,
        setEmocionSeleccionada,
    ] =
        useState<string | null>(
            null
        );


    // ========================================================
    // TEMA
    // ========================================================

    const backgroundColor =
        useThemeColor(
            {},
            "background"
        );

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

    const secondaryColor =
        useThemeColor(
            {},
            "secondary"
        );


    // ========================================================
    // PUBLICAR
    // ========================================================

    function manejarPublicar() {

        if (
            !titulo.trim()
        ) {

            Alert.alert(
                "Título requerido",
                "Escribe un título para tu publicación."
            );

            return;

        }


        if (
            !contenido.trim()
        ) {

            Alert.alert(
                "Contenido requerido",
                "Escribe algo que quieras compartir."
            );

            return;

        }


        if (
            !emocionSeleccionada
        ) {

            Alert.alert(
                "Selecciona una emoción",
                "Selecciona la emoción que mejor represente tu publicación."
            );

            return;

        }


        console.log({
            titulo,
            contenido,
            emocionSeleccionada,
        });


        Alert.alert(
            "Publicación preparada",
            "En el siguiente paso conectaremos esta pantalla con Supabase."
        );

    }


    // ========================================================
    // UI
    // ========================================================

    return (

        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor,
            }}
        >

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }

                contentContainerStyle={{
                    paddingHorizontal:
                        24,

                    paddingTop:
                        18,

                    paddingBottom:
                        50,
                }}
            >

                {/* =================================================
            HEADER
        ================================================= */}

                <View className="mb-8 flex-row items-center justify-between">

                    <Pressable
                        onPress={() =>
                            router.back()
                        }

                        className="h-11 w-11 items-center justify-center"
                    >

                        <Ionicons
                            name="arrow-back"
                            size={27}
                            color={
                                iconColor
                            }
                        />

                    </Pressable>


                    <Text
                        style={{
                            fontFamily:
                                "Nunito-Bold",

                            fontSize:
                                25,

                            color:
                                textColor,
                        }}
                    >
                        Foro
                    </Text>


                    <View
                        style={{
                            height:
                                48,

                            width:
                                48,

                            borderRadius:
                                24,

                            backgroundColor:
                                surfaceSecondaryColor,
                        }}
                    />

                </View>


                {/* =================================================
            TARJETA DE PUBLICACIÓN
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

                    {/* Usuario */}

                    <View className="mb-5 flex-row items-center">

                        <View
                            style={{
                                height:
                                    70,

                                width:
                                    70,

                                borderRadius:
                                    35,

                                backgroundColor:
                                    surfaceSecondaryColor,
                            }}
                        />


                        <View className="ml-4">

                            <Text
                                style={{
                                    fontFamily:
                                        "Nunito-Bold",

                                    fontSize:
                                        21,

                                    color:
                                        textColor,
                                }}
                            >
                                Usuario
                            </Text>


                            {
                                emocionSeleccionada && (

                                    <Text
                                        style={{
                                            marginTop:
                                                4,

                                            fontFamily:
                                                "Nunito-SemiBold",

                                            fontSize:
                                                17,

                                            color:
                                                secondaryColor,
                                        }}
                                    >
                                        {
                                            emocionSeleccionada
                                        }
                                    </Text>

                                )
                            }

                        </View>

                    </View>


                    {/* =================================================
              TÍTULO
          ================================================= */}

                    <TextInput
                        value={
                            titulo
                        }

                        onChangeText={
                            setTitulo
                        }

                        placeholder="Título de tu publicación"

                        placeholderTextColor={
                            placeholderColor
                        }

                        selectionColor={
                            primaryColor
                        }

                        maxLength={
                            150
                        }

                        style={{
                            marginBottom:
                                12,

                            paddingBottom:
                                12,

                            borderBottomWidth:
                                1,

                            borderBottomColor:
                                borderColor,

                            fontFamily:
                                "Nunito-Bold",

                            fontSize:
                                18,

                            color:
                                textColor,
                        }}
                    />


                    {/* =================================================
              CONTENIDO
          ================================================= */}

                    <TextInput
                        value={
                            contenido
                        }

                        onChangeText={
                            setContenido
                        }

                        placeholder="¿Qué quieres compartir con la comunidad?"

                        placeholderTextColor={
                            placeholderColor
                        }

                        selectionColor={
                            primaryColor
                        }

                        multiline

                        textAlignVertical="top"

                        style={{
                            minHeight:
                                250,

                            fontFamily:
                                "Nunito-Medium",

                            fontSize:
                                17,

                            lineHeight:
                                24,

                            color:
                                textSecondaryColor,
                        }}
                    />


                    {/* Contador */}

                    <Text
                        style={{
                            marginTop:
                                8,

                            textAlign:
                                "right",

                            fontFamily:
                                "Nunito-Medium",

                            fontSize:
                                13,

                            color:
                                textMutedColor,
                        }}
                    >
                        {contenido.length} caracteres
                    </Text>

                </View>


                {/* =================================================
            EMOCIONES
        ================================================= */}

                <Text
                    style={{
                        marginBottom:
                            16,

                        marginTop:
                            32,

                        fontFamily:
                            "Nunito-SemiBold",

                        fontSize:
                            17,

                        lineHeight:
                            24,

                        color:
                            primaryColor,
                    }}
                >
                    Selecciona la emoción que mejor describa tu publicación
                </Text>


                <View className="flex-row flex-wrap gap-3">

                    {
                        EMOCIONES.map(
                            emocion => {

                                const seleccionada =
                                    emocionSeleccionada ===
                                    emocion;


                                return (

                                    <Pressable
                                        key={
                                            emocion
                                        }

                                        onPress={() =>
                                            setEmocionSeleccionada(
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
                                                seleccionada
                                                    ? primaryColor
                                                    : borderColor,

                                            backgroundColor:
                                                seleccionada
                                                    ? primaryColor
                                                    : surfaceSecondaryColor,
                                        }}
                                    >

                                        <Text
                                            style={{
                                                fontFamily:
                                                    seleccionada
                                                        ? "Nunito-SemiBold"
                                                        : "Nunito-Medium",

                                                color:
                                                    seleccionada
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

                </View>


                {/* =================================================
            REGLAS
        ================================================= */}

                <ReglasForo />


                {/* =================================================
            PUBLICAR
        ================================================= */}

                <Pressable
                    onPress={
                        manejarPublicar
                    }

                    style={{
                        marginTop:
                            40,

                        minHeight:
                            58,

                        flexDirection:
                            "row",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        borderRadius:
                            20,

                        backgroundColor:
                            primaryColor,
                    }}
                >

                    <Text
                        style={{
                            marginRight:
                                16,

                            fontFamily:
                                "Nunito-SemiBold",

                            fontSize:
                                20,

                            color:
                                "#FFFFFF",
                        }}
                    >
                        Publicar
                    </Text>


                    <Ionicons
                        name="send"
                        size={25}
                        color="#FFFFFF"
                    />

                </Pressable>

            </ScrollView>

        </SafeAreaView>

    );

}