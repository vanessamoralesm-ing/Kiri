import React from "react";

import {
  Image,
  ImageStyle,
  StyleProp,
} from "react-native";

import {
  useTheme,
} from "@react-navigation/native";


// ==========================================================
// PROPS
// ==========================================================

interface LogoProps {
  ancho?: number;
  alto?: number;
  estilo?: StyleProp<ImageStyle>;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function Logo({
  ancho = 130,
  alto = 100,
  estilo,
}: LogoProps) {

  const {
    dark,
  } =
    useTheme();


  // ========================================================
  // LOGO SEGÚN EL TEMA GLOBAL DE KIRI
  // ========================================================

  const logo =
    dark

      ? require(
          "../../assets/images/splash-icon-ps.png"
        )

      : require(
          "../../assets/images/splash-icon.png"
        );


  return (

    <Image
      source={
        logo
      }

      style={[
        {
          width:
            ancho,

          height:
            alto,
        },

        estilo,
      ]}

      resizeMode="contain"
    />

  );

}