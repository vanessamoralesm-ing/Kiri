import React, { useEffect } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import Svg, { Path } from "react-native-svg";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";

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

// Pestañas que queremos mostrar realmente
const RUTAS_VISIBLES = [
  "home",
  "diario/index",
  "educacion/index",
  "tecnicas/index",
  "perfil/index",
];

export function BarraNavegacionCurva({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  // Se actualiza automáticamente cuando cambia el tamaño de pantalla
  const { width } = useWindowDimensions();

  // Filtramos únicamente las cinco pestañas principales
  const rutasVisibles = state.routes.filter((route) =>
    RUTAS_VISIBLES.includes(route.name)
  );

  const cantidadTabs = rutasVisibles.length;

  const anchoTab =
    cantidadTabs > 0
      ? width / cantidadTabs
      : width / 5;

  const translateX = useSharedValue(0);

  // Ruta actualmente seleccionada
  const rutaActiva = state.routes[state.index];

  // Buscamos su posición dentro de las rutas visibles
  let indiceVisibleActivo = rutasVisibles.findIndex(
    (route) => route.key === rutaActiva.key
  );

  /*
   * Si estamos en una pantalla secundaria como /cuestionarios,
   * la consideramos parte de Inicio.
   */
  if (indiceVisibleActivo === -1) {
    indiceVisibleActivo = 0;
  }

  useEffect(() => {
    translateX.value = withSpring(
      indiceVisibleActivo * anchoTab,
      {
        damping: 18,
        stiffness: 150,
      }
    );
  }, [
    indiceVisibleActivo,
    anchoTab,
    translateX,
  ]);

  const estiloCirculoFlotante =
    useAnimatedStyle(() => ({
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    }));

  const crearCaminoSVG = () => {
    const centroTab = anchoTab / 2;

    const centroActivo =
      indiceVisibleActivo * anchoTab +
      centroTab;

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

      V 75

      H 0

      Z
    `;
  };

  /*
   * Si estamos en una pantalla secundaria como cuestionarios,
   * usamos Inicio como referencia para el círculo.
   */
  const rutaParaIcono =
    indiceVisibleActivo >= 0
      ? rutasVisibles[indiceVisibleActivo]?.name
      : "home";

  const rutaActivaLimpia =
    rutaParaIcono
      ?.replace("/index", "")
      .split("/")[0] ?? "home";

  return (
    <View
      style={[
        styles.container,
        {
          width,
        },
      ]}
    >
      {/* Fondo curvo */}
      <Svg
        width={width}
        height={75}
        style={StyleSheet.absoluteFill}
      >
        <Path
          d={crearCaminoSVG()}
          fill="#FFFFFF"
          stroke="#9FA2A7"
          strokeWidth={1}
        />
      </Svg>

      {/* Círculo flotante */}
      <Animated.View
        style={[
          styles.circuloFlotante,
          {
            width: anchoTab,
          },
          estiloCirculoFlotante,
        ]}
      >
        <View style={styles.interiorCirculo}>
          <Ionicons
            name={
              MAPA_ICONOS[rutaActivaLimpia]
                ?.activo || "home"
            }
            size={25}
            color="#FFFFFF"
          />
        </View>
      </Animated.View>

      {/* Pestañas */}
      <View
        style={[
          styles.contenedorTabs,
          {
            width,
          },
        ]}
      >
        {rutasVisibles.map((route) => {
          const indiceRutaOriginal =
            state.routes.findIndex(
              (item) => item.key === route.key
            );

          const isFocused =
            state.index === indiceRutaOriginal;

          const { options } =
            descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (
              !isFocused &&
              !event.defaultPrevented
            ) {
              navigation.navigate(route.name);
            }
          };

          const nombreLimpio = route.name
            .replace("/index", "")
            .split("/")[0];

          const configuracionIcono =
            MAPA_ICONOS[nombreLimpio] || {
              inactivo: "ellipse-outline",
              activo: "ellipse",
            };

          const tituloTab =
            options.title || nombreLimpio;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={
                isFocused
                  ? { selected: true }
                  : {}
              }
              accessibilityLabel={
                options.tabBarAccessibilityLabel
              }
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
                    name={
                      configuracionIcono.inactivo
                    }
                    size={25}
                    color="#5A6677"
                  />

                  <Text
                    style={styles.textoInactivo}
                    numberOfLines={1}
                  >
                    {tituloTab}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    bottom: 0,

    height: 75,

    backgroundColor: "transparent",

    elevation: 8,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: -2,
    },

    shadowOpacity: 0.1,

    shadowRadius: 4,
  },

  contenedorTabs: {
    flexDirection: "row",

    height: 75,
  },

  tabButton: {
    height: 75,

    justifyContent: "center",

    alignItems: "center",

    paddingTop: 10,
  },

  circuloFlotante: {
    position: "absolute",

    top: -20,

    alignItems: "center",

    zIndex: 10,
  },

  interiorCirculo: {
    width: 46,

    height: 46,

    borderRadius: 23,

    backgroundColor: "#4F8EF7",

    justifyContent: "center",

    alignItems: "center",

    shadowColor: "#4F8EF7",

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

    color: "#5A6677",

    marginTop: 3,

    textAlign: "center",
  },
});