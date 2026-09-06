import React, { useEffect } from "react";

import { Text, useWindowDimensions, View } from "react-native";

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
  const { width } = useWindowDimensions();

  // ======================================================
  // TEMA
  // ======================================================

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const borderColor = useThemeColor({}, "border");

  const primaryColor = useThemeColor({}, "primary");

  const accentColor = useThemeColor({}, "accent");

  const accentSoftColor = useThemeColor({}, "accentSoft");

  // ======================================================
  // RESPONSIVE
  // ======================================================

  const esTelefonoPequeno = width < 390;

  // ======================================================
  // COLORES SEMÁNTICOS DE RACHA
  // ======================================================

  const colorRacha = "#F59E0B";

  const fondoRacha = "rgba(245, 158, 11, 0.10)";

  const fondoIconoRacha = "rgba(245, 158, 11, 0.16)";

  const bordeRacha = "rgba(245, 158, 11, 0.28)";

  const decoracionRacha = "rgba(245, 158, 11, 0.35)";

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
  // UI
  // ======================================================

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(450)}
      style={{
        flexDirection: "row",

        width: "100%",

        gap: 12,

        marginTop: 20,
      }}
    >
      {/* ==================================================
          RACHA
      ================================================== */}

      <View
        style={{
          flex: 1,

          minWidth: 0,

          overflow: "hidden",

          borderRadius: 22,

          borderWidth: 1,

          borderColor: bordeRacha,

          backgroundColor: fondoRacha,

          padding: 16,
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
              width: esTelefonoPequeno ? 44 : 48,

              height: esTelefonoPequeno ? 44 : 48,

              borderRadius: 999,

              alignItems: "center",

              justifyContent: "center",

              backgroundColor: fondoIconoRacha,
            }}
          >
            <Animated.View style={estiloLlama}>
              <Ionicons
                name="flame"
                size={esTelefonoPequeno ? 31 : 35}
                color={colorRacha}
              />
            </Animated.View>
          </View>

          <Text
            numberOfLines={1}
            style={{
              flex: 1,

              marginLeft: 12,

              fontFamily: "Nunito-Bold",

              fontSize: esTelefonoPequeno ? 17 : 20,

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
          color={decoracionRacha}
          style={{
            position: "absolute",

            right: -8,

            bottom: -10,
          }}
        />
      </View>

      {/* ==================================================
          ENTRADAS
      ================================================== */}

      <View
        style={{
          flex: 1,

          minWidth: 0,

          overflow: "hidden",

          borderRadius: 22,

          borderWidth: 1,

          borderColor: borderColor,

          backgroundColor: accentSoftColor,

          padding: 16,
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
              width: esTelefonoPequeno ? 44 : 48,

              height: esTelefonoPequeno ? 44 : 48,

              borderRadius: 999,

              alignItems: "center",

              justifyContent: "center",

              backgroundColor: accentSoftColor,

              borderWidth: 1,

              borderColor: borderColor,
            }}
          >
            <Ionicons
              name="book-outline"
              size={esTelefonoPequeno ? 27 : 30}
              color={primaryColor}
            />
          </View>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            style={{
              flex: 1,

              marginLeft: 12,

              fontFamily: "Nunito-Bold",

              fontSize: esTelefonoPequeno ? 17 : 20,

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
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.82}
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

            opacity: 0.28,
          }}
        />
      </View>
    </Animated.View>
  );
}
