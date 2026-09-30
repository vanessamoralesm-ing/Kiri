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
  onPress?: () => void;
  onFavoritoPress?: () => void;
};


// ==========================================================
// COMPONENTE
// ==========================================================

export default function LecturaRecomendadaCard({
  titulo,
  index,
  onPress,
  onFavoritoPress,
}: LecturaRecomendadaCardProps) {

  // ========================================================
  // ANIMACIÓN
  // ========================================================

  // Escala del card al presionarlo
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


  // Alterna morado y celeste
  const fondoPortada =
    index % 2 === 0
      ? accentSoftColor
      : primarySoftColor;


  // ========================================================
  // UI
  // ========================================================

  return (
    <Animated.View
      style={[
        estiloAnimado,
        {
          width: 150,
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
          className="overflow-hidden rounded-[18px] border"
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
            className="relative h-[175px] w-full items-center"
            style={{
              backgroundColor:
                fondoPortada,
            }}
          >

            {/* =================================================
                FAVORITO
                ================================================= */}

            <Pressable
              onPress={(event) => {
                event.stopPropagation();

                onFavoritoPress?.();
              }}

              hitSlop={8}

              className="absolute right-2 top-2 z-20"
            >

              {/* Círculo blanco del corazón */}

              <View
                className="h-[28px] w-[28px] items-center justify-center rounded-full"
                style={{
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
                  size={17}
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
              className="mt-[34px] h-[58px] w-[58px] items-center justify-center rounded-full"
              style={{
                backgroundColor:
                  "#FFFFFF",
              }}
            >

              <Ionicons
                name="book-outline"
                size={30}
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
              className="mt-3 px-3 text-center font-nunito-bold text-[14px] leading-[18px]"
              style={{
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
            className="min-h-[88px] px-3 pb-3 pt-3"
            style={{
              backgroundColor:
                surfaceColor,
            }}
          >

            {/* Título inferior */}

            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              className="font-nunito-bold text-[14px] leading-[18px]"
              style={{
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
                  size={13}
                  color={
                    primaryColor
                  }
                />

                <Text
                  className="ml-1 font-nunito-medium text-[11px]"
                  style={{
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