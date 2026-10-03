import React from "react";

import { Image, StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useAuth } from "@/services/authProvider";

export function EncabezadoHome() {
  const { profile, user } = useAuth();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  // Mantener la prioridad actual del nombre
  const nombreUsuario =
    profile?.nombre_preferido ||
    profile?.nombres?.split(" ")[0] ||
    user?.user_metadata?.nombres ||
    "Usuario";

  const anchoAvatar = esTelefono ? 64 : esTablet ? 80 : 100;

  const altoAvatar = esTelefono ? 76 : esTablet ? 96 : 116;

  return (
    <View
      style={[
        styles.contenedor,
        {
          paddingHorizontal: esTelefono ? 16 : esTablet ? 24 : 32,

          paddingVertical: esTelefono ? 8 : 16,

          marginTop: esTelefono ? 0 : 8,
        },
      ]}
    >
      {/* SALUDO */}

      <View style={styles.bloqueTexto}>
        <Text
          numberOfLines={2}
          style={[
            styles.saludo,
            {
              color: textColor,

              fontSize: esTelefono ? 23 : esTablet ? 27 : 30,

              lineHeight: esTelefono ? 29 : esTablet ? 34 : 38,
            },
          ]}
        >
          Hola, {nombreUsuario}
        </Text>

        <Text
          style={[
            styles.cita,
            {
              color: textSecondaryColor,

              fontSize: esTelefono ? 12 : 14,

              lineHeight: esTelefono ? 17 : 20,
            },
          ]}
        >
          “La Paz Comienza Con Una Sonrisa”
        </Text>
      </View>

      {/* MASCOTA */}

      <View
        style={{
          width: anchoAvatar,

          height: altoAvatar,

          marginLeft: esTelefono ? 8 : 16,

          flexShrink: 0,

          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <Image
          source={require("@/assets/images/mascota.png")}
          style={styles.imagenAvatar}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    backgroundColor: "transparent",
  },

  bloqueTexto: {
    flex: 1,

    minWidth: 0,
  },

  saludo: {
    fontFamily: "Nunito-Bold",
  },

  cita: {
    fontFamily: "Nunito-Medium",

    marginTop: 4,

    flexShrink: 1,
  },

  imagenAvatar: {
    width: "100%",

    height: "100%",
  },
});
