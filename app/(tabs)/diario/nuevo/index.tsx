import React from "react";

import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import TarjetaPlantillaAutorregistro from "@/components/diario/TarjetaPlantillaAutorregistro";


export default function NuevoRegistro() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const {
    width,
  } = useWindowDimensions();

  const {
    origen,
  } = useLocalSearchParams<{
    origen?: string;
  }>();

  const esTelefono =
    width < 768;

  const esTablet =
    width >= 768 &&
    width < 1100;

  const esWeb =
    width >= 1100;

  const maxWidthContenido =
    esWeb
      ? 820
      : esTablet
        ? 760
        : undefined;


  const regresar = () => {
    if (origen === "home") {
      router.replace(
        "/(tabs)/home" as never
      );

      return;
    }

    router.replace(
      "/(tabs)/diario" as never
    );
  };


  const seleccionarPlantilla = (
    plantilla: string
  ) => {
    router.push({
      pathname:
        `/diario/nuevo/${plantilla}` as never,

      params: {
        origen,
      },
    });
  };


  return (
    <View className="flex-1 bg-[#F8FBFF]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom:
            Math.max(
              insets.bottom + 70,
              90
            ),
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: maxWidthContenido,
            alignSelf: "center",
            paddingHorizontal:
              esTelefono
                ? 20
                : 28,
            paddingTop:
              esTelefono
                ? 18
                : 26,
          }}
        >
          {/* Boton regresar */}
          <Pressable
            onPress={regresar}
            hitSlop={8}
            className="mb-7 h-12 w-12 items-center justify-center rounded-[18px] border border-slate-100 bg-white shadow-sm"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#243B63"
            />
          </Pressable>

          {/* Encabezado */}
          <Animated.View
            entering={
              FadeInDown.duration(400)
            }
            className="mb-8"
          >
            <Text
              className="font-nunito-bold text-[#243B63]"
              style={{
                fontSize:
                  esTelefono
                    ? 30
                    : 34,

                lineHeight:
                  esTelefono
                    ? 38
                    : 42,
              }}
            >
              ¿Qué quieres registrar hoy?
            </Text>

            <Text
              className="mt-2 font-nunito-medium text-[#7A89A3]"
              style={{
                fontSize:
                  esTelefono
                    ? 15
                    : 16,

                lineHeight:
                  esTelefono
                    ? 22
                    : 24,
              }}
            >
              Elige el tipo de autorregistro que mejor se adapte a lo que
              quieres expresar.
            </Text>
          </Animated.View>

          {/* Tarjetas */}
          <View>
            <Animated.View
              entering={
                FadeInDown
                  .delay(100)
                  .duration(400)
              }
              style={{
                marginBottom:
                  esTelefono
                    ? 16
                    : 20,
              }}
            >
              <TarjetaPlantillaAutorregistro
                titulo="Diario emocional"
                descripcion="Reconoce lo que sientes, qué lo provocó y cómo reaccionaste."
                icono="heart-outline"
                color="#6C8FE3"
                fondoIcono="#E7EEFF"
                onPress={() =>
                  seleccionarPlantilla(
                    "emocional"
                  )
                }
              />
            </Animated.View>

            <Animated.View
              entering={
                FadeInDown
                  .delay(180)
                  .duration(400)
              }
              style={{
                marginBottom:
                  esTelefono
                    ? 16
                    : 20,
              }}
            >
              <TarjetaPlantillaAutorregistro
                titulo="Observando mis pensamientos"
                descripcion="Observa una situación, tus pensamientos, sentimientos y reacciones."
                icono="bulb-outline"
                color="#9B82D9"
                fondoIcono="#F0EAFF"
                onPress={() =>
                  seleccionarPlantilla(
                    "pensamientos"
                  )
                }
              />
            </Animated.View>

            <Animated.View
              entering={
                FadeInDown
                  .delay(260)
                  .duration(400)
              }
            >
              <TarjetaPlantillaAutorregistro
                titulo="Autorregistro ABCDE"
                descripcion="Reflexiona sobre una situación, tus creencias y nuevas formas de responder."
                icono="leaf-outline"
                color="#6FA58A"
                fondoIcono="#E8F5EE"
                onPress={() =>
                  seleccionarPlantilla(
                    "abc"
                  )
                }
              />
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}