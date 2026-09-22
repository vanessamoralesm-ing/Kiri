import React from "react";

import {
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// PROPS
// ==========================================================

interface CampoRespuestaProps {
  valor: string;

  onChangeText:
    (texto: string) => void;

  tipo?:
    | "texto"
    | "numero";

  placeholder?:
    string;

  disabled?:
    boolean;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function CampoRespuesta({
  valor,
  onChangeText,
  tipo = "texto",
  placeholder,
  disabled = false,
}: CampoRespuestaProps) {

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const inputBackgroundColor =
    useThemeColor(
      {},
      "inputBackground"
    );


  const inputBorderColor =
    useThemeColor(
      {},
      "inputBorder"
    );


  const textColor =
    useThemeColor(
      {},
      "text"
    );


  const placeholderColor =
    useThemeColor(
      {},
      "placeholder"
    );


  const surfaceSecondaryColor =
    useThemeColor(
      {},
      "surfaceSecondary"
    );


  const primaryColor =
    useThemeColor(
      {},
      "primary"
    );


  // ========================================================
  // CAMBIO DE VALOR
  // ========================================================

  function manejarCambio(
    texto: string
  ) {

    if (
      tipo === "numero"
    ) {

      onChangeText(
        texto.replace(
          /\D/g,
          ""
        )
      );

      return;

    }


    onChangeText(
      texto
    );

  }


  // ========================================================
  // UI
  // ========================================================

  return (

    <View
      style={
        styles.contenedor
      }
    >

      <TextInput
        value={
          valor
        }

        onChangeText={
          manejarCambio
        }

        editable={
          !disabled
        }

        placeholder={
          placeholder ??
          (
            tipo === "numero"
              ? "Escribe una cantidad..."
              : "Escribe tu respuesta..."
          )
        }

        placeholderTextColor={
          placeholderColor
        }

        selectionColor={
          primaryColor
        }

        cursorColor={
          primaryColor
        }

        keyboardType={
          tipo === "numero"
            ? "number-pad"
            : "default"
        }

        multiline={
          tipo === "texto"
        }

        textAlignVertical={
          tipo === "texto"
            ? "top"
            : "center"
        }

        style={[
          styles.campo,

          {
            backgroundColor:
              disabled
                ? surfaceSecondaryColor
                : inputBackgroundColor,

            borderColor:
              inputBorderColor,

            color:
              textColor,
          },

          tipo === "texto" &&
            styles.campoTexto,

          tipo === "numero" &&
            styles.campoNumero,

          disabled &&
            styles.campoDeshabilitado,
        ]}
      />

    </View>

  );

}


// ==========================================================
// ESTILOS
// ==========================================================

const styles =
  StyleSheet.create({

    contenedor: {
      width:
        "100%",
    },


    campo: {
      width:
        "100%",

      borderWidth:
        1.5,

      borderRadius:
        16,

      paddingHorizontal:
        17,

      fontSize:
        16,

      fontFamily:
        "Nunito-Medium",
    },


    campoTexto: {
      minHeight:
        130,

      paddingTop:
        15,

      paddingBottom:
        15,

      lineHeight:
        22,
    },


    campoNumero: {
      height:
        58,
    },


    campoDeshabilitado: {
      opacity:
        0.6,
    },

  });