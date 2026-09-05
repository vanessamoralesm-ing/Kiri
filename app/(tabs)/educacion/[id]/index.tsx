import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import React from "react";

import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import LecturaRecomendadaCard from "../../../../components/educacion/LecturaRecomendadaCard";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// DATOS TEMPORALES

const contenidoCategorias = {
  Ansiedad: {
    titulo:
      "Ansiedad",

    descripcion:
      "Conoce más sobre la ansiedad, aprende a identificarla y descubre herramientas que pueden ayudarte a comprender mejor lo que sientes.",

    mito:
      "“Sentir ansiedad significa que algo está mal conmigo.”",

    realidad:
      "La ansiedad puede ser una respuesta normal ante situaciones de preocupación, incertidumbre o peligro. Puede convertirse en un problema cuando aparece de manera intensa, frecuente o comienza a afectar las actividades de la vida diaria.",

    lecturas: [
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
    ],
  },

  Autoestima: {
    titulo:
      "Autoestima",

    descripcion:
      "Descubre cómo la manera en que te percibes puede influir en tus emociones, decisiones y relaciones.",

    mito:
      "“Tener buena autoestima significa sentirse seguro todo el tiempo.”",

    realidad:
      "Tener una autoestima saludable no significa sentirse bien en todo momento. También implica reconocer nuestras fortalezas y dificultades, aceptar que podemos equivocarnos y aprender a tratarnos con respeto.",

    lecturas: [
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
    ],
  },

  Estres: {
    titulo:
      "Estrés",

    descripcion:
      "Aprende qué es el estrés, cómo puede manifestarse y qué podemos hacer para manejarlo de una manera más saludable.",

    mito:
      "“Todo el estrés es malo y debemos evitarlo por completo.”",

    realidad:
      "El estrés es una respuesta natural del organismo ante determinadas situaciones. En algunos momentos puede ayudarnos a reaccionar y adaptarnos, pero cuando se mantiene durante mucho tiempo puede afectar nuestro bienestar.",

    lecturas: [
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
    ],
  },

  Procrastinacion: {
    titulo:
      "Procrastinación",

    descripcion:
      "Comprende por qué algunas veces dejamos nuestras responsabilidades para después y cómo podemos empezar a cambiar este hábito.",

    mito:
      "“Las personas procrastinan simplemente porque son perezosas.”",

    realidad:
      "La procrastinación puede estar relacionada con diferentes factores, como el miedo a equivocarse, sentirse abrumado, la falta de motivación o la dificultad para organizar una tarea.",

    lecturas: [
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
    ],
  },

  Soledad: {
    titulo:
      "Soledad",

    descripcion:
      "Conoce mejor qué significa sentirse solo y cómo podemos fortalecer nuestros vínculos y nuestro bienestar emocional.",

    mito:
      "“Estar solo y sentirse solo significan exactamente lo mismo.”",

    realidad:
      "Una persona puede disfrutar de momentos a solas sin sentirse sola. La soledad emocional aparece cuando sentimos que nuestras necesidades de conexión o compañía no están siendo satisfechas.",

    lecturas: [
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
    ],
  },

  Depresion: {
    titulo:
      "Depresión",

    descripcion:
      "La depresión es una condición de salud mental que puede afectar de manera persistente el estado de ánimo, los pensamientos, la energía y la forma en que una persona realiza sus actividades cotidianas. Comprender sus señales y hablar de ellas con claridad puede facilitar la búsqueda de apoyo adecuado.",

    mito:
      "“La depresión es solo tristeza y se supera con fuerza de voluntad.”",

    realidad:
      "La depresión no es simplemente un momento de tristeza ni una falta de voluntad. Puede incluir pérdida de interés o placer, cambios en el sueño o el apetito, cansancio, dificultad para concentrarse y sentimientos de desesperanza. Su intensidad y duración varían entre personas, y cuando estos síntomas interfieren con la vida diaria es importante buscar orientación de un profesional de la salud mental.",

    lecturas: [
      {
        id:
          "comprender-depresion",

        categoria:
          "Depresión",

        tiempo:
          "7 min de lectura",

        titulo:
          "Comprendiendo la depresión",

        descripcion:
          "Conoce qué es la depresión, algunas de sus manifestaciones más frecuentes y por qué no debe confundirse con una tristeza pasajera.",
      },
      {
        id:
          "apoyo-ante-depresion",

        categoria:
          "Depresión",

        tiempo:
          "8 min de lectura",

        titulo:
          "Cuándo y cómo buscar apoyo",

        descripcion:
          "Aprende a reconocer cuándo el malestar emocional requiere atención y qué formas de apoyo profesional y social pueden acompañar el proceso de recuperación.",
      },
    ],
  },

};


// COMPONENTE

