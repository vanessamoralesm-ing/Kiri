import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";

import {
  LayoutChangeEvent,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import CategoriaCard from "@/components/educacion/CategoriaCard";
import EncabezadoCard from "@/components/educacion/EncabezadoCard";
import SearchBar from "@/components/ui/SearchBar";

import {
  MAX_WIDTHS,
  PADDING_RESPONSIVE,
} from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";


// ==========================================================
// CATEGORÍAS
// ==========================================================

const categorias = [
  {
    id: "Ansiedad",
    titulo: "Ansiedad",
    imagen: require(
      "../../../assets/images_educacion/ansiedad_kiri.png"
    ),
  },
  {
    id: "Autoestima",
    titulo: "Autoestima",
    imagen: require(
      "../../../assets/images_educacion/autoestima_kiri.png"
    ),
  },
  {
    id: "Estres",
    titulo: "Estrés",
    imagen: require(
      "../../../assets/images_educacion/kiri_estres.png"
    ),
  },
  {
    id: "Procrastinacion",
    titulo: "Procrastinación",
    imagen: require(
      "../../../assets/images_educacion/procrastinacion_kiri.png"
    ),
  },
  {
    id: "Soledad",
    titulo: "Soledad",
    imagen: require(
      "../../../assets/images_educacion/kiri_solito.png"
    ),
  },
  {
    id: "Depresion",
    titulo: "Depresión",
    imagen: require(
      "../../../assets/images_educacion/depresion_kiri.png"
    ),
  },
];


// ==========================================================
// EDUCACIÓN
// ==========================================================

export default function EducacionScreen() {

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const {
    esTelefono,
    esTablet,
    esEscritorio,
  } = useResponsiveLayout();


  // ========================================================
  // ESTADOS
  // ========================================================

  const [busqueda, setBusqueda] =
    useState("");

  const [anchoGrid, setAnchoGrid] =
    useState(0);


  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const backgroundColor = useThemeColor(
    {},
    "background"
  );

  const surfaceColor = useThemeColor(
    {},
    "surface"
  );

  const textColor = useThemeColor(
    {},
    "text"
  );

  const textSecondaryColor = useThemeColor(
    {},
    "textSecondary"
  );

  const textMutedColor = useThemeColor(
    {},
    "textMuted"
  );

  const primaryColor = useThemeColor(
    {},
    "primary"
  );

  const primarySoftColor = useThemeColor(
    {},
    "primarySoft"
  );

  const borderColor = useThemeColor(
    {},
    "border"
  );


  // ========================================================
  // CONFIGURACIÓN RESPONSIVE
  // ========================================================

  const paddingHorizontal =
    esEscritorio
      ? PADDING_RESPONSIVE.escritorio
      : esTablet
        ? PADDING_RESPONSIVE.tablet
        : PADDING_RESPONSIVE.telefono;


  const maxWidthContenido =
    esEscritorio
      ? MAX_WIDTHS.dashboard
      : esTablet
        ? MAX_WIDTHS.contenido
        : undefined;


  // Tablet usa 2 columnas.
  // Escritorio usa 3 columnas.
  // Teléfono usa el 48% original.

  const numeroColumnas =
    esEscritorio
      ? 3
      : 2;


  const gapHorizontal =
    esTelefono
      ? 0
      : 18;


  const gapVertical =
    esTelefono
      ? 28
      : 20;


  // Solo se usa para tablet y escritorio.

  const anchoTarjetaResponsive =
    anchoGrid > 0
      ? (
          anchoGrid -
          gapHorizontal *
            (numeroColumnas - 1)
        ) /
        numeroColumnas
      : undefined;


  const paddingTop =
    esEscritorio
      ? 30
      : esTablet
        ? 26
        : 20;


  const paddingBottom =
    esEscritorio
      ? 64
      : 145;


  // ========================================================
  // NORMALIZAR TEXTO
  // ========================================================

  function normalizarTexto(
    texto: string
  ) {
    return texto
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .trim();
  }


  // ========================================================
  // FILTRO DE CATEGORÍAS
  // ========================================================

  const categoriasFiltradas =
    useMemo(() => {

      const termino =
        normalizarTexto(
          busqueda
        );


      if (!termino) {
        return categorias;
      }


      return categorias.filter(
        (categoria) =>
          normalizarTexto(
            categoria.titulo
          ).includes(
            termino
          )
      );

    }, [busqueda]);


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
  // MEDIR GRID
  // ========================================================

  function medirGrid(
    event: LayoutChangeEvent
  ) {

    // En teléfono usamos 48%.
    // No necesitamos calcular el ancho.

    if (esTelefono) {
      return;
    }


    const nuevoAncho =
      event.nativeEvent.layout.width;


    setAnchoGrid(
      (anterior) =>
        Math.abs(
          nuevoAncho -
            anterior
        ) > 1
          ? nuevoAncho
          : anterior
    );
  }


  // ========================================================
  // UI
  // ========================================================

  return (
    <ScrollView
      className="flex-1"

      style={{
        backgroundColor,
      }}

      showsVerticalScrollIndicator={
        false
      }

      keyboardShouldPersistTaps="handled"

      contentContainerStyle={{
        paddingTop,
        paddingBottom,
      }}
    >

      {/* ==================================================
          CONTENIDO PRINCIPAL
          ================================================== */}

      <View
        style={{
          width:
            "100%",

          maxWidth:
            maxWidthContenido,

          alignSelf:
            "center",

          paddingHorizontal,
        }}
      >

        {/* ==================================================
            ENCABEZADO
            ================================================== */}

        <EncabezadoCard
          imagen={require(
            "../../../assets/images_educacion/kiri_lee_edu_horiz.png"
          )}

          titulo="Biblioteca de Bienestar"

          subtitulo="Conoce, aprende y descubre herramientas para tu bienestar emocional."
        />


        {/* ==================================================
            BUSCADOR
            ================================================== */}

        <View
          style={{
            width:
              "100%",

            maxWidth:
              esEscritorio
                ? 760
                : undefined,

            alignSelf:
              esEscritorio
                ? "center"
                : undefined,

            marginTop:
              esTelefono
                ? 20
                : 24,

            marginBottom:
              esTelefono
                ? 26
                : 32,
          }}
        >

          <SearchBar
            value={
              busqueda
            }

            onChangeText={
              setBusqueda
            }

            placeholder="¿Qué te gustaría explorar hoy?"
          />

        </View>


        {/* ==================================================
            TÍTULO DE CATEGORÍAS
            ================================================== */}

        <View
          style={{
            width:
              "100%",

            marginBottom:
              esTelefono
                ? 16
                : 22,
          }}
        >

          <Text
            className="font-nunito-bold"

            style={{
              fontSize:
                esEscritorio
                  ? 22
                  : 20,

              lineHeight:
                27,

              color:
                textColor,
            }}
          >
            Explora por categoría
          </Text>


          <Text
            className="mt-1 font-nunito-semibold"

            style={{
              fontSize:
                14,

              lineHeight:
                20,

              color:
                textMutedColor,
            }}
          >
            Selecciona el tema sobre el que quieras aprender.
          </Text>

        </View>


        {/* ==================================================
            TARJETAS DE CATEGORÍAS
            ================================================== */}

        {categoriasFiltradas.length > 0 ? (

          <View
            onLayout={
              medirGrid
            }

            style={{
              width:
                "100%",

              flexDirection:
                "row",

              flexWrap:
                "wrap",

              justifyContent:
                esTelefono
                  ? "space-between"
                  : "flex-start",

              columnGap:
                gapHorizontal,

              rowGap:
                gapVertical,

              alignItems:
                "stretch",
            }}
          >

            {categoriasFiltradas.map(
              (categoria) => (

                <View
                  key={
                    categoria.id
                  }

                  style={{
                    // En teléfono recuperamos exactamente
                    // la distribución de dos cards por fila.

                    width:
                      esTelefono
                        ? "48%"
                        : anchoTarjetaResponsive !==
                            undefined
                          ? anchoTarjetaResponsive
                          : esEscritorio
                            ? "31%"
                            : "48%",

                    minWidth:
                      0,

                    alignItems:
                      "stretch",
                  }}
                >

                  <CategoriaCard
                    titulo={
                      categoria.titulo
                    }

                    imagen={
                      categoria.imagen
                    }

                    onPress={() =>
                      abrirCategoria(
                        categoria.id
                      )
                    }
                  />

                </View>

              )
            )}

          </View>

        ) : (

          // ==================================================
          // SIN RESULTADOS
          // ==================================================

          <View
            style={{
              width:
                "100%",

              minHeight:
                210,

              borderRadius:
                22,

              borderWidth:
                1,

              borderColor,

              backgroundColor:
                surfaceColor,

              alignItems:
                "center",

              justifyContent:
                "center",

              padding:
                24,
            }}
          >

            <View
              style={{
                width:
                  58,

                height:
                  58,

                borderRadius:
                  29,

                alignItems:
                  "center",

                justifyContent:
                  "center",

                backgroundColor:
                  primarySoftColor,
              }}
            >

              <Ionicons
                name="search-outline"
                size={26}
                color={
                  primaryColor
                }
              />

            </View>


            <Text
              className="mt-3 font-nunito-bold"

              style={{
                fontSize:
                  16,

                textAlign:
                  "center",

                color:
                  textColor,
              }}
            >
              No encontramos esa categoría
            </Text>


            <Text
              className="mt-1 font-nunito-medium"

              style={{
                maxWidth:
                  420,

                fontSize:
                  13,

                lineHeight:
                  19,

                textAlign:
                  "center",

                color:
                  textMutedColor,
              }}
            >
              Prueba con otra palabra o explora las categorías disponibles.
            </Text>

          </View>

        )}


        {/* ==================================================
            MENSAJE FINAL
            ================================================== */}

        <View
          style={{
            width:
              "100%",

            marginTop:
              esEscritorio
                ? 36
                : 28,

            padding:
              esTelefono
                ? 16
                : 24,

            borderRadius:
              20,

            borderWidth:
              1,

            borderColor,

            backgroundColor:
              surfaceColor,

            ...Platform.select({
              web: {
                boxShadow:
                  "0px 2px 8px rgba(0,0,0,0.04)",
              } as any,

              ios: {
                shadowColor:
                  "#000000",

                shadowOffset: {
                  width: 0,
                  height: 2,
                },

                shadowOpacity:
                  0.05,

                shadowRadius:
                  5,
              },

              android: {
                elevation:
                  2,
              },
            }),
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

            {/* ICONO */}

            <View
              style={{
                width:
                  esTelefono
                    ? 42
                    : 48,

                height:
                  esTelefono
                    ? 42
                    : 48,

                borderRadius:
                  14,

                flexShrink:
                  0,

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
                size={23}
                color={
                  primaryColor
                }
              />

            </View>


            {/* TEXTO */}

            <View
              style={{
                flex:
                  1,

                minWidth:
                  0,

                marginLeft:
                  14,
              }}
            >

              <Text
                className="font-nunito-bold"

                style={{
                  fontSize:
                    16,

                  color:
                    textColor,
                }}
              >
                Explora a tu ritmo
              </Text>


              <Text
                className="mt-1 font-nunito-semibold"

                style={{
                  fontSize:
                    13,

                  lineHeight:
                    20,

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