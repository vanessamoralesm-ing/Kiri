import React from "react";

import {
  Image,
  ImageSourcePropType,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// PROPS
// ==========================================================

type EncabezadoCardProps = {
  imagen: ImageSourcePropType;
  titulo: string;
  subtitulo: string;
};

// ==========================================================
// COMPONENTE
// ==========================================================

export default function EncabezadoCard({
  imagen,
  titulo,
  subtitulo,
}: EncabezadoCardProps) {
  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const textColor = useThemeColor(
    {},
    "text"
  );

  const textSecondaryColor = useThemeColor(
    {},
    "textSecondary"
  );

  const accentColor = useThemeColor(
    {},
    "accent"
  );

  // ========================================================
  // UI
  // ========================================================

  return (
    <View className="items-center px-6 pt-6">

      {/* ==================================================
          CARD
          ================================================== */}

      <View
        className="items-center rounded-[22px] border bg-white px-5 py-5"
        style={{
          width: 360,
          borderColor: accentColor,

          shadowColor: "#000000",

          shadowOffset: {
            width: 0,
            height: 2,
          },

          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 3,
        }}
      >

        {/* ==================================================
            IMAGEN
            ================================================== */}

        <View
          className="items-center justify-center"
          style={{
            width: 255,
            height: 180,
          }}
        >
          <View
            style={{
              width: "135%",
              height: "150%",
              borderRadius: 80, // border en las esquinas de la imagen
              overflow: "hidden",
            }}
          >
            <Image
              source={imagen}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ==================================================
            TEXTO
            ================================================== */}

        <View className="items-center px-2">

          <Text
            className="text-center font-nunito-bold text-[23px]"
            style={{
              color: textColor,
            }}
          >
            {titulo}
          </Text>

          <Text
            className="mt-2 text-center font-nunito-medium text-[14px] leading-5"
            style={{
              color: textSecondaryColor,
            }}
          >
            {subtitulo}
          </Text>

        </View>

      </View>

    </View>
  );
}