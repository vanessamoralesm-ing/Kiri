import React from "react";

import {
  Image,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

interface TarjetaBienvenidaDiarioProps {
  nombre: string;
  onNuevoRegistro: () => void;
}

export default function TarjetaBienvenidaDiario({
  nombre,
  onNuevoRegistro,
}: TarjetaBienvenidaDiarioProps) {
  const { width } = useWindowDimensions();

  // ========================================================
  // TEMA
  // ========================================================

  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const esTelefonoPequeno = width < 390;
  const esTelefono = width < 768;
  const esTablet = width >= 768 && width < 1100;

  const tamanoAvatar = esTelefonoPequeno
    ? 96
    : esTelefono
      ? 112
      : esTablet
        ? 150
        : 170;

  const tamanoIcono = esTelefonoPequeno ? 44 : esTelefono ? 52 : 64;

  const tamanoFlecha = esTelefonoPequeno ? 34 : esTelefono ? 38 : 48;

  // ========================================================
  // ANIMACIÓN
  // ========================================================

  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [
      {
        scale: escala.value,
      },
    ],
  }));

  // ========================================================
  // UI
  // ========================================================

  return (
    <Animated.View
      entering={FadeInDown.duration(450)}
      style={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* ==================================================
          BIENVENIDA CON AVATAR
      ================================================== */}

      <View
        style={{
          width: "100%",

          marginBottom: esTelefono ? 16 : 22,

          flexDirection: "row",
          alignItems: "center",

          justifyContent: "space-between",

          gap: esTelefonoPequeno ? 6 : 12,
        }}
      >
        {/* TEXTO */}

        <View
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esTelefonoPequeno ? 21 : esTelefono ? 24 : 29,

              lineHeight: esTelefonoPequeno ? 28 : esTelefono ? 32 : 38,

              color: textColor,
            }}
          >
            ¿Qué agregarás hoy a tu{" "}
            <Text
              style={{
                color: primaryColor,
              }}
            >
              Diario, {nombre}
            </Text>
            ?
          </Text>
        </View>

        {/* AVATAR */}

        <View
          style={{
            width: tamanoAvatar,
            height: tamanoAvatar,

            flexShrink: 0,

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/images_kids/avatar_pregunta.png")}
            resizeMode="contain"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>
      </View>

      {/* ==================================================
          BOTÓN NUEVO REGISTRO
      ================================================== */}

      <Animated.View
        style={[
          {
            width: "100%",
          },
          estiloAnimado,
        ]}
      >
        <Pressable
          onPress={onNuevoRegistro}
          onPressIn={() => {
            escala.value = withSpring(0.97);
          }}
          onPressOut={() => {
            escala.value = withSpring(1);
          }}
          accessibilityRole="button"
          accessibilityLabel="Crear nuevo registro en el diario"
          style={{
            width: "100%",
            borderRadius: 22,

            ...(Platform.OS === "web"
              ? ({
                boxShadow: "0px 5px 14px rgba(79,142,247,0.20)",
              } as any)
              : {}),

            ...(Platform.OS === "android"
              ? {
                elevation: 4,
              }
              : {}),

            ...(Platform.OS === "ios"
              ? {
                shadowColor: primaryColor,
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }
              : {}),
          }}
        >
          <View
            style={{
              width: "100%",

              minHeight: esTelefono ? 112 : 128,

              paddingHorizontal: esTelefonoPequeno ? 12 : esTelefono ? 16 : 22,

              paddingVertical: esTelefono ? 18 : 22,

              borderRadius: 22,

              backgroundColor: primaryColor,

              flexDirection: "row",
              alignItems: "center",

              gap: esTelefonoPequeno ? 9 : esTelefono ? 12 : 18,
            }}
          >
            {/* ICONO */}

            <View
              style={{
                width: tamanoIcono,
                height: tamanoIcono,

                borderRadius: 999,

                flexShrink: 0,

                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "#FFFFFF",
              }}
            >
              <Ionicons
                name="create-outline"
                size={esTelefonoPequeno ? 24 : esTelefono ? 27 : 32}
                color={primaryColor}
              />
            </View>

            {/* TEXTOS */}

            <View
              style={{
                flex: 1,
                minWidth: 0,

                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esTelefonoPequeno ? 16 : esTelefono ? 18 : 22,

                  lineHeight: esTelefonoPequeno ? 21 : esTelefono ? 24 : 29,

                  color: textOnPrimaryColor,
                }}
              >
                Nuevo Registro
              </Text>

              <Text
                style={{
                  marginTop: 5,

                  fontFamily: "Nunito-Medium",

                  fontSize: esTelefonoPequeno ? 12 : esTelefono ? 13 : 15,

                  lineHeight: esTelefonoPequeno ? 17 : esTelefono ? 19 : 22,

                  color: "#EFF5FF",
                }}
              >
                Registra cómo te sientes y lo que pasó hoy.
              </Text>
            </View>

            {/* FLECHA */}

            <View
              style={{
                width: tamanoFlecha,
                height: tamanoFlecha,

                borderRadius: 999,

                flexShrink: 0,

                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "#FFFFFF",
              }}
            >
              <Ionicons
                name="arrow-forward"
                size={esTelefonoPequeno ? 20 : esTelefono ? 23 : 28}
                color={primaryColor}
              />
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
