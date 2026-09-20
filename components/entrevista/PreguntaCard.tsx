import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// PROPS
// ==========================================================

interface Props {
  codigo?: string;

  pregunta: string;

  descripcion?: string;

  opcional?: boolean;

  children?: React.ReactNode;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function PreguntaCard({
  codigo,
  pregunta,
  descripcion,
  opcional = false,
  children,
}: Props) {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio ? 28 : esTablet ? 24 : 20;

  const paddingTop = esEscritorio ? 24 : 22;

  const paddingBottom = esEscritorio ? 24 : esTablet ? 26 : 24;

  const borderRadius = esEscritorio ? 22 : 24;

  const fontSizePregunta = esEscritorio ? 21 : esTablet ? 21 : 20;

  const lineHeightPregunta = esEscritorio ? 28 : 27;

  const marginTopRespuestas = esEscritorio ? 22 : esTablet ? 24 : 22;

  // ========================================================
  // UI
  // ========================================================

  return (
    <View
      style={[
        styles.tarjeta,

        {
          backgroundColor: surfaceColor,

          borderColor,

          borderRadius,

          paddingHorizontal,

          paddingTop,

          paddingBottom,

          ...(Platform.OS === "web"
            ? ({
              boxShadow: esEscritorio
                ? "0px 4px 14px rgba(0,0,0,0.05)"
                : "0px 4px 14px rgba(0,0,0,0.06)",
            } as any)
            : {}),

          ...(Platform.OS === "ios"
            ? {
              shadowColor: "#000000",

              shadowOffset: {
                width: 0,
                height: 4,
              },

              shadowOpacity: esEscritorio ? 0.05 : 0.07,

              shadowRadius: esEscritorio ? 8 : 9,
            }
            : {}),

          ...(Platform.OS === "android"
            ? {
              elevation: esEscritorio ? 2 : 3,
            }
            : {}),
        },
      ]}
    >
      {/* =================================================
          ENCABEZADO
      ================================================= */}

      <View
        style={[
          styles.encabezadoPregunta,

          {
            marginBottom: esEscritorio ? 14 : 16,
          },
        ]}
      >
        {/* CÓDIGO */}

        {codigo ? (
          <View
            style={[
              styles.codigo,

              {
                minWidth: esEscritorio ? 40 : 43,

                minHeight: esEscritorio ? 30 : 32,

                backgroundColor: primarySoftColor,
              },
            ]}
          >
            <Text
              style={[
                styles.codigoTexto,

                {
                  color: primaryColor,

                  fontSize: esEscritorio ? 12 : 13,
                },
              ]}
            >
              {codigo}
            </Text>
          </View>
        ) : (
          <View />
        )}

        {/* OPCIONAL */}

        {opcional && (
          <View
            style={[
              styles.opcional,

              {
                backgroundColor: surfaceSecondaryColor,

                borderColor,
              },
            ]}
          >
            <Text
              style={[
                styles.opcionalTexto,

                {
                  color: textMutedColor,
                },
              ]}
            >
              Opcional
            </Text>
          </View>
        )}
      </View>

      {/* =================================================
          PREGUNTA
      ================================================= */}

      <Text
        style={[
          styles.pregunta,

          {
            color: textColor,

            fontSize: fontSizePregunta,

            lineHeight: lineHeightPregunta,
          },
        ]}
      >
        {pregunta}
      </Text>

      {/* =================================================
          DESCRIPCIÓN
      ================================================= */}

      {descripcion && (
        <Text
          style={[
            styles.descripcion,

            {
              color: textSecondaryColor,

              fontSize: esEscritorio ? 14 : 14,

              lineHeight: esEscritorio ? 20 : 21,

              marginTop: esEscritorio ? 8 : 10,
            },
          ]}
        >
          {descripcion}
        </Text>
      )}

      {/* =================================================
          RESPUESTAS
      ================================================= */}

      <View
        style={[
          styles.respuestas,

          {
            marginTop: marginTopRespuestas,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

// ==========================================================
// ESTILOS
// ==========================================================

const styles = StyleSheet.create({
  tarjeta: {
    width: "100%",

    borderWidth: 1,
  },

  encabezadoPregunta: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  codigo: {
    paddingHorizontal: 11,

    paddingVertical: 6,

    borderRadius: 16,

    alignItems: "center",

    justifyContent: "center",
  },

  codigoTexto: {
    fontFamily: "Nunito-Bold",
  },

  opcional: {
    paddingHorizontal: 11,

    paddingVertical: 6,

    borderRadius: 15,

    borderWidth: 1,

    marginLeft: 10,
  },

  opcionalTexto: {
    fontSize: 12,

    fontFamily: "Nunito-SemiBold",
  },

  pregunta: {
    width: "100%",

    fontFamily: "Nunito-Bold",
  },

  descripcion: {
    width: "100%",

    fontFamily: "Nunito-Medium",
  },

  respuestas: {
    width: "100%",
  },
});
