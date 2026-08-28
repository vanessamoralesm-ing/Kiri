import React, {
  useEffect,
} from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import {
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";

import {
  usePathname,
} from "expo-router";

import Svg, {
  Path,
} from "react-native-svg";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  Ionicons,
} from "@expo/vector-icons";


// ==========================================================
// ICONOS
// ==========================================================

const MAPA_ICONOS: Record<
    string,
    {
        inactivo:
            keyof typeof Ionicons.glyphMap;

        activo:
            keyof typeof Ionicons.glyphMap;
    }
> = {

    home: {
        inactivo:
            "home-outline",

        activo:
            "home",
    },

    diario: {
        inactivo:
            "book-outline",

        activo:
            "book",
    },

    educacion: {
        inactivo:
            "school-outline",

        activo:
            "school",
    },

    tecnicas: {
        inactivo:
            "heart-outline",

        activo:
            "heart",
    },

    perfil: {
        inactivo:
            "person-outline",

        activo:
            "person",
    },

};


// ==========================================================
// RUTAS VISIBLES
// ==========================================================

const RUTAS_VISIBLES = [
    "home",
    "diario/index",
    "educacion/index",
    "tecnicas/index",
    "perfil/index",
];


// ==========================================================
// COMPONENTE
// ==========================================================

export function BarraNavegacionCurva({
    state,
    descriptors,
    navigation,
}: BottomTabBarProps) {

    // ======================================================
    // HOOKS
    // ======================================================

    const {
        width,
    } = useWindowDimensions();


    const pathname =
        usePathname();


    /*
     * IMPORTANTE:
     *
     * Este hook debe ejecutarse SIEMPRE,
     * incluso cuando luego ocultemos
     * la barra.
     */
    const translateX =
        useSharedValue(0);


    // ======================================================
    // DETERMINAR SI SE DEBE OCULTAR
    // ======================================================

    const segmentosRuta =
        pathname
            .split("/")
            .filter(Boolean);


    /*
     * Visible:
     *
     * /cuestionarios
     *
     * Oculta:
     *
     * /cuestionarios/CDSS
     * /cuestionarios/RATHUS
     * /cuestionarios/CDSS/resultado
     * etc.
     */
    const ocultarBarra =
        segmentosRuta[0] ===
            "cuestionarios" &&
        segmentosRuta.length >= 2;


    // ======================================================
    // RUTAS VISIBLES
    // ======================================================

    const rutasVisibles =
        state.routes.filter(
            route =>
                RUTAS_VISIBLES.includes(
                    route.name
                )
        );


    const cantidadTabs =
        rutasVisibles.length;


    const anchoTab =
        cantidadTabs > 0

            ? width /
              cantidadTabs

            : width / 5;


    // ======================================================
    // RUTA ACTUAL
    // ======================================================

    const rutaActiva =
        state.routes[
            state.index
        ];


    let indiceVisibleActivo =
        rutasVisibles.findIndex(
            route =>
                route.key ===
                rutaActiva?.key
        );


    // ======================================================
    // CUESTIONARIOS PERTENECE VISUALMENTE A INICIO
    // ======================================================

    const esListaCuestionarios =
        pathname ===
            "/cuestionarios" ||
        pathname ===
            "/cuestionarios/";


    if (
        indiceVisibleActivo === -1
    ) {

        indiceVisibleActivo =
            0;

    }


    // ======================================================
    // ANIMACIÓN
    // ======================================================

    useEffect(
        () => {

            translateX.value =
                withSpring(
                    indiceVisibleActivo *
                        anchoTab,
                    {
                        damping:
                            18,

                        stiffness:
                            150,
                    }
                );

        },
        [
            indiceVisibleActivo,
            anchoTab,
            translateX,
        ]
    );


    /*
     * También debe ejecutarse
     * siempre antes de cualquier
     * return condicional.
     */
    const estiloCirculoFlotante =
        useAnimatedStyle(
            () => ({

                transform: [
                    {
                        translateX:
                            translateX.value,
                    },
                ],

            })
        );


    // ======================================================
    // SVG
    // ======================================================

    const crearCaminoSVG =
        () => {

            const centroTab =
                anchoTab / 2;


            const centroActivo =
                indiceVisibleActivo *
                    anchoTab +
                centroTab;


            return `
                M 0 0

                H ${centroActivo - 30}

                C
                ${centroActivo - 30} 0,
                ${centroActivo - 30} 35,
                ${centroActivo} 35

                C
                ${centroActivo + 30} 35,
                ${centroActivo + 30} 0,
                ${centroActivo + 60} 0

                H ${width}

                V 75

                H 0

                Z
            `;

        };


    // ======================================================
    // ICONO ACTIVO
    // ======================================================

    const rutaParaIcono =
        rutasVisibles[
            indiceVisibleActivo
        ]?.name ??
        "home";


    const rutaActivaLimpia =
        rutaParaIcono

            .replace(
                "/index",
                ""
            )

            .split("/")[0];


    // ======================================================
    // AHORA SÍ PODEMOS RETORNAR NULL
    // ======================================================

    /*
     * Todos los hooks ya se ejecutaron.
     *
     * Esto evita:
     *
     * "Rendered fewer hooks than expected"
     */
    if (
        ocultarBarra
    ) {

        return null;

    }


    // ======================================================
    // UI
    // ======================================================

    return (

        <View
            style={[
                styles.container,
                {
                    width,
                },
            ]}
        >

            {/* Fondo */}

            <Svg

                width={
                    width
                }

                height={
                    75
                }

                style={
                    StyleSheet.absoluteFill
                }

            >

                <Path

                    d={
                        crearCaminoSVG()
                    }

                    fill="#FFFFFF"

                    stroke="#9FA2A7"

                    strokeWidth={
                        1
                    }

                />

            </Svg>


            {/* Círculo flotante */}

            <Animated.View

                style={[
                    styles.circuloFlotante,

                    {
                        width:
                            anchoTab,
                    },

                    estiloCirculoFlotante,
                ]}

            >

                <View
                    style={
                        styles.interiorCirculo
                    }
                >

                    <Ionicons

                        name={
                            MAPA_ICONOS[
                                rutaActivaLimpia
                            ]?.activo ??
                            "home"
                        }

                        size={
                            25
                        }

                        color="#FFFFFF"

                    />

                </View>

            </Animated.View>


            {/* Tabs */}

            <View
                style={[
                    styles.contenedorTabs,
                    {
                        width,
                    },
                ]}
            >

                {
                    rutasVisibles.map(
                        (
                            route
                        ) => {

                            const indiceRutaOriginal =
                                state.routes.findIndex(
                                    item =>
                                        item.key ===
                                        route.key
                                );


                            const tieneFocusReal =
                                state.index ===
                                indiceRutaOriginal;


                            const esInicio =
                                route.name ===
                                "home";


                            /*
                             * En /cuestionarios,
                             * Inicio se considera
                             * visualmente activo.
                             */
                            const isFocused =
                                tieneFocusReal ||
                                (
                                    esListaCuestionarios &&
                                    esInicio
                                );


                            const {
                                options,
                            } =
                                descriptors[
                                    route.key
                                ];


                            const onPress =
                                () => {

                                    const event =
                                        navigation.emit(
                                            {
                                                type:
                                                    "tabPress",

                                                target:
                                                    route.key,

                                                canPreventDefault:
                                                    true,
                                            }
                                        );


                                    /*
                                     * Si estamos en cuestionarios
                                     * y tocamos Inicio,
                                     * debe volver realmente a Home.
                                     */
                                    if (
                                        esListaCuestionarios &&
                                        esInicio
                                    ) {

                                        if (
                                            !event.defaultPrevented
                                        ) {

                                            navigation.navigate(
                                                route.name
                                            );

                                        }

                                        return;

                                    }


                                    if (
                                        !tieneFocusReal &&
                                        !event.defaultPrevented
                                    ) {

                                        navigation.navigate(
                                            route.name
                                        );

                                    }

                                };


                            const nombreLimpio =
                                route.name

                                    .replace(
                                        "/index",
                                        ""
                                    )

                                    .split(
                                        "/"
                                    )[0];


                            const configuracionIcono =
                                MAPA_ICONOS[
                                    nombreLimpio
                                ] ?? {

                                    inactivo:
                                        "ellipse-outline",

                                    activo:
                                        "ellipse",

                                };


                            const tituloTab =
                                options.title ??
                                nombreLimpio;


                            return (

                                <TouchableOpacity

                                    key={
                                        route.key
                                    }

                                    accessibilityRole="button"

                                    accessibilityState={
                                        isFocused

                                            ? {
                                                selected:
                                                    true,
                                            }

                                            : {}
                                    }

                                    accessibilityLabel={
                                        options
                                            .tabBarAccessibilityLabel
                                    }

                                    onPress={
                                        onPress
                                    }

                                    style={[
                                        styles.tabButton,
                                        {
                                            width:
                                                anchoTab,
                                        },
                                    ]}

                                    activeOpacity={
                                        0.7
                                    }

                                >

                                    {
                                        !isFocused && (

                                            <>

                                                <Ionicons

                                                    name={
                                                        configuracionIcono.inactivo
                                                    }

                                                    size={
                                                        25
                                                    }

                                                    color="#5A6677"

                                                />


                                                <Text

                                                    style={
                                                        styles.textoInactivo
                                                    }

                                                    numberOfLines={
                                                        1
                                                    }

                                                >

                                                    {
                                                        tituloTab
                                                    }

                                                </Text>

                                            </>

                                        )
                                    }


                                    {
                                        isFocused && (

                                            <Text

                                                style={
                                                    styles.textoActivo
                                                }

                                                numberOfLines={
                                                    1
                                                }

                                            >

                                                {
                                                    tituloTab
                                                }

                                            </Text>

                                        )
                                    }

                                </TouchableOpacity>

                            );

                        }
                    )
                }

            </View>

        </View>

    );

}


