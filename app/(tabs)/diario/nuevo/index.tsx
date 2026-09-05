import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import TarjetaPlantillaAutorregistro from "@/components/diario/TarjetaPlantillaAutorregistro";

export default function NuevoRegistro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Obtenemos desde donde llego el usuario.
  const { origen } = useLocalSearchParams<{
    origen?: string;
  }>();

  // Regresa al lugar desde donde se abrió "Nuevo Registro".
  const regresar = () => {
    if (origen === "home") {
      router.replace("/(tabs)/home" as never);
      return;
    }

    router.replace("/(tabs)/diario" as never);
  };

  // Abre la plantilla seleccionada y conserva el origen.
  const seleccionarPlantilla = (plantilla: string) => {
    router.push({
      pathname: `/diario/nuevo/${plantilla}` as never,
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
          paddingTop: 16,
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom + 120, 140),
        }}
      >
        {/* Boton para regresar al lugar de origen */}
        <Pressable
          onPress={regresar}
          className="mb-5 h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <Ionicons name="arrow-back" size={22} color="#243B63" />
        </Pressable>

        {/* Encabezado */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="mb-7"
        >
          <Text className="font-nunito-bold text-3xl text-[#243B63]">
            ¿Qué quieres registrar hoy?
          </Text>

          <Text className="mt-2 font-nunito-medium text-base leading-6 text-[#7A89A3]">
            Elige el tipo de autorregistro que mejor se adapte a lo que
            quieres expresar.
          </Text>
        </Animated.View>

        {/* Diario emocional */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <TarjetaPlantillaAutorregistro
            titulo="Diario emocional"
            descripcion="Reconoce lo que sientes, qué lo provocó y cómo reaccionaste."
            icono="heart-outline"
            color="#6C8FE3"
            fondoIcono="#E7EEFF"
            onPress={() => seleccionarPlantilla("emocional")}
          />
        </Animated.View>

        {/* Observando mis pensamientos */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <TarjetaPlantillaAutorregistro
            titulo="Observando mis pensamientos"
            descripcion="Observa una situación, tus pensamientos, sentimientos y reacciones."
            icono="bulb-outline"
            color="#9B82D9"
            fondoIcono="#F0EAFF"
            onPress={() => seleccionarPlantilla("pensamientos")}
          />
        </Animated.View>

        {/* Autorregistro ABC */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <TarjetaPlantillaAutorregistro
            titulo="Autorregistro ABCDE"
            descripcion="Reflexiona sobre una situación, tus creencias y nuevas formas de responder."
            icono="leaf-outline"
            color="#6FA58A"
            fondoIcono="#E8F5EE"
            onPress={() => seleccionarPlantilla("abc")}
          />
        </Animated.View>

        {/* Mensaje de apoyo */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          className="mt-3 rounded-3xl border border-[#E7EAF2] bg-white px-5 py-5"
        >
          <View className="mb-2 flex-row items-center">
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-[#FFF1F5]">
              <Ionicons
                name="heart-outline"
                size={19}
                color="#D58BA5"
              />
            </View>

            <Text className="font-nunito-bold text-base text-[#243B63]">
              Un espacio para ti
            </Text>
          </View>

          <Text className="font-nunito-medium text-sm leading-5 text-[#7A89A3]">
            No existe una forma correcta o incorrecta de registrar lo que
            sientes. Escribe desde tu propia experiencia.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}