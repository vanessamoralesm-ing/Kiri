import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { OpcionEmocion } from "@/components/diario/OpcionEmocion";
import { CampoPreguntaDiario } from "@/components/diario/CampoPreguntaDiario";
import Button from "@/components/ui/Button";
const EMOCIONES = [
  { nombre: "Alegría", emoji: "😊" },
  { nombre: "Tristeza", emoji: "😢" },
  { nombre: "Ansiedad", emoji: "😰" },
  { nombre: "Miedo", emoji: "😨" },
  { nombre: "Enojo", emoji: "😡" },
  { nombre: "Calma", emoji: "😌" },
  { nombre: "Frustración", emoji: "😤" },
  { nombre: "Culpa", emoji: "😔" },
  { nombre: "Vergüenza", emoji: "😳" },
  { nombre: "Esperanza", emoji: "🌱" },
];

export default function NuevoAutorregistro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { plantilla, origen } = useLocalSearchParams<{
    plantilla?: string;
    origen?: string;
  }>();

  const [emocion, setEmocion] = useState("");
  const [motivo, setMotivo] = useState("");
  const [reaccion, setReaccion] = useState("");
  const [ideaUtil, setIdeaUtil] = useState("");

  // Regresa a la lista de tipos de autorregistro.
  // Regresa a la lista de tipos de autorregistro o al historial previo
  const regresar = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: "/diario/nuevo" as never,
        params: { origen },
      });
    }
  };

  // La plantilla Diario Emocional
  if (plantilla !== "emocional") {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FBFF] px-6">
        <Text className="text-center font-nunito-bold text-xl text-gray-700">
          Plantilla no disponible
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FBFF]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 12,
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom + 130, 150),
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="mb-5 flex-row items-center justify-between"
        >
          <Pressable
            onPress={regresar}
            className="h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-white"
          >
            <Ionicons name="arrow-back" size={22} color="#1E3A5F" />
          </Pressable>

          <View className="flex-1 px-3">
            <Text className="font-nunito-bold text-[30px] font-[700] text-['#4F8EF7']">
              Diario Emocional
            </Text>

            <Text className="font-nunito-medium text-[16px] text-['#9096a3']">
              Tu espacio seguro para expresar lo que sientes
            </Text>
          </View>

          <Pressable className="h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-white">
            <Ionicons name="calendar-outline" size={23} color="#243B63" />
          </Pressable>
        </Animated.View>

        {/* Tarjeta de bienvenida */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          className="relative mb-7 min-h-[185px] overflow-hidden rounded-[24px] bg-[#E9F1FF] px-6 py-6"
        >
          {/* Decoraciones de fondo */}
          <View className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#D9E5FF]" />
          <View className="absolute -bottom-12 right-16 h-32 w-32 rounded-full bg-[#E8DFFF]" />
          <View className="absolute -left-8 bottom-[-35px] h-28 w-28 rounded-full bg-[#F7E0EF]" />

          {/* Pequeños detalles decorativos */}
          <View className="absolute right-24 top-8 h-3 w-3 rounded-full bg-[#AFC7F5]" />
          <View className="absolute right-12 bottom-8 h-2 w-2 rounded-full bg-[#BFA9E8]" />

          <View className="w-[58%]">
            <Text className="font-nunito-bold text-[23px] font-[700] leading-7 text-[#2D3748]">
              ¿Cómo te{"\n"}sientes hoy?
            </Text>

            <Text className="mt-3 font-nunito-medium text-[16px] leading-5 text-[#61718E]">
              Reconocer tus emociones es el primer paso para entenderte mejor.
            </Text>
          </View>

          {/* Ilustracion sencilla mientras colocamos el asset definitivo */}
          <View className="absolute bottom-5 right-5 h-[115px] w-[115px] items-center justify-center rounded-[28px] bg-[#7EA8EE] rotate-[-5deg]">
            <View className="h-[85px] w-[65px] items-center justify-center rounded-xl bg-[#5E8FE4]">
              <Ionicons name="heart" size={34} color="white" />
            </View>

            <View className="absolute -right-2 bottom-4 h-8 w-4 rounded-full bg-[#365FAD]" />
          </View>
        </Animated.View>

        {/* Seleccion de emocion */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          className="mb-6"
        >
          <Text className="mb-1 font-nunito-bold text-[20px] text-['#2D3748']">
            ¿Cómo me siento hoy?
          </Text>

          <Text className="mb-4 font-nunito-medium text-[14px] leading-5 text-[#7A89A3]">
            Elige la emoción que mejor representa cómo te sientes.
          </Text>

          <View className="flex-row flex-wrap justify-between gap-y-3">
            {EMOCIONES.map((item) => (
              <OpcionEmocion
                key={item.nombre}
                nombre={item.nombre}
                emoji={item.emoji}
                seleccionada={emocion === item.nombre}
                onPress={() => setEmocion(item.nombre)}
              />
            ))}
          </View>
        </Animated.View>

        {/* Preguntas de reflexion */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
        >
          <CampoPreguntaDiario
            titulo="¿Qué me hizo sentir así?"
            valor={motivo}
            onChangeText={setMotivo}
            placeholder="Cuéntanos qué ocurrió..."
          />

          <CampoPreguntaDiario
            titulo="¿Cómo reaccioné?"
            valor={reaccion}
            onChangeText={setReaccion}
            placeholder="¿Qué hiciste o cómo respondiste?"
          />

          <CampoPreguntaDiario
            titulo="Una idea útil"
            valor={ideaUtil}
            onChangeText={setIdeaUtil}
            placeholder="¿Qué te gustaría recordar de esta experiencia?"
          />
        </Animated.View>

        {/* Boton de guardar */}
       <Animated.View entering={FadeInDown.delay(400).duration(500)} className="mt-3">
          <Button
            title="Guardar registro"
            onPress={() => {
              console.log({
                emocion,
                motivo,
                reaccion,
                ideaUtil,
              });
            }}
          />
      </Animated.View>
      </ScrollView>
    </View>
  );
}