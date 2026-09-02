import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

import React from "react";

import {
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import CategoriaCard from "../../../components/educacion/CategoriaCard";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// CATEGORÍAS
// ==========================================================

const categorias = [
  {
    id: "Ansiedad",
    titulo: "Ansiedad",
  },
  {
    id: "Autoestima",
    titulo: "Autoestima",
  },
  {
    id: "Estres",
    titulo: "Estrés",
  },
  {
    id: "Procrastinacion",
    titulo: "Procrastinación",
  },
  {
    id: "Soledad",
    titulo: "Soledad",
  },
  {
    id: "Depresion",
    titulo: "Depresión",
  },
];


// ==========================================================
// EDUCACIÓN
// ==========================================================

export default function EducacionScreen() {

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


  const placeholderColor =
    useThemeColor(
      {},
      "placeholder"
    );


  const iconColor =
    useThemeColor(
      {},
      "icon"
    );


  const borderColor =
    useThemeColor(
      {},
      "border"
    );


  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  function abrirCategoria(
    id: string
  ) {

    router.push(
      `/educacion/${id}` as any
    );

  }


  // ========================================================
  // UI
  // ========================================================

  return (

    <ScrollView
      style={{
        flex: 1,
        backgroundColor,
      }}

      showsVerticalScrollIndicator={
        false
      }

      contentContainerStyle={{
        paddingBottom:
          130,
      }}
    >

      <View
        style={{
          paddingHorizontal:
            24,

          paddingTop:
            48,
        }}
      >

        {/* =================================================
            ENCABEZADO
        ================================================= */}

        <View>

          <Text
            style={{
              fontFamily:
                "Nunito-Bold",

              fontSize:
                24,

              color:
                primaryColor,
            }}
          >
            Biblioteca de Bienestar
          </Text>


          <Text
            style={{
              marginTop:
                8,

              fontFamily:
                "Nunito-Medium",

              fontSize:
                15,

              lineHeight:
                20,

              color:
                textSecondaryColor,
            }}
          >
            Explora herramientas y conocimientos diseñados para acompañarte en
            tu camino hacia una mejor salud mental.
          </Text>

        </View>


        {/* =================================================
            BUSCADOR
        ================================================= */}

        <View
          style={{
            marginTop:
              28,

            minHeight:
              56,

            flexDirection:
              "row",

            alignItems:
              "center",

            paddingHorizontal:
              16,

            borderRadius:
              16,

            borderWidth:
              1,

            borderColor:
              inputBorderColor,

            backgroundColor:
              inputBackgroundColor,

            shadowColor:
              "#000000",

            shadowOffset: {
              width: 0,
              height: 2,
            },

            shadowOpacity:
              0.08,

            shadowRadius:
              6,

            elevation:
              2,
          }}
        >

          <Ionicons
            name="search-outline"
            size={27}
            color={
              iconColor
            }
          />


          <TextInput
            placeholder="¿Qué tema te gustaría explorar hoy?"

            placeholderTextColor={
              placeholderColor
            }

            selectionColor={
              primaryColor
            }

            style={{
              flex:
                1,

              marginLeft:
                12,

              paddingVertical:
                16,

              fontFamily:
                "Nunito-Medium",

              fontSize:
                14,

              color:
                textColor,
            }}
          />

        </View>


        {/* =================================================
            TÍTULO DE CATEGORÍAS
        ================================================= */}

        <View
          style={{
            marginTop:
              32,

            marginBottom:
              20,
          }}
        >

          <Text
            style={{
              fontFamily:
                "Nunito-Bold",

              fontSize:
                20,

              color:
                textColor,
            }}
          >
            Explora por categoría
          </Text>


          <Text
            style={{
              marginTop:
                4,

              fontFamily:
                "Nunito-SemiBold",

              fontSize:
                15,

              color:
                textMutedColor,
            }}
          >
            Selecciona el tema sobre el que quieras aprender.
          </Text>

        </View>


        {/* =================================================
            TARJETAS DE CATEGORÍAS
        ================================================= */}

        <View
          style={{
            flexDirection:
              "row",

            flexWrap:
              "wrap",

            justifyContent:
              "space-between",

            rowGap:
              28,
          }}
        >

          {
            categorias.map(
              categoria => (

                <View
                  key={
                    categoria.id
                  }

                  style={{
                    width:
                      "48%",
                  }}
                >

                  <CategoriaCard
                    titulo={
                      categoria.titulo
                    }

                    onPress={() =>
                      abrirCategoria(
                        categoria.id
                      )
                    }
                  />

                </View>

              )
            )
          }

        </View>


        {/* =================================================
            MENSAJE FINAL
        ================================================= */}

        <View
          style={{
            marginTop:
              40,

            padding:
              20,

            borderRadius:
              22,

            borderWidth:
              1,

            borderColor,

            backgroundColor:
              surfaceColor,

            shadowColor:
              "#000000",

            shadowOffset: {
              width: 0,
              height: 2,
            },

            shadowOpacity:
              0.06,

            shadowRadius:
              5,

            elevation:
              2,
          }}
        >

          <View
            style={{
              flexDirection:
                "row",

              alignItems:
                "flex-start",
            }}
          >

            <View
              style={{
                width:
                  44,

                height:
                  44,

                borderRadius:
                  22,

                alignItems:
                  "center",

                justifyContent:
                  "center",

                backgroundColor:
                  primarySoftColor,
              }}
            >

              <Ionicons
                name="leaf-outline"
                size={22}
                color={
                  primaryColor
                }
              />

            </View>


            <View
              style={{
                flex:
                  1,

                marginLeft:
                  16,
              }}
            >

              <Text
                style={{
                  fontFamily:
                    "Nunito-Bold",

                  fontSize:
                    18,

                  color:
                    textColor,
                }}
              >
                Explora a tu ritmo
              </Text>


              <Text
                style={{
                  marginTop:
                    4,

                  fontFamily:
                    "Nunito-Medium",

                  fontSize:
                    16,

                  lineHeight:
                    21,

                  textAlign:
                    "justify",

                  color:
                    textSecondaryColor,
                }}
              >
                Cada categoría contiene información, mitos, realidades y
                lecturas relacionadas para ayudarte a comprender mejor cada
                tema.
              </Text>

            </View>

          </View>

        </View>

      </View>

    </ScrollView>

  );

}