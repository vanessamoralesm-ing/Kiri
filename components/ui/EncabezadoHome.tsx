import React from "react";

import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/services/authProvider";

export function EncabezadoHome() {
  const {
    profile,
    user,
  } = useAuth();

  const textColor =
    useThemeColor(
      {},
      "text"
    );

  const textSecondaryColor =
    useThemeColor(
      {},
      "textSecondary"
    );

  // Prioridad:
  // 1. Nombre preferido
  // 2. Primer nombre
  // 3. Metadata del usuario
  // 4. Valor por defecto
  const nombreUsuario =
    profile?.nombre_preferido ||
    profile?.nombres?.split(" ")[0] ||
    user?.user_metadata?.nombres ||
    "Usuario";

  return (
    <View
      style={
        styles.contenedorSimple
      }
    >
      {/* Texto */}
      <View
        style={
          styles.bloqueTexto
        }
      >
        <Text
          style={[
            styles.saludo,
            {
              color:
                textColor,
            },
          ]}
        >
          Hola, {nombreUsuario}
        </Text>

        <Text
          style={[
            styles.cita,
            {
              color:
                textSecondaryColor,
            },
          ]}
        >
          “La Paz Comienza Con Una Sonrisa”
        </Text>
      </View>

      {/* Avatar Kiri */}
      <View
        style={
          styles.contenedorAvatar
        }
      >
        <Image
          source={require(
            "@/assets/images/mascota.png"
          )}
          style={
            styles.imagenAvatar
          }
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    contenedorSimple: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      paddingHorizontal:
        20,

      paddingVertical:
        12,

      marginTop:
        8,

      backgroundColor:
        "transparent",
    },

    bloqueTexto: {
      flex: 1,
    },

    saludo: {
      fontFamily:
        "Nunito-Bold",

      fontSize:
        30,

      lineHeight:
        36,
    },

    cita: {
      fontFamily:
        "Nunito-Medium",

      fontSize:
        14,

      lineHeight:
        20,

      marginTop:
        2,
    },

    contenedorAvatar: {
      width:
        80,

      height:
        110,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginLeft:
        12,
    },

    imagenAvatar: {
      width:
        "100%",

      height:
        "100%",
    },
  });