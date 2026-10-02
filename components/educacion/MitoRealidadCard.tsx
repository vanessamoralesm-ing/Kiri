import {
  Ionicons,
} from "@expo/vector-icons";

import React, {
  useState,
} from "react";

import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// PROPS
// ==========================================================

type MitoRealidadCardProps = {
  mito: string;
  realidad: string;
};


// ==========================================================
// COMPONENTE
// ==========================================================

export default function MitoRealidadCard({
  mito,
  realidad,
}: MitoRealidadCardProps) {

  // ========================================================
  // ESTADO
  // ========================================================

  // Controla cuál card está abierto
  const [
    tarjetaAbierta,
    setTarjetaAbierta,
  ] = useState<"mito" | "realidad" | null>(
    null
  );


  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const surfaceColor =
    useThemeColor(
      {},
      "surface"
    );

  const textColor =
    useThemeColor(
      {},
      "text"
    );

  const textSecondaryColor =
    useThemeColor(
      {},
      "textSecondary"
    );

  const borderColor =
    useThemeColor(
      {},
      "border"
    );

  const accentColor =
    useThemeColor(
      {},
      "accent"
    );

  const accentSoftColor =
    useThemeColor(
      {},
      "accentSoft"
    );

  const secondaryColor =
    useThemeColor(
      {},
      "secondary"
    );

  const secondarySoftColor =
    useThemeColor(
      {},
      "secondarySoft"
    );


  // ========================================================
  // DATOS DEL CARD ABIERTO
  // ========================================================

  const esMito =
    tarjetaAbierta === "mito";

  // Cambia el título según el card
  const tituloTarjeta =
    esMito
      ? "Mito"
      : "Realidad";

  // Cambia la información
  const contenidoTarjeta =
    esMito
      ? mito
      : realidad;

  // Cambia el color
  const colorTarjeta =
    esMito
      ? accentColor
      : secondaryColor;

  // Cambia el fondo
  const fondoTarjeta =
    esMito
      ? accentSoftColor
      : secondarySoftColor;

  // Cambia el icono
  const iconoTarjeta =
    esMito
      ? "bulb-outline"
      : "checkmark-circle-outline";


  // ========================================================
  // UI
  // ========================================================

  return (

    <Animated.View
      entering={
        FadeInDown
          .delay(200)
          .duration(450)
      }
    >

      {/* ==================================================
          DOS CARDS PEQUEÑOS
          ================================================== */}

      {tarjetaAbierta === null && (

        <View className="flex-row">

          {/* MITO */}

          <Pressable
            onPress={() =>
              setTarjetaAbierta(
                "mito"
              )
            }
            className="mr-2 flex-1"
            style={({
              pressed,
            }) => ({
              opacity:
                pressed
                  ? 0.78
                  : 1,
            })}
          >

            <View
              className="items-center justify-center rounded-[22px] border px-3 py-6"
              style={{
                minHeight:
                  135,

                borderColor:
                  accentColor,

                backgroundColor:
                  accentSoftColor,

                shadowColor:
                  "#000000",

                shadowOffset: {
                  width: 0,
                  height: 2,
                },

                shadowOpacity:
                  0.06,

                shadowRadius:
                  5,

                elevation:
                  2,
              }}
            >

              {/* Icono */}

              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor:
                    surfaceColor,
                }}
              >
                <Ionicons
                  name="bulb-outline"
                  size={25}
                  color={
                    accentColor
                  }
                />
              </View>


              {/* Título */}

              <Text
                className="mt-3 font-nunito-bold text-base"
                style={{
                  color:
                    accentColor,
                }}
              >
                Mito
              </Text>


              {/* Acción */}

              <View className="mt-2 flex-row items-center">

                <Text
                  className="font-nunito-semibold text-xs"
                  style={{
                    color:
                      textSecondaryColor,
                  }}
                >
                  Toca para leer
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={
                    accentColor
                  }
                  style={{
                    marginLeft: 2,
                  }}
                />

              </View>

            </View>

          </Pressable>


          {/* REALIDAD */}

          <Pressable
            onPress={() =>
              setTarjetaAbierta(
                "realidad"
              )
            }
            className="ml-2 flex-1"
            style={({
              pressed,
            }) => ({
              opacity:
                pressed
                  ? 0.78
                  : 1,
            })}
          >

            <View
              className="items-center justify-center rounded-[22px] border px-3 py-6"
              style={{
                minHeight:
                  135,

                borderColor:
                  secondaryColor,

                backgroundColor:
                  secondarySoftColor,

                shadowColor:
                  "#000000",

                shadowOffset: {
                  width: 0,
                  height: 2,
                },

                shadowOpacity:
                  0.06,

                shadowRadius:
                  5,

                elevation:
                  2,
              }}
            >

              {/* Icono */}

              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor:
                    surfaceColor,
                }}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={27}
                  color={
                    secondaryColor
                  }
                />
              </View>


              {/* Título */}

              <Text
                className="mt-3 font-nunito-bold text-base"
                style={{
                  color:
                    secondaryColor,
                }}
              >
                Realidad
              </Text>


              {/* Acción */}

              <View className="mt-2 flex-row items-center">

                <Text
                  className="font-nunito-semibold text-xs"
                  style={{
                    color:
                      textSecondaryColor,
                  }}
                >
                  Toca para leer
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={
                    secondaryColor
                  }
                  style={{
                    marginLeft: 2,
                  }}
                />

              </View>

            </View>

          </Pressable>

        </View>

      )}


      {/* ==================================================
          CARD GRANDE
          ================================================== */}

      {tarjetaAbierta !== null && (

        <Animated.View
          entering={
            FadeInDown.duration(
              300
            )
          }
          className="overflow-hidden rounded-[24px] border"
          style={{
            borderColor:
              colorTarjeta,

            backgroundColor:
              surfaceColor,

            shadowColor:
              "#000000",

            shadowOffset: {
              width: 0,
              height: 3,
            },

            shadowOpacity:
              0.09,

            shadowRadius:
              8,

            elevation:
              4,
          }}
        >

          {/* PARTE SUPERIOR */}

          <View
            className="p-5"
            style={{
              backgroundColor:
                fondoTarjeta,
            }}
          >

            <View className="flex-row items-center">

              {/* Icono */}

              <View
                className="h-12 w-12 items-center justify-center rounded-[14px]"
                style={{
                  backgroundColor:
                    surfaceColor,
                }}
              >
                <Ionicons
                  name={
                    iconoTarjeta
                  }
                  size={26}
                  color={
                    colorTarjeta
                  }
                />
              </View>


              {/* Título */}

              <View className="ml-3 flex-1">

                <Text
                  className="font-nunito-bold text-lg"
                  style={{
                    color:
                      textColor,
                  }}
                >
                  {tituloTarjeta}
                </Text>

                {/* Línea de color */}

                <View
                  className="mt-2 h-[5px] rounded-full"
                  style={{
                    width:
                      80,

                    backgroundColor:
                      colorTarjeta,
                  }}
                />

              </View>


              {/* BOTÓN X */}

              <Pressable
                onPress={() =>
                  setTarjetaAbierta(
                    null
                  )
                }
                hitSlop={10}
                className="h-10 w-10 items-center justify-center rounded-full"
                style={({
                  pressed,
                }) => ({
                  backgroundColor:
                    surfaceColor,

                  opacity:
                    pressed
                      ? 0.65
                      : 1,
                })}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={
                    colorTarjeta
                  }
                />
              </Pressable>

            </View>

          </View>


          {/* ==================================================
              CONTENIDO CON SCROLL
              ================================================== */}

          <View className="p-5">

            {/* Información completa */}

            <ScrollView
              style={{
                maxHeight:
                  86,
              }}
              nestedScrollEnabled
              showsVerticalScrollIndicator
              contentContainerStyle={{
                paddingRight:
                  8,
              }}
            >
              <Text
                className="font-nunito-semibold text-[15px] leading-7"
                style={{
                  color:
                    textSecondaryColor,
                }}
              >
                {contenidoTarjeta}
              </Text>
            </ScrollView>


            {/* LÍNEA DECORATIVA */}

            <View
              className="mt-5 h-px"
              style={{
                backgroundColor:
                  borderColor,
              }}
            />


            {/* BOTÓN TERMINAR */}

            <Pressable
              onPress={() =>
                setTarjetaAbierta(
                  null
                )
              }
              className="mt-5 flex-row items-center justify-center rounded-[14px] py-3"
              style={({
                pressed,
              }) => ({
                backgroundColor:
                  fondoTarjeta,

                opacity:
                  pressed
                    ? 0.7
                    : 1,
              })}
            >

              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={
                  colorTarjeta
                }
              />

              <Text
                className="ml-2 font-nunito-bold text-sm"
                style={{
                  color:
                    colorTarjeta,
                }}
              >
                Terminar
              </Text>

            </Pressable>

          </View>

        </Animated.View>

      )}

    </Animated.View>

  );
}