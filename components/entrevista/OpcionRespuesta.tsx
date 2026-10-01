import React from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// PROPS
// ==========================================================

interface Props {
  texto: string;

  seleccionada: boolean;

  onPress: () => void;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function OpcionRespuesta({
  texto,
  seleccionada,
  onPress,
}: Props) {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const surfaceColor = useThemeColor({}, "surface");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const minHeightOpcion = esEscritorio ? 54 : esTablet ? 56 : 58;

  const minHeightContenido = esEscritorio ? 52 : esTablet ? 54 : 56;

  const paddingHorizontal = esEscritorio ? 18 : 16;

  const paddingVertical = esEscritorio ? 10 : 12;

  const tamañoRadio = esEscritorio ? 22 : 24;

  const tamañoRadioInterno = esEscritorio ? 10 : 12;

  const fontSize = esEscritorio ? 15 : 16;

  const lineHeight = esEscritorio ? 21 : 22;

  const marginBottom = esEscritorio ? 10 : 12;

  // ========================================================
  // UI
  // ========================================================

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: "rgba(79, 142, 247, 0.10)",
      }}
      style={({ pressed }) => [
        styles.opcion,

        {
          minHeight: minHeightOpcion,

          marginBottom,

          backgroundColor: seleccionada ? primarySoftColor : surfaceColor,

          borderColor: seleccionada ? primaryColor : borderColor,
        },

        pressed && styles.opcionPresionada,
      ]}
    >
      <View
        style={[
          styles.contenidoOpcion,

          {
            minHeight: minHeightContenido,

            paddingHorizontal,

            paddingVertical,
          },
        ]}
      >
        {/* RADIO */}

        <View
          style={{
            width: tamañoRadio,

            height: tamañoRadio,

            borderRadius: tamañoRadio / 2,

            borderWidth: 2,

            borderColor: seleccionada ? primaryColor : textSecondaryColor,

            alignItems: "center",

            justifyContent: "center",

            marginRight: esEscritorio ? 12 : 14,

            flexShrink: 0,
          }}
        >
          {seleccionada && (
            <View
              style={{
                width: tamañoRadioInterno,

                height: tamañoRadioInterno,

                borderRadius: tamañoRadioInterno / 2,

                backgroundColor: primaryColor,
              }}
            />
          )}
        </View>

        {/* TEXTO */}

        <Text
          style={[
            styles.texto,

            {
              fontSize,
              lineHeight,

              color: seleccionada ? primaryColor : textColor,
            },
          ]}
        >
          {texto}
        </Text>
      </View>
    </Pressable>
  );
}

// ==========================================================
// ESTILOS
// ==========================================================

const styles = StyleSheet.create({
  opcion: {
    width: "100%",

    borderWidth: 1.5,

    borderRadius: 16,

    overflow: "hidden",
  },

  contenidoOpcion: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",
  },

  texto: {
    flex: 1,

    fontFamily: "Nunito-SemiBold",

    textAlignVertical: "center",

    includeFontPadding: false,
  },

  opcionPresionada: {
    opacity: 0.85,
  },
});
