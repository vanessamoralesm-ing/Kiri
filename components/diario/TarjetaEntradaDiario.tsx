import React from "react";

import { Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, { FadeInDown } from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

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
  // ======================================================
  // TEMA
  // ======================================================

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const secondaryColor = useThemeColor({}, "secondary");

  const secondarySoftColor = useThemeColor({}, "secondarySoft");

  const accentColor = useThemeColor({}, "accent");

  const accentSoftColor = useThemeColor({}, "accentSoft");

  // ======================================================
  // UI
  // ======================================================

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(450)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          padding: 20,
          borderRadius: 24,
          borderWidth: 1,
          borderColor,
          backgroundColor: surfaceColor,
          opacity: pressed ? 0.9 : 1,

          elevation: 2,

          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        })}
      >
        {/* ==================================================
                    FECHA Y OPCIONES
                ================================================== */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 999,
              backgroundColor: accentSoftColor,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Medium",
                fontSize: 12,
                color: accentColor,
              }}
            >
              {fecha}
            </Text>
          </View>

          <Pressable
            hitSlop={8}
            style={({ pressed }) => ({
              width: 32,
              height: 32,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: pressed ? surfaceSecondaryColor : "transparent",
            })}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={textMutedColor}
            />
          </Pressable>
        </View>

        {/* ==================================================
                    TÍTULO
                ================================================== */}

        <Text
          style={{
            marginTop: 16,
            fontFamily: "Nunito-Bold",
            fontSize: 19,
            color: textColor,
          }}
        >
          {titulo}
        </Text>

        {/* ==================================================
                    CONTENIDO
                ================================================== */}

        <Text
          numberOfLines={3}
          style={{
            marginTop: 8,
            fontFamily: "Nunito-Medium",
            fontSize: 14,
            lineHeight: 21,
            color: textSecondaryColor,
          }}
        >
          {contenido}
        </Text>

        {/* ==================================================
                    EMOCIONES
                ================================================== */}

        <View
          style={{
            marginTop: 16,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {emociones.map((emocion, index) => {
            const esPrimera = index === 0;

            return (
              <View
                key={`${emocion}-${index}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: esPrimera
                    ? secondarySoftColor
                    : primarySoftColor,
                }}
              >
                <Ionicons
                  name={esPrimera ? "leaf-outline" : "sparkles-outline"}
                  size={20}
                  color={esPrimera ? secondaryColor : primaryColor}
                />

                <Text
                  style={{
                    marginLeft: 4,
                    fontFamily: "Nunito-SemiBold",
                    fontSize: 12,
                    color: esPrimera ? secondaryColor : primaryColor,
                  }}
                >
                  {emocion}
                </Text>
              </View>
            );
          })}
        </View>
      </Pressable>
    </Animated.View>
  );
}
