import React from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo_izq";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// PANTALLA
// ==========================================================

export default function BienvenidaEntrevista() {

  const router =
    useRouter();


  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const backgroundColor =
    useThemeColor(
      {},
      "background"
    );


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


  const dividerColor =
    useThemeColor(
      {},
      "divider"
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
  // NAVEGACIÓN
  // ========================================================

  const continuar =
    () => {

      router.push(
        "/(entrevista)/rango_edad"
      );

    };


  // ========================================================
  // UI
  // ========================================================

  return (

    <SafeAreaView
      style={[
        styles.pantalla,

        {
          backgroundColor,
        },
      ]}
    >

      <ScrollView
        contentContainerStyle={
          styles.scroll
        }

        showsVerticalScrollIndicator={
          false
        }
      >

        <View
          style={
            styles.contenedor
          }
        >

          {/* =================================================
              CABECERA
          ================================================= */}

          <View
            style={
              styles.cabecera
            }
          >

            <Logo />

          </View>


          {/* =================================================
              CONTENIDO
          ================================================= */}

          <View
            style={
              styles.contenido
            }
          >

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

              {/* Mascota */}

              <Image
                source={
                  require(
                    "@/assets/images/mascota.png"
                  )
                }

                style={
                  styles.mascota
                }

                resizeMode="contain"
              />


              {/* Etiqueta */}

              <View
                style={[
                  styles.etiqueta,

                  {
                    backgroundColor:
                      primarySoftColor,
                  },
                ]}
              >

                <Text
                  style={[
                    styles.textoEtiqueta,

                    {
                      color:
                        primaryColor,
                    },
                  ]}
                >
                  Tu espacio de bienestar
                </Text>

              </View>


              {/* Título */}

              <Text
                style={[
                  styles.titulo,

                  {
                    color:
                      textColor,
                  },
                ]}
              >
                Tu bienestar emocional comienza con un pequeño paso.
              </Text>


              {/* Descripción */}

              <Text
                style={[
                  styles.descripcion,

                  {
                    color:
                      textSecondaryColor,
                  },
                ]}
              >
                Nos alegra que hayas decidido dedicar un momento para cuidar de ti.
                En Kiri encontrarás un espacio seguro donde podrás comprender mejor
                tus emociones, fortalecer hábitos saludables y descubrir herramientas
                que te acompañen en tu bienestar.
              </Text>


              <Text
                style={[
                  styles.descripcion,

                  {
                    color:
                      textSecondaryColor,
                  },
                ]}
              >
                Antes de comenzar, queremos conocerte un poco más para ofrecerte una
                experiencia adaptada a tu etapa de vida.
              </Text>


              {/* Información */}

              <View
                style={[
                  styles.informacion,

                  {
                    backgroundColor:
                      surfaceSecondaryColor,

                    borderColor,
                  },
                ]}
              >

                <Text
                  style={
                    styles.iconoInformacion
                  }
                >
                  💙
                </Text>


                <Text
                  style={[
                    styles.textoInformacion,

                    {
                      color:
                        textSecondaryColor,
                    },
                  ]}
                >

                  <Text
                    style={[
                      styles.negrita,

                      {
                        color:
                          textColor,
                      },
                    ]}
                  >
                    Recuerda:{" "}
                  </Text>

                  no buscamos juzgarte ni diagnosticarte; queremos acompañarte en el
                  camino hacia un mayor bienestar.

                </Text>

              </View>


              {/* Privacidad */}

              <View
                style={[
                  styles.privacidad,

                  {
                    borderTopColor:
                      dividerColor,
                  },
                ]}
              >

                <Text
                  style={[
                    styles.privacidadTitulo,

                    {
                      color:
                        textColor,
                    },
                  ]}
                >
                  Tu información es importante
                </Text>


                <Text
                  style={[
                    styles.privacidadTexto,

                    {
                      color:
                        textMutedColor,
                    },
                  ]}
                >
                  Responde con tranquilidad y de la manera más sincera posible.
                </Text>

              </View>

            </View>

          </View>


          {/* =================================================
              BOTÓN
          ================================================= */}

          <View
            style={
              styles.zonaBoton
            }
          >

            <Button
              title="Continuar  ➔"
              variant="primary"
              onPress={
                continuar
              }
              style={
                styles.boton
              }
            />

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>

  );

}


// ==========================================================
// ESTILOS
// ==========================================================

const styles =
  StyleSheet.create({

    pantalla: {
      flex: 1,
    },

    scroll: {
      flexGrow: 1,
    },

    contenedor: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 30,
    },

    cabecera: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    contenido: {
      flex: 1,
      justifyContent: "center",
    },

    tarjeta: {
      borderRadius: 26,
      paddingHorizontal: 25,
      paddingTop: 34,
      paddingBottom: 26,

      borderWidth: 1,

      position: "relative",

      shadowColor: "#000000",

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.1,
      shadowRadius: 12,

      elevation: 4,
    },

    mascota: {
      position: "absolute",

      width: 100,
      height: 130,

      right: 4,
      top: -50,
    },

    etiqueta: {
      alignSelf: "flex-start",

      paddingHorizontal: 13,
      paddingVertical: 7,

      borderRadius: 20,

      marginBottom: 17,
    },

    textoEtiqueta: {
      fontSize: 13,
      fontFamily: "Nunito-Bold",
    },

    titulo: {
      maxWidth: "85%",

      fontSize: 27,
      lineHeight: 34,

      fontFamily: "Nunito-Bold",

      marginBottom: 20,
    },

    descripcion: {
      fontSize: 16,
      lineHeight: 24,

      fontFamily: "Nunito-Medium",

      marginBottom: 14,
    },

    informacion: {
      flexDirection: "row",

      borderRadius: 18,

      borderWidth: 1,

      paddingHorizontal: 15,
      paddingVertical: 15,

      marginTop: 8,
    },

    iconoInformacion: {
      fontSize: 18,
      marginRight: 10,
    },

    textoInformacion: {
      flex: 1,

      fontSize: 14,
      lineHeight: 21,

      fontFamily: "Nunito-Medium",
    },

    negrita: {
      fontFamily: "Nunito-Bold",
    },

    privacidad: {
      borderTopWidth: 1,

      marginTop: 20,
      paddingTop: 17,
    },

    privacidadTitulo: {
      fontSize: 14,

      fontFamily: "Nunito-Bold",

      marginBottom: 4,
    },

    privacidadTexto: {
      fontSize: 13,
      lineHeight: 19,

      fontFamily: "Nunito-Medium",
    },

    zonaBoton: {
      marginTop: 25,
    },

    boton: {
      height: 56,
      borderRadius: 16,
    },

  });