import React, { useEffect } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { BottomTabBarProps } from "expo-router/js-tabs";

import { usePathname, useRouter } from "expo-router";

import Svg, { Path } from "react-native-svg";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// CONSTANTES
// ==========================================================

const ALTURA_BARRA = 75;

// ==========================================================
// ICONOS
// ==========================================================

const MAPA_ICONOS: Record<
  string,
  {
    inactivo: keyof typeof Ionicons.glyphMap;
    activo: keyof typeof Ionicons.glyphMap;
  }
> = {
  home: {
    inactivo: "home-outline",
    activo: "home",
  },

  diario: {
    inactivo: "book-outline",
    activo: "book",
  },

  educacion: {
    inactivo: "school-outline",
    activo: "school",
  },

  tecnicas: {
    inactivo: "heart-outline",
    activo: "heart",
  },

  perfil: {
    inactivo: "person-outline",
    activo: "person",
  },
};

// ==========================================================
// RUTAS VISIBLES
// ==========================================================

const RUTAS_VISIBLES = [
  "home",
  "diario",
  "educacion/index",
  "tecnicas",
  "perfil/index",
];

// ==========================================================
// COMPONENTE
// ==========================================================

export function BarraNavegacionCurva({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  // ========================================================
  // HOOKS
  // ========================================================

  const { width } = useWindowDimensions();

  const pathname = usePathname();

  const router = useRouter();

  const translateX = useSharedValue(0);

  // ========================================================
  // COLORES
  // ========================================================

  const tabBarColor = useThemeColor({}, "tabBar");

  const borderColor = useThemeColor({}, "border");

  const tabIconDefault = useThemeColor({}, "tabIconDefault");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const primaryColor = useThemeColor({}, "primary");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // SEGMENTOS
  // ========================================================

  const segmentosRuta = pathname.split("/").filter(Boolean);

  // ========================================================
  // RUTAS SECUNDARIAS
  // ========================================================

  const esListaCuestionarios =
    pathname === "/cuestionarios" || pathname === "/cuestionarios/";

  const esForoPrincipal = pathname === "/foro" || pathname === "/foro/";

  const esEntrevistaNinosPrincipal =
    pathname === "/ninos" || pathname === "/ninos/";

  const esEntrevistaAdultosPrincipal =
    pathname === "/adultos" || pathname === "/adultos/";

  const esNuevoRegistroDiario =
    pathname === "/diario/nuevo" || pathname === "/diario/nuevo/";

  const estaDentroDePlantillaDiario =
    segmentosRuta[0] === "diario" &&
    segmentosRuta[1] === "nuevo" &&
    segmentosRuta.length >= 3;

  const esHistorialDiario =
    segmentosRuta[0] === "diario" && segmentosRuta[1] === "historial";

  const esDetalleRegistroDiario =
    segmentosRuta[0] === "diario" &&
    segmentosRuta.length === 2 &&
    segmentosRuta[1] !== "nuevo" &&
    segmentosRuta[1] !== "historial";

  const esEditarRegistroDiario =
    segmentosRuta[0] === "diario" &&
    segmentosRuta.length === 3 &&
    segmentosRuta[2] === "editar";

  const esRutaSecundariaDeInicio =
    esListaCuestionarios ||
    esForoPrincipal ||
    esEntrevistaNinosPrincipal ||
    esEntrevistaAdultosPrincipal ||
    esNuevoRegistroDiario;

  // ========================================================
  // RUTAS EN LAS QUE SE OCULTA
  // ========================================================

  const estaDentroDeCuestionario =
    segmentosRuta[0] === "cuestionarios" && segmentosRuta.length >= 2;

  const estaDentroDeForo =
    segmentosRuta[0] === "foro" && segmentosRuta.length >= 2;

  const estaDentroEntrevistaNinos =
    segmentosRuta[0] === "ninos" && segmentosRuta.length >= 2;

  const estaDentroEntrevistaAdultos =
    segmentosRuta[0] === "adultos" && segmentosRuta.length >= 2;

  const ocultarBarra =
    estaDentroDeCuestionario ||
    estaDentroDeForo ||
    estaDentroEntrevistaNinos ||
    estaDentroEntrevistaAdultos ||
    estaDentroDePlantillaDiario ||
    esHistorialDiario ||
    esDetalleRegistroDiario ||
    esEditarRegistroDiario;

  // ========================================================
  // RUTAS VISIBLES
  // ========================================================

  const rutasVisibles = state.routes.filter((route) =>
    RUTAS_VISIBLES.includes(route.name),
  );

  const cantidadTabs = rutasVisibles.length;

  const anchoTab = cantidadTabs > 0 ? width / cantidadTabs : width / 5;

  // ========================================================
  // RUTA ACTIVA
  // ========================================================

  const rutaActiva = state.routes[state.index];

  let indiceVisibleActivo = rutasVisibles.findIndex(
    (route) => route.key === rutaActiva?.key,
  );

  // ========================================================
  // TAB ACTIVO
  // ========================================================

  const hayTabActivo = !esRutaSecundariaDeInicio && indiceVisibleActivo !== -1;

  if (indiceVisibleActivo === -1) {
    indiceVisibleActivo = 0;
  }

  // ========================================================
  // ANIMACIÓN
  // ========================================================

  useEffect(() => {
    if (!hayTabActivo) {
      return;
    }

    translateX.value = withSpring(indiceVisibleActivo * anchoTab, {
      damping: 18,
      stiffness: 150,
    });
  }, [indiceVisibleActivo, anchoTab, hayTabActivo, translateX]);

  const estiloCirculoFlotante = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  // ========================================================
  // SVG
  // ========================================================

  const crearCaminoSVG = () => {
    if (!hayTabActivo) {
      return `
        M 0 0
        H ${width}
        V ${ALTURA_BARRA}
        H 0
        Z
      `;
    }

    const centroTab = anchoTab / 2;

    const centroActivo = indiceVisibleActivo * anchoTab + centroTab;

    return `
      M 0 0

      H ${centroActivo - 30}

      C
      ${centroActivo - 30} 0,
      ${centroActivo - 30} 35,
      ${centroActivo} 35

      C
      ${centroActivo + 30} 35,
      ${centroActivo + 30} 0,
      ${centroActivo + 60} 0

      H ${width}

      V ${ALTURA_BARRA}

      H 0

      Z
    `;
  };

  // ========================================================
  // ICONO ACTIVO
  // ========================================================

  const rutaParaIcono = rutasVisibles[indiceVisibleActivo]?.name ?? "home";

  const rutaActivaLimpia = rutaParaIcono.replace("/index", "").split("/")[0];

  // ========================================================
  // OCULTAR BARRA
  // ========================================================

  if (ocultarBarra) {
    return null;
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <View style={styles.container}>
      {/* ==================================================
          FONDO
      ================================================== */}

      <Svg
        width={width}
        height={ALTURA_BARRA}
        style={styles.fondoSvg}
        pointerEvents="none"
      >
        <Path
          d={crearCaminoSVG()}
          fill={tabBarColor}
          stroke={borderColor}
          strokeWidth={1}
        />
      </Svg>

      {/* ==================================================
          CÍRCULO ACTIVO
      ================================================== */}

      {hayTabActivo && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.circuloFlotante,
            {
              width: anchoTab,
            },
            estiloCirculoFlotante,
          ]}
        >
          <View
            style={[
              styles.interiorCirculo,
              {
                backgroundColor: primaryColor,
                shadowColor: primaryColor,
              },
            ]}
          >
            <Ionicons
              name={MAPA_ICONOS[rutaActivaLimpia]?.activo ?? "home"}
              size={25}
              color={textOnPrimaryColor}
            />
          </View>
        </Animated.View>
      )}

      {/* ==================================================
          TABS
      ================================================== */}

      <View
        style={[
          styles.contenedorTabs,
          {
            width,
          },
        ]}
      >
        {rutasVisibles.map((route) => {
          const indiceRutaOriginal = state.routes.findIndex(
            (item) => item.key === route.key,
          );

          const tieneFocusReal = state.index === indiceRutaOriginal;

          const esInicio = route.name === "home";

          const isFocused = hayTabActivo && tieneFocusReal;

          const { options } = descriptors[route.key];

          const nombreLimpio = route.name.replace("/index", "").split("/")[0];

          const configuracionIcono = MAPA_ICONOS[nombreLimpio] ?? {
            inactivo: "ellipse-outline" as keyof typeof Ionicons.glyphMap,

            activo: "ellipse" as keyof typeof Ionicons.glyphMap,
          };

          const tituloTab = options.title ?? nombreLimpio;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              return;
            }

            // --------------------------------
            // HOME
            // --------------------------------

            if (esRutaSecundariaDeInicio && esInicio) {
              navigation.navigate(route.name);
              return;
            }

            // --------------------------------
            // DIARIO
            // --------------------------------

            if (nombreLimpio === "diario") {
              router.replace("/(tabs)/diario" as never);

              return;
            }

            // --------------------------------
            // NAVEGACIÓN NORMAL
            // --------------------------------

            if (!tieneFocusReal) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={
                isFocused
                  ? {
                      selected: true,
                    }
                  : {}
              }
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={[
                styles.tabButton,
                {
                  width: anchoTab,
                },
              ]}
              activeOpacity={0.7}
            >
              {!isFocused && (
                <>
                  <Ionicons
                    name={configuracionIcono.inactivo}
                    size={25}
                    color={tabIconDefault}
                  />

                  <Text
                    style={[
                      styles.textoInactivo,
                      {
                        color: textSecondaryColor,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {tituloTab}
                  </Text>
                </>
              )}

              {isFocused && (
                <Text
                  style={[
                    styles.textoActivo,
                    {
                      color: textColor,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {tituloTab}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ==========================================================
// ESTILOS
// ==========================================================

const styles = StyleSheet.create({
  /*
   * MUY IMPORTANTE:
   *
   * La barra NO se posiciona con bottom: 0.
   *
   * React Navigation es quien coloca este componente
   * en la parte inferior y reserva sus 75px.
   */
  container: {
    width: "100%",

    height: ALTURA_BARRA,

    backgroundColor: "transparent",

    overflow: "visible",

    zIndex: 1000,

    elevation: 1000,
  },

  fondoSvg: {
    position: "absolute",

    left: 0,

    top: 0,

    zIndex: 0,
  },

  contenedorTabs: {
    position: "absolute",

    left: 0,

    top: 0,

    height: ALTURA_BARRA,

    flexDirection: "row",

    zIndex: 2,
  },

  tabButton: {
    height: ALTURA_BARRA,

    justifyContent: "center",

    alignItems: "center",

    paddingTop: 10,
  },

  circuloFlotante: {
    position: "absolute",

    top: -20,

    left: 0,

    alignItems: "center",

    zIndex: 10,

    elevation: 10,
  },

  interiorCirculo: {
    width: 46,

    height: 46,

    borderRadius: 23,

    justifyContent: "center",

    alignItems: "center",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.3,

    shadowRadius: 6,

    elevation: 6,
  },

  textoInactivo: {
    fontFamily: "Nunito-Medium",

    fontSize: 11,

    marginTop: 3,

    textAlign: "center",
  },

  textoActivo: {
    fontFamily: "Nunito-SemiBold",

    fontSize: 11,

    marginTop: 28,

    textAlign: "center",
  },
});
