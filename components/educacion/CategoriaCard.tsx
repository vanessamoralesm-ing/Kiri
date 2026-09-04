import React from "react";

import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

// ========
// PROPS
// ========

type CategoriaCardProps = {
  titulo: string;
  imagen?: ImageSourcePropType;
  onPress: () => void;
};

// ========
// COMPONENTE
// ========

export default function CategoriaCard({
  titulo,
  imagen,
  onPress,
}: CategoriaCardProps) {

  // ======
  // ANIMACIÓN
  // ======

  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: escala.value,
        },
      ],
    };
  });

  // ======
  // COLORES DEL TEMA
  // ======

  const surfaceColor = useThemeColor(
    {},
    "surface"
  );

  const textColor = useThemeColor(
    {},
    "text"
  );

  const borderColor = useThemeColor(
    {},
    "border"
  );

  // UI //

  return (
    <Animated.View
      style={[
        estiloAnimado,
        {
          width: "100%",
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          escala.value = withSpring(0.96);
        }}
        onPressOut={() => {
          escala.value = withSpring(1);
        }}
        style={({ pressed }) => ({
          height: 210,

          paddingHorizontal: 16,

          alignItems: "center",

          justifyContent: "center",

          borderRadius: 20,

          borderWidth: 1,

          borderColor,

          backgroundColor: surfaceColor,

          opacity: pressed ? 0.9 : 1,

          shadowColor: "#000000",

          shadowOffset: {
            width: 0,
            height: 3,
          },

          shadowOpacity: 0.08,

          shadowRadius: 8,

          elevation: 3,
        })}
      >

        {/*IMAGEN*/}

        <View
          style={{
            width: 130,

            height: 120,

            alignItems: "center",

            justifyContent: "center",

            alignSelf: "center",

            marginBottom: 18,

            overflow: "hidden",

            borderRadius: 16,
          }}
        >
          {imagen && (
            <Image
              source={imagen}
              style={{
                width: "100%",

                height: "100%",

                alignSelf: "center",
              }}
              resizeMode="cover"
            />
          )}
        </View>

        {/*TÍTULO*/}

        <Text
          style={{
            fontFamily: "Nunito-SemiBold",

            fontSize: 18,

            textAlign: "center",

            color: textColor,
          }}
        >
          {titulo}
        </Text>

      </Pressable>
    </Animated.View>
  );
}