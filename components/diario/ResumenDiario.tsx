import React, { useEffect } from "react";

import { Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

interface ResumenDiarioProps {
  diasRacha: number;
  totalEntradas: number;
}

export default function ResumenDiario({
  diasRacha,
  totalEntradas,
}: ResumenDiarioProps) {
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

  const accentColor = useThemeColor({}, "accent");

  const accentSoftColor = useThemeColor({}, "accentSoft");

  // ======================================================
  // ANIMACIÓN
  // ======================================================

  const movimientoLlama = useSharedValue(0);

  const rotacionLlama = useSharedValue(0);

  useEffect(() => {
    movimientoLlama.value = withRepeat(
      withSequence(
        withTiming(-4, {
          duration: 700,
        }),
        withTiming(0, {
          duration: 700,
        }),
      ),
      -1,
      true,
    );

    rotacionLlama.value = withRepeat(
      withSequence(
        withTiming(-5, {
          duration: 600,
        }),
        withTiming(5, {
          duration: 600,
        }),
        withTiming(0, {
          duration: 600,
        }),
      ),
      -1,
      true,
    );
  }, [movimientoLlama, rotacionLlama]);

  const estiloLlama = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: movimientoLlama.value,
      },
      {
        rotate: `${rotacionLlama.value}deg`,
      },
    ],
  }));

  // ======================================================
  // COLORES DECORATIVOS
  // ======================================================

  const colorRacha = "#F59E0B";

  const fondoRacha = surfaceSecondaryColor;

  const fondoIconoRacha = "rgba(245, 158, 11, 0.14)";

  const bordeRacha = "rgba(245, 158, 11, 0.28)";

  const colorDecoracionRacha = "#F59E0B";

  const fondoEntradas = surfaceSecondaryColor;

  const fondoIconoEntradas = accentSoftColor;

  const bordeEntradas = borderColor;

  // ======================================================
  // UI
  // ======================================================

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(450)}
      style={{
        marginTop: 20,
        flexDirection: "row",
        gap: 12,
      }}
    >
      {/* ==================================================
                RACHA
            ================================================== */}

      <View
        style={{
          flex: 1,
          overflow: "hidden",
          padding: 16,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: bordeRacha,
          backgroundColor: fondoRacha,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: fondoIconoRacha,
            }}
          >
            <Animated.View style={estiloLlama}>
              <Ionicons name="flame" size={35} color={colorRacha} />
            </Animated.View>
          </View>

          <Text
            style={{
              marginLeft: 12,
              fontFamily: "Nunito-Bold",
              fontSize: 20,
              color: textColor,
            }}
          >
            Racha
          </Text>
        </View>

        <Text
          style={{
            marginTop: 16,
            fontFamily: "Nunito-Bold",
            fontSize: 28,
            color: colorRacha,
          }}
        >
          {diasRacha} días
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontFamily: "Nunito-Medium",
            fontSize: 13,
            color: textSecondaryColor,
          }}
        >
          ¡Sigue así!
        </Text>

        <Ionicons
          name="flame-outline"
          size={65}
          color={colorDecoracionRacha}
          style={{
            position: "absolute",
            right: -8,
            bottom: -10,
            opacity: 0.16,
          }}
        />
      </View>

      {/* ==================================================
                ENTRADAS
            ================================================== */}

      <View
        style={{
          flex: 1,
          overflow: "hidden",
          padding: 16,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: bordeEntradas,
          backgroundColor: fondoEntradas,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: fondoIconoEntradas,
            }}
          >
            <Ionicons name="book-outline" size={30} color={primaryColor} />
          </View>

          <Text
            style={{
              marginLeft: 12,
              fontFamily: "Nunito-Bold",
              fontSize: 20,
              color: textColor,
            }}
          >
            Entradas
          </Text>
        </View>

        <Text
          style={{
            marginTop: 16,
            fontFamily: "Nunito-Bold",
            fontSize: 28,
            color: accentColor,
          }}
        >
          {totalEntradas}
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontFamily: "Nunito-Medium",
            fontSize: 13,
            color: textSecondaryColor,
          }}
        >
          Registros guardados
        </Text>

        <Ionicons
          name="sparkles-outline"
          size={55}
          color={accentColor}
          style={{
            position: "absolute",
            right: -2,
            bottom: -5,
            opacity: 0.16,
          }}
        />
      </View>
    </Animated.View>
  );
}
