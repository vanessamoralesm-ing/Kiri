// components/diario/ResumenRegistroCard.tsx

import React from "react";

import { Text, useWindowDimensions, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, { FadeInDown } from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

type ResumenRegistroCardProps = {
  fecha: string;
  emocion: string;
};

const EMOJIS_EMOCIONES: Record<string, string> = {
  Alegría: "😊",
  Tristeza: "😢",
  Ansiedad: "😰",
  Miedo: "😨",
  Enojo: "😡",
  Calma: "😌",
  Frustración: "😤",
  Culpa: "😔",
  Vergüenza: "😳",
  Esperanza: "🌱",
};

export function ResumenRegistroCard({
  fecha,
  emocion,
}: ResumenRegistroCardProps) {
  const { width } = useWindowDimensions();

  // ======================================================
  // TEMA
  // ======================================================

  const surfaceColor = useThemeColor({}, "surface");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  // ======================================================
  // RESPONSIVE
  // ======================================================

  const esTelefonoPequeno = width < 390;

  const esTelefono = width < 768;

  const esTablet = width >= 768 && width < 1100;

  const esWeb = width >= 1100;

  const emoji = EMOJIS_EMOCIONES[emocion] ?? "💭";

  const anchoMaximoCard = esWeb ? 700 : esTablet ? 680 : undefined;

  // ======================================================
  // UI
  // ======================================================

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={{
        width: "100%",

        maxWidth: anchoMaximoCard,

        alignSelf: "center",

        borderRadius: 26,

        borderWidth: 1,

        borderColor,

        backgroundColor: surfaceColor,

        overflow: "hidden",

        paddingHorizontal: esTelefono ? 18 : 22,

        paddingVertical: esTelefono ? 18 : 20,

        marginBottom: 24,

        shadowColor: "#000000",

        shadowOffset: {
          width: 0,

          height: 4,
        },

        shadowOpacity: 0.06,

        shadowRadius: 10,

        elevation: 2,
      }}
    >
      {/* ==================================================
          DECORACIÓN
      ================================================== */}

      <View
        style={{
          position: "absolute",

          width: esWeb ? 130 : 110,

          height: esWeb ? 130 : 110,

          borderRadius: esWeb ? 65 : 55,

          backgroundColor: primarySoftColor,

          right: esWeb ? -35 : -30,

          top: esWeb ? -35 : -30,

          opacity: 0.8,
        }}
      />

      {/* ==================================================
          PARTE SUPERIOR
      ================================================== */}

      <View
        style={{
          flexDirection: "row",

          alignItems: "center",
        }}
      >
        {/* ==================================================
            EMOJI
        ================================================== */}

        <View
          style={{
            width: esTelefonoPequeno ? 64 : esTelefono ? 72 : 78,

            height: esTelefonoPequeno ? 64 : esTelefono ? 72 : 78,

            borderRadius: 22,

            backgroundColor: primarySoftColor,

            alignItems: "center",

            justifyContent: "center",

            marginRight: esTelefono ? 14 : 18,

            flexShrink: 0,
          }}
        >
          <Text
            style={{
              fontSize: esTelefonoPequeno ? 32 : 38,
            }}
          >
            {emoji}
          </Text>
        </View>

        {/* ==================================================
            INFORMACIÓN
        ================================================== */}

        <View
          style={{
            flex: 1,

            minWidth: 0,

            paddingRight: esWeb ? 24 : 0,
          }}
        >
          {/* ESTADO */}

          <View
            style={{
              alignSelf: "flex-start",

              backgroundColor: primarySoftColor,

              paddingHorizontal: 12,

              paddingVertical: 5,

              borderRadius: 999,

              marginBottom: 7,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",

                fontSize: 10,

                color: primaryColor,

                letterSpacing: 0.3,
              }}
            >
              REGISTRO COMPLETADO
            </Text>
          </View>

          {/* TÍTULO */}

          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esTelefonoPequeno ? 18 : 20,

              color: textColor,
            }}
          >
            Tu momento emocional
          </Text>

          {/* FECHA */}

          <View
            style={{
              flexDirection: "row",

              alignItems: "flex-start",

              marginTop: 8,
            }}
          >
            <Ionicons name="calendar-outline" size={16} color={primaryColor} />

            <Text
              style={{
                flex: 1,

                marginLeft: 8,

                fontFamily: "Nunito-Medium",

                fontSize: 13,

                lineHeight: 19,

                color: textSecondaryColor,
              }}
            >
              {fecha}
            </Text>
          </View>
        </View>
      </View>

      {/* ==================================================
          SEPARADOR
      ================================================== */}

      <View
        style={{
          height: 1,

          backgroundColor: borderColor,

          marginVertical: esTelefono ? 14 : 16,
        }}
      />

      {/* ==================================================
          PARTE INFERIOR
      ================================================== */}

      <View
        style={{
          flexDirection: "row",

          alignItems: "center",

          justifyContent: "space-between",

          gap: 12,
        }}
      >
        <Text
          style={{
            fontFamily: "Nunito-SemiBold",

            fontSize: 13,

            color: textSecondaryColor,

            flexShrink: 1,
          }}
        >
          Emoción registrada
        </Text>

        <View
          style={{
            borderWidth: 1,

            borderColor: primaryColor,

            backgroundColor: primarySoftColor,

            borderRadius: 999,

            paddingHorizontal: 14,

            paddingVertical: 7,

            flexShrink: 0,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: 13,

              color: primaryColor,
            }}
          >
            {emocion || "Sin emoción"}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
