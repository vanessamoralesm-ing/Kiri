import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";

import {
  Image,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import CategoriaCard from "@/components/educacion/CategoriaCard";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

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
// PANTALLA
// ==========================================================

export default function EducacionScreen() {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // ESTADOS
  // ========================================================

  const [busqueda, setBusqueda] = useState("");
  const [anchoGrid, setAnchoGrid] = useState(0);

  // ========================================================
  // TEMA
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

  // Móvil: tarjetas horizontales.
  // Tablet: dos columnas.
  // Escritorio: tres columnas.

  const numeroColumnas = esEscritorio ? 3 : esTablet ? 2 : 1;

  const gapHorizontal = 18;
  const gapVertical = 20;

  const anchoTarjeta =
    anchoGrid > 0
      ? (anchoGrid - gapHorizontal * (numeroColumnas - 1)) / numeroColumnas
      : undefined;

  const paddingTop = esEscritorio ? 30 : esTablet ? 26 : 20;

  // La barra inferior está fuera de este ScrollView.
  // Dejamos espacio adicional para poder ver la última
  // categoría y el mensaje final completamente.

  const paddingBottom = esEscritorio ? 64 : 145;

  // ========================================================
  // FILTRADO
  // ========================================================

  const categoriasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase("es");

    if (!termino) {
      return categorias;
    }

    return categorias.filter((categoria) =>
      categoria.titulo.toLocaleLowerCase("es").includes(termino),
    );
  }, [busqueda]);

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  function abrirCategoria(id: string) {
    router.push(`/educacion/${id}` as any);
  }

  // ========================================================
  // MEDIR GRID DE TABLET Y ESCRITORIO
  // ========================================================

  function medirGrid(event: LayoutChangeEvent) {
    const nuevoAncho = event.nativeEvent.layout.width;

    setAnchoGrid((anterior) =>
      Math.abs(nuevoAncho - anterior) > 1 ? nuevoAncho : anterior,
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
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
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
            marginBottom: esTelefono ? 22 : 28,
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
              fontSize: esEscritorio ? 16 : 14,
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
            minHeight: esTelefono ? 52 : 56,
            paddingHorizontal: 16,
            marginBottom: esTelefono ? 26 : 32,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: inputBorderColor,
            backgroundColor: inputBackgroundColor,
            flexDirection: "row",
            alignItems: "center",

            ...(Platform.OS === "web"
              ? ({
                boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
              } as any)
              : {}),

            ...(Platform.OS === "ios"
              ? {
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.06,
                shadowRadius: 6,
              }
              : {}),

            ...(Platform.OS === "android" ? { elevation: 2 } : {}),
          }}
        >
          <Ionicons name="search-outline" size={22} color={iconColor} />

          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="¿Qué tema te gustaría explorar hoy?"
            placeholderTextColor={placeholderColor}
            selectionColor={primaryColor}
            returnKeyType="search"
            style={{
              flex: 1,
              minWidth: 0,
              marginLeft: 12,
              paddingVertical: 12,
              fontFamily: "Nunito-Medium",
              fontSize: esTelefono ? 13 : 14,
              color: textColor,
              ...(Platform.OS === "web"
                ? ({ outlineStyle: "none" } as any)
                : {}),
            }}
          />

          {busqueda.length > 0 && (
            <Pressable
              onPress={() => setBusqueda("")}
              hitSlop={10}
              style={{
                width: 32,
                height: 32,
                marginLeft: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close-circle" size={20} color={textMutedColor} />
            </Pressable>
          )}
        </View>

        {/* ==================================================
            TÍTULO DE CATEGORÍAS
        ================================================== */}

        <View
          style={{
            width: "100%",
            marginBottom: esTelefono ? 16 : 22,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: esEscritorio ? 22 : 20,
              lineHeight: 27,
              color: textColor,
            }}
          >
            Explora por categoría
          </Text>

          <Text
            style={{
              marginTop: 5,
              fontFamily: "Nunito-SemiBold",
              fontSize: 14,
              lineHeight: 20,
              color: textMutedColor,
            }}
          >
            Selecciona el tema sobre el que quieras aprender.
          </Text>
        </View>

        {/* ==================================================
            CATEGORÍAS
        ================================================== */}

        {categoriasFiltradas.length > 0 ? (
          esTelefono ? (
            // ==============================================
            // TELÉFONO: TARJETAS HORIZONTALES
            // ==============================================

            <View
              style={{
                width: "100%",
                gap: 12,
              }}
            >
              {categoriasFiltradas.map((categoria) => (
                <Pressable
                  key={categoria.id}
                  onPress={() => abrirCategoria(categoria.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Explorar ${categoria.titulo}`}
                  style={({ pressed }) => ({
                    width: "100%",
                    borderRadius: 20,
                    opacity: pressed ? 0.82 : 1,
                  })}
                >
                  <View
                    style={{
                      width: "100%",
                      minHeight: 116,
                      padding: 12,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor,
                      backgroundColor: surfaceColor,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {/* ILUSTRACIÓN ORIGINAL */}

                    <View
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: 16,
                        overflow: "hidden",
                        flexShrink: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: primarySoftColor,
                      }}
                    >
                      <Image
                        source={categoria.imagen}
                        resizeMode="contain"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </View>

                    {/* INFORMACIÓN */}

                    <View
                      style={{
                        flex: 1,
                        minWidth: 0,
                        marginLeft: 14,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",
                          fontSize: 17,
                          lineHeight: 23,
                          color: textColor,
                        }}
                      >
                        {categoria.titulo}
                      </Text>

                      <Text
                        style={{
                          marginTop: 4,
                          fontFamily: "Nunito-Medium",
                          fontSize: 12,
                          lineHeight: 17,
                          color: textSecondaryColor,
                        }}
                      >
                        Explorar tema
                      </Text>
                    </View>

                    {/* FLECHA */}

                    <View
                      style={{
                        width: 34,
                        height: 34,
                        marginLeft: 6,
                        flexShrink: 0,
                        borderRadius: 17,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: primarySoftColor,
                      }}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={19}
                        color={primaryColor}
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            // ==============================================
            // TABLET Y ESCRITORIO: CARD ORIGINAL
            // ==============================================

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
                    width:
                      anchoTarjeta !== undefined
                        ? anchoTarjeta
                        : numeroColumnas === 2
                          ? "48%"
                          : "31%",
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
          )
        ) : (
          // ==============================================
          // SIN RESULTADOS
          // ==============================================

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
            marginTop: esEscritorio ? 36 : 28,
            padding: esTelefono ? 16 : 24,
            borderRadius: 20,
            borderWidth: 1,
            borderColor,
            backgroundColor: surfaceColor,

            ...(Platform.OS === "web"
              ? ({
                boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
              } as any)
              : {}),

            ...(Platform.OS === "ios"
              ? {
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.05,
                shadowRadius: 5,
              }
              : {}),

            ...(Platform.OS === "android" ? { elevation: 2 } : {}),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                width: esTelefono ? 42 : 48,
                height: esTelefono ? 42 : 48,
                borderRadius: 14,
                flexShrink: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: primarySoftColor,
              }}
            >
              <Ionicons name="leaf-outline" size={23} color={primaryColor} />
            </View>

            <View
              style={{
                flex: 1,
                minWidth: 0,
                marginLeft: 14,
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
                  fontFamily: "Nunito-SemiBold",
                  fontSize: 13,
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
