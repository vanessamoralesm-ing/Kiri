import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import React, { useState } from "react";

import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import Animated, { FadeInDown } from "react-native-reanimated";

import LecturaRecomendadaCard from "../../../../components/educacion/LecturaRecomendadaCard";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// DATOS TEMPORALES
// ==========================================================

const contenidoCategorias = {
  Ansiedad: {
    titulo: "Ansiedad",

    descripcion:
      "Conoce más sobre la ansiedad, aprende a identificarla y descubre herramientas que pueden ayudarte a comprender mejor lo que sientes.",

    mito: "“Sentir ansiedad significa que algo está mal conmigo.”",

    realidad:
      "La ansiedad puede ser una respuesta normal ante situaciones de preocupación, incertidumbre o peligro. Puede convertirse en un problema cuando aparece de manera intensa, frecuente o comienza a afectar las actividades de la vida diaria.",

    lecturas: [
      {
        id: "que-es-la-ansiedad",

        categoria: "Ansiedad",

        tiempo: "5 min de lectura",

        titulo: "¿Qué es la ansiedad?",

        descripcion:
          "Conoce qué es la ansiedad, por qué aparece y cómo puede manifestarse en diferentes situaciones.",
      },

      {
        id: "reconocer-ansiedad",

        categoria: "Ansiedad",

        tiempo: "7 min de lectura",

        titulo: "Cómo reconocer la ansiedad",

        descripcion:
          "Aprende a identificar algunas señales físicas, emocionales y conductuales relacionadas con la ansiedad.",
      },
    ],
  },

  Autoestima: {
    titulo: "Autoestima",

    descripcion:
      "Descubre cómo la manera en que te percibes puede influir en tus emociones, decisiones y relaciones.",

    mito: "“Tener buena autoestima significa sentirse seguro todo el tiempo.”",

    realidad:
      "Tener una autoestima saludable no significa sentirse bien en todo momento. También implica reconocer nuestras fortalezas y dificultades, aceptar que podemos equivocarnos y aprender a tratarnos con respeto.",

    lecturas: [
      {
        id: "comprender-autoestima",

        categoria: "Autoestima",

        tiempo: "6 min de lectura",

        titulo: "Comprendiendo la autoestima",

        descripcion:
          "Conoce qué es la autoestima y cómo puede influir en la manera en que pensamos y actuamos.",
      },

      {
        id: "fortalecer-autoestima",

        categoria: "Autoestima",

        tiempo: "7 min de lectura",

        titulo: "Cómo fortalecer tu autoestima",

        descripcion:
          "Descubre pequeñas acciones que pueden ayudarte a construir una relación más saludable contigo.",
      },
    ],
  },

  Estres: {
    titulo: "Estrés",

    descripcion:
      "Aprende qué es el estrés, cómo puede manifestarse y qué podemos hacer para manejarlo de una manera más saludable.",

    mito: "“Todo el estrés es malo y debemos evitarlo por completo.”",

    realidad:
      "El estrés es una respuesta natural del organismo ante determinadas situaciones. En algunos momentos puede ayudarnos a reaccionar y adaptarnos, pero cuando se mantiene durante mucho tiempo puede afectar nuestro bienestar.",

    lecturas: [
      {
        id: "comprender-estres",

        categoria: "Estrés",

        tiempo: "5 min de lectura",

        titulo: "Comprendiendo el estrés",

        descripcion:
          "Conoce por qué aparece el estrés y cuáles son algunas de las señales más comunes.",
      },

      {
        id: "manejar-estres",

        categoria: "Estrés",

        tiempo: "8 min de lectura",

        titulo: "Estrategias para manejar el estrés",

        descripcion:
          "Conoce algunas estrategias que pueden ayudarte a afrontar situaciones estresantes.",
      },
    ],
  },

  Procrastinacion: {
    titulo: "Procrastinación",

    descripcion:
      "Comprende por qué algunas veces dejamos nuestras responsabilidades para después y cómo podemos empezar a cambiar este hábito.",

    mito: "“Las personas procrastinan simplemente porque son perezosas.”",

    realidad:
      "La procrastinación puede estar relacionada con diferentes factores, como el miedo a equivocarse, sentirse abrumado, la falta de motivación o la dificultad para organizar una tarea.",

    lecturas: [
      {
        id: "entender-procrastinacion",

        categoria: "Procrastinación",

        tiempo: "6 min de lectura",

        titulo: "¿Por qué procrastinamos?",

        descripcion:
          "Comprende algunas de las razones que pueden llevarnos a posponer nuestras responsabilidades.",
      },

      {
        id: "evitar-procrastinacion",

        categoria: "Procrastinación",

        tiempo: "7 min de lectura",

        titulo: "Pequeños pasos para dejar de procrastinar",

        descripcion:
          "Aprende estrategias sencillas para comenzar tus tareas y organizar mejor tu tiempo.",
      },
    ],
  },

  Soledad: {
    titulo: "Soledad",

    descripcion:
      "Conoce mejor qué significa sentirse solo y cómo podemos fortalecer nuestros vínculos y nuestro bienestar emocional.",

    mito: "“Estar solo y sentirse solo significan exactamente lo mismo.”",

    realidad:
      "Una persona puede disfrutar de momentos a solas sin sentirse sola. La soledad emocional aparece cuando sentimos que nuestras necesidades de conexión o compañía no están siendo satisfechas.",

    lecturas: [
      {
        id: "comprender-soledad",

        categoria: "Soledad",

        tiempo: "5 min de lectura",

        titulo: "Comprendiendo la soledad",

        descripcion:
          "Conoce las diferencias entre estar solo y experimentar sentimientos de soledad.",
      },

      {
        id: "conexiones-saludables",

        categoria: "Soledad",

        tiempo: "7 min de lectura",

        titulo: "Construyendo conexiones saludables",

        descripcion:
          "Descubre algunas formas de fortalecer nuestras relaciones y crear vínculos significativos.",
      },
    ],
  },

  Depresion: {
    titulo: "Depresión",

    descripcion:
      "La depresión es una condición de salud mental que puede afectar de manera persistente el estado de ánimo, los pensamientos, la energía y la forma en que una persona realiza sus actividades cotidianas. Comprender sus señales y hablar de ellas con claridad puede facilitar la búsqueda de apoyo adecuado.",

    mito: "“La depresión es solo tristeza y se supera con fuerza de voluntad.”",

    realidad:
      "La depresión no es simplemente un momento de tristeza ni una falta de voluntad. Puede incluir pérdida de interés o placer, cambios en el sueño o el apetito, cansancio, dificultad para concentrarse y sentimientos de desesperanza. Su intensidad y duración varían entre personas, y cuando estos síntomas interfieren con la vida diaria es importante buscar orientación de un profesional de la salud mental.",

    lecturas: [
      {
        id: "comprender-depresion",

        categoria: "Depresión",

        tiempo: "7 min de lectura",

        titulo: "Comprendiendo la depresión",

        descripcion:
          "Conoce qué es la depresión, algunas de sus manifestaciones más frecuentes y por qué no debe confundirse con una tristeza pasajera.",
      },

      {
        id: "apoyo-ante-depresion",

        categoria: "Depresión",

        tiempo: "8 min de lectura",

        titulo: "Cuándo y cómo buscar apoyo",

        descripcion:
          "Aprende a reconocer cuándo el malestar emocional requiere atención y qué formas de apoyo profesional y social pueden acompañar el proceso de recuperación.",
      },
    ],
  },
};

