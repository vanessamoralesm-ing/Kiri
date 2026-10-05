import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";

import React, {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import EncabezadoCard from "@/components/educacion/EncabezadoCard";
import LecturaRecomendadaCard from "@/components/educacion/LecturaRecomendadaCard";
import MitoRealidadCard from "@/components/educacion/MitoRealidadCard";

import BotonVolver from "@/components/ui/BotonVolver";

import {
  MAX_WIDTHS,
  PADDING_RESPONSIVE,
} from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useRecursosCategoria } from "@/hooks/useRecursosCategoria";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// CONTENIDO DE LAS CATEGORÍAS
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
      "Aprende a como saber manejarlo de una manera más saludable.",

    mito:
      "“Todo el estrés es malo y debemos evitarlo por completo.”",

    realidad:
      "El estrés es una respuesta natural del organismo ante determinadas situaciones. En algunos momentos puede ayudarnos a reaccionar y adaptarnos, pero cuando se mantiene durante mucho tiempo puede afectar nuestro bienestar.",
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
    }, [])
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

  const backgroundColor =
    useThemeColor({}, "background");

  const surfaceColor =
    useThemeColor({}, "surface");

  const textColor =
    useThemeColor({}, "text");

  const textMutedColor =
    useThemeColor({}, "textMuted");

  const primaryColor =
    useThemeColor({}, "primary");

  const primarySoftColor =
    useThemeColor({}, "primarySoft");

  const textOnPrimaryColor =
    useThemeColor({}, "textOnPrimary");

  const borderColor =
    useThemeColor({}, "border");

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

  const [anchoLecturas, setAnchoLecturas] =
    useState(0);

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

  function medirLecturas(
    event: LayoutChangeEvent
  ) {
    const nuevoAncho =
      event.nativeEvent.layout.width;

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
  // RECURSOS DE SUPABASE
  // ========================================================

  const { recursos } =
    useRecursosCategoria(
      categoria?.titulo
    );

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
              backgroundColor:
                primarySoftColor,
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
            Es posible que el contenido
            solicitado ya no esté disponible.
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

        <View
          style={{
            marginBottom: 12,
          }}
        >
          <BotonVolver
            onPress={() =>
              router.replace(
                "/(tabs)/educacion" as any
              )
            }
          />
        </View>

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
                  Continúa explorando contenidos
                  relacionados con este tema.
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
            {recursos.map(
              (recurso, index) => (
                <Animated.View
                  key={recurso.id_recurso}
                  entering={FadeInDown
                    .delay(
                      150 + index * 50
                    )
                    .duration(400)}
                  style={{
                    width: anchoTarjeta,
                    minWidth: 0,
                  }}
                >
                  <LecturaRecomendadaCard
                    titulo={recurso.titulo}
                    imagenPortada={
                      recurso.imagen_portada
                  }
                  index={index}
                  ancho={anchoTarjeta}
                  onPress={() =>
                    router.push({
                      pathname:
                      "/(tabs)/educacion/recursos/[id]",
                    params: {
                    id: recurso.id_recurso,
                    categoriaId: id,
                  },
                  } as any)
                }
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