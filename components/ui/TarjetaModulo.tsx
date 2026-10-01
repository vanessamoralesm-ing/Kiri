
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

type TarjetaModuloProps = {
  titulo: string;
  descripcion?: string;
  nombreIcono: keyof typeof Ionicons.glyphMap;
  colorAcento?: string;
  fondoIconoClaro?: string;
  fondoIconoOscuro?: string;
  onPress: () => void;
};

export function TarjetaModulo({
  titulo,
  descripcion,
  nombreIcono,
  colorAcento,
  fondoIconoClaro,
  fondoIconoOscuro,
  onPress,
}: TarjetaModuloProps) {
  const { dark: isDarkMode } = useTheme();
  const { esTelefono, esTablet } = useResponsiveLayout();

  const surfaceColor = useThemeColor({}, "surface");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");
  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");
  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const colorIcono = colorAcento ?? primaryColor;

  const fondoIcono = isDarkMode
    ? (fondoIconoOscuro ?? primarySoftColor)
    : (fondoIconoClaro ?? primarySoftColor);

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={{
        width: "100%",

        // La altura se adapta al contenido en móvil.
        // Sin height: "100%" ni flex: 1.
        minHeight: esTelefono ? 104 : esTablet ? 180 : 175,

        borderRadius: 20,
        borderWidth: 1,
        borderColor,

        paddingHorizontal: esTelefono ? 14 : 18,
        paddingVertical: esTelefono ? 14 : 18,

        backgroundColor: surfaceColor,

        flexDirection: esTelefono ? "row" : "column",
        alignItems: esTelefono ? "center" : "stretch",
        justifyContent: esTelefono ? "flex-start" : "space-between",

        ...(Platform.OS === "web"
          ? ({
              boxShadow: "0px 3px 8px rgba(0,0,0,0.05)",
            } as any)
          : Platform.OS === "ios"
            ? {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
              }
            : Platform.OS === "android"
              ? { elevation: 3 }
              : {}),
      }}
    >
      {/* ICONO */}

      <View
        style={{
          width: esTelefono ? 52 : 56,
          height: esTelefono ? 52 : 56,
          borderRadius: 16,

          flexShrink: 0,
          alignSelf: esTelefono ? "center" : "center",

          alignItems: "center",
          justifyContent: "center",

          backgroundColor: fondoIcono,
        }}
      >
        <Ionicons
          name={nombreIcono}
          size={esTelefono ? 25 : 27}
          color={colorIcono}
        />
      </View>

      {/* TÍTULO Y DESCRIPCIÓN */}

      <View
        style={{
          flex: esTelefono ? 1 : undefined,
          minWidth: 0,

          marginLeft: esTelefono ? 12 : 0,
          marginTop: esTelefono ? 0 : 12,

          alignItems: esTelefono ? "flex-start" : "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Nunito-Bold",
            fontSize: esTelefono ? 15 : 15,
            lineHeight: 20,
            color: textColor,
            textAlign: esTelefono ? "left" : "center",
          }}
        >
          {titulo}
        </Text>

        {!!descripcion && (
          <Text
            numberOfLines={esTelefono ? 3 : 3}
            style={{
              marginTop: 5,
              fontFamily: "Nunito-Medium",
              fontSize: esTelefono ? 12 : 12,
              lineHeight: 17,
              color: textSecondaryColor,
              textAlign: esTelefono ? "left" : "center",
            }}
          >
            {descripcion}
          </Text>
        )}
      </View>

      {/* FLECHA */}

      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,

          flexShrink: 0,

          marginLeft: esTelefono ? 8 : 0,
          marginTop: esTelefono ? 0 : 12,

          alignSelf: esTelefono ? "center" : "flex-end",

          alignItems: "center",
          justifyContent: "center",

          backgroundColor: surfaceSecondaryColor,
        }}
      >
        <Ionicons
          name="arrow-forward"
          size={16}
          color={colorIcono}
        />
      </View>
    </TouchableOpacity>
  );
}