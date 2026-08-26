import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const TAB_COUNT = 5;
const TAB_WIDTH = width / TAB_COUNT;

const MAPA_ICONOS: Record<
  string,
  { inactivo: keyof typeof Ionicons.glyphMap; activo: keyof typeof Ionicons.glyphMap }
> = {
  home: { inactivo: 'home-outline', activo: 'home' },
  diario: { inactivo: 'book-outline', activo: 'book' },
  educacion: { inactivo: 'school-outline', activo: 'school' },
  tecnicas: { inactivo: 'heart-outline', activo: 'heart' },
  perfil: { inactivo: 'person-outline', activo: 'person' },
};

export function BarraNavegacionCurva({ state, descriptors, navigation }: BottomTabBarProps) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(state.index * TAB_WIDTH, {
      damping: 18,
      stiffness: 150,
    });
  }, [state.index]);

  const estiloCirculoFlotante = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const crearCaminoSVG = () => {
    const cX = TAB_WIDTH / 2;
    return `
      M 0 0
      H ${state.index * TAB_WIDTH + cX - 30}
      C ${state.index * TAB_WIDTH + cX - 30} 0, ${state.index * TAB_WIDTH + cX - 30} 35, ${state.index * TAB_WIDTH + cX} 35
      C ${state.index * TAB_WIDTH + cX + 30} 35, ${state.index * TAB_WIDTH + cX + 30} 0, ${state.index * TAB_WIDTH + cX + 60} 0
      H ${width}
      V 75
      H 0
      Z
    `;
  };

  const rutaActivaLimpia = state.routes[state.index].name.replace('/index', '');
  const tituloActivo = descriptors[state.routes[state.index].key].options.title || rutaActivaLimpia;

  return (
    <View style={styles.container}>
      {/* SVG del fondo */}
      <Svg width={width} height={75} style={StyleSheet.absoluteFill}>
        <Path 
          d={crearCaminoSVG()} 
          fill="#FFFFFF"
          stroke="#9fa2a7"
          strokeWidth={1} 
        />
      </Svg>

      {/* Círculo Flotante Azul */}
      <Animated.View style={[styles.circuloFlotante, estiloCirculoFlotante]}>
        <View style={styles.interiorCirculo}>
          <Ionicons
            name={MAPA_ICONOS[rutaActivaLimpia]?.activo || 'ellipse'}
            size={25}//cambiando tamaño de icono seleccionado
            color="#FFFFFF"
          />
        </View>
      </Animated.View>

      {/* Pestañas de la barra */}
      <View style={styles.contenedorTabs}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const nombreLimpio = route.name.replace('/index', '');
          const configuracionIcono = MAPA_ICONOS[nombreLimpio] || {
            inactivo: 'ellipse-outline',
            activo: 'ellipse',
          };

          const tituloTab = options.title || nombreLimpio;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              {!isFocused && (
                <>
                  <Ionicons
                    name={configuracionIcono.inactivo}
                    size={28}//cambiar tamaño del icono sin seleccionar
                    color="#5a6677"
                  />
                  <Text style={styles.textoInactivo} numberOfLines={1}>
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
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 75,
    backgroundColor: 'transparent',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contenedorTabs: {
    flexDirection: 'row',
    height: 75,
    width: width,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  circuloFlotante: {
    position: 'absolute',
    top: -20,
    width: TAB_WIDTH,
    alignItems: 'center',
    zIndex: 10,
  },
  interiorCirculo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#4F8EF7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  textoInactivo: {
    fontSize: 12,
    color: '#5a6677',
    marginTop: 3,
    textAlign: 'center',
  },
});