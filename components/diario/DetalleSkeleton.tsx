import React, { useEffect } from "react";

import { useWindowDimensions, View } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

export function DetalleSkeleton() {
  const { width } = useWindowDimensions();

  // ======================================================
  // TEMA
  // ======================================================

  const backgroundColor = useThemeColor({}, "background");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  // ======================================================
  // RESPONSIVE
  // ======================================================

  const esTelefono = width < 768;

  // ======================================================
  // ANIMACIÓN
  // ======================================================

  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 800,
      }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // ======================================================
  // UI
  // ======================================================

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <View
        style={{
          width: "100%",

          maxWidth: 920,

          alignSelf: "center",

          paddingHorizontal: esTelefono ? 16 : 28,

          paddingTop: 24,
        }}
      >
        {/* Encabezado */}

        <Animated.View
          style={[
            animatedStyle,
            {
              height: 64,

              marginBottom: 20,

              borderRadius: 20,

              backgroundColor: surfaceSecondaryColor,
            },
          ]}
        />

        {/* Resumen */}

        <Animated.View
          style={[
            animatedStyle,
            {
              height: 176,

              marginBottom: 20,

              borderRadius: 26,

              backgroundColor: surfaceSecondaryColor,
            },
          ]}
        />

        {/* Respuesta 1 */}

        <Animated.View
          style={[
            animatedStyle,
            {
              height: 112,

              marginBottom: 16,

              borderRadius: 22,

              backgroundColor: surfaceSecondaryColor,
            },
          ]}
        />

        {/* Respuesta 2 */}

        <Animated.View
          style={[
            animatedStyle,
            {
              height: 112,

              marginBottom: 16,

              borderRadius: 22,

              backgroundColor: surfaceSecondaryColor,
            },
          ]}
        />

        {/* Respuesta 3 */}

        <Animated.View
          style={[
            animatedStyle,
            {
              height: 112,

              borderRadius: 22,

              backgroundColor: surfaceSecondaryColor,
            },
          ]}
        />
      </View>
    </View>
  );
}
