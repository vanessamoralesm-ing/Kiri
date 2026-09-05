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
   useRouter,
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

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


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
    "diario",
    "educacion/index",
    "tecnicas",
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

  // ========================================================
  // HOOKS
  // ========================================================

  const {
    width,
  } =
    useWindowDimensions();


  const pathname =
    usePathname();

  const router =
    useRouter();//Lo agregue para la navegacion del diario ya que no deseo que se guarde el estado anterior donde estuvo el usuario


  const translateX =
    useSharedValue(0);


  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const tabBarColor =
    useThemeColor(
      {},
      "tabBar"
    );


  const borderColor =
    useThemeColor(
      {},
      "border"
    );


  const tabIconDefault =
    useThemeColor(
      {},
      "tabIconDefault"
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


  const primaryColor =
    useThemeColor(
      {},
      "primary"
    );


  // ========================================================
  // SEGMENTOS DE LA URL
  // ========================================================

  const segmentosRuta =
    pathname
      .split("/")
      .filter(Boolean);


  // ========================================================
  // RUTAS SECUNDARIAS DE INICIO
  // ========================================================
  //
  // En estas pantallas la barra permanece visible,
  // pero NINGÚN tab se muestra como activo.
  //
  // Esto permite que "Inicio" pueda pulsarse normalmente
  // para regresar al Home.
  // ========================================================

  const esListaCuestionarios =
    pathname ===
    "/cuestionarios" ||
    pathname ===
    "/cuestionarios/";


  const esForoPrincipal =
    pathname ===
    "/foro" ||
    pathname ===
    "/foro/";


  const esEntrevistaNinosPrincipal =
    pathname ===
    "/ninos" ||
    pathname ===
    "/ninos/";


  const esEntrevistaAdultosPrincipal =
    pathname ===
    "/adultos" ||
    pathname ===
    "/adultos/";

  const esNuevoRegistroDiario =
    pathname === "/diario/nuevo" ||
    pathname === "/diario/nuevo/";

  const estaDentroDePlantillaDiario =
    segmentosRuta[0] === "diario" &&
    segmentosRuta[1] === "nuevo" &&
    segmentosRuta.length >= 3;
  // Historial completo del Diario.
  const esHistorialDiario =
    segmentosRuta[0] === "diario" &&
    segmentosRuta[1] === "historial";

    // Detalle de un registro: /diario/[id]
  const esDetalleRegistroDiario =
    segmentosRuta[0] === "diario" &&
    segmentosRuta.length === 2 &&
    segmentosRuta[1] !== "nuevo" &&
    segmentosRuta[1] !== "historial";

    // Edicion de un registro: /diario/[id]/editar
  const esEditarRegistroDiario =
    segmentosRuta[0] === "diario" &&
    segmentosRuta.length === 3 &&
    segmentosRuta[2] === "editar";


  const esRutaSecundariaDeInicio =
    esListaCuestionarios ||
    esForoPrincipal ||
    esEntrevistaNinosPrincipal ||
    esEntrevistaAdultosPrincipal ||
    esNuevoRegistroDiario;


  // ========================================================
  // RUTAS EN LAS QUE LA BARRA DEBE OCULTARSE
  // ========================================================

  const estaDentroDeCuestionario =
    segmentosRuta[0] ===
    "cuestionarios" &&
    segmentosRuta.length >=
    2;


  const estaDentroDeForo =
    segmentosRuta[0] ===
    "foro" &&
    segmentosRuta.length >=
    2;


  const estaDentroEntrevistaNinos =
    segmentosRuta[0] ===
    "ninos" &&
    segmentosRuta.length >=
    2;


  const estaDentroEntrevistaAdultos =
    segmentosRuta[0] ===
    "adultos" &&
    segmentosRuta.length >=
    2;

  const ocultarBarra =
    estaDentroDeCuestionario ||
    estaDentroDeForo ||
    estaDentroEntrevistaNinos ||
    estaDentroEntrevistaAdultos ||
    estaDentroDePlantillaDiario ||
    esHistorialDiario ||
    esDetalleRegistroDiario ||
    esEditarRegistroDiario;


  // ========================================================
  // RUTAS VISIBLES DE LA BARRA
  // ========================================================

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
    cantidadTabs >
      0

      ? width /
      cantidadTabs

      : width /
      5;


  // ========================================================
  // RUTA ACTIVA REAL
  // ========================================================

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


  // ========================================================
  // ¿HAY UN TAB ACTIVO?
  // ========================================================
  //
  // En Foro, Cuestionarios y las pantallas principales
  // de Entrevista no queremos mostrar Inicio como activo.
  // ========================================================

  const hayTabActivo =
    !esRutaSecundariaDeInicio &&
    indiceVisibleActivo !==
    -1;


  // Se conserva un índice válido internamente para evitar
  // errores en cálculos y animaciones.
  //
  // IMPORTANTE:
  // esto NO significa que Inicio estará visualmente activo.

  if (
    indiceVisibleActivo ===
    -1
  ) {

    indiceVisibleActivo =
      0;

  }


  // ========================================================
  // ANIMACIÓN
  // ========================================================

  useEffect(
    () => {

      if (
        !hayTabActivo
      ) {
        return;
      }


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
      hayTabActivo,
      translateX,
    ]
  );


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


  // ========================================================
  // SVG
  // ========================================================

  const crearCaminoSVG =
    () => {

      // ====================================================
      // SIN TAB ACTIVO
      // ====================================================
      //
      // Cuando estamos en Foro, Cuestionarios o Entrevistas
      // principales, dibujamos una barra completamente recta,
      // sin la curva del botón activo.
      // ====================================================

      if (
        !hayTabActivo
      ) {

        return `
          M 0 0

          H ${width}

          V 75

          H 0

          Z
        `;

      }


      // ====================================================
      // CON TAB ACTIVO
      // ====================================================

      const centroTab =
        anchoTab /
        2;


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


  // ========================================================
  // ICONO ACTIVO
  // ========================================================

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
      .split(
        "/"
      )[0];


  // ========================================================
  // RETORNO CONDICIONAL
  // ========================================================

  if (
    ocultarBarra
  ) {

    return null;

  }


  // ========================================================
  // UI
  // ========================================================

  return (

    <View
      style={[
        styles.container,

        {
          width,
        },
      ]}
    >

      {/* ====================================================
          FONDO
      ==================================================== */}

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

          fill={
            tabBarColor
          }

          stroke={
            borderColor
          }

          strokeWidth={
            1
          }
        />

      </Svg>


      {/* ====================================================
          CÍRCULO FLOTANTE
      ==================================================== */}

      {
        hayTabActivo && (

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
              style={[
                styles.interiorCirculo,

                {
                  backgroundColor:
                    primaryColor,

                  shadowColor:
                    primaryColor,
                },
              ]}
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

        )
      }


      {/* ====================================================
          TABS
      ==================================================== */}

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
            route => {

              // ==============================================
              // ÍNDICE REAL
              // ==============================================

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


              // ==============================================
              // ESTADO VISUAL
              // ==============================================
              //
              // Si estamos en una ruta secundaria:
              //
              // /foro
              // /cuestionarios
              // /ninos
              // /adultos
              //
              // ningún botón aparece seleccionado.
              // ==============================================

              const isFocused =
                hayTabActivo &&
                tieneFocusReal;


              const {
                options,
              } =
                descriptors[
                route.key
                ];


              // ==============================================
              // PRESS
              // ==============================================

              const onPress =
                () => {

                  const event =
                    navigation.emit({
                      type:
                        "tabPress",

                      target:
                        route.key,

                      canPreventDefault:
                        true,
                    });


                  if (
                    event.defaultPrevented
                  ) {

                    return;

                  }


                  // ==========================================
                  // REGRESAR A HOME DESDE RUTAS SECUNDARIAS
                  // ==========================================
                  //
                  // Aunque React Navigation pueda considerar
                  // Home como tab activo internamente,
                  // permitimos navegar explícitamente a Home.
                  // ==========================================

                  if (
                    esRutaSecundariaDeInicio &&
                    esInicio
                  ) {

                    navigation.navigate(
                      route.name
                    );

                    return;

                  }


                  // ==========================================
                  // NAVEGACIÓN NORMAL
                  // ==========================================
                  
                  // Cuando se pulsa Diario desde la barra,
                  // siempre regresamos a su pantalla principal.
                  // Esto evita que se conserve una plantilla
                  // que el usuario habia abierto anteriormente.
                  if (nombreLimpio === "diario") {
                    router.replace("/(tabs)/diario" as never);
                    return;
                  }

                  if (
                    !tieneFocusReal
                  ) {

                    navigation.navigate(
                      route.name
                    );

                  }

                };


              // ==============================================
              // CONFIGURACIÓN DEL ICONO
              // ==============================================

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


              // ==============================================
              // TAB
              // ==============================================

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

                  {/* ==========================================
                      ESTADO INACTIVO
                  ========================================== */}

                  {
                    !isFocused && (

                      <>

                        <Ionicons
                          name={
                            configuracionIcono
                              .inactivo
                          }

                          size={
                            25
                          }

                          color={
                            tabIconDefault
                          }
                        />


                        <Text
                          style={[
                            styles.textoInactivo,

                            {
                              color:
                                textSecondaryColor,
                            },
                          ]}

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


                  {/* ==========================================
                      ESTADO ACTIVO
                  ========================================== */}

                  {
                    isFocused && (

                      <Text
                        style={[
                          styles.textoActivo,

                          {
                            color:
                              textColor,
                          },
                        ]}

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
        "#000000",

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

      justifyContent:
        "center",

      alignItems:
        "center",

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

      marginTop:
        28,

      textAlign:
        "center",

    },

  });
