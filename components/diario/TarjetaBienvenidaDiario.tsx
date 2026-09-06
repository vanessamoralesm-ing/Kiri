import React from "react";

import {
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


interface TarjetaBienvenidaDiarioProps {
  nombre: string;

  onNuevoRegistro: () => void;
}


export default function TarjetaBienvenidaDiario({
  nombre,
  onNuevoRegistro,
}: TarjetaBienvenidaDiarioProps) {

  const {
    width,
  } = useWindowDimensions();


  // ======================================================
  // TEMA
  // ======================================================

  const textColor =
    useThemeColor({}, "text");

  const primaryColor =
    useThemeColor({}, "primary");

  const textOnPrimaryColor =
    useThemeColor({}, "textOnPrimary");

  const primarySoftColor =
    useThemeColor({}, "primarySoft");


  // ======================================================
  // RESPONSIVE
  // ======================================================

  const esTelefonoPequeno =
    width < 390;

  const esTelefono =
    width < 768;

  const esTablet =
    width >= 768 &&
    width < 1100;


  // Tamaño responsive del avatar.
  const tamanoAvatar =
    esTelefonoPequeno
      ? 135
      : esTelefono
        ? 160
        : esTablet
          ? 185
          : 200;


  // ======================================================
  // ANIMACIÓN
  // ======================================================

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


  // ======================================================
  // UI
  // ======================================================

  return (
    <Animated.View
      entering={
        FadeInDown.duration(450)
      }
    >

      {/* ==================================================
          BIENVENIDA CON AVATAR
      ================================================== */}

      <View
        style={{
          marginBottom: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >

        {/* TEXTO */}

        <View
          style={{
            flex: 1,

            paddingRight:
              esTelefonoPequeno
                ? 4
                : 10,
          }}
        >
          <Text
            style={{
              fontFamily:
                "Nunito-Bold",

              fontSize:
                esTelefonoPequeno
                  ? 22
                  : 24,

              lineHeight:
                32,

              textAlign:
                "left",

              color:
                textColor,
            }}
          >
            ¿Qué agregarás hoy a tu{"\n"}
            Diario,{" "}

            <Text
              style={{
                color:
                  primaryColor,
              }}
            >
              {nombre}
            </Text>

            ?
          </Text>
        </View>


        {/* AVATAR */}

        <View
          style={{
            width:
              tamanoAvatar,

            height:
              tamanoAvatar,

            flexShrink:
              0,

            alignItems:
              "center",

            justifyContent:
              "center",
          }}
        >
          <Image
            source={
              require(
                "@/assets/images_kids/avatar_pregunta.png"
              )
            }
            style={{
              width:
                "100%",

              height:
                "100%",

              transform: [
                {
                  scale:
                    1.28,
                },
              ],
            }}
            resizeMode="contain"
          />
        </View>

      </View>


      {/* ==================================================
          BOTÓN NUEVO REGISTRO
      ================================================== */}

      <Animated.View
        style={
          estiloAnimado
        }
      >
        <Pressable
          onPress={
            onNuevoRegistro
          }
          onPressIn={() => {
            escala.value =
              withSpring(0.95);
          }}
          onPressOut={() => {
            escala.value =
              withSpring(1);
          }}
          style={{
            flexDirection:
              "row",

            alignItems:
              "center",

            paddingHorizontal:
              20,

            paddingVertical:
              20,

            borderRadius:
              24,

            backgroundColor:
              primaryColor,

            elevation:
              5,

            shadowColor:
              primaryColor,

            shadowOffset: {
              width:
                0,

              height:
                5,
            },

            shadowOpacity:
              0.2,

            shadowRadius:
              8,
          }}
        >

          {/* ==================================================
              ICONO LÁPIZ
          ================================================== */}

          <View
            style={{
              width:
                64,

              height:
                64,

              borderRadius:
                32,

              alignItems:
                "center",

              justifyContent:
                "center",

              backgroundColor:
                textOnPrimaryColor,
            }}
          >
            <Ionicons
              name="create-outline"
              size={31}
              color={primaryColor}
            />
          </View>


          {/* ==================================================
              TEXTO
          ================================================== */}

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
                  19,

                color:
                  textOnPrimaryColor,
              }}
            >
              Nuevo Registro
            </Text>

            <Text
              style={{
                marginTop:
                  4,

                fontFamily:
                  "Nunito-Medium",

                fontSize:
                  14,

                lineHeight:
                  20,

                color:
                  primarySoftColor,
              }}
            >
              Registra cómo te sientes y lo que pasó hoy.
            </Text>
          </View>


          {/* ==================================================
              FLECHA
          ================================================== */}

          <View
            style={{
              width:
                48,

              height:
                48,

              borderRadius:
                24,

              alignItems:
                "center",

              justifyContent:
                "center",

              backgroundColor:
                textOnPrimaryColor,
            }}
          >
            <Ionicons
              name="arrow-forward"
              size={27}
              color={primaryColor}
            />
          </View>

        </Pressable>
      </Animated.View>

    </Animated.View>
  );
}