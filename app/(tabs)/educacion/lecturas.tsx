import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import React, {
  useMemo,
  useState,
} from "react";

import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import LecturaRecomendadaCard from "../../../components/educacion/LecturaRecomendadaCard";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// =========
// LECTURAS
// =========

const lecturas = [
  {
    id:
      "que-es-la-ansiedad",

    categoria:
      "Ansiedad",

    tiempo:
      "5 min de lectura",

    titulo:
      "¿Qué es la ansiedad?",

    descripcion:
      "Conoce qué es la ansiedad, por qué aparece y cómo puede manifestarse en diferentes situaciones.",
  },
  {
    id:
      "reconocer-ansiedad",

    categoria:
      "Ansiedad",

    tiempo:
      "7 min de lectura",

    titulo:
      "Cómo reconocer la ansiedad",

    descripcion:
      "Aprende a identificar algunas señales físicas, emocionales y conductuales relacionadas con la ansiedad.",
  },
  {
    id:
      "comprender-autoestima",

    categoria:
      "Autoestima",

    tiempo:
      "6 min de lectura",

    titulo:
      "Comprendiendo la autoestima",

    descripcion:
      "Conoce qué es la autoestima y cómo puede influir en la manera en que pensamos y actuamos.",
  },
  {
    id:
      "fortalecer-autoestima",

    categoria:
      "Autoestima",

    tiempo:
      "7 min de lectura",

    titulo:
      "Cómo fortalecer tu autoestima",

    descripcion:
      "Descubre pequeñas acciones que pueden ayudarte a construir una relación más saludable contigo.",
  },
  {
    id:
      "comprender-estres",

    categoria:
      "Estrés",

    tiempo:
      "5 min de lectura",

    titulo:
      "Comprendiendo el estrés",

    descripcion:
      "Conoce por qué aparece el estrés y cuáles son algunas de las señales más comunes.",
  },
  {
    id:
      "manejar-estres",

    categoria:
      "Estrés",

    tiempo:
      "8 min de lectura",

    titulo:
      "Estrategias para manejar el estrés",

    descripcion:
      "Conoce algunas estrategias que pueden ayudarte a afrontar situaciones estresantes.",
  },
  {
    id:
      "entender-procrastinacion",

    categoria:
      "Procrastinación",

    tiempo:
      "6 min de lectura",

    titulo:
      "¿Por qué procrastinamos?",

    descripcion:
      "Comprende algunas de las razones que pueden llevarnos a posponer nuestras responsabilidades.",
  },
  {
    id:
      "evitar-procrastinacion",

    categoria:
      "Procrastinación",

    tiempo:
      "7 min de lectura",

    titulo:
      "Pequeños pasos para dejar de procrastinar",

    descripcion:
      "Aprende estrategias sencillas para comenzar tus tareas y organizar mejor tu tiempo.",
  },
  {
    id:
      "comprender-soledad",

    categoria:
      "Soledad",

    tiempo:
      "5 min de lectura",

    titulo:
      "Comprendiendo la soledad",

    descripcion:
      "Conoce las diferencias entre estar solo y experimentar sentimientos de soledad.",
  },
  {
    id:
      "conexiones-saludables",

    categoria:
      "Soledad",

    tiempo:
      "7 min de lectura",

    titulo:
      "Construyendo conexiones saludables",

    descripcion:
      "Descubre algunas formas de fortalecer nuestras relaciones y crear vínculos significativos.",
  },
];


// =========
// CATEGORÍAS
// =========

const categorias = [
  "Todas",
  "Ansiedad",
  "Autoestima",
  "Estrés",
  "Procrastinación",
  "Soledad",
  "Depresión",
];


// =========
// COMPONENTE
// =========

