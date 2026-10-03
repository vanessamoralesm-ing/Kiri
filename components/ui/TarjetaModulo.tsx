import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "expo-router/react-navigation";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

type TarjetaModuloProps = {
  titulo: string;
  descripcion?: string;
  nombreIcono: keyof typeof Ionicons.glyphMap;
  colorAcento?: string;
  fondoIconoClaro?: string;
  fondoIconoOscuro?: string;
  onPress: () => void;
};

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

  const { esTelefono, esTablet } = useResponsiveLayout();

  // ==========================================================
  // TEMA
  // ==========================================================

  const surfaceColor = useThemeColor({}, "surface");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");
  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");
  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  // ==========================================================
  // COLORES DEL MÓDULO
  // ==========================================================

  const colorIcono = colorAcento ?? primaryColor;

  const fondoIcono = isDarkMode
    ? (fondoIconoOscuro ?? primarySoftColor)
    : (fondoIconoClaro ?? primarySoftColor);

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={{
        width: "100%",

        /*
         * Altura de la tarjeta.
         *
         * En móvil usamos una altura suficiente para que:
         * - el icono tenga espacio
         * - el texto respire
         * - la flecha quede abajo
         */
        minHeight: esTelefono ? 178 : esTablet ? 180 : 175,

        borderRadius: 20,

        borderWidth: 1,

        borderColor,

        paddingHorizontal: esTelefono ? 14 : 18,

        paddingVertical: esTelefono ? 14 : 18,

        backgroundColor: surfaceColor,

        flexDirection: "column",

        alignItems: "stretch",

        justifyContent: "flex-start",

        ...(Platform.OS === "web"
          ? ({
            boxShadow: "0px 3px 8px rgba(0,0,0,0.05)",
          } as any)
          : Platform.OS === "ios"
            ? {
              shadowColor: "#000000",

              shadowOffset: {
                width: 0,
                height: 3,
              },

              shadowOpacity: 0.05,

              shadowRadius: 8,
            }
            : Platform.OS === "android"
              ? {
                elevation: 3,
              }
              : {}),
      }}
    >
      {/* ======================================================
          ICONO
          ====================================================== */}

      <View
        style={{
          width: esTelefono ? 54 : 56,

          height: esTelefono ? 54 : 56,

          borderRadius: esTelefono ? 17 : 16,

          alignSelf: "center",

          alignItems: "center",

          justifyContent: "center",

          backgroundColor: fondoIcono,

          marginBottom: esTelefono ? 10 : 12,
        }}
      >
        <Ionicons
          name={nombreIcono}
          size={esTelefono ? 27 : 27}
          color={colorIcono}
        />
      </View>

      {/* ======================================================
          TÍTULO + DESCRIPCIÓN
          ====================================================== */}

      <View
        style={{
          width: "100%",

          flex: 1,

          minWidth: 0,

          alignItems: "center",

          justifyContent: "flex-start",

          /*
           * Dejamos un pequeño margen para que el contenido
           * no choque visualmente con los bordes.
           */
          paddingHorizontal: esTelefono ? 2 : 0,
        }}
      >
        {/* ====================================================
            TÍTULO
            ==================================================== */}

        <Text
          numberOfLines={esTelefono ? 2 : 2}
          ellipsizeMode="tail"
          style={{
            width: "100%",

            fontFamily: "Nunito-Bold",

            fontSize: esTelefono ? 15 : 15,

            lineHeight: esTelefono ? 20 : 20,

            color: textColor,

            textAlign: "center",
          }}
        >
          {titulo}
        </Text>

        {/* ====================================================
            DESCRIPCIÓN
            ==================================================== */}

        {!!descripcion && (
          <Text
            numberOfLines={esTelefono ? 3 : 3}
            ellipsizeMode="tail"
            style={{
              width: "100%",

              marginTop: 4,

              fontFamily: "Nunito-Medium",

              fontSize: esTelefono ? 11.5 : 12,

              lineHeight: esTelefono ? 16 : 17,

              color: textSecondaryColor,

              textAlign: "center",
            }}
          >
            {descripcion}
          </Text>
        )}
      </View>

      {/* ======================================================
          FLECHA
          ====================================================== */}

      <View
        style={{
          width: esTelefono ? 30 : 30,

          height: esTelefono ? 30 : 30,

          borderRadius: 15,

          alignSelf: "center",

          alignItems: "center",

          justifyContent: "center",

          backgroundColor: surfaceSecondaryColor,

          marginTop: esTelefono ? 10 : 12,
        }}
      >
        <Ionicons name="arrow-forward" size={16} color={colorIcono} />
      </View>
    </TouchableOpacity>
  );
}
