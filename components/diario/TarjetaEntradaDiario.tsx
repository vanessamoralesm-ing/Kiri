import React from "react";

import { Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

interface TarjetaEntradaDiarioProps {
  fecha: string;
  titulo: string;
  contenido: string;
  emociones: string[];
  onPress?: () => void;
}

export default function TarjetaEntradaDiario({
  fecha,
  titulo,
  contenido,
  emociones,
  onPress,
}: TarjetaEntradaDiarioProps) {
  const { esTelefono } = useResponsiveLayout();

  /*
   * ==================================================
   * COLORES
   * ==================================================
   */

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const cardBorderColor = useThemeColor({}, "cardBorder");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const secondaryColor = useThemeColor({}, "secondary");

  const secondarySoftColor = useThemeColor({}, "secondarySoft");

  const accentColor = useThemeColor({}, "accent");

  const accentSoftColor = useThemeColor({}, "accentSoft");

  /*
   * ==================================================
   * DIMENSIONES RESPONSIVAS
   * ==================================================
   */

  const paddingHorizontal = esTelefono ? 18 : 24;

  const paddingVertical = esTelefono ? 18 : 22;

  const tituloFontSize = esTelefono ? 18 : 18;

  const tituloLineHeight = esTelefono ? 24 : 25;

  const contenidoFontSize = esTelefono ? 14 : 14;

  const contenidoLineHeight = esTelefono ? 20 : 21;

  /*
   * ==================================================
   * TARJETA
   * ==================================================
   */

  return (
    <View
      style={{
        width: "100%",
        minWidth: 0,

        borderWidth: 1,
        borderColor: cardBorderColor,
        borderRadius: 24,

        backgroundColor: surfaceColor,

        overflow: "hidden",

        elevation: 3,

        shadowColor: "#000000",

        shadowOffset: {
          width: 0,
          height: 3,
        },

        shadowOpacity: 0.08,
        shadowRadius: 9,
      }}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => ({
          width: "100%",
          minWidth: 0,

          backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,

          opacity: pressed ? 0.96 : 1,
        })}
      >
        {/* ==================================================
            CONTENIDO INTERNO
            El padding se controla AQUÍ y no en Pressable.
        ================================================== */}

        <View
          style={{
            width: "100%",
            minWidth: 0,

            paddingHorizontal,
            paddingVertical,
          }}
        >
          {/* ==================================================
              ENCABEZADO
          ================================================== */}

          <View
            style={{
              width: "100%",
              minWidth: 0,

              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* FECHA */}

            <View
              style={{
                maxWidth: "75%",
                minWidth: 0,

                paddingHorizontal: 12,
                paddingVertical: 6,

                borderRadius: 999,

                backgroundColor: accentSoftColor,

                flexShrink: 1,
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  flexShrink: 1,

                  fontFamily: "Nunito-Medium",

                  fontSize: esTelefono ? 12 : 12,

                  lineHeight: 16,

                  color: accentColor,
                }}
              >
                {fecha}
              </Text>
            </View>

            {/* MENÚ */}

            <View
              style={{
                width: 34,
                height: 34,

                marginLeft: 8,

                flexShrink: 0,

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={20}
                color={textMutedColor}
              />
            </View>
          </View>

          {/* ==================================================
              TÍTULO
          ================================================== */}

          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              width: "100%",
              minWidth: 0,

              marginTop: esTelefono ? 18 : 20,

              fontFamily: "Nunito-Bold",

              fontSize: tituloFontSize,
              lineHeight: tituloLineHeight,

              color: textColor,

              flexShrink: 1,
            }}
          >
            {titulo}
          </Text>

          {/* ==================================================
              CONTENIDO
          ================================================== */}

          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={{
              width: "100%",
              minWidth: 0,

              marginTop: 10,

              fontFamily: "Nunito-Medium",

              fontSize: contenidoFontSize,
              lineHeight: contenidoLineHeight,

              color: textSecondaryColor,

              flexShrink: 1,
            }}
          >
            {contenido}
          </Text>

          {/* ==================================================
              SEPARADOR
          ================================================== */}

          <View
            style={{
              width: "100%",
              height: 1,

              marginTop: esTelefono ? 20 : 20,

              marginBottom: esTelefono ? 16 : 16,

              backgroundColor: cardBorderColor,

              opacity: 0.55,
            }}
          />

          {/* ==================================================
              EMOCIONES
          ================================================== */}

          <View
            style={{
              width: "100%",
              minWidth: 0,

              flexDirection: "row",
              alignItems: "flex-start",

              flexWrap: "wrap",
            }}
          >
            {emociones.map((emocion, index) => {
              const esPrimera = index === 0;

              const color = esPrimera ? secondaryColor : accentColor;

              const fondo = esPrimera ? secondarySoftColor : accentSoftColor;

              return (
                <View
                  key={`${emocion}-${index}`}
                  style={{
                    maxWidth: "100%",
                    minWidth: 0,

                    marginRight: 8,
                    marginBottom: 8,

                    paddingHorizontal: esTelefono ? 11 : 11,

                    paddingVertical: esTelefono ? 7 : 7,

                    borderRadius: 999,

                    backgroundColor: fondo,

                    flexDirection: "row",
                    alignItems: "center",

                    flexShrink: 1,
                  }}
                >
                  <Ionicons
                    name={esPrimera ? "leaf-outline" : "sparkles-outline"}
                    size={17}
                    color={color}
                  />

                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      flexShrink: 1,
                      minWidth: 0,

                      marginLeft: 5,

                      fontFamily: "Nunito-SemiBold",

                      fontSize: esTelefono ? 12 : 12,

                      lineHeight: 16,

                      color,
                    }}
                  >
                    {emocion}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Pressable>
    </View>
  );
}
