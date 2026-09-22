import React from "react";

import {
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
  codigo?: string;

  pregunta: string;

  descripcion?: string;

  opcional?: boolean;

  children?: React.ReactNode;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function PreguntaCard({
  codigo,
  pregunta,
  descripcion,
  opcional = false,
  children,
}: Props) {

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const surfaceColor =
    useThemeColor(
      {},
      "surface"
    );


  const surfaceSecondaryColor =
    useThemeColor(
      {},
      "surfaceSecondary"
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


  const textMutedColor =
    useThemeColor(
      {},
      "textMuted"
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

    <View
      style={[
        styles.tarjeta,

        {
          backgroundColor:
            surfaceColor,

          borderColor,
        },
      ]}
    >

      {/* =================================================
          ENCABEZADO
      ================================================= */}

      <View
        style={
          styles.encabezadoPregunta
        }
      >

        {/* Código */}

        {
          codigo

            ? (

              <View
                style={[
                  styles.codigo,

                  {
                    backgroundColor:
                      primarySoftColor,
                  },
                ]}
              >

                <Text
                  style={[
                    styles.codigoTexto,

                    {
                      color:
                        primaryColor,
                    },
                  ]}
                >
                  {codigo}
                </Text>

              </View>

            )

            : (

              <View />

            )
        }


        {/* Opcional */}

        {
          opcional && (

            <View
              style={[
                styles.opcional,

                {
                  backgroundColor:
                    surfaceSecondaryColor,

                  borderColor,
                },
              ]}
            >

              <Text
                style={[
                  styles.opcionalTexto,

                  {
                    color:
                      textMutedColor,
                  },
                ]}
              >
                Opcional
              </Text>

            </View>

          )
        }

      </View>


      {/* =================================================
          PREGUNTA
      ================================================= */}

      <Text
        style={[
          styles.pregunta,

          {
            color:
              textColor,
          },
        ]}
      >
        {pregunta}
      </Text>


      {/* =================================================
          DESCRIPCIÓN
      ================================================= */}

      {
        descripcion && (

          <Text
            style={[
              styles.descripcion,

              {
                color:
                  textSecondaryColor,
              },
            ]}
          >
            {descripcion}
          </Text>

        )
      }


      {/* =================================================
          RESPUESTAS
      ================================================= */}

      <View
        style={
          styles.respuestas
        }
      >
        {children}
      </View>

    </View>

  );

}


// ==========================================================
// ESTILOS
// ==========================================================

const styles =
  StyleSheet.create({

    tarjeta: {
      width:
        "100%",

      borderRadius:
        26,

      borderWidth:
        1,

      paddingHorizontal:
        22,

      paddingTop:
        24,

      paddingBottom:
        28,

      shadowColor:
        "#000000",

      shadowOffset: {
        width:
          0,

        height:
          4,
      },

      shadowOpacity:
        0.1,

      shadowRadius:
        9,

      elevation:
        4,
    },


    encabezadoPregunta: {
      width:
        "100%",

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      marginBottom:
        17,
    },


    codigo: {
      minWidth:
        43,

      minHeight:
        32,

      paddingHorizontal:
        11,

      paddingVertical:
        6,

      borderRadius:
        16,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    codigoTexto: {
      fontSize:
        13,

      fontFamily:
        "Nunito-Bold",
    },


    opcional: {
      paddingHorizontal:
        11,

      paddingVertical:
        6,

      borderRadius:
        15,

      borderWidth:
        1,

      marginLeft:
        10,
    },


    opcionalTexto: {
      fontSize:
        12,

      fontFamily:
        "Nunito-SemiBold",
    },


    pregunta: {
      width:
        "100%",

      fontSize:
        22,

      lineHeight:
        30,

      fontFamily:
        "Nunito-Bold",
    },


    descripcion: {
      width:
        "100%",

      fontSize:
        14,

      lineHeight:
        21,

      fontFamily:
        "Nunito-Medium",

      marginTop:
        10,
    },


    respuestas: {
      width:
        "100%",

      marginTop:
        28,
    },

  });