export default function LecturasScreen() {

  const {
    categoria,
  } =
    useLocalSearchParams<{
      categoria?: string;
    }>();


  // =======
  // ESTADOS
  // =======

  const [
    busqueda,
    setBusqueda,
  ] =
    useState(
      ""
    );


  const [
    categoriaSeleccionada,
    setCategoriaSeleccionada,
  ] =
    useState(
      categoria ||
      "Todas"
    );


  // =======
  // COLORES DEL TEMA
  // =======

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


  const inputBackgroundColor =
    useThemeColor(
      {},
      "inputBackground"
    );


  const inputBorderColor =
    useThemeColor(
      {},
      "inputBorder"
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


  const borderColor =
    useThemeColor(
      {},
      "border"
    );


  const textOnPrimaryColor =
    useThemeColor(
      {},
      "textOnPrimary"
    );


  // =======
  // FILTRAR LECTURAS
  // =======

  const lecturasFiltradas =
    useMemo(
      () => {

        return lecturas.filter(
          lectura => {

            const coincideCategoria =
              categoriaSeleccionada ===
                "Todas" ||
              lectura.categoria ===
                categoriaSeleccionada;


            const textoBusqueda =
              busqueda
                .toLowerCase()
                .trim();


            const coincideBusqueda =
              textoBusqueda.length ===
                0 ||

              lectura.titulo
                .toLowerCase()
                .includes(
                  textoBusqueda
                ) ||

              lectura.descripcion
                .toLowerCase()
                .includes(
                  textoBusqueda
                ) ||

              lectura.categoria
                .toLowerCase()
                .includes(
                  textoBusqueda
                );


            return (
              coincideCategoria &&
              coincideBusqueda
            );

          }
        );

      },
      [
        busqueda,
        categoriaSeleccionada,
      ]
    );


  // =======
  // UI
  // =======

  return (

    <ScrollView
      style={{
        flex:
          1,

        backgroundColor,
      }}

      showsVerticalScrollIndicator={
        false
      }

      contentContainerStyle={{
        paddingBottom:
          130,
      }}
    >

      <View
        style={{
          paddingHorizontal:
            24,

          paddingTop:
            48,
        }}
      >

        {/* 
            BOTÓN VOLVER
         */}

        <Pressable
          onPress={() =>
            router.back()
          }

          style={({
            pressed,
          }) => ({
            width:
              44,

            height:
              44,

            marginBottom:
              20,

            borderRadius:
              22,

            alignItems:
              "center",

            justifyContent:
              "center",

            borderWidth:
              1,

            borderColor,

            backgroundColor:
              surfaceColor,

            opacity:
              pressed
                ? 0.7
                : 1,

            shadowColor:
              "#000000",

            shadowOffset: {
              width:
                0,

              height:
                2,
            },

            shadowOpacity:
              0.06,

            shadowRadius:
              4,

            elevation:
              2,
          })}
        >

          <Ionicons
            name="arrow-back"
            size={23}
            color={
              iconColor
            }
          />

        </Pressable>


        {/*ENCABEZADO*/}

        <Animated.View
          entering={
            FadeInDown
              .duration(
                450
              )
          }
        >

          <Text
            style={{
              fontFamily:
                "Nunito-Bold",

              fontSize:
                27,

              color:
                textColor,
            }}
          >
            Biblioteca
          </Text>


          <Text
            style={{
              marginTop:
                8,

              fontFamily:
                "Nunito-Medium",

              fontSize:
                15,

              lineHeight:
                24,
              textAlign:
                "justify",
              color:
                textSecondaryColor,
            }}
          >
            Explora contenidos sobre bienestar emocional y encuentra lecturas
            relacionadas con los temas que más te interesan.
          </Text>

        </Animated.View>


        {/* 
            BUSCADOR
         */}

        <Animated.View
          entering={
            FadeInDown
              .delay(
                80
              )
              .duration(
                450
              )
          }

          style={{
            minHeight:
              56,

            marginTop:
              24,

            paddingHorizontal:
              16,

            flexDirection:
              "row",

            alignItems:
              "center",

            borderRadius:
              16,

            borderWidth:
              1,

            borderColor:
              inputBorderColor,

            backgroundColor:
              inputBackgroundColor,

            shadowColor:
              "#000000",

            shadowOffset: {
              width:
                0,

              height:
                2,
            },

            shadowOpacity:
              0.05,

            shadowRadius:
              4,

            elevation:
              2,
          }}
        >

          <Ionicons
            name="search-outline"
            size={21}
            color={
              iconColor
            }
          />


          <TextInput
            value={
              busqueda
            }

            onChangeText={
              setBusqueda
            }

            placeholder="Buscar una lectura..."

            placeholderTextColor={
              placeholderColor
            }

            selectionColor={
              primaryColor
            }

            style={{
              flex:
                1,

              marginLeft:
                12,

              paddingVertical:
                16,

              fontFamily:
                "Nunito-Medium",

              fontSize:
                15,

              color:
                textColor,
            }}
          />


          {
            busqueda.length >
              0 && (

              <Pressable
                hitSlop={
                  8
                }

                onPress={() =>
                  setBusqueda(
                    ""
                  )
                }
              >

                <Ionicons
                  name="close-circle"
                  size={20}
                  color={
                    textMutedColor
                  }
                />

              </Pressable>

            )
          }

        </Animated.View>


        {/* 
            FILTROS
         */}

        <Animated.View
          entering={
            FadeInDown
              .delay(
                140
              )
              .duration(
                450
              )
          }

          style={{
            marginTop:
              24,
          }}
        >

          <Text
            style={{
              marginBottom:
                12,

              fontFamily:
                "Nunito-SemiBold",

              fontSize:
                17,

              color:
                textColor,
            }}
          >
            Categorías
          </Text>


          <ScrollView
            horizontal

            showsHorizontalScrollIndicator={
              false
            }
          >

            <View
              style={{
                flexDirection:
                  "row",

                gap:
                  12,

                paddingRight:
                  24,
              }}
            >

              {
                categorias.map(
                  item => {

                    const estaSeleccionada =
                      categoriaSeleccionada ===
                      item;


                    return (

                      <Pressable
                        key={
                          item
                        }

                        onPress={() =>
                          setCategoriaSeleccionada(
                            item
                          )
                        }

                        style={({
                          pressed,
                        }) => ({
                          paddingHorizontal:
                            16,

                          paddingVertical:
                            10,

                          borderRadius:
                            999,

                          borderWidth:
                            estaSeleccionada
                              ? 0
                              : 1,

                          borderColor:
                            borderColor,

                          backgroundColor:
                            estaSeleccionada
                              ? primaryColor
                              : surfaceColor,

                          opacity:
                            pressed
                              ? 0.75
                              : 1,
                        })}
                      >

                        <Text
                          style={{
                            fontFamily:
                              "Nunito-SemiBold",

                            fontSize:
                              13,

                            color:
                              estaSeleccionada
                                ? textOnPrimaryColor
                                : textSecondaryColor,
                          }}
                        >
                          {item}
                        </Text>

                      </Pressable>

                    );

                  }
                )
              }

            </View>

          </ScrollView>

        </Animated.View>


        {/* 
            ENCABEZADO DE RESULTADOS
         */}

        <Animated.View
          entering={
            FadeInDown
              .delay(
                200
              )
              .duration(
                450
              )
          }

          style={{
            marginTop:
              32,

            marginBottom:
              20,

            flexDirection:
              "row",

            alignItems:
              "flex-end",

            justifyContent:
              "space-between",
          }}
        >

          <View
            style={{
              flex:
                1,

              paddingRight:
                12,
            }}
          >

            <Text
              style={{
                fontFamily:
                  "Nunito-SemiBold",

                fontSize:
                  20,

                color:
                  textColor,
              }}
            >
              {
                categoriaSeleccionada ===
                  "Todas"
                  ? "Todas las lecturas"
                  : categoriaSeleccionada
              }
            </Text>


            <Text
              style={{
                marginTop:
                  4,

                fontFamily:
                  "Nunito-Medium",

                fontSize:
                  13,

                color:
                  textMutedColor,
              }}
            >
              {lecturasFiltradas.length}{" "}
              {
                lecturasFiltradas.length ===
                  1
                  ? "lectura encontrada"
                  : "lecturas encontradas"
              }
            </Text>

          </View>

        </Animated.View>


        {/* 
            RESULTADOS
         */}

        {
          lecturasFiltradas.length >
            0

            ? (

              lecturasFiltradas.map(
                lectura => (

                  <LecturaRecomendadaCard
                    key={
                      lectura.id
                    }

                    categoria={
                      lectura.categoria
                    }

                    tiempo={
                      lectura.tiempo
                    }

                    titulo={
                      lectura.titulo
                    }

                    descripcion={
                      lectura.descripcion
                    }

                    onPress={() => {

                      console.log(
                        "Lectura seleccionada:",
                        lectura.id
                      );

                    }}
                  />

                )
              )

            )

            : (

              <View
                style={{
                  marginTop:
                    32,

                  paddingHorizontal:
                    24,

                  paddingVertical:
                    40,

                  alignItems:
                    "center",

                  borderRadius:
                    22,

                  borderWidth:
                    1,

                  borderColor,

                  backgroundColor:
                    surfaceColor,
                }}
              >

                <View
                  style={{
                    width:
                      64,

                    height:
                      64,

                    borderRadius:
                      32,

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    backgroundColor:
                      surfaceSecondaryColor,
                  }}
                >

                  <Ionicons
                    name="book-outline"
                    size={29}
                    color={
                      textMutedColor
                    }
                  />

                </View>


                <Text
                  style={{
                    marginTop:
                      16,

                    fontFamily:
                      "Nunito-SemiBold",

                    fontSize:
                      17,

                    textAlign:
                      "center",

                    color:
                      textColor,
                  }}
                >
                  No encontramos lecturas
                </Text>


                <Text
                  style={{
                    marginTop:
                      8,

                    fontFamily:
                      "Nunito-Medium",

                    fontSize:
                      14,

                    lineHeight:
                      20,

                    textAlign:
                      "center",

                    color:
                      textMutedColor,
                  }}
                >
                  Intenta buscar otro tema o selecciona una categoría diferente.
                </Text>

              </View>

            )
        }

      </View>

    </ScrollView>

  );

}