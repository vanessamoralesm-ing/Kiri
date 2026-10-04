import React from "react";

import { Platform, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// TIPOS
// ==========================================================

// Colores oficiales disponibles para personalizar la tarjeta.
type ColorTarjeta = "primary" | "secondary" | "accent";

type ColorFondoTarjeta =
  | "primary"
  | "secondary"
  | "accent"
  | "primarySoft"
  | "secondarySoft"
  | "accentSoft";

// Propiedades visuales y de interacción de la tarjeta.
interface TarjetaAccesoProps {
  titulo: string;

  descripcion: string;

  icono: keyof typeof Ionicons.glyphMap;

  color?: ColorTarjeta;
  // Fondo opcional de la tarjeta.
  // Si no se envía, se utiliza "surface" del tema.
  colorFondo?: ColorFondoTarjeta;

  onPress: () => void;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export function TarjetaAcceso({
  titulo,
  descripcion,
  icono,
  color = "primary",
  colorFondo,
  onPress,
}: TarjetaAccesoProps) {
  // ========================================================
  // COLORES GENERALES DEL TEMA
  // ========================================================

  const surfaceColor = useThemeColor({}, "surface");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // COLORES DE MARCA
  // ========================================================

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const secondaryColor = useThemeColor({}, "secondary");

  const secondarySoftColor = useThemeColor({}, "secondarySoft");

  const accentColor = useThemeColor({}, "accent");

  const accentSoftColor = useThemeColor({}, "accentSoft");

  // ========================================================
  // COLOR DE LA TARJETA
  // ========================================================

  const colores = {
    primary: {
      principal: primaryColor,
      suave: primarySoftColor,
    },

    secondary: {
      principal: secondaryColor,
      suave: secondarySoftColor,
    },

    accent: {
      principal: accentColor,
      suave: accentSoftColor,
    },
  };

  const colorTarjeta = colores[color];

  const coloresFondo = {
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    primarySoft: primarySoftColor,
    secondarySoft: secondarySoftColor,
    accentSoft: accentSoftColor,
  };

  const fondoTarjeta = colorFondo ? coloresFondo[colorFondo] : surfaceColor;

  // Los fondos fuertes necesitan texto claro.
  const tieneFondoFuerte =
    colorFondo === "primary" ||
    colorFondo === "secondary" ||
    colorFondo === "accent";

  // Cuando la tarjeta tiene un fondo fuerte,
  // los contenedores del icono y la flecha utilizan
  // un fondo claro para mantener buen contraste.
  const fondoElemento = tieneFondoFuerte
    ? textOnPrimaryColor
    : colorTarjeta.suave;

  // ========================================================
  // UI
  // ========================================================

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}. ${descripcion}`}
      className="w-full"
      style={({ pressed }) => ({
        opacity: pressed ? 0.92 : 1,

        transform: [
          {
            scale: pressed ? 0.99 : 1,
          },
        ],
      })}
    >
      <View
        className="
          min-h-[112px]
          w-full
          flex-row
          items-center
          border
          rounded-[24px]
          px-3
          py-4
        "
        style={{
          // Fondo obtenido desde theme.ts.
          backgroundColor: fondoTarjeta,

          // El ancho del borde es fijo; el color depende del tema.
          borderColor: colorTarjeta.principal,

          // Aplicar solo la sombra adecuada para cada plataforma.
          ...(Platform.OS === "web"
            ? { boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.08)" }
            : Platform.OS === "android"
              ? { elevation: 3 }
              : {
                  shadowColor: "#000000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                }),
        }}
      >
        {/* ICONO */}
        <View
          className="
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-[16px]
          "
          style={{
            backgroundColor: fondoElemento,
          }}
        >
          <Ionicons name={icono} size={31} color={colorTarjeta.principal} />
        </View>

        {/* TEXTOS */}
        <View
          className="
            ml-3
            min-w-0
            flex-1
            justify-center
            pr-2
          "
        >
          <Text
            className="
              font-nunito-bold
              text-[16px]
              leading-[21px]
            "
            style={{
              color: tieneFondoFuerte ? textOnPrimaryColor : textColor,
            }}
          >
            {titulo}
          </Text>

          <Text
            className="
              mt-1
              font-nunito-medium
              text-[14px]
              leading-[18px]
            "
            style={{
              color: tieneFondoFuerte ? textOnPrimaryColor : textSecondaryColor,
            }}
          >
            {descripcion}
          </Text>
        </View>

        {/* FLECHA */}
        <View
          className="
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
          "
          style={{
            backgroundColor: fondoElemento,
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colorTarjeta.principal}
          />
        </View>
      </View>
    </Pressable>
  );
}
