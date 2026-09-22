import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";

interface TarjetaModuloProps {
  titulo: string;

  nombreIcono:
    keyof typeof Ionicons.glyphMap;

  onPress: () => void;
}

export const TarjetaModulo = ({
  titulo,
  nombreIcono,
  onPress,
}: TarjetaModuloProps) => {

  const surfaceColor =
    useThemeColor(
      {},
      "surface"
    );

  const borderColor =
    useThemeColor(
      {},
      "border"
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

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}

      className="
        w-[48%]
        p-4
        rounded-3xl
        items-center
        justify-center
        my-2
      "

      style={{
        backgroundColor:
          surfaceColor,

        borderWidth: 1,

        borderColor:
          borderColor,

        shadowColor:
          "#000000",

        shadowOffset: {
          width: 0,
          height: 2,
        },

        shadowOpacity:
          0.12,

        shadowRadius:
          5,

        elevation:
          3,
      }}
    >

      {/* Fondo del icono */}

      <View
        className="
          p-4
          rounded-2xl
          mb-3
        "

        style={{
          backgroundColor:
            primarySoftColor,
        }}
      >

        <Ionicons
          name={nombreIcono}
          size={30}
          color={primaryColor}
        />

      </View>


      {/* Título */}

      <Text
        style={{
          fontFamily:
            "Nunito-SemiBold",

          fontSize:
            13,

          lineHeight:
            17,

          textAlign:
            "center",

          color:
            textColor,
        }}
      >
        {titulo}
      </Text>

    </TouchableOpacity>
  );
};