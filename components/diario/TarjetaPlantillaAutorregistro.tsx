import React from "react";

import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";


interface TarjetaPlantillaAutorregistroProps {
  titulo: string;
  descripcion: string;
  icono: keyof typeof Ionicons.glyphMap;
  color: string;
  fondoIcono: string;
  onPress: () => void;
}


export default function TarjetaPlantillaAutorregistro({
  titulo,
  descripcion,
  icono,
  color,
  fondoIcono,
  onPress,
}: TarjetaPlantillaAutorregistroProps) {
  const {
    width,
  } = useWindowDimensions();

  const esTelefonoPequeno =
    width < 390;

  const esTelefono =
    width < 768;


  const escala =
    useSharedValue(1);

  const estiloAnimado =
    useAnimatedStyle(() => ({
      transform: [
        {
          scale:
            escala.value,
        },
      ],
    }));


  return (
    <Animated.View
      style={estiloAnimado}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          escala.value =
            withSpring(
              0.985,
              {
                damping: 16,
                stiffness: 220,
              }
            );
        }}
        onPressOut={() => {
          escala.value =
            withSpring(
              1,
              {
                damping: 16,
                stiffness: 220,
              }
            );
        }}
        style={{
          minHeight:
            esTelefonoPequeno
              ? 108
              : esTelefono
                ? 114
                : 118,

          borderRadius:
            24,

          borderWidth:
            1,

          borderColor:
            "#E5EAF1",

          backgroundColor:
            "#FFFFFF",

          paddingHorizontal:
            esTelefonoPequeno
              ? 14
              : 16,

          paddingVertical:
            esTelefono
              ? 14
              : 16,

          flexDirection:
            "row",

          alignItems:
            "center",

          shadowColor:
            "#64748B",

          shadowOffset: {
            width: 0,
            height: 4,
          },

          shadowOpacity:
            0.08,

          shadowRadius:
            10,

          elevation:
            2,
        }}
      >
        {/* Icono */}
        <View
          style={{
            width:
              esTelefonoPequeno
                ? 56
                : 60,

            height:
              esTelefonoPequeno
                ? 56
                : 60,

            borderRadius:
              18,

            backgroundColor:
              fondoIcono,

            alignItems:
              "center",

            justifyContent:
              "center",

            flexShrink:
              0,
          }}
        >
          <Ionicons
            name={icono}
            size={
              esTelefonoPequeno
                ? 27
                : 30
            }
            color={color}
          />
        </View>

        {/* Información */}
        <View
          style={{
            flex: 1,
            minWidth: 0,
            marginLeft: 15,
            paddingRight: 10,
          }}
        >
          <Text
            numberOfLines={2}
            className="font-nunito-semibold text-[#1E293B]"
            style={{
              fontSize:
                esTelefonoPequeno
                  ? 15
                  : 16,

              lineHeight:
                esTelefonoPequeno
                  ? 20
                  : 22,
            }}
          >
            {titulo}
          </Text>

          <Text
            numberOfLines={3}
            className="mt-1 font-nunito-medium text-[#64748B]"
            style={{
              fontSize:
                esTelefonoPequeno
                  ? 12
                  : 13,

              lineHeight:
                esTelefonoPequeno
                  ? 17
                  : 18,
            }}
          >
            {descripcion}
          </Text>
        </View>

        {/* Flecha */}
        <View
          style={{
            width:
              esTelefonoPequeno
                ? 38
                : 40,

            height:
              esTelefonoPequeno
                ? 38
                : 40,

            borderRadius:
              20,

            backgroundColor:
              "#F1F5F9",

            alignItems:
              "center",

            justifyContent:
              "center",

            flexShrink:
              0,
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#64748B"
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}