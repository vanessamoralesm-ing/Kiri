import React from "react";

import { Image, Text, useWindowDimensions, View } from "react-native";

import Animated, { FadeInDown } from "react-native-reanimated";

import { TarjetaAcceso } from "@/components/ui/TarjetaAccesso";
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

      <TarjetaAcceso
        titulo="Nuevo Registro"
        descripcion="Registra cómo te sientes y lo que pasó hoy."
        icono="create-outline"
        color="primary"
        colorFondo="primary"
        onPress={onNuevoRegistro}
        //color es el color de borde y del icono, colorFondo es el color de fondo de la tarjeta
      />
    </Animated.View>
  );
}
