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
  actual: number;

  total: number;

  tituloModulo?: string;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function ProgresoEntrevista({
  actual,
  total,
  tituloModulo,
}: Props) {

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

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


  const borderColor =
    useThemeColor(
      {},
      "border"
    );


  // ========================================================
  // PORCENTAJE
  // ========================================================

  const porcentaje =
    total > 0
      ? Math.round(
          (actual / total) * 100
        )
      : 0;


  const porcentajeLimitado =
    Math.min(
      porcentaje,
      100
    );


  // ========================================================
  // UI
  // ========================================================

  return (

    <View
      style={
        styles.contenedor
      }
    >

      {/* =================================================
          INFORMACIÓN
      ================================================= */}

      <View
        style={
          styles.informacion
        }
      >

        <View>

          {
            tituloModulo && (

              <Text
                style={[
                  styles.modulo,

                  {
                    color:
                      primaryColor,
                  },
                ]}
              >
                {tituloModulo}
              </Text>

            )
          }


          <Text
            style={[
              styles.pregunta,

              {
                color:
                  textSecondaryColor,
              },
            ]}
          >
            Pregunta {actual} de {total}
          </Text>

        </View>


        <Text
          style={[
            styles.porcentaje,

            {
              color:
                primaryColor,
            },
          ]}
        >
          {porcentaje}% completado
        </Text>

      </View>


      {/* =================================================
          BARRA DE PROGRESO
      ================================================= */}

      <View
        style={[
          styles.barra,

          {
            backgroundColor:
              borderColor,
          },
        ]}
      >

        <View
          style={[
            styles.barraActiva,

            {
              width:
                `${porcentajeLimitado}%`,

              backgroundColor:
                primaryColor,
            },
          ]}
        />

      </View>

    </View>

  );

}


// ==========================================================
// ESTILOS
// ==========================================================

const styles =
  StyleSheet.create({

    contenedor: {
      marginBottom:
        20,
    },


    informacion: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "flex-end",

      marginBottom:
        10,
    },


    modulo: {
      fontSize:
        14,

      fontFamily:
        "Nunito-Bold",

      marginBottom:
        3,
    },


    pregunta: {
      fontSize:
        13,

      fontFamily:
        "Nunito-SemiBold",
    },


    porcentaje: {
      fontSize:
        13,

      fontFamily:
        "Nunito-Bold",
    },


    barra: {
      width:
        "100%",

      height:
        7,

      borderRadius:
        20,

      overflow:
        "hidden",
    },


    barraActiva: {
      height:
        "100%",

      borderRadius:
        20,
    },

  });