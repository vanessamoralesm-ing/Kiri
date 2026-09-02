import React from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// PROPS
// ==========================================================

interface Props {
  texto: string;
  seleccionada: boolean;
  onPress: () => void;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function OpcionRespuesta({
  texto,
  seleccionada,
  onPress,
}: Props) {

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const surfaceColor =
    useThemeColor(
      {},
      "surface"
    );

  const borderColor =
    useThemeColor(
      {},
      "border"
    );

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

  const primaryColor =
    useThemeColor(
      {},
      "primary"
    );

  const primarySoftColor =
    useThemeColor(
      {},
      "primarySoft"
    );


  // ========================================================
  // UI
  // ========================================================

  return (

    <Pressable
      onPress={
        onPress
      }

      android_ripple={{
        color: "rgba(79, 142, 247, 0.10)",
      }}

      style={({
        pressed,
      }) => [
          styles.opcion,

          {
            backgroundColor:
              seleccionada
                ? primarySoftColor
                : surfaceColor,

            borderColor:
              seleccionada
                ? primaryColor
                : borderColor,
          },

          pressed &&
          styles.opcionPresionada,
        ]}
    >

      {/* =================================================
          CONTENEDOR HORIZONTAL
      ================================================= */}

      <View
        style={
          styles.contenidoOpcion
        }
      >

        {/* ===============================================
            RADIO
        =============================================== */}

        <View
          style={[
            styles.radio,

            {
              borderColor:
                seleccionada
                  ? primaryColor
                  : textSecondaryColor,
            },
          ]}
        >

          {
            seleccionada && (

              <View
                style={[
                  styles.radioInterno,

                  {
                    backgroundColor:
                      primaryColor,
                  },
                ]}
              />

            )
          }

        </View>


        {/* ===============================================
            TEXTO
        =============================================== */}

        <Text
          style={[
            styles.texto,

            {
              color:
                seleccionada
                  ? primaryColor
                  : textColor,
            },
          ]}
        >
          {texto}
        </Text>

      </View>

    </Pressable>

  );

}


// ==========================================================
// ESTILOS
// ==========================================================

const styles =
  StyleSheet.create({

    // ------------------------------------------------------
    // OPCIÓN COMPLETA
    // ------------------------------------------------------

    opcion: {
      width: "100%",

      minHeight: 58,

      borderWidth: 1.5,

      borderRadius: 16,

      marginBottom: 12,

      overflow: "hidden",
    },


    // ------------------------------------------------------
    // RADIO + TEXTO
    // ------------------------------------------------------

    contenidoOpcion: {
      width: "100%",

      minHeight: 56,

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 16,

      paddingVertical: 12,
    },


    // ------------------------------------------------------
    // RADIO
    // ------------------------------------------------------

    radio: {
      width: 24,

      height: 24,

      borderRadius: 12,

      borderWidth: 2,

      alignItems: "center",

      justifyContent: "center",

      marginRight: 14,

      flexShrink: 0,
    },


    // ------------------------------------------------------
    // CENTRO DEL RADIO
    // ------------------------------------------------------

    radioInterno: {
      width: 12,

      height: 12,

      borderRadius: 6,
    },


    // ------------------------------------------------------
    // TEXTO
    // ------------------------------------------------------

    texto: {
      flex: 1,

      fontSize: 16,

      lineHeight: 22,

      fontFamily: "Nunito-SemiBold",

      textAlignVertical: "center",

      includeFontPadding: false,
    },


    // ------------------------------------------------------
    // PRESIONADO
    // ------------------------------------------------------

    opcionPresionada: {
      opacity: 0.85,
    },

  });