import React from "react";

import {
  Pressable,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// TIPOS
// ==========================================================

// Colores oficiales disponibles para personalizar la tarjeta.
type ColorTarjeta =
  | "primary"
  | "secondary"
  | "accent";


// Propiedades visuales y de interacción de la tarjeta.
interface TarjetaAccesoProps {
  titulo: string;

  descripcion: string;

  icono: keyof typeof Ionicons.glyphMap;

  color?: ColorTarjeta;

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
  onPress,
}: TarjetaAccesoProps) {

  // ========================================================
  // COLORES GENERALES DEL TEMA
  // ========================================================

  const surfaceColor =
    useThemeColor({}, "surface");

  const textColor =
    useThemeColor({}, "text");

  const textSecondaryColor =
    useThemeColor({}, "textSecondary");


  // ========================================================
  // COLORES DE MARCA
  // ========================================================

  const primaryColor =
    useThemeColor({}, "primary");

  const primarySoftColor =
    useThemeColor({}, "primarySoft");

  const secondaryColor =
    useThemeColor({}, "secondary");

  const secondarySoftColor =
    useThemeColor({}, "secondarySoft");

  const accentColor =
    useThemeColor({}, "accent");

  const accentSoftColor =
    useThemeColor({}, "accentSoft");


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

  const colorTarjeta =
    colores[color];


  // ========================================================
  // UI
  // ========================================================

  return (
    <Pressable
      onPress={onPress}
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
          rounded-[24px]
          px-3
          py-4
        "
        style={{
          // Fondo obtenido desde theme.ts.
          backgroundColor: surfaceColor,

          // Borde dinámico obtenido desde theme.ts.
          borderWidth: 1,
          borderColor: colorTarjeta.principal,

          // Sombra Android.
          elevation: 3,

          // Sombra iOS y web.
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.08,
          shadowRadius: 8,
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
            backgroundColor: colorTarjeta.suave,
          }}
        >
          <Ionicons
            name={icono}
            size={31}
            color={colorTarjeta.principal}
          />
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
              color: textColor,
            }}
          >
            {titulo}
          </Text>

          <Text
            className="
              mt-1
              font-nunito-medium
              text-[13px]
              leading-[18px]
            "
            style={{
              color: textSecondaryColor,
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
            backgroundColor: colorTarjeta.suave,
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