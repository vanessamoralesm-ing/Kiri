import {
  Ionicons,
} from "@expo/vector-icons";

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

type LecturaRecomendadaCardProps = {
  titulo: string;
  descripcion: string;
  categoria: string;
  tiempo: string;
  autor?: string;
  imagen?: ImageSourcePropType;
  onPress?: () => void;
};


// ==========================================================
// COMPONENTE
// ==========================================================

export default function LecturaRecomendadaCard({
  titulo,
  descripcion,
  categoria,
  tiempo,
  autor = "Equipo Kiri",
  imagen,
  onPress,
}: LecturaRecomendadaCardProps) {

  // ========================================================
  // ANIMACIÓN
  // ========================================================

  const escala =
    useSharedValue(
      1
    );


  const estiloAnimado =
    useAnimatedStyle(
      () => ({
        transform: [
          {
            scale:
              escala.value,
          },
        ],
      })
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


  // ========================================================
  // UI
  // ========================================================

  return (

    <Animated.View
      style={[
        estiloAnimado,
        {
          marginBottom:
            20,

          overflow:
            "hidden",

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
            width: 0,
            height: 2,
          },

          shadowOpacity:
            0.08,

          shadowRadius:
            6,

          elevation:
            3,
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
              0.98
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
          opacity:
            pressed
              ? 0.95
              : 1,
        })}
      >

        {/* =================================================
            IMAGEN PRINCIPAL
        ================================================= */}

        <View
          style={{
            width:
              "100%",

            height:
              155,

            alignItems:
              "center",

            justifyContent:
              "center",

            backgroundColor:
              surfaceSecondaryColor,
          }}
        >

          {
            imagen

              ? (

                <Image
                  source={
                    imagen
                  }

                  style={{
                    width:
                      "100%",

                    height:
                      "100%",
                  }}

                  resizeMode="cover"
                />

              )

              : (

                <Ionicons
                  name="image-outline"
                  size={35}
                  color={
                    iconColor
                  }
                />

              )
          }

        </View>


        {/* =================================================
            CONTENIDO
        ================================================= */}

        <View
          style={{
            padding:
              20,
          }}
        >

          {/* =================================================
              CATEGORÍA + TIEMPO
          ================================================= */}

          <View
            style={{
              flexDirection:
                "row",

              alignItems:
                "center",

              flexWrap:
                "wrap",

              gap:
                12,
            }}
          >

            {/* CATEGORÍA */}

            <View
              style={{
                paddingHorizontal:
                  12,

                paddingVertical:
                  4,

                borderRadius:
                  999,

                backgroundColor:
                  primarySoftColor,
              }}
            >

              <Text
                style={{
                  fontFamily:
                    "Nunito-Bold",

                  fontSize:
                    11,

                  textTransform:
                    "uppercase",

                  color:
                    primaryColor,
                }}
              >
                {categoria}
              </Text>

            </View>


            {/* TIEMPO */}

            <View
              style={{
                flexDirection:
                  "row",

                alignItems:
                  "center",
              }}
            >

              <Ionicons
                name="time-outline"
                size={14}
                color={
                  textMutedColor
                }
              />


              <Text
                style={{
                  marginLeft:
                    4,

                  fontFamily:
                    "Nunito-Medium",

                  fontSize:
                    12,

                  color:
                    textMutedColor,
                }}
              >
                {tiempo}
              </Text>

            </View>

          </View>


          {/* =================================================
              TÍTULO
          ================================================= */}

          <Text
            style={{
              marginTop:
                12,

              fontFamily:
                "Nunito-Bold",

              fontSize:
                19,

              lineHeight:
                24,

              color:
                textColor,
            }}
          >
            {titulo}
          </Text>


          {/* =================================================
              DESCRIPCIÓN
          ================================================= */}

          <Text
            numberOfLines={
              3
            }

            style={{
              marginTop:
                8,

              fontFamily:
                "Nunito-Medium",

              fontSize:
                14,

              lineHeight:
                20,

              color:
                textSecondaryColor,
            }}
          >
            {descripcion}
          </Text>


          {/* =================================================
              AUTOR + FLECHA
          ================================================= */}

          <View
            style={{
              marginTop:
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
                  "Nunito-Medium",

                fontSize:
                  12,

                color:
                  textMutedColor,
              }}
            >
              Por {autor}
            </Text>


            <View
              style={{
                width:
                  36,

                height:
                  36,

                borderRadius:
                  18,

                alignItems:
                  "center",

                justifyContent:
                  "center",

                backgroundColor:
                  primarySoftColor,
              }}
            >

              <Ionicons
                name="arrow-forward"
                size={18}
                color={
                  primaryColor
                }
              />

            </View>

          </View>

        </View>

      </Pressable>

    </Animated.View>

  );

}