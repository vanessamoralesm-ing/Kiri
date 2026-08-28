import React, {
    useMemo,
    useState,
} from "react";

import {
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    useRouter,
} from "expo-router";

import {
    useTheme,
} from "@react-navigation/native";

import FiltroEmociones from "@/components/foro/FiltroEmociones";
import PreguntaSemana from "@/components/foro/PreguntaSemana";
import PublicacionCard from "@/components/foro/PublicacionCard";

import type {
    PublicacionForo,
} from "@/types/foro";


// ==========================================================
// PUBLICACIONES TEMPORALES PARA MAQUETACIÓN
// ==========================================================

const PUBLICACIONES_DEMO: PublicacionForo[] = [
    {
        id_publicacion: "1",

        id_usuario: "usuario-demo-1",

        titulo:
            "Aprendiendo a bajar el ritmo",

        contenido:
            "Esta semana me di cuenta de que cuando comienzo a sentirme muy cansado y pierdo concentración necesito detenerme un momento. Estoy intentando escuchar más estas señales y darme pequeños espacios para descansar.",

        fecha_publicacion:
            new Date().toISOString(),

        fecha_actualizacion:
            new Date().toISOString(),

        estado: "activa",

        editada: false,

        usuario: {
            id_usuario:
                "usuario-demo-1",

            nombres:
                "Usuario 1",

            nombre_preferido:
                "Usuario 1",

            foto_perfil:
                null,
        },

        emociones: [
            {
                id_emocion_foro:
                    "emocion-calma",

                nombre:
                    "Calma",

                descripcion:
                    null,

                estado:
                    true,

                fecha_registro:
                    new Date().toISOString(),
            },

            {
                id_emocion_foro:
                    "emocion-esperanza",

                nombre:
                    "Esperanza",

                descripcion:
                    null,

                estado:
                    true,

                fecha_registro:
                    new Date().toISOString(),
            },
        ],

        total_reacciones:
            10,

        total_comentarios:
            4,

        reaccion_usuario:
            null,
    },

    {
        id_publicacion:
            "2",

        id_usuario:
            "usuario-demo-2",

        titulo:
            "Un pequeño logro",

        contenido:
            "Hoy pude terminar algo que había estado posponiendo durante varios días. Puede parecer pequeño, pero para mí representa un avance y quería compartirlo con la comunidad.",

        fecha_publicacion:
            new Date().toISOString(),

        fecha_actualizacion:
            new Date().toISOString(),

        estado:
            "activa",

        editada:
            false,

        usuario: {
            id_usuario:
                "usuario-demo-2",

            nombres:
                "Usuario 2",

            nombre_preferido:
                "Usuario 2",

            foto_perfil:
                null,
        },

        emociones: [
            {
                id_emocion_foro:
                    "emocion-alegria",

                nombre:
                    "Alegría",

                descripcion:
                    null,

                estado:
                    true,

                fecha_registro:
                    new Date().toISOString(),
            },
        ],

        total_reacciones:
            3,

        total_comentarios:
            2,

        reaccion_usuario:
            null,
    },

    {
        id_publicacion:
            "3",

        id_usuario:
            "usuario-demo-3",

        titulo:
            "Día complicado",

        contenido:
            "Tuve un día difícil y me sentí bastante frustrado. Escribir sobre lo que pasó me ayudó a organizar un poco mis pensamientos y entender mejor cómo me estaba sintiendo.",

        fecha_publicacion:
            new Date().toISOString(),

        fecha_actualizacion:
            new Date().toISOString(),

        estado:
            "activa",

        editada:
            false,

        usuario: {
            id_usuario:
                "usuario-demo-3",

            nombres:
                "Usuario 3",

            nombre_preferido:
                "Usuario 3",

            foto_perfil:
                null,
        },

        emociones: [
            {
                id_emocion_foro:
                    "emocion-frustracion",

                nombre:
                    "Frustración",

                descripcion:
                    null,

                estado:
                    true,

                fecha_registro:
                    new Date().toISOString(),
            },
        ],

        total_reacciones:
            20,

        total_comentarios:
            7,

        reaccion_usuario:
            null,
    },
];


// ==========================================================
// PANTALLA PRINCIPAL DEL FORO
// ==========================================================

