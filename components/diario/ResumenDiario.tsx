import React, { useEffect, useState } from "react";

import { LayoutChangeEvent, Text, View } from "react-native";

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
  // ========================================================
  // ESTADO
  // ========================================================

  const [anchoDisponible, setAnchoDisponible] = useState(0);

  // ========================================================
  // TEMA
  // ========================================================

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const borderColor = useThemeColor({}, "border");

  const primaryColor = useThemeColor({}, "primary");

  const accentColor = useThemeColor({}, "accent");

  const accentSoftColor = useThemeColor({}, "accentSoft");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  /*
   * Mantenemos siempre las dos tarjetas en una fila.
   * Adaptamos su contenido según el ancho REAL del padre.
   */

  const esMuyCompacto = anchoDisponible > 0 && anchoDisponible < 350;

  const esCompacto = anchoDisponible > 0 && anchoDisponible < 430;

  const gapTarjetas = esMuyCompacto ? 10 : 12;

  const anchoTarjeta =
    anchoDisponible > 0
      ? Math.max(0, (anchoDisponible - gapTarjetas) / 2)
      : undefined;

  const paddingTarjeta = esMuyCompacto ? 11 : esCompacto ? 14 : 18;

  const tamanoIcono = esMuyCompacto ? 36 : esCompacto ? 42 : 48;

  const tamanoTextoTitulo = esMuyCompacto ? 14 : esCompacto ? 16 : 19;

  // ========================================================
  // COLORES DE RACHA
  // ========================================================

  const colorRacha = "#F59E0B";

  const fondoRacha = "rgba(245,158,11,0.10)";

  const fondoIconoRacha = "rgba(245,158,11,0.16)";

  const bordeRacha = "rgba(245,158,11,0.28)";

  const decoracionRacha = "rgba(245,158,11,0.35)";

  // ========================================================
  // ANIMACIÓN
  // ========================================================

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

  // ========================================================
  // MEDIR ANCHO REAL
  // ========================================================

  const medirContenedor = (event: LayoutChangeEvent) => {
    const nuevoAncho = event.nativeEvent.layout.width;

    setAnchoDisponible((anchoAnterior) =>
      Math.abs(nuevoAncho - anchoAnterior) > 1 ? nuevoAncho : anchoAnterior,
    );
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <View
      onLayout={medirContenedor}
      style={{
        width: "100%",
        minWidth: 0,
      }}
    >
      <Animated.View
        entering={FadeInDown.delay(100).duration(450)}
        style={{
          width: "100%",

          flexDirection: "row",

          alignItems: "stretch",

          gap: gapTarjetas,
        }}
      >
        {/* ================================================
            TARJETA RACHA
        ================================================ */}

        <View
          style={{
            flex: 1,

            width: anchoTarjeta,

            minWidth: 0,

            minHeight: esCompacto ? 165 : 190,

            padding: paddingTarjeta,

            borderRadius: 22,

            borderWidth: 1,
            borderColor: bordeRacha,

            backgroundColor: fondoRacha,

            justifyContent: "space-between",

            overflow: "hidden",
          }}
        >
          {/* HEADER */}

          <View
            style={{
              width: "100%",

              flexDirection: esMuyCompacto ? "column" : "row",

              alignItems: esMuyCompacto ? "flex-start" : "center",

              gap: esMuyCompacto ? 6 : 9,
            }}
          >
            <View
              style={{
                width: tamanoIcono,
                height: tamanoIcono,

                borderRadius: 999,

                flexShrink: 0,

                alignItems: "center",
                justifyContent: "center",

                backgroundColor: fondoIconoRacha,
              }}
            >
              <Animated.View style={estiloLlama}>
                <Ionicons
                  name="flame"
                  size={esMuyCompacto ? 23 : esCompacto ? 27 : 32}
                  color={colorRacha}
                />
              </Animated.View>
            </View>

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              style={{
                flexShrink: 1,

                fontFamily: "Nunito-Bold",

                fontSize: tamanoTextoTitulo,

                lineHeight: tamanoTextoTitulo + 5,

                color: textColor,
              }}
            >
              Racha
            </Text>
          </View>

          {/* VALOR */}

          <View
            style={{
              marginTop: 16,
            }}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              style={{
                fontFamily: "Nunito-Bold",

                fontSize: esMuyCompacto ? 24 : esCompacto ? 27 : 31,

                lineHeight: esMuyCompacto ? 31 : esCompacto ? 35 : 40,

                color: colorRacha,
              }}
            >
              {diasRacha} {diasRacha === 1 ? "día" : "días"}
            </Text>

            <Text
              style={{
                marginTop: 5,

                fontFamily: "Nunito-Medium",

                fontSize: esMuyCompacto ? 11 : 13,

                lineHeight: 17,

                color: textSecondaryColor,
              }}
            >
              ¡Sigue así!
            </Text>
          </View>

          {/* DECORACIÓN */}

          <Ionicons
            name="flame-outline"
            size={esMuyCompacto ? 50 : 65}
            color={decoracionRacha}
            style={{
              position: "absolute",

              right: -8,

              bottom: -12,

              opacity: 0.7,
            }}
          />
        </View>

        {/* ================================================
            TARJETA ENTRADAS
        ================================================ */}

        <View
          style={{
            flex: 1,

            width: anchoTarjeta,

            minWidth: 0,

            minHeight: esCompacto ? 165 : 190,

            padding: paddingTarjeta,

            borderRadius: 22,

            borderWidth: 1,
            borderColor,

            backgroundColor: accentSoftColor,

            justifyContent: "space-between",

            overflow: "hidden",
          }}
        >
          {/* HEADER */}

          <View
            style={{
              width: "100%",

              flexDirection: esMuyCompacto ? "column" : "row",

              alignItems: esMuyCompacto ? "flex-start" : "center",

              gap: esMuyCompacto ? 6 : 9,
            }}
          >
            <View
              style={{
                width: tamanoIcono,
                height: tamanoIcono,

                borderRadius: 999,

                flexShrink: 0,

                alignItems: "center",
                justifyContent: "center",

                borderWidth: 1,
                borderColor,

                backgroundColor: accentSoftColor,
              }}
            >
              <Ionicons
                name="book-outline"
                size={esMuyCompacto ? 22 : esCompacto ? 25 : 29}
                color={primaryColor}
              />
            </View>

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              style={{
                flexShrink: 1,

                fontFamily: "Nunito-Bold",

                fontSize: tamanoTextoTitulo,

                lineHeight: tamanoTextoTitulo + 5,

                color: textColor,
              }}
            >
              Entradas
            </Text>
          </View>

          {/* VALOR */}

          <View
            style={{
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito-Bold",

                fontSize: esMuyCompacto ? 26 : esCompacto ? 29 : 34,

                lineHeight: esMuyCompacto ? 33 : esCompacto ? 37 : 43,

                color: accentColor,
              }}
            >
              {totalEntradas}
            </Text>

            <Text
              numberOfLines={2}
              style={{
                marginTop: 5,

                fontFamily: "Nunito-Medium",

                fontSize: esMuyCompacto ? 11 : 13,

                lineHeight: 17,

                color: textSecondaryColor,
              }}
            >
              Registros guardados
            </Text>
          </View>

          {/* DECORACIÓN */}

          <Ionicons
            name="sparkles-outline"
            size={esMuyCompacto ? 43 : 56}
            color={accentColor}
            style={{
              position: "absolute",

              right: -3,

              bottom: -8,

              opacity: 0.24,
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
}