export default function CategoriaScreen() {

  // PARÁMETROS

  const {
    id,
  } =
    useLocalSearchParams<{
      id: string;
    }>();


  // COLORES DEL TEMA

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


  const textOnPrimaryColor =
    useThemeColor(
      {},
      "textOnPrimary"
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


  const secondaryColor =
    useThemeColor(
      {},
      "secondary"
    );


  const secondarySoftColor =
    useThemeColor(
      {},
      "secondarySoft"
    );


  // CATEGORÍA

  const categoria =
    contenidoCategorias[
      id as keyof typeof contenidoCategorias
    ];


  // CATEGORÍA NO ENCONTRADA

  if (
    !categoria
  ) {

    return (

      <View
        style={{
          flex:
            1,

          paddingHorizontal:
            24,

          alignItems:
            "center",

          justifyContent:
            "center",

          backgroundColor,
        }}
      >

        <Text
          style={{
            fontFamily:
              "Nunito-SemiBold",

            fontSize:
              18,

            textAlign:
              "center",

            color:
              textColor,
          }}
        >
          No encontramos esta categoría.
        </Text>


        <Pressable
          onPress={() =>
            router.replace(
              "/(tabs)/educacion" as any
            )
          }

          style={({
            pressed,
          }) => ({
            marginTop:
              20,

            paddingHorizontal:
              20,

            paddingVertical:
              12,

            borderRadius:
              12,

            backgroundColor:
              primaryColor,

            opacity:
              pressed
                ? 0.8
                : 1,
          })}
        >

          <Text
            style={{
              fontFamily:
                "Nunito-SemiBold",

              color:
                textOnPrimaryColor,
            }}
          >
            Volver a Educación
          </Text>

        </Pressable>

      </View>

    );

  }


  // UI

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

        {/*VOLVER*/}

        <Pressable
          onPress={() =>
            router.replace(
              "/(tabs)/educacion" as any
            )
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


        {/* 
            INFORMACIÓN DE LA CATEGORÍA
         */}

        <Animated.View
          entering={
            FadeInDown.duration(
              450
            )
          }
        >

          <Text
            style={{
              fontFamily:
                "Nunito-Bold",

              fontSize:
                26,

              color:
                primaryColor,
            }}
          >
            {categoria.titulo}
          </Text>


          <Text
            style={{
              marginTop:
                8,

              fontFamily:
                "Nunito-SemiBold",

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
            {categoria.descripcion}
          </Text>

        </Animated.View>


        {/* 
            MITOS Y REALIDADES
         */}

        <Animated.View
          entering={
            FadeInDown
              .delay(
                100
              )
              .duration(
                450
              )
          }

          style={{
            marginTop:
              36,
          }}
        >

          <Text
            style={{
              marginBottom:
                20,

              fontFamily:
                "Nunito-SemiBold",

              fontSize:
                20,

              color:
                textColor,
            }}
          >
            Mitos y Realidades
          </Text>


          {/* 
              CONTENEDOR
           */}

          <View
            style={{
              padding:
                16,

              borderRadius:
                22,

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
                  2,
              },

              shadowOpacity:
                0.08,

              shadowRadius:
                6,

              elevation:
                3,
            }}
          >

            {/* 
                MITO
             */}

            <View
              style={{
                padding:
                  16,

                borderRadius:
                  18,

                backgroundColor:
                  accentSoftColor,
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

                <View
                  style={{
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
                      surfaceColor,
                  }}
                >

                  <Ionicons
                    name="bulb-outline"
                    size={22}
                    color={
                      accentColor
                    }
                  />

                </View>


                <Text
                  style={{
                    marginLeft:
                      12,

                    fontFamily:
                      "Nunito-Bold",

                    fontSize:
                      13,

                    textTransform:
                      "uppercase",

                    letterSpacing:
                      0.7,

                    color:
                      accentColor,
                  }}
                >
                  Mito
                </Text>

              </View>


              <Text
                style={{
                  marginTop:
                    16,

                  fontFamily:
                    "Nunito-SemiBold",

                  fontSize:
                    16,

                  lineHeight:
                    24,

                  color:
                    textColor,
                }}
              >
                {categoria.mito}
              </Text>

            </View>


            {/* 
                REALIDAD
             */}

            <View
              style={{
                marginTop:
                  16,

                padding:
                  16,

                borderRadius:
                  18,

                backgroundColor:
                  secondarySoftColor,
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

                <View
                  style={{
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
                      surfaceColor,
                  }}
                >

                  <Ionicons
                    name="checkmark-circle-outline"
                    size={23}
                    color={
                      secondaryColor
                    }
                  />

                </View>


                <Text
                  style={{
                    marginLeft:
                      12,

                    fontFamily:
                      "Nunito-Bold",

                    fontSize:
                      13,

                    textTransform:
                      "uppercase",

                    letterSpacing:
                      0.7,

                    color:
                      secondaryColor,
                  }}
                >
                  Realidad
                </Text>

              </View>


              <Text
                style={{
                  marginTop:
                    16,

                  fontFamily:
                    "Nunito-SemiBold",

                  fontSize:
                    14,

                  lineHeight:
                    24,

                  textAlign:
                    "justify",

                  color:
                    textSecondaryColor,
                }}
              >
                {categoria.realidad}
              </Text>

            </View>

          </View>

        </Animated.View>


        {/* 
            LECTURAS RECOMENDADAS
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
              40,
          }}
        >

          <View
            style={{
              marginBottom:
                20,

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
                  "Nunito-SemiBold",

                fontSize:
                  20,

                color:
                  textColor,
              }}
            >
              Lecturas recomendadas
            </Text>


            <Pressable
              hitSlop={
                8
              }

              onPress={() =>
                router.push({
                  pathname:
                    "/(tabs)/educacion/lecturas",

                  params: {
                    categoria:
                      categoria.titulo,
                  },
                } as any)
              }
            >

              <Text
                style={{
                  fontFamily:
                    "Nunito-SemiBold",

                  fontSize:
                    13,

                  color:
                    primaryColor,
                }}
              >
                Ver todas
              </Text>

            </Pressable>

          </View>


          {
            categoria.lecturas.map(
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
                />

              )
            )
          }

        </Animated.View>

      </View>

    </ScrollView>

  );

}