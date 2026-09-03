import React from "react";

import {
  Image,
  ImageSourcePropType,
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

type CategoriaCardProps = {
  titulo: string;
  imagen?: ImageSourcePropType;
  onPress: () => void;
};


// ==========================================================
// COMPONENTE
// ==========================================================

export default function CategoriaCard({
  titulo,
  imagen,
  onPress,
}: CategoriaCardProps) {

  // ========================================================
  // ANIMACIÓN
  // ========================================================

  const escala =
    useSharedValue(
      1
    );


  const estiloAnimado =
    useAnimatedStyle(
      () => {

        return {
          transform: [
            {
              scale:
                escala.value,
            },
          ],
        };

      }
    );


  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

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


  const borderColor =
    useThemeColor(
      {},
      "border"
    );


  // ========================================================
  // UI
  // ========================================================

  return (

    <Animated.View
      style={[
        estiloAnimado,
        {
          width:
            "100%",
        },
      ]}
    >

      <Pressable
        onPress={
          onPress
        }

        onPressIn={() => {

          escala.value =
            withSpring(
              0.96
            );

        }}

        onPressOut={() => {

          escala.value =
            withSpring(
              1
            );

        }}

        style={({
          pressed,
        }) => ({
          height:
            145,

          paddingHorizontal:
            16,

          alignItems:
            "center",

          justifyContent:
            "center",

          borderRadius:
            16,

          borderWidth:
            1,

          borderColor,

          backgroundColor:
            surfaceColor,

          opacity:
            pressed
              ? 0.9
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
            0.08,

          shadowRadius:
            6,

          elevation:
            3,
        })}
      >

        {/* =================================================
            IMAGEN DE LA CATEGORÍA
        ================================================= */}

        <View
          style={{
            width:
              80,

            height:
              80,

            marginBottom:
              16,

            borderRadius:
              40,

            alignItems:
              "center",

            justifyContent:
              "center",

            backgroundColor:
              surfaceSecondaryColor,
          }}
        >

          {
            imagen && (

              <Image
                source={
                  imagen
                }

                style={{
                  width:
                    64,

                  height:
                    64,
                }}

                resizeMode="contain"
              />

            )
          }

        </View>


        {/* =================================================
            TÍTULO
        ================================================= */}

        <Text
          style={{
            fontFamily:
              "Nunito-SemiBold",

            fontSize:
              15,

            textAlign:
              "center",

            color:
              textColor,
          }}
        >
          {titulo}
        </Text>

      </Pressable>

    </Animated.View>

  );

}