import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";

import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import Animated, { FadeInDown } from "react-native-reanimated";

import EncabezadoCard from "@/components/educacion/EncabezadoCard";
import LecturaRecomendadaCard from "@/components/educacion/LecturaRecomendadaCard";
import MitoRealidadCard from "@/components/educacion/MitoRealidadCard";

import {
  MAX_WIDTHS,
  PADDING_RESPONSIVE,
} from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// DATOS TEMPORALES
// Más adelante estos datos vendrán de Supabase.
// ==========================================================

const contenidoCategorias = {
  // ========================================================
  // ANSIEDAD
  // ========================================================

  Ansiedad: {
    titulo: "Ansiedad",

    imagen: require(
      "../../../../assets/images_educacion/kiri_ansiedad_horiz.png"
    ),

    descripcion:
      "Identifica la ansiedad y descubre herramientas para comprender lo que sientes.",

    mito:
      "“Sentir ansiedad significa que algo está mal conmigo.”",

    realidad:
      "La ansiedad es una respuesta normal ante el peligro o la incertidumbre, pero se convierte en un problema cuando es muy intensa, frecuente y afecta tu vida diaria.",

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

  // ========================================================
  // AUTOESTIMA
  // ========================================================

  Autoestima: {
    titulo: "Autoestima",

    imagen: require(
      "../../../../assets/images_educacion/kiri_autoest_horiz.png"
    ),

    descripcion:
      "Descubre cómo la manera en que te percibes puede influir en tus emociones, decisiones y relaciones.",

    mito:
      "“Tener buena autoestima significa sentirse seguro todo el tiempo.”",

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

  // ========================================================
  // ESTRÉS
  // ========================================================

  Estres: {
    titulo: "Estrés",

    imagen: require(
      "../../../../assets/images_educacion/kiri_estres_horiz.png"
    ),

    descripcion:
      "Aprende qué es el estrés, cómo puede manifestarse y qué podemos hacer para manejarlo de una manera más saludable.",

    mito:
      "“Todo el estrés es malo y debemos evitarlo por completo.”",

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

  // ========================================================
  // PROCRASTINACIÓN
  // ========================================================

  Procrastinacion: {
    titulo: "Procrastinación",

    imagen: require(
      "../../../../assets/images_educacion/kiri_procras_horiz.png"
    ),

    descripcion:
      "Es el hábito de posponer tareas o responsabilidades importantes.",

    mito:
      "“Las personas procrastinan simplemente porque son perezosas.”",

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

  // ========================================================
  // SOLEDAD
  // ========================================================

  Soledad: {
    titulo: "Soledad",

    imagen: require(
      "../../../../assets/images_educacion/kiri_soledad_horiz.png"
    ),

    descripcion:
      "Conoce mejor qué significa sentirse solo y cómo podemos fortalecer nuestros vínculos y nuestro bienestar emocional.",

    mito:
      "“Estar solo y sentirse solo significan exactamente lo mismo.”",

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

  // ========================================================
  // DEPRESIÓN
  // ========================================================

  Depresion: {
    titulo: "Depresión",

    imagen: require(
      "../../../../assets/images_educacion/kiri_depre_horiz.png"
    ),

    descripcion:
      "La depresión afecta el ánimo, la energía y la vida diaria. Identificar sus señales facilita buscar ayuda.",

    mito:
      "“La depresión es solo tristeza y se supera con fuerza de voluntad.”",

    realidad:
      "La depresión es una enfermedad médica real, no simple tristeza ni falta de voluntad. Es un apagón físico y mental que causa cansancio, desesperanza y pérdida de interés; si afecta tu vida diaria, busca ayuda profesional.",

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
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  // ========================================================
  // SCROLL
  // ========================================================

  const scrollViewRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      const frame = requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: false,
        });
      });

      return () => {
        cancelAnimationFrame(frame);
      };
    }, [])//
  );

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const {
    esTelefono,
    esTablet,
    esEscritorio,
  } = useResponsiveLayout();

  // ========================================================
  // COLORES
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const textColor = useThemeColor({}, "text");
  const textMutedColor = useThemeColor({}, "textMuted");
  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");
  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");
  const borderColor = useThemeColor({}, "border");

  // ========================================================
  // CONFIGURACIÓN RESPONSIVE
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

  const paddingTop = esEscritorio
    ? 28
    : esTablet
      ? 24
      : 20;

  const paddingBottom = esEscritorio
    ? 64
    : 140;

  // ========================================================
  // ANCHO DE LECTURAS
  // ========================================================

  const [anchoLecturas, setAnchoLecturas] = useState(0);

  const numeroColumnas = esEscritorio
    ? 4
    : esTablet
      ? 3
      : 2;

  const gapLecturas = esEscritorio
    ? 26
    : esTablet
      ? 18
      : 12;

  const anchoDisponible =
    anchoLecturas > 0
      ? (anchoLecturas -
          gapLecturas * (numeroColumnas - 1)) /
        numeroColumnas
      : 0;

  const anchoTarjeta =
    anchoDisponible > 0
      ? esEscritorio
        ? Math.min(anchoDisponible, 230)
        : esTablet
          ? Math.min(anchoDisponible, 190)
          : anchoDisponible
      : esEscritorio
        ? 230
        : esTablet
          ? 190
          : 150;

  function medirLecturas(event: LayoutChangeEvent) {
    const nuevoAncho = event.nativeEvent.layout.width;

    setAnchoLecturas((anterior) =>
      Math.abs(nuevoAncho - anterior) > 1
        ? nuevoAncho
        : anterior
    );
  }

  // ========================================================
  // CATEGORÍA ACTUAL
  // ========================================================

  const categoria =
    contenidoCategorias[
      id as keyof typeof contenidoCategorias
    ];

  // ========================================================
  // CATEGORÍA NO ENCONTRADA
  // ========================================================

  if (!categoria) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{
          paddingHorizontal,
          backgroundColor,
        }}
      >
        <View
          className="items-center"
          style={{
            width: "100%",
            maxWidth: 440,
            padding: esTelefono ? 22 : 28,
            borderRadius: 24,
            borderWidth: 1,
            borderColor,
            backgroundColor: surfaceColor,

            ...Platform.select({
              web: {
                boxShadow:
                  "0px 3px 10px rgba(0,0,0,0.05)",
              } as any,

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
                elevation: 2,
              },
            }),
          }}
        >
          <View
            className="h-[62px] w-[62px] items-center justify-center rounded-full"
            style={{
              backgroundColor: primarySoftColor,
            }}
          >
            <Ionicons
              name="library-outline"
              size={28}
              color={primaryColor}
            />
          </View>

          <Text
            className="mt-4 text-center font-nunito-bold text-[19px]"
            style={{
              color: textColor,
            }}
          >
            No encontramos esta categoría
          </Text>

          <Text
            className="mt-1.5 text-center font-nunito-medium text-sm leading-5"
            style={{
              color: textMutedColor,
            }}
          >
            Es posible que el contenido solicitado ya no esté disponible.
          </Text>

          <Pressable
            onPress={() =>
              router.replace(
                "/(tabs)/educacion" as any
              )
            }
            className="mt-5 min-h-11 flex-row items-center justify-center rounded-[13px] px-5"
            style={({ pressed }) => ({
              gap: 7,
              backgroundColor: primaryColor,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons
              name="arrow-back"
              size={17}
              color={textOnPrimaryColor}
            />

            <Text
              className="font-nunito-semibold text-[13px]"
              style={{
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
      ref={scrollViewRef}
      className="flex-1"
      style={{
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
            BOTÓN VOLVER
            ================================================== */}

        <Pressable
          onPress={() =>
            router.replace(
              "/(tabs)/educacion" as any
            )
          }
          hitSlop={10}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            marginBottom: 12,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: primarySoftColor,
            opacity: pressed ? 0.7 : 1,

            transform: [
              {
                scale: pressed ? 0.96 : 1,
              },
            ],

            ...Platform.select({
              web: {
                cursor: "pointer",
              } as any,
            }),
          })}
        >
          <Ionicons
            name="chevron-back"
            size={23}
            color={primaryColor}
          />
        </Pressable>

        {/* ==================================================
            ENCABEZADO
            ================================================== */}

        <Animated.View
          entering={FadeInDown.duration(450)}
        >
          <EncabezadoCard
            imagen={categoria.imagen}
            titulo={categoria.titulo}
            subtitulo={categoria.descripcion}
          />
        </Animated.View>

        {/* ==================================================
            LECTURAS SUGERIDAS
            ================================================== */}

        <Animated.View
          entering={FadeInDown
            .delay(100)
            .duration(450)}
          style={{
            marginTop: esEscritorio
              ? 40
              : 36,
          }}
        >
          <View className="mb-5 flex-row items-center justify-between">
            <View
              style={{
                flex: 1,
                minWidth: 0,
                paddingRight: 12,
              }}
            >
              <Text
                className="font-nunito-bold"
                style={{
                  fontSize: esEscritorio
                    ? 22
                    : 20,
                  color: textColor,
                }}
              >
                Lecturas sugeridas
              </Text>

              {!esTelefono && (
                <Text
                  className="mt-1 font-nunito-medium text-[13px]"
                  style={{
                    color: textMutedColor,
                  }}
                >
                  Continúa explorando contenidos relacionados con este tema.
                </Text>
              )}
            </View>

            {/* VER TODAS */}

            <Pressable
              hitSlop={8}
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
              {({ pressed }) => (
                <View
                  className="flex-row items-center rounded-full px-3 py-2"
                  style={{
                    backgroundColor:
                      primarySoftColor,

                    opacity: pressed
                      ? 0.65
                      : 1,
                  }}
                >
                  <Text
                    className="font-nunito-semibold text-sm"
                    style={{
                      color: primaryColor,
                    }}
                  >
                    Ver todas
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color={primaryColor}
                  />
                </View>
              )}
            </Pressable>
          </View>

          {/* ==================================================
              LECTURAS
              ================================================== */}

          <View
            onLayout={medirLecturas}
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "flex-start",
              columnGap: gapLecturas,
            }}
          >
            {categoria.lecturas.map(
              (lectura, index) => (
                <Animated.View
                  key={lectura.id}
                  entering={FadeInDown
                    .delay(150 + index * 50)
                    .duration(400)}
                  style={{
                    width: anchoTarjeta,
                    minWidth: 0,
                  }}
                >
                  <LecturaRecomendadaCard
                    titulo={lectura.titulo}
                    index={index}
                    ancho={anchoTarjeta}
                  />
                </Animated.View>
              )
            )}
          </View>
        </Animated.View>

        {/* ==================================================
            MITOS Y REALIDADES
            ================================================== */}

        <Animated.View
          entering={FadeInDown
            .delay(200)
            .duration(450)}
          style={{
            marginTop: esEscritorio
              ? 44
              : 40,
          }}
        >
          <Text
            className="mb-5 font-nunito-bold"
            style={{
              fontSize: esEscritorio
                ? 22
                : 20,
              color: textColor,
            }}
          >
            Mitos y Realidades
          </Text>

          <MitoRealidadCard
            mito={categoria.mito}
            realidad={categoria.realidad}
          />
        </Animated.View>
      </View>
    </ScrollView>
  );
}