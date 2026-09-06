import React from "react";

import { Pressable, Text, useWindowDimensions, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

interface TarjetaPlantillaAutorregistroProps {
  titulo: string;

  descripcion: string;

  icono: keyof typeof Ionicons.glyphMap;

  color: string;

  fondoIcono: string;

  onPress: () => void;
}

export default function TarjetaPlantillaAutorregistro({
  titulo,
  descripcion,
  icono,
  color,
  fondoIcono,
  onPress,
}: TarjetaPlantillaAutorregistroProps) {
  const { width } = useWindowDimensions();

  // ======================================================
  // TEMA
  // ======================================================

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const iconColor = useThemeColor({}, "icon");

  // ======================================================
  // RESPONSIVE
  // ======================================================

  const esTelefonoPequeno = width < 390;

  const esTelefono = width < 768;

  // ======================================================
  // ANIMACIÓN
  // ======================================================

  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [
      {
        scale: escala.value,
      },
    ],
  }));

  // ======================================================
  // UI
  // ======================================================

  return (
    <Animated.View
      style={[
        estiloAnimado,
        {
          width: "100%",
          alignSelf: "stretch",
        },
      ]}
    >
      <Pressable
        onPress={onPress}

        onPressIn={() => {
          escala.value = withSpring(0.985, {
            damping: 16,
            stiffness: 220,
          });
        }}

        onPressOut={() => {
          escala.value = withSpring(1, {
            damping: 16,
            stiffness: 220,
          });
        }}

        style={{
          // ==============================================
          // MUY IMPORTANTE: DIMENSIONES DEL CARD
          // ==============================================

          width: "100%",

          minHeight: esTelefonoPequeno ? 108 : esTelefono ? 114 : 118,

          // ==============================================
          // LAYOUT HORIZONTAL
          // ==============================================

          flexDirection: "row",

          alignItems: "center",

          // ==============================================
          // DISEÑO
          // ==============================================

          paddingHorizontal: esTelefonoPequeno ? 14 : 16,

          paddingVertical: esTelefono ? 14 : 16,

          borderRadius: 24,

          borderWidth: 1,

          borderColor,

          backgroundColor: surfaceColor,

          // ==============================================
          // SOMBRA
          // ==============================================

          elevation: 2,

          shadowColor: "#000000",

          shadowOffset: {
            width: 0,
            height: 4,
          },

          shadowOpacity: 0.08,

          shadowRadius: 10,
        }}
      >
        {/* ==================================================
            ICONO
        ================================================== */}

        <View
          style={{
            width: esTelefonoPequeno ? 56 : 60,

            height: esTelefonoPequeno ? 56 : 60,

            borderRadius: 18,

            backgroundColor: fondoIcono,

            alignItems: "center",

            justifyContent: "center",

            flexShrink: 0,
          }}
        >
          <Ionicons
            name={icono}

            size={esTelefonoPequeno ? 27 : 30}

            color={color}
          />
        </View>

        {/* ==================================================
            INFORMACIÓN
        ================================================== */}

        <View
          style={{
            flex: 1,

            minWidth: 0,

            marginLeft: 15,

            marginRight: 12,

            justifyContent: "center",
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              fontFamily: "Nunito-SemiBold",

              fontSize: esTelefonoPequeno ? 15 : 16,

              lineHeight: esTelefonoPequeno ? 20 : 22,

              color: textColor,
            }}
          >
            {titulo}
          </Text>

          <Text
            numberOfLines={3}
            style={{
              marginTop: 4,

              fontFamily: "Nunito-Medium",

              fontSize: esTelefonoPequeno ? 12 : 13,

              lineHeight: esTelefonoPequeno ? 17 : 18,

              color: textSecondaryColor,
            }}
          >
            {descripcion}
          </Text>
        </View>

        {/* ==================================================
            FLECHA
        ================================================== */}

        <View
          style={{
            width: esTelefonoPequeno ? 38 : 40,

            height: esTelefonoPequeno ? 38 : 40,

            borderRadius: 20,

            backgroundColor: surfaceSecondaryColor,

            alignItems: "center",

            justifyContent: "center",

            flexShrink: 0,
          }}
        >
          <Ionicons name="chevron-forward" size={20} color={iconColor} />
        </View>
      </Pressable>
    </Animated.View>
  );
}
