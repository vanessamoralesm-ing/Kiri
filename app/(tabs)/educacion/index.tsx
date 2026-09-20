import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import React, { useMemo, useState } from "react";

import {
  LayoutChangeEvent,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import CategoriaCard from "@/components/educacion/CategoriaCard";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// CATEGORÍAS
// ==========================================================

const categorias = [
  {
    id: "Ansiedad",

    titulo: "Ansiedad",

    imagen: require("../../../assets/images_educacion/ansiedad_kiri.png"),
  },

  {
    id: "Autoestima",

    titulo: "Autoestima",

    imagen: require("../../../assets/images_educacion/autoestima_kiri.png"),
  },

  {
    id: "Estres",

    titulo: "Estrés",

    imagen: require("../../../assets/images_educacion/kiri_estres.png"),
  },

  {
    id: "Procrastinacion",

    titulo: "Procrastinación",

    imagen: require("../../../assets/images_educacion/procrastinacion_kiri.png"),
  },

  {
    id: "Soledad",

    titulo: "Soledad",

    imagen: require("../../../assets/images_educacion/kiri_solito.png"),
  },

  {
    id: "Depresion",

    titulo: "Depresión",

    imagen: require("../../../assets/images_educacion/depresion_kiri.png"),
  },
];

// ==========================================================
// EDUCACIÓN
// ==========================================================

export default function EducacionScreen() {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // ESTADOS
  // ========================================================

  const [busqueda, setBusqueda] = useState("");

  const [anchoGrid, setAnchoGrid] = useState(0);

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");

  const surfaceColor = useThemeColor({}, "surface");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const inputBackgroundColor = useThemeColor({}, "inputBackground");

  const inputBorderColor = useThemeColor({}, "inputBorder");

  const placeholderColor = useThemeColor({}, "placeholder");

  const iconColor = useThemeColor({}, "icon");

  const borderColor = useThemeColor({}, "border");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidthContenido = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  /*
   * Móvil      → 1 columna
   * Tablet     → 2 columnas
   * Escritorio → 3 columnas
   */
  const numeroColumnas = esEscritorio ? 3 : esTablet ? 2 : 1;

  const gapHorizontal = esEscritorio ? 20 : 16;

  const gapVertical = esEscritorio ? 24 : 20;

  const anchoTarjeta =
    anchoGrid > 0
      ? (anchoGrid - gapHorizontal * (numeroColumnas - 1)) / numeroColumnas
      : undefined;

  const paddingTop = esEscritorio ? 30 : esTablet ? 26 : 22;

  const paddingBottom = esEscritorio ? 64 : 145;

  // ========================================================
  // FILTRADO
  // ========================================================

  const categoriasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      return categorias;
    }

    return categorias.filter((categoria) =>
      categoria.titulo.toLowerCase().includes(termino),
    );
  }, [busqueda]);

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  function abrirCategoria(id: string) {
    router.push(`/educacion/${id}` as any);
  }

  // ========================================================
  // MEDIR GRID
  // ========================================================

  function medirGrid(event: LayoutChangeEvent) {
    const nuevoAncho = event.nativeEvent.layout.width;

    if (Math.abs(nuevoAncho - anchoGrid) > 1) {
      setAnchoGrid(nuevoAncho);
    }
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
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop,

        paddingBottom,
      }}
    >
      <View
        style={{
          width: "100%",

          maxWidth: maxWidthContenido,

          alignSelf: "center",

          paddingHorizontal,
        }}
      >
        {/* ==================================================
            ENCABEZADO
        ================================================== */}

        <View
          style={{
            width: "100%",

            maxWidth: esEscritorio ? 820 : undefined,

            marginBottom: esEscritorio ? 28 : 24,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esEscritorio ? 32 : esTablet ? 28 : 24,

              lineHeight: esEscritorio ? 40 : esTablet ? 35 : 31,

              color: primaryColor,
            }}
          >
            Biblioteca de Bienestar
          </Text>

          <Text
            style={{
              marginTop: 8,

              maxWidth: esEscritorio ? 720 : undefined,

              fontFamily: "Nunito-Medium",

              fontSize: esEscritorio ? 16 : 15,

              lineHeight: esEscritorio ? 23 : 21,

              color: textSecondaryColor,
            }}
          >
            Explora herramientas y conocimientos diseñados para acompañarte en
            tu camino hacia una mejor salud mental.
          </Text>
        </View>

        {/* ==================================================
            BUSCADOR
        ================================================== */}

        <View
          style={{
            width: "100%",

            maxWidth: esEscritorio ? 760 : undefined,

            minHeight: 56,

            flexDirection: "row",

            alignItems: "center",

            paddingHorizontal: 16,

            marginBottom: esEscritorio ? 32 : 28,

            borderRadius: 16,

            borderWidth: 1,

            borderColor: inputBorderColor,

            backgroundColor: inputBackgroundColor,

            ...Platform.select({
              web: {
                boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
              },

              ios: {
                shadowColor: "#000000",

                shadowOffset: {
                  width: 0,

                  height: 2,
                },

                shadowOpacity: 0.06,

                shadowRadius: 6,
              },

              android: {
                elevation: 2,
              },
            }),
          }}
        >
          <Ionicons name="search-outline" size={24} color={iconColor} />

          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="¿Qué tema te gustaría explorar hoy?"
            placeholderTextColor={placeholderColor}
            selectionColor={primaryColor}
            style={{
              flex: 1,

              marginLeft: 12,

              paddingVertical: 16,

              fontFamily: "Nunito-Medium",

              fontSize: 14,

              color: textColor,

              outlineStyle: "none" as any,
            }}
          />
        </View>

        {/* ==================================================
            TÍTULO DE CATEGORÍAS
        ================================================== */}

        <View
          style={{
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esEscritorio ? 22 : 20,

              color: textColor,
            }}
          >
            Explora por categoría
          </Text>

          <Text
            style={{
              marginTop: 4,

              fontFamily: "Nunito-SemiBold",

              fontSize: 14,

              color: textMutedColor,
            }}
          >
            Selecciona el tema sobre el que quieras aprender.
          </Text>
        </View>

        {/* ==================================================
            TARJETAS
        ================================================== */}

        {categoriasFiltradas.length > 0 ? (
          <View
            onLayout={medirGrid}
            style={{
              width: "100%",

              flexDirection: "row",

              flexWrap: "wrap",

              columnGap: gapHorizontal,

              rowGap: gapVertical,

              alignItems: "stretch",
            }}
          >
            {categoriasFiltradas.map((categoria) => (
              <View
                key={categoria.id}
                style={{
                  width: numeroColumnas === 1 ? "100%" : anchoTarjeta,

                  minWidth: 0,

                  alignItems: "stretch",
                }}
              >
                <CategoriaCard
                  titulo={categoria.titulo}
                  imagen={categoria.imagen}
                  onPress={() => abrirCategoria(categoria.id)}
                />
              </View>
            ))}
          </View>
        ) : (
          // ==================================================
          // SIN RESULTADOS
          // ==================================================

          <View
            style={{
              width: "100%",

              minHeight: 210,

              borderRadius: 22,

              borderWidth: 1,

              borderColor,

              backgroundColor: surfaceColor,

              alignItems: "center",

              justifyContent: "center",

              padding: 24,
            }}
          >
            <View
              style={{
                width: 58,

                height: 58,

                borderRadius: 29,

                alignItems: "center",

                justifyContent: "center",

                backgroundColor: primarySoftColor,
              }}
            >
              <Ionicons name="search-outline" size={26} color={primaryColor} />
            </View>

            <Text
              style={{
                marginTop: 14,

                fontFamily: "Nunito-Bold",

                fontSize: 16,

                textAlign: "center",

                color: textColor,
              }}
            >
              No encontramos esa categoría
            </Text>

            <Text
              style={{
                marginTop: 5,

                maxWidth: 420,

                fontFamily: "Nunito-Medium",

                fontSize: 13,

                lineHeight: 19,

                textAlign: "center",

                color: textMutedColor,
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
            width: "100%",

            marginTop: esEscritorio ? 36 : 32,

            padding: esEscritorio ? 24 : 20,

            borderRadius: 22,

            borderWidth: 1,

            borderColor,

            /*
             * IMPORTANTE:
             *
             * Utilizamos surface y no surfaceSecondary.
             * En tu configuración actual surfaceSecondary
             * está resolviendo un fondo demasiado claro
             * cuando el tema es oscuro.
             */
            backgroundColor: surfaceColor,

            ...Platform.select({
              web: {
                boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
              },

              ios: {
                shadowColor: "#000000",

                shadowOffset: {
                  width: 0,

                  height: 2,
                },

                shadowOpacity: 0.05,

                shadowRadius: 5,
              },

              android: {
                elevation: 2,
              },
            }),
          }}
        >
          <View
            style={{
              flexDirection: "row",

              alignItems: "flex-start",
            }}
          >
            {/* ICONO */}

            <View
              style={{
                width: 48,

                height: 48,

                borderRadius: 24,

                flexShrink: 0,

                alignItems: "center",

                justifyContent: "center",

                backgroundColor: primarySoftColor,
              }}
            >
              <Ionicons name="leaf-outline" size={23} color={primaryColor} />
            </View>

            {/* TEXTO */}

            <View
              style={{
                flex: 1,

                marginLeft: 16,

                minWidth: 0,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: 16,

                  color: textColor,
                }}
              >
                Explora a tu ritmo
              </Text>

              <Text
                style={{
                  marginTop: 5,

                  maxWidth: esEscritorio ? 820 : undefined,

                  fontFamily: "Nunito-SemiBold",

                  fontSize: 14,

                  lineHeight: 20,

                  color: textSecondaryColor,
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