// ==========================================================
// COMPONENTE
// ==========================================================

export default function CategoriaScreen() {
  // ========================================================
  // PARÁMETROS
  // ========================================================

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // ESTADO
  // ========================================================

  const [anchoGridLecturas, setAnchoGridLecturas] = useState(0);

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  const iconColor = useThemeColor({}, "icon");

  const borderColor = useThemeColor({}, "border");

  const accentColor = useThemeColor({}, "accent");

  const accentSoftColor = useThemeColor({}, "accentSoft");

  const secondaryColor = useThemeColor({}, "secondary");

  const secondarySoftColor = useThemeColor({}, "secondarySoft");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidthContenido = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  const maxWidthTexto = esEscritorio ? 860 : undefined;

  const numeroColumnasLecturas = esEscritorio ? 2 : 1;

  const gapLecturas = esEscritorio ? 18 : 16;

  const anchoTarjetaLectura =
    anchoGridLecturas > 0 && numeroColumnasLecturas > 1
      ? (anchoGridLecturas - gapLecturas * (numeroColumnasLecturas - 1)) /
      numeroColumnasLecturas
      : undefined;

  const paddingTop = esEscritorio ? 28 : esTablet ? 24 : 20;

  const paddingBottom = esEscritorio ? 64 : 140;

  // ========================================================
  // CATEGORÍA
  // ========================================================

  const categoria = contenidoCategorias[id as keyof typeof contenidoCategorias];

  // ========================================================
  // MEDIR GRID
  // ========================================================

  function medirGridLecturas(event: LayoutChangeEvent) {
    const nuevoAncho = event.nativeEvent.layout.width;

    if (Math.abs(nuevoAncho - anchoGridLecturas) > 1) {
      setAnchoGridLecturas(nuevoAncho);
    }
  }

  // ========================================================
  // CATEGORÍA NO ENCONTRADA
  // ========================================================

  if (!categoria) {
    return (
      <View
        style={{
          flex: 1,

          paddingHorizontal,

          alignItems: "center",

          justifyContent: "center",

          backgroundColor,
        }}
      >
        <View
          style={{
            width: "100%",

            maxWidth: 440,

            padding: esTelefono ? 22 : 28,

            borderRadius: 24,

            borderWidth: 1,

            borderColor,

            alignItems: "center",

            backgroundColor: surfaceColor,
          }}
        >
          <View
            style={{
              width: 62,

              height: 62,

              borderRadius: 31,

              alignItems: "center",

              justifyContent: "center",

              backgroundColor: primarySoftColor,
            }}
          >
            <Ionicons name="library-outline" size={28} color={primaryColor} />
          </View>

          <Text
            style={{
              marginTop: 16,

              fontFamily: "Nunito-Bold",

              fontSize: 19,

              textAlign: "center",

              color: textColor,
            }}
          >
            No encontramos esta categoría
          </Text>

          <Text
            style={{
              marginTop: 6,

              fontFamily: "Nunito-Medium",

              fontSize: 14,

              lineHeight: 20,

              textAlign: "center",

              color: textMutedColor,
            }}
          >
            Es posible que el contenido solicitado ya no esté disponible.
          </Text>

          <Pressable
            onPress={() => router.replace("/(tabs)/educacion" as any)}
            style={({ pressed }) => ({
              marginTop: 20,

              minHeight: 44,

              paddingHorizontal: 20,

              borderRadius: 13,

              flexDirection: "row",

              alignItems: "center",

              justifyContent: "center",

              gap: 7,

              backgroundColor: primaryColor,

              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons name="arrow-back" size={17} color={textOnPrimaryColor} />

            <Text
              style={{
                fontFamily: "Nunito-SemiBold",

                fontSize: 13,

                color: textOnPrimaryColor,
              }}
            >
              Volver a Educación
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <ScrollView
      style={{
        flex: 1,

        backgroundColor,
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop,

        paddingBottom,
      }}
    >
      <View
        style={{
          width: "100%",

          maxWidth: maxWidthContenido,

          alignSelf: "center",

          paddingHorizontal,
        }}
      >
        {/* ==================================================
            VOLVER
        ================================================== */}

        <Pressable
          onPress={() => router.replace("/(tabs)/educacion" as any)}
          hitSlop={8}
          style={({ pressed }) => ({
            width: 46,

            height: 46,

            marginBottom: esEscritorio ? 22 : 18,

            borderRadius: 15,

            alignItems: "center",

            justifyContent: "center",

            borderWidth: 1,

            borderColor,

            backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,

            opacity: pressed ? 0.8 : 1,

            ...Platform.select({
              web: {
                boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
              },

              ios: {
                shadowColor: "#000000",

                shadowOffset: {
                  width: 0,

                  height: 2,
                },

                shadowOpacity: 0.05,

                shadowRadius: 5,
              },

              android: {
                elevation: 2,
              },
            }),
          })}
        >
          <Ionicons name="arrow-back" size={22} color={iconColor} />
        </Pressable>

        {/* ==================================================
            INFORMACIÓN DE LA CATEGORÍA
        ================================================== */}

        <Animated.View
          entering={FadeInDown.duration(450)}
          style={{
            width: "100%",

            maxWidth: maxWidthTexto,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esEscritorio ? 34 : esTablet ? 30 : 26,

              lineHeight: esEscritorio ? 42 : 34,

              color: primaryColor,
            }}
          >
            {categoria.titulo}
          </Text>

          <Text
            style={{
              marginTop: 8,

              fontFamily: "Nunito-SemiBold",

              fontSize: esEscritorio ? 16 : 15,

              lineHeight: esEscritorio ? 25 : 23,

              color: textSecondaryColor,
            }}
          >
            {categoria.descripcion}
          </Text>
        </Animated.View>

        {/* ==================================================
            MITOS Y REALIDADES
        ================================================== */}

        <Animated.View
          entering={FadeInDown.delay(100).duration(450)}
          style={{
            marginTop: esEscritorio ? 36 : 32,
          }}
        >
          <Text
            style={{
              marginBottom: 18,

              fontFamily: "Nunito-Bold",

              fontSize: esEscritorio ? 22 : 20,

              color: textColor,
            }}
          >
            Mitos y Realidades
          </Text>

          {/* ==================================================
              CONTENEDOR
          ================================================== */}

          <View
            style={{
              width: "100%",

              padding: esEscritorio ? 20 : 16,

              borderRadius: 22,

              borderWidth: 1,

              borderColor,

              backgroundColor: surfaceColor,

              flexDirection: esEscritorio ? "row" : "column",

              alignItems: "stretch",

              gap: 16,

              ...Platform.select({
                web: {
                  boxShadow: "0px 3px 10px rgba(0,0,0,0.05)",
                },

                ios: {
                  shadowColor: "#000000",

                  shadowOffset: {
                    width: 0,

                    height: 2,
                  },

                  shadowOpacity: 0.06,

                  shadowRadius: 6,
                },

                android: {
                  elevation: 3,
                },
              }),
            }}
          >
            {/* ==================================================
                MITO
            ================================================== */}

            <View
              style={{
                flex: esEscritorio ? 1 : undefined,

                minWidth: 0,

                padding: esEscritorio ? 20 : 16,

                borderRadius: 18,

                backgroundColor: accentSoftColor,
              }}
            >
              <View
                style={{
                  flexDirection: "row",

                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 42,

                    height: 42,

                    borderRadius: 21,

                    alignItems: "center",

                    justifyContent: "center",

                    backgroundColor: surfaceColor,
                  }}
                >
                  <Ionicons name="bulb-outline" size={22} color={accentColor} />
                </View>

                <Text
                  style={{
                    marginLeft: 12,

                    fontFamily: "Nunito-Bold",

                    fontSize: 13,

                    textTransform: "uppercase",

                    letterSpacing: 0.7,

                    color: accentColor,
                  }}
                >
                  Mito
                </Text>
              </View>

              <Text
                style={{
                  marginTop: 18,

                  fontFamily: "Nunito-SemiBold",

                  fontSize: esEscritorio ? 17 : 16,

                  lineHeight: esEscritorio ? 26 : 24,

                  color: textColor,
                }}
              >
                {categoria.mito}
              </Text>
            </View>

            {/* ==================================================
                REALIDAD
            ================================================== */}

            <View
              style={{
                flex: esEscritorio ? 1 : undefined,

                minWidth: 0,

                padding: esEscritorio ? 20 : 16,

                borderRadius: 18,

                backgroundColor: secondarySoftColor,
              }}
            >
              <View
                style={{
                  flexDirection: "row",

                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 42,

                    height: 42,

                    borderRadius: 21,

                    alignItems: "center",

                    justifyContent: "center",

                    backgroundColor: surfaceColor,
                  }}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={23}
                    color={secondaryColor}
                  />
                </View>

                <Text
                  style={{
                    marginLeft: 12,

                    fontFamily: "Nunito-Bold",

                    fontSize: 13,

                    textTransform: "uppercase",

                    letterSpacing: 0.7,

                    color: secondaryColor,
                  }}
                >
                  Realidad
                </Text>
              </View>

              <Text
                style={{
                  marginTop: 18,

                  fontFamily: "Nunito-SemiBold",

                  fontSize: esEscritorio ? 15 : 14,

                  lineHeight: esEscritorio ? 24 : 22,

                  color: textSecondaryColor,
                }}
              >
                {categoria.realidad}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ==================================================
            LECTURAS RECOMENDADAS
        ================================================== */}

        <Animated.View
          entering={FadeInDown.delay(200).duration(450)}
          style={{
            marginTop: esEscritorio ? 40 : 34,
          }}
        >
          <View
            style={{
              marginBottom: 18,

              flexDirection: "row",

              alignItems: "center",

              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,

                paddingRight: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esEscritorio ? 22 : 20,

                  color: textColor,
                }}
              >
                Lecturas recomendadas
              </Text>

              {!esTelefono && (
                <Text
                  style={{
                    marginTop: 3,

                    fontFamily: "Nunito-Medium",

                    fontSize: 13,

                    color: textMutedColor,
                  }}
                >
                  Continúa explorando contenidos relacionados con este tema.
                </Text>
              )}
            </View>

            <Pressable
              hitSlop={8}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/educacion/lecturas",

                  params: {
                    categoria: categoria.titulo,
                  },
                } as any)
              }
              style={({ pressed }) => ({
                minHeight: 38,

                paddingHorizontal: 10,

                borderRadius: 10,

                flexDirection: "row",

                alignItems: "center",

                justifyContent: "center",

                backgroundColor: pressed ? primarySoftColor : "transparent",
              })}
            >
              <Text
                style={{
                  fontFamily: "Nunito-SemiBold",

                  fontSize: 13,

                  color: primaryColor,
                }}
              >
                Ver todas
              </Text>

              <Ionicons name="chevron-forward" size={17} color={primaryColor} />
            </Pressable>
          </View>

          {/* ==================================================
              GRID DE LECTURAS
          ================================================== */}

          <View
            onLayout={medirGridLecturas}
            style={{
              width: "100%",

              flexDirection: numeroColumnasLecturas > 1 ? "row" : "column",

              flexWrap: numeroColumnasLecturas > 1 ? "wrap" : "nowrap",

              gap: gapLecturas,

              alignItems: "stretch",
            }}
          >
            {categoria.lecturas.map((lectura) => (
              <View
                key={lectura.id}
                style={{
                  width:
                    numeroColumnasLecturas === 1 ? "100%" : anchoTarjetaLectura,

                  minWidth: 0,
                }}
              >
                <LecturaRecomendadaCard
                  categoria={lectura.categoria}
                  tiempo={lectura.tiempo}
                  titulo={lectura.titulo}
                  descripcion={lectura.descripcion}
                />
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
