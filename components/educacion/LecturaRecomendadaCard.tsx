import {
  Ionicons,
} from "@expo/vector-icons";

import React from "react";

import {
  Pressable,
  Text,
  View,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// PROPS
// ==========================================================

type LecturaRecomendadaCardProps = {
  titulo: string;
  index: number;
  ancho?: number;
  onPress?: () => void;
  onFavoritoPress?: () => void;
};

// ==========================================================
// COMPONENTE
// ==========================================================

export default function LecturaRecomendadaCard({
  titulo,
  index,
  ancho = 150,
  onPress,
  onFavoritoPress,
}: LecturaRecomendadaCardProps) {

  // ========================================================
  // ANIMACIÓN
  // ========================================================

  const escala =
    useSharedValue(1);

  const estiloAnimado =
    useAnimatedStyle(() => ({
      transform: [
        {
          scale:
            escala.value,
        },
      ],
    }));


  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

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

  const borderColor =
    useThemeColor(
      {},
      "border"
    );


  // ========================================================
  // FONDO DE PORTADA
  // ========================================================

  // Alterna morado y celeste.
  const fondoPortada =
    index % 2 === 0
      ? accentSoftColor
      : primarySoftColor;


  // ========================================================
  // ESCALA VISUAL SEGÚN EL ANCHO
  // ========================================================

  // El card conserva su proporción en teléfono,
  // pero aprovecha mejor el espacio disponible en web.
  const esCardGrande =
    ancho >= 190;

  const alturaPortada =
    esCardGrande
      ? 220
      : 175;

  const tamanoCirculoLibro =
    esCardGrande
      ? 70
      : 58;

  const tamanoIconoLibro =
    esCardGrande
      ? 36
      : 30;

  const tamanoTitulo =
    esCardGrande
      ? 16
      : 14;

  const lineaTitulo =
    esCardGrande
      ? 21
      : 18;

  const alturaInformacion =
    esCardGrande
      ? 104
      : 88;


  // ========================================================
  // UI
  // ========================================================

  return (
    <Animated.View
      style={[
        estiloAnimado,
        {
          width:
            ancho,
        },
      ]}
    >
      <Pressable
        onPress={
          onPress
        }
        onPressIn={() => {
          escala.value =
            withSpring(0.97);
        }}
        onPressOut={() => {
          escala.value =
            withSpring(1);
        }}
        style={({
          pressed,
        }) => ({
          opacity:
            pressed
              ? 0.92
              : 1,
        })}
      >

        {/* =================================================
            CARD
            ================================================= */}

        <View
          className="w-full overflow-hidden rounded-[18px] border"
          style={{
            borderColor,

            backgroundColor:
              surfaceColor,

            shadowColor:
              "#000000",

            shadowOffset: {
              width: 0,
              height: 2,
            },

            shadowOpacity:
              0.07,

            shadowRadius:
              5,

            elevation:
              2,
          }}
        >

          {/* =================================================
              PORTADA
              ================================================= */}

          <View
            className="relative w-full items-center"
            style={{
              height:
                alturaPortada,

              backgroundColor:
                fondoPortada,
            }}
          >

            {/* =================================================
                FAVORITO
                ================================================= */}

            <Pressable
              onPress={(
                event
              ) => {
                event.stopPropagation();

                onFavoritoPress?.();
              }}
              hitSlop={8}
              className="absolute right-2 top-2 z-20"
            >
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width:
                    esCardGrande
                      ? 34
                      : 28,

                  height:
                    esCardGrande
                      ? 34
                      : 28,

                  backgroundColor:
                    "#FFFFFF",

                  shadowColor:
                    "#000000",

                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },

                  shadowOpacity:
                    0.08,

                  shadowRadius:
                    2,

                  elevation:
                    3,
                }}
              >
                <Ionicons
                  name="heart-outline"
                  size={
                    esCardGrande
                      ? 20
                      : 17
                  }
                  color={
                    accentColor
                  }
                />
              </View>
            </Pressable>


            {/* =================================================
                ICONO DEL LIBRO
                ================================================= */}

            <View
              className="items-center justify-center rounded-full"
              style={{
                marginTop:
                  esCardGrande
                    ? 42
                    : 34,

                width:
                  tamanoCirculoLibro,

                height:
                  tamanoCirculoLibro,

                backgroundColor:
                  "#FFFFFF",
              }}
            >
              <Ionicons
                name="book-outline"
                size={
                  tamanoIconoLibro
                }
                color={
                  primaryColor
                }
              />
            </View>


            {/* =================================================
                TÍTULO DE PORTADA
                ================================================= */}

            <Text
              numberOfLines={3}
              className="px-3 text-center font-nunito-bold"
              style={{
                marginTop:
                  esCardGrande
                    ? 18
                    : 12,

                fontSize:
                  tamanoTitulo,

                lineHeight:
                  lineaTitulo,

                color:
                  textColor,
              }}
            >
              {titulo}
            </Text>

          </View>


          {/* =================================================
              INFORMACIÓN INFERIOR
              ================================================= */}

          <View
            className="px-3 pb-3 pt-3"
            style={{
              minHeight:
                alturaInformacion,

              backgroundColor:
                surfaceColor,
            }}
          >

            {/* =================================================
                TÍTULO INFERIOR
                ================================================= */}

            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              className="font-nunito-bold"
              style={{
                fontSize:
                  tamanoTitulo,

                lineHeight:
                  lineaTitulo,

                color:
                  textColor,
              }}
            >
              {titulo}
            </Text>


            {/* =================================================
                ETIQUETA LIBRO
                ================================================= */}

            <View className="mt-2 flex-row">
              <View
                className="flex-row items-center rounded-md px-1.5 py-1"
                style={{
                  backgroundColor:
                    primarySoftColor,
                }}
              >
                <Ionicons
                  name="book-outline"
                  size={
                    esCardGrande
                      ? 15
                      : 13
                  }
                  color={
                    primaryColor
                  }
                />

                <Text
                  className="ml-1 font-nunito-medium"
                  style={{
                    fontSize:
                      esCardGrande
                        ? 12
                        : 11,

                    color:
                      primaryColor,
                  }}
                >
                  Libro
                </Text>
              </View>
            </View>

          </View>

        </View>

      </Pressable>
    </Animated.View>
  );
}