export default function ForoScreen() {

    const router =
        useRouter();


    const {
        colors,
        dark,
    } =
        useTheme();


    const [
        filtroActivo,
        setFiltroActivo,
    ] =
        useState("Todo");


    // ========================================================
    // FILTRADO VISUAL
    // ========================================================

    const publicacionesFiltradas =
        useMemo(() => {

            if (
                filtroActivo ===
                "Todo"
            ) {

                return PUBLICACIONES_DEMO;

            }


            return PUBLICACIONES_DEMO.filter(
                (publicacion) =>
                    publicacion.emociones?.some(
                        (emocion) =>
                            emocion.nombre ===
                            filtroActivo
                    )
            );

        }, [
            filtroActivo,
        ]);


    // ========================================================
    // UI
    // ========================================================

    return (

        <SafeAreaView
            style={{
                flex: 1,

                backgroundColor:
                    colors.background,
            }}
        >

            <View
                style={{
                    flex: 1,

                    backgroundColor:
                        colors.background,
                }}
            >

                {/* =================================================
            CONTENIDO DESPLAZABLE
        ================================================= */}

                <ScrollView
                    style={{
                        flex: 1,

                        backgroundColor:
                            colors.background,
                    }}

                    contentContainerStyle={{
                        paddingHorizontal:
                            20,

                        paddingTop:
                            24,

                        paddingBottom:
                            180,

                        flexGrow:
                            1,
                    }}

                    showsVerticalScrollIndicator={
                        false
                    }

                    keyboardShouldPersistTaps="handled"
                >

                    {/* ===============================================
              PREGUNTA DE LA SEMANA
          =============================================== */}

                    <PreguntaSemana />


                    {/* ===============================================
              ENCABEZADO DE PUBLICACIONES
          =============================================== */}

                    <Text
                        style={{
                            marginTop:
                                32,

                            marginBottom:
                                20,

                            fontFamily:
                                "Nunito-Bold",

                            fontSize:
                                24,

                            color:
                                colors.text,
                        }}
                    >

                        Lo que otros comparten

                    </Text>


                    {/* ===============================================
              FILTROS
          =============================================== */}

                    <FiltroEmociones
                        seleccionada={
                            filtroActivo
                        }

                        onSeleccionar={
                            setFiltroActivo
                        }
                    />


                    {/* ===============================================
              CONTADOR
          =============================================== */}

                    <View
                        style={{
                            marginTop:
                                28,

                            marginBottom:
                                24,

                            flexDirection:
                                "row",

                            alignItems:
                                "center",
                        }}
                    >

                        {/* Avatares ilustrativos */}

                        <View
                            style={{
                                marginRight:
                                    14,

                                flexDirection:
                                    "row",
                            }}
                        >

                            <View
                                style={{
                                    width:
                                        34,

                                    height:
                                        34,

                                    borderRadius:
                                        17,

                                    borderWidth:
                                        1,

                                    borderColor:
                                        "#4F8EF7",

                                    backgroundColor:
                                        dark
                                            ? "#334155"
                                            : "#E2E8F0",
                                }}
                            />


                            <View
                                style={{
                                    width:
                                        34,

                                    height:
                                        34,

                                    borderRadius:
                                        17,

                                    marginLeft:
                                        -8,

                                    borderWidth:
                                        1,

                                    borderColor:
                                        "#4F8EF7",

                                    backgroundColor:
                                        dark
                                            ? "#334155"
                                            : "#E2E8F0",
                                }}
                            />


                            <View
                                style={{
                                    width:
                                        34,

                                    height:
                                        34,

                                    borderRadius:
                                        17,

                                    marginLeft:
                                        -8,

                                    borderWidth:
                                        1,

                                    borderColor:
                                        "#4F8EF7",

                                    backgroundColor:
                                        dark
                                            ? "#334155"
                                            : "#E2E8F0",
                                }}
                            />

                        </View>


                        <Text
                            style={{
                                fontFamily:
                                    "Nunito-Medium",

                                fontSize:
                                    15,

                                color:
                                    dark
                                        ? "#CBD5E1"
                                        : "#475569",
                            }}
                        >

                            {
                                publicacionesFiltradas.length
                            }{" "}
                            publicaciones

                        </Text>

                    </View>


                    {/* ===============================================
              PUBLICACIONES
          =============================================== */}

                    {
                        publicacionesFiltradas.length >
                            0 ? (

                            publicacionesFiltradas.map(
                                (
                                    publicacion
                                ) => (

                                    <PublicacionCard

                                        key={
                                            publicacion
                                                .id_publicacion
                                        }

                                        publicacion={
                                            publicacion
                                        }

                                    />

                                )
                            )

                        ) : (

                            <View
                                style={{
                                    alignItems:
                                        "center",

                                    paddingVertical:
                                        48,
                                }}
                            >

                                <Ionicons

                                    name="chatbubbles-outline"

                                    size={
                                        44
                                    }

                                    color={
                                        dark
                                            ? "#64748B"
                                            : "#94A3B8"
                                    }

                                />


                                <Text
                                    style={{
                                        marginTop:
                                            12,

                                        maxWidth:
                                            280,

                                        textAlign:
                                            "center",

                                        fontFamily:
                                            "Nunito-Medium",

                                        fontSize:
                                            16,

                                        lineHeight:
                                            22,

                                        color:
                                            dark
                                                ? "#CBD5E1"
                                                : "#64748B",
                                    }}
                                >

                                    Aún no hay publicaciones
                                    relacionadas con esta
                                    emoción.

                                </Text>

                            </View>

                        )
                    }

                </ScrollView>


                {/* =================================================
            BOTÓN FLOTANTE
        ================================================= */}

                <Pressable

                    onPress={() =>
                        router.push(
                            "/(tabs)/foro/crear"
                        )
                    }

                    style={({ pressed }) => ({

                        position:
                            "absolute",

                        right:
                            22,

                        bottom:
                            96,

                        width:
                            62,

                        height:
                            62,

                        borderRadius:
                            31,

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        backgroundColor:
                            "#B8A8F8",

                        opacity:
                            pressed
                                ? 0.8
                                : 1,

                        elevation:
                            6,

                    })}
                >

                    <Ionicons
                        name="add"
                        size={34}
                        color="#FFFFFF"
                    />

                </Pressable>

            </View>

        </SafeAreaView>

    );

}