import React, {
  useState,
} from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useRouter,
} from "expo-router";

import LogoutModal from "@/components/ui/LogoutModal";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// PROPS
// ==========================================================

type Props = {
  onBack: () => void;
};


// ==========================================================
// COMPONENTE
// ==========================================================

export default function EntrevistaHeader({
  onBack,
}: Props) {

  const router =
    useRouter();


  const [
    menuAbierto,
    setMenuAbierto,
  ] =
    useState(
      false
    );


  const [
    mostrarLogout,
    setMostrarLogout,
  ] =
    useState(
      false
    );


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


  const iconColor =
    useThemeColor(
      {},
      "icon"
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
  // ACCIONES
  // ========================================================

  function irPerfil() {

    setMenuAbierto(
      false
    );


    router.push(
      "/(tabs)/perfil"
    );

  }


  function cerrarSesion() {

    setMenuAbierto(
      false
    );


    setMostrarLogout(
      true
    );

  }


  // ========================================================
  // UI
  // ========================================================

  return (

    <View
      style={
        styles.header
      }
    >

      {/* =================================================
          VOLVER
      ================================================= */}

      <Pressable
        onPress={
          onBack
        }

        hitSlop={
          10
        }

        style={({
          pressed,
        }) => [
          styles.botonHeader,

          pressed &&
            styles.presionado,
        ]}
      >

        <Ionicons
          name="arrow-back"
          size={28}

          color={
            iconColor
          }
        />

      </Pressable>


      {/* =================================================
          PERFIL
      ================================================= */}

      <View
        style={
          styles.perfilContenedor
        }
      >

        <Pressable
          onPress={() =>
            setMenuAbierto(
              actual =>
                !actual
            )
          }

          hitSlop={
            10
          }

          style={({
            pressed,
          }) => [
            styles.botonHeader,

            pressed &&
              styles.presionado,
          ]}
        >

          <Ionicons
            name="person-outline"
            size={27}

            color={
              iconColor
            }
          />

        </Pressable>


        {/* =================================================
            MENÚ DESPLEGABLE
        ================================================= */}

        {
          menuAbierto && (

            <View
              style={[
                styles.menu,

                {
                  backgroundColor:
                    surfaceColor,

                  borderColor,
                },
              ]}
            >

              {/* =============================================
                  MI PERFIL
              ============================================= */}

              <Pressable
                onPress={
                  irPerfil
                }

                style={({
                  pressed,
                }) => [
                  styles.opcionMenu,

                  pressed && {
                    backgroundColor:
                      primarySoftColor,
                  },
                ]}
              >

                <View
                  style={
                    styles.contenidoOpcion
                  }
                >

                  <View
                    style={[
                      styles.iconoMenu,

                      {
                        backgroundColor:
                          primarySoftColor,
                      },
                    ]}
                  >

                    <Ionicons
                      name="person-outline"
                      size={20}

                      color={
                        primaryColor
                      }
                    />

                  </View>


                  <View
                    style={
                      styles.textoOpcion
                    }
                  >

                    <Text
                      style={[
                        styles.tituloOpcion,

                        {
                          color:
                            textColor,
                        },
                      ]}
                    >
                      Mi perfil
                    </Text>


                    <Text
                      style={[
                        styles.descripcionOpcion,

                        {
                          color:
                            textSecondaryColor,
                        },
                      ]}
                    >
                      Ver mi información
                    </Text>

                  </View>

                </View>

              </Pressable>


              {/* =============================================
                  SEPARADOR
              ============================================= */}

              <View
                style={[
                  styles.separador,

                  {
                    backgroundColor:
                      dividerColor,
                  },
                ]}
              />


              {/* =============================================
                  CERRAR SESIÓN
              ============================================= */}

              <Pressable
                onPress={
                  cerrarSesion
                }

                style={({
                  pressed,
                }) => [
                  styles.opcionMenu,

                  pressed && {
                    backgroundColor:
                      surfaceSecondaryColor,
                  },
                ]}
              >

                <View
                  style={
                    styles.contenidoOpcion
                  }
                >

                  <View
                    style={[
                      styles.iconoMenu,

                      {
                        backgroundColor:
                          surfaceSecondaryColor,
                      },
                    ]}
                  >

                    <Ionicons
                      name="log-out-outline"
                      size={20}

                      color={
                        iconColor
                      }
                    />

                  </View>


                  <View
                    style={
                      styles.textoOpcion
                    }
                  >

                    <Text
                      style={[
                        styles.tituloOpcion,

                        {
                          color:
                            textColor,
                        },
                      ]}
                    >
                      Cerrar sesión
                    </Text>


                    <Text
                      style={[
                        styles.descripcionOpcion,

                        {
                          color:
                            textSecondaryColor,
                        },
                      ]}
                    >
                      Salir de tu cuenta
                    </Text>

                  </View>

                </View>

              </Pressable>

            </View>

          )
        }

      </View>


      {/* =================================================
          MODAL DE CIERRE DE SESIÓN
      ================================================= */}

      <LogoutModal
        visible={
          mostrarLogout
        }

        onClose={() =>
          setMostrarLogout(
            false
          )
        }
      />

    </View>

  );

}


// ==========================================================
// ESTILOS
// ==========================================================

const styles =
  StyleSheet.create({

    // ======================================================
    // HEADER
    // ======================================================

    header: {
      height:
        60,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      paddingHorizontal:
        18,

      zIndex:
        1000,

      overflow:
        "visible",
    },


    // ======================================================
    // BOTONES DEL HEADER
    // ======================================================

    botonHeader: {
      width:
        44,

      height:
        44,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    // ======================================================
    // CONTENEDOR PERFIL
    // ======================================================

    perfilContenedor: {
      position:
        "relative",

      zIndex:
        2000,

      elevation:
        20,
    },


    // ======================================================
    // MENÚ
    // ======================================================

    menu: {
      position:
        "absolute",

      top:
        50,

      right:
        0,

      width:
        230,

      borderRadius:
        18,

      borderWidth:
        1,

      paddingVertical:
        7,

      paddingHorizontal:
        6,

      zIndex:
        3000,

      elevation:
        20,

      shadowColor:
        "#000000",

      shadowOffset: {
        width:
          0,

        height:
          6,
      },

      shadowOpacity:
        0.18,

      shadowRadius:
        12,
    },


    // ======================================================
    // OPCIÓN
    // ======================================================

    opcionMenu: {
      width:
        "100%",

      borderRadius:
        13,

      overflow:
        "hidden",
    },


    contenidoOpcion: {
      width:
        "100%",

      minHeight:
        58,

      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        10,

      paddingVertical:
        8,
    },


    // ======================================================
    // ICONO DE OPCIÓN
    // ======================================================

    iconoMenu: {
      width:
        38,

      height:
        38,

      borderRadius:
        19,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        12,

      flexShrink:
        0,
    },


    // ======================================================
    // TEXTO DE OPCIÓN
    // ======================================================

    textoOpcion: {
      flex:
        1,

      justifyContent:
        "center",
    },


    tituloOpcion: {
      fontSize:
        15,

      lineHeight:
        20,

      fontFamily:
        "Nunito-Bold",

      includeFontPadding:
        false,
    },


    descripcionOpcion: {
      marginTop:
        2,

      fontSize:
        12,

      lineHeight:
        16,

      fontFamily:
        "Nunito-Medium",

      includeFontPadding:
        false,
    },


    // ======================================================
    // SEPARADOR
    // ======================================================

    separador: {
      height:
        1,

      marginHorizontal:
        10,

      marginVertical:
        4,
    },


    // ======================================================
    // ESTADO PRESIONADO
    // ======================================================

    presionado: {
      opacity:
        0.6,
    },

  });