// ==========================================================
// ESTILOS
// ==========================================================

const styles =
    StyleSheet.create({

        container: {

            position:
                "absolute",

            bottom:
                0,

            height:
                75,

            backgroundColor:
                "transparent",

            elevation:
                8,

            shadowColor:
                "#000",

            shadowOffset: {
                width:
                    0,

                height:
                    -2,
            },

            shadowOpacity:
                0.1,

            shadowRadius:
                4,

        },


        contenedorTabs: {

            flexDirection:
                "row",

            height:
                75,

        },


        tabButton: {

            height:
                75,

            justifyContent:
                "center",

            alignItems:
                "center",

            paddingTop:
                10,

        },


        circuloFlotante: {

            position:
                "absolute",

            top:
                -20,

            alignItems:
                "center",

            zIndex:
                10,

        },


        interiorCirculo: {

            width:
                46,

            height:
                46,

            borderRadius:
                23,

            backgroundColor:
                "#4F8EF7",

            justifyContent:
                "center",

            alignItems:
                "center",

            shadowColor:
                "#4F8EF7",

            shadowOffset: {
                width:
                    0,

                height:
                    4,
            },

            shadowOpacity:
                0.3,

            shadowRadius:
                6,

            elevation:
                6,

        },


        textoInactivo: {

            fontFamily:
                "Nunito-Medium",

            fontSize:
                11,

            color:
                "#5A6677",

            marginTop:
                3,

            textAlign:
                "center",

        },


        textoActivo: {

            fontFamily:
                "Nunito-SemiBold",

            fontSize:
                11,

            color:
                "#2D3748",

            marginTop:
                28,

            textAlign:
                "center",

        },

    });