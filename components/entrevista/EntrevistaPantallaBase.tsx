import React from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import CampoRespuesta from "./CampoRespuesta";
import EntrevistaHeader from "./EntrevistaHeader";
import OpcionRespuesta from "./OpcionRespuesta";
import PreguntaCard from "./PreguntaCard";
import ProgresoEntrevista from "./ProgresoEntrevista";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";

import type {
  PreguntaEntrevista,
} from "@/types/entrevista";

import {
  obtenerDescripcionPregunta,
} from "@/utils/entrevistaHelpers";


// ==========================================================
// PROPS
// ==========================================================

interface Props {
  cargando: boolean;

  guardando: boolean;

  errorPantalla: string | null;

  onReintentar: () => void;

  onBack: () => void;

  onContinuar: () => void;

  tituloModulo: string;

  indiceActual: number;

  totalPreguntas: number;

  preguntaActual?: PreguntaEntrevista;

  opcionesSeleccionadas: string[];

  onSeleccionarOpcion:
    (idOpcion: string) => void;

  textoRespuesta: string;

  onChangeTextoRespuesta:
    (text: string) => void;

  numeroRespuesta: string;

  onChangeNumeroRespuesta:
    (text: string) => void;

  esValida: boolean;

  headerBanner?: React.ReactNode;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function EntrevistaPantallaBase({
  cargando,
  guardando,
  errorPantalla,
  onReintentar,
  onBack,
  onContinuar,
  tituloModulo,
  indiceActual,
  totalPreguntas,
  preguntaActual,
  opcionesSeleccionadas,
  onSeleccionarOpcion,
  textoRespuesta,
  onChangeTextoRespuesta,
  numeroRespuesta,
  onChangeNumeroRespuesta,
  esValida,
  headerBanner,
}: Props) {

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

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


  const dangerColor =
    useThemeColor(
      {},
      "danger"
    );


  // ========================================================
  // ESTADOS DERIVADOS
  // ========================================================

  const botonDeshabilitado =
    guardando ||
    !esValida;


  // ========================================================
  // CARGANDO
  // ========================================================

  if (cargando) {

    return (

      <SafeAreaView
        style={styles.pantalla}
      >

        <View
          style={styles.centroPantalla}
        >

          <View
            style={[
              styles.iconoEstado,

              {
                backgroundColor:
                  primarySoftColor,

                borderColor,
              },
            ]}
          >

            <ActivityIndicator
              size="large"
              color={
                primaryColor
              }
            />

          </View>


          <Text
            style={[
              styles.textoCargando,

              {
                color:
                  textSecondaryColor,
              },
            ]}
          >
            Preparando esta sección...
          </Text>

        </View>

      </SafeAreaView>

    );

  }


  // ========================================================
  // ERROR
  // ========================================================

  if (
    errorPantalla ||
    !preguntaActual
  ) {

    return (

      <SafeAreaView
        style={styles.pantalla}
      >

        <View
          style={styles.centroPantalla}
        >

          <View
            style={[
              styles.iconoEstado,

              {
                backgroundColor:
                  primarySoftColor,

                borderColor,
              },
            ]}
          >

            <Ionicons
              name="alert-circle-outline"
              size={45}
              color={
                dangerColor
              }
            />

          </View>


          <Text
            style={[
              styles.tituloError,

              {
                color:
                  textColor,
              },
            ]}
          >
            No pudimos cargar esta sección
          </Text>


          <Text
            style={[
              styles.descripcionError,

              {
                color:
                  textSecondaryColor,
              },
            ]}
          >
            {
              errorPantalla ??
              "No encontramos preguntas disponibles."
            }
          </Text>


          <Pressable
            onPress={
              onReintentar
            }

            style={({
              pressed,
            }) => [
              styles.botonReintentar,

              {
                backgroundColor:
                  primaryColor,
              },

              pressed &&
                styles.botonPresionado,
            ]}
          >

            <Ionicons
              name="refresh-outline"
              size={19}
              color="#FFFFFF"
            />


            <Text
              style={
                styles.textoReintentar
              }
            >
              Intentar nuevamente
            </Text>

          </Pressable>

        </View>

      </SafeAreaView>

    );

  }


  // ========================================================
  // PANTALLA PRINCIPAL
  // ========================================================

  return (

    <SafeAreaView
      style={
        styles.pantalla
      }
    >

      <View
        style={
          styles.contenedor
        }
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <EntrevistaHeader
          onBack={
            onBack
          }
        />


        {/* =================================================
            PROGRESO
        ================================================= */}

        <ProgresoEntrevista
          actual={
            indiceActual + 1
          }

          total={
            totalPreguntas
          }

          tituloModulo={
            tituloModulo
          }
        />


        {/* =================================================
            BANNER OPCIONAL
        ================================================= */}

        {headerBanner}


        {/* =================================================
            CONTENIDO
        ================================================= */}

        <ScrollView
          style={
            styles.scroll
          }

          contentContainerStyle={
            styles.scrollContenido
          }

          showsVerticalScrollIndicator={
            false
          }

          keyboardShouldPersistTaps="handled"
        >

          <PreguntaCard
            codigo={
              preguntaActual.codigo
            }

            pregunta={
              preguntaActual.enunciado
            }

            descripcion={
              obtenerDescripcionPregunta(
                preguntaActual
              )
            }

            opcional={
              !preguntaActual.obligatoria
            }
          >

            {/* ===============================================
                OPCIONES
            =============================================== */}

            {
              (
                preguntaActual.tipo_pregunta ===
                  "opcion_unica" ||

                preguntaActual.tipo_pregunta ===
                  "opcion_multiple" ||

                preguntaActual.tipo_pregunta ===
                  "escala"
              ) &&

              preguntaActual.opciones.map(
                opcion => (

                  <OpcionRespuesta
                    key={
                      opcion.id_opcion
                    }

                    texto={
                      opcion.descripcion
                    }

                    seleccionada={
                      opcionesSeleccionadas.includes(
                        opcion.id_opcion
                      )
                    }

                    onPress={() =>
                      onSeleccionarOpcion(
                        opcion.id_opcion
                      )
                    }
                  />

                )
              )
            }


            {/* ===============================================
                RESPUESTA DE TEXTO
            =============================================== */}

            {
              preguntaActual.tipo_pregunta ===
                "texto" && (

                <CampoRespuesta
                  valor={
                    textoRespuesta
                  }

                  onChangeText={
                    onChangeTextoRespuesta
                  }

                  tipo="texto"

                  placeholder="Escribe tu respuesta..."
                />

              )
            }


            {/* ===============================================
                RESPUESTA NUMÉRICA
            =============================================== */}

            {
              preguntaActual.tipo_pregunta ===
                "numero" && (

                <CampoRespuesta
                  valor={
                    numeroRespuesta
                  }

                  onChangeText={
                    onChangeNumeroRespuesta
                  }

                  tipo="numero"

                  placeholder="Escribe una cantidad..."
                />

              )
            }

          </PreguntaCard>

        </ScrollView>


        {/* =================================================
            BOTÓN INFERIOR
        ================================================= */}

        <View
          style={
            styles.zonaBoton
          }
        >

          <TouchableOpacity
            activeOpacity={
              0.82
            }

            onPress={
              onContinuar
            }

            disabled={
              botonDeshabilitado
            }

            style={[
              styles.botonContinuar,

              {
                backgroundColor:
                  botonDeshabilitado
                    ? surfaceSecondaryColor
                    : primaryColor,

                borderColor:
                  botonDeshabilitado
                    ? borderColor
                    : primaryColor,
              },
            ]}
          >

            {
              guardando

                ? (

                  <ActivityIndicator
                    size="small"
                    color={
                      primaryColor
                    }
                  />

                )

                : (

                  <>

                    <Text
                      style={[
                        styles.textoBoton,

                        {
                          color:
                            botonDeshabilitado
                              ? textMutedColor
                              : "#FFFFFF",
                        },
                      ]}
                    >
                      {
                        indiceActual ===
                        totalPreguntas - 1
                          ? "Finalizar sección"
                          : "Siguiente"
                      }
                    </Text>


                    <Ionicons
                      name="arrow-forward"
                      size={21}

                      color={
                        botonDeshabilitado
                          ? textMutedColor
                          : "#FFFFFF"
                      }
                    />

                  </>

                )
            }

          </TouchableOpacity>

        </View>

      </View>

    </SafeAreaView>

  );

}


// ==========================================================
// ESTILOS
// ==========================================================

const styles =
  StyleSheet.create({

    // ======================================================
    // PANTALLA
    // ======================================================

    pantalla: {
      flex: 1,

      /*
       * IMPORTANTE:
       * se mantiene transparente para permitir
       * visualizar el fondo general de las entrevistas.
       */
      backgroundColor:
        "transparent",
    },


    // ======================================================
    // CONTENEDOR
    // ======================================================

    contenedor: {
      flex: 1,

      paddingHorizontal:
        18,

      paddingBottom:
        15,
    },


    // ======================================================
    // SCROLL
    // ======================================================

    scroll: {
      flex: 1,
    },


    scrollContenido: {
      flexGrow: 1,

      paddingBottom:
        15,
    },


    // ======================================================
    // ESTADOS DE CARGA / ERROR
    // ======================================================

    centroPantalla: {
      flex: 1,

      justifyContent:
        "center",

      alignItems:
        "center",

      paddingHorizontal:
        35,
    },


    iconoEstado: {
      width:
        78,

      height:
        78,

      borderRadius:
        39,

      borderWidth:
        1,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    textoCargando: {
      marginTop:
        14,

      fontSize:
        15,

      fontFamily:
        "Nunito-SemiBold",

      textAlign:
        "center",
    },


    tituloError: {
      marginTop:
        15,

      fontSize:
        20,

      fontFamily:
        "Nunito-Bold",

      textAlign:
        "center",
    },


    descripcionError: {
      marginTop:
        9,

      fontSize:
        14,

      lineHeight:
        21,

      fontFamily:
        "Nunito-Medium",

      textAlign:
        "center",
    },


    // ======================================================
    // BOTÓN REINTENTAR
    // ======================================================

    botonReintentar: {
      marginTop:
        22,

      minHeight:
        48,

      paddingHorizontal:
        25,

      paddingVertical:
        13,

      borderRadius:
        15,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        8,
    },


    textoReintentar: {
      color:
        "#FFFFFF",

      fontFamily:
        "Nunito-Bold",

      fontSize:
        14,
    },


    // ======================================================
    // BOTÓN INFERIOR
    // ======================================================

    zonaBoton: {
      width:
        "100%",

      paddingTop:
        12,

      paddingBottom:
        4,

      /*
       * NO agregar backgroundColor aquí.
       *
       * El contenedor debe permanecer transparente
       * para conservar el fondo original de entrevistas.
       */
    },


    botonContinuar: {
      width:
        "100%",

      minHeight:
        56,

      borderRadius:
        16,

      borderWidth:
        1,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        9,

      paddingHorizontal:
        20,

      shadowColor:
        "#000000",

      shadowOffset: {
        width:
          0,

        height:
          3,
      },

      shadowOpacity:
        0.12,

      shadowRadius:
        6,

      elevation:
        3,
    },


    textoBoton: {
      fontSize:
        16,

      fontFamily:
        "Nunito-Bold",

      includeFontPadding:
        false,
    },


    // ======================================================
    // INTERACCIONES
    // ======================================================

    botonPresionado: {
      opacity:
        0.88,
    },

  });