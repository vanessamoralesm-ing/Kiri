import {
  Ionicons,
} from "@expo/vector-icons";

import React from "react";

import {
  Text,
  View,
} from "react-native";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// COMPONENTE
// ==========================================================

export default function MitoRealidadCard() {

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


  const textSecondaryColor =
    useThemeColor(
      {},
      "textSecondary"
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


  // ========================================================
  // UI
  // ========================================================

  return (

    <Animated.View
      entering={
        FadeInDown.duration(
          500
        )
      }

      style={{
        overflow:
          "hidden",

        padding:
          20,

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

      {/* =================================================
          MITO
      ================================================= */}

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
              17,

            lineHeight:
              24,

            color:
              textColor,
          }}
        >
          “Hablar de salud mental significa que algo está mal conmigo.”
        </Text>

      </View>


      {/* =================================================
          REALIDAD
      ================================================= */}

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
              "Nunito-Medium",

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
          Cuidar nuestra salud mental también forma parte del bienestar. Conocer
          nuestras emociones puede ayudarnos a comprender mejor lo que sentimos.
        </Text>

      </View>

    </Animated.View>

  );

}