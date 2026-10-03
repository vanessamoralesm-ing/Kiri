import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// PROPS
// ==========================================================

interface Props {
  actual: number;

  total: number;

  tituloModulo?: string;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function ProgresoEntrevista({
  actual,
  total,
  tituloModulo,
}: Props) {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const borderColor = useThemeColor({}, "border");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  // ========================================================
  // PORCENTAJE
  // ========================================================

  const porcentaje = total > 0 ? Math.round((actual / total) * 100) : 0;

  const porcentajeLimitado = Math.min(Math.max(porcentaje, 0), 100);

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const marginBottom = esEscritorio ? 18 : 20;

  const fontSizeModulo = esEscritorio ? 14 : 13;

  const fontSizeInfo = esEscritorio ? 13 : 12;

  const alturaBarra = esEscritorio ? 7 : 6;

  // ========================================================
  // UI
  // ========================================================

  return (
    <View
      style={[
        styles.contenedor,

        {
          marginBottom,
        },
      ]}
    >
      {/* =================================================
          INFORMACIÓN
      ================================================= */}

      <View
        style={[
          styles.informacion,

          esTelefono && {
            alignItems: "flex-start",
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {tituloModulo && (
            <View
              style={{
                alignSelf: "flex-start",

                paddingHorizontal: esEscritorio ? 10 : 9,

                paddingVertical: 5,

                borderRadius: 999,

                backgroundColor: primarySoftColor,

                marginBottom: 6,
              }}
            >
              <Text
                numberOfLines={esTelefono ? 2 : 1}
                style={[
                  styles.modulo,

                  {
                    color: primaryColor,

                    fontSize: fontSizeModulo,
                  },
                ]}
              >
                {tituloModulo}
              </Text>
            </View>
          )}

          <Text
            style={[
              styles.pregunta,

              {
                color: textSecondaryColor,

                fontSize: fontSizeInfo,
              },
            ]}
          >
            Pregunta {actual} de {total}
          </Text>
        </View>

        <Text
          style={[
            styles.porcentaje,

            {
              color: primaryColor,

              fontSize: fontSizeInfo,

              marginLeft: 12,
            },
          ]}
        >
          {porcentajeLimitado}% completado
        </Text>
      </View>

      {/* =================================================
          BARRA DE PROGRESO
      ================================================= */}

      <View
        style={[
          styles.barra,

          {
            height: alturaBarra,

            backgroundColor: borderColor,
          },
        ]}
      >
        <View
          style={[
            styles.barraActiva,

            {
              width: `${porcentajeLimitado}%`,

              backgroundColor: primaryColor,
            },
          ]}
        />
      </View>

      {/* =================================================
          INDICADOR ADICIONAL EN MÓVIL
      ================================================= */}

      {esTelefono && total > 0 && (
        <Text
          style={{
            marginTop: 7,

            fontFamily: "Nunito-Medium",

            fontSize: 11,

            color: textMutedColor,
          }}
        >
          {actual >= total
            ? "Última pregunta de esta sección"
            : `Faltan ${Math.max(total - actual, 0)} ${total - actual === 1 ? "pregunta" : "preguntas"
            }`}
        </Text>
      )}
    </View>
  );
}

// ==========================================================
// ESTILOS
// ==========================================================

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",
  },

  informacion: {
    width: "100%",

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-end",

    marginBottom: 10,
  },

  modulo: {
    fontFamily: "Nunito-Bold",

    includeFontPadding: false,
  },

  pregunta: {
    fontFamily: "Nunito-SemiBold",

    includeFontPadding: false,
  },

  porcentaje: {
    fontFamily: "Nunito-Bold",

    includeFontPadding: false,

    textAlign: "right",
  },

  barra: {
    width: "100%",

    borderRadius: 999,

    overflow: "hidden",
  },

  barraActiva: {
    height: "100%",

    borderRadius: 999,
  },
});
