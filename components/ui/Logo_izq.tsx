import React from "react";

import {
  Image,
  ImageStyle,
  StyleProp,
} from "react-native";

import {
  useColorScheme,
} from "@/hooks/use-color-scheme";


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

  const colorScheme =
    useColorScheme();

  const esOscuro =
    colorScheme === "dark";


  const logo =
    esOscuro
      ? require("../../assets/images/splash-icon-ps.png")
      : require("../../assets/images/splash-icon.png");


  return (
    <Image
      source={logo}

      style={[
        {
          width: ancho,
          height: alto,
        },

        estilo,
      ]}

      resizeMode="contain"
    />
  );
}