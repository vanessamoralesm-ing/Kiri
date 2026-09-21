import { Ionicons } from "@expo/vector-icons";
import React from "react";

import { Platform, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@react-navigation/native";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// PROPS
// ==========================================================

type TarjetaModuloProps = {
  titulo: string;

  descripcion?: string;

  nombreIcono: keyof typeof Ionicons.glyphMap;

  colorAcento?: string;

  fondoIconoClaro?: string;

  fondoIconoOscuro?: string;

  onPress: () => void;
};

// ==========================================================
// COMPONENTE
// ==========================================================

export function TarjetaModulo({
  titulo,
  descripcion,
  nombreIcono,
  colorAcento,
  fondoIconoClaro,
  fondoIconoOscuro,
  onPress,
}: TarjetaModuloProps) {
  const { dark: isDarkMode } = useTheme();

  // ========================================================
  // TEMA
  // ========================================================

  const surfaceColor = useThemeColor({}, "surface");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const borderColor = useThemeColor({}, "border");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  // ========================================================
  // COLORES
  // ========================================================

  const colorIcono = colorAcento ?? primaryColor;

  const fondoIcono = isDarkMode
    ? (fondoIconoOscuro ?? primarySoftColor)
    : (fondoIconoClaro ?? primarySoftColor);

  // ========================================================
  // UI
  // ========================================================

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={{
        width: "100%",

        height: "100%",

        minHeight: 170,

        borderRadius: 20,

        borderWidth: 1,

        borderColor,

        paddingHorizontal: 18,

        paddingVertical: 18,

        backgroundColor: surfaceColor,

        alignItems: "center",

        justifyContent: "space-between",

        ...Platform.select({
          web: {
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.05)",
          },

          ios: {
            shadowColor: "#000000",

            shadowOffset: {
              width: 0,
              height: 3,
            },

            shadowOpacity: 0.05,

            shadowRadius: 8,
          },

          android: {
            elevation: 3,
          },
        }),
      }}
    >
      {/* ICONO */}

      <View
        style={{
          width: 52,

          height: 52,

          borderRadius: 16,

          alignItems: "center",

          justifyContent: "center",

          backgroundColor: fondoIcono,
        }}
      >
        <Ionicons name={nombreIcono} size={27} color={colorIcono} />
      </View>

      {/* TEXTO */}

      <View
        style={{
          width: "100%",

          flex: 1,

          alignItems: "center",

          justifyContent: "center",

          marginTop: 12,
        }}
      >
        <Text
          style={{
            fontFamily: "Nunito-Bold",

            fontSize: 15,

            lineHeight: 20,

            color: textColor,

            textAlign: "center",
          }}
        >
          {titulo}
        </Text>

        {descripcion && (
          <Text
            numberOfLines={3}
            style={{
              marginTop: 6,

              fontFamily: "Nunito-Medium",

              fontSize: 12,

              lineHeight: 17,

              color: textSecondaryColor,

              textAlign: "center",
            }}
          >
            {descripcion}
          </Text>
        )}
      </View>

      {/* FLECHA */}

      <View
        style={{
          width: 30,

          height: 30,

          borderRadius: 15,

          alignSelf: "flex-end",

          alignItems: "center",

          justifyContent: "center",

          backgroundColor: surfaceSecondaryColor,
        }}
      >
        <Ionicons name="arrow-forward" size={16} color={colorIcono} />
      </View>
    </TouchableOpacity>
  );
}
