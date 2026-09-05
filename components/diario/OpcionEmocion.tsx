import React from "react";

import {
  Pressable,
  Text,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";


interface OpcionEmocionProps {
  nombre: string;
  emoji: string;
  seleccionada: boolean;
  ancho: number;
  onPress: () => void;
}


const AnimatedPressable =
  Animated.createAnimatedComponent(
    Pressable
  );


export function OpcionEmocion({
  nombre,
  emoji,
  seleccionada,
  ancho,
  onPress,
}: OpcionEmocionProps) {
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


  const presionar =
    () => {
      escala.value =
        withSpring(
          0.96,
          {
            damping:
              15,

            stiffness:
              230,
          }
        );

      setTimeout(
        () => {
          escala.value =
            withSpring(
              1,
              {
                damping:
                  15,

                stiffness:
                  230,
              }
            );
        },
        80
      );

      onPress();
    };


  return (
    <AnimatedPressable
      onPress={
        presionar
      }
      style={[
        estiloAnimado,

        {
          width:
            ancho,

          minHeight:
            125,

          paddingHorizontal:
            8,

          paddingVertical:
            16,

          borderRadius:
            20,

          borderWidth:
            seleccionada
              ? 2
              : 1.5,

          borderColor:
            seleccionada
              ? "#60A5FA"
              : "#E6EBF2",

          backgroundColor:
            seleccionada
              ? "#EFF6FF"
              : "#FFFFFF",

          alignItems:
            "center",

          justifyContent:
            "center",

          shadowColor:
            "#64748B",

          shadowOffset: {
            width:
              0,

            height:
              3,
          },

          shadowOpacity:
            seleccionada
              ? 0.12
              : 0.07,

          shadowRadius:
            7,

          elevation:
            2,
        },
      ]}
    >
      <Text
        style={{
          fontSize:
            34,

          lineHeight:
            42,
        }}
      >
        {emoji}
      </Text>


      <Text
        numberOfLines={1}
        style={{
          marginTop:
            8,

          width:
            "100%",

          textAlign:
            "center",

          fontFamily:
            seleccionada
              ? "Nunito-Bold"
              : "Nunito-Medium",

          fontSize:
            14,

          color:
            seleccionada
              ? "#2563EB"
              : "#475569",
        }}
      >
        {nombre}
      </Text>
    </AnimatedPressable>
  );
}