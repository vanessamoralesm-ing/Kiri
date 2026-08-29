import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import CategoriaCard from "../../../components/educacion/CategoriaCard";

const categorias = [
  {
    id: "Ansiedad",
    titulo: "Ansiedad",
  },
  {
    id: "Autoestima",
    titulo: "Autoestima",
  },
  {
    id: "Estres",
    titulo: "Estrés",
  },
  {
    id: "Procrastinacion",
    titulo: "Procrastinación",
  },
  {
    id: "Soledad",
    titulo: "Soledad",
  },
];

export default function EducacionScreen() {
  // Abre la categoría seleccionada usando su id en la ruta dinámica.
  const abrirCategoria = (id: string) => {
    router.push(`/educacion/${id}` as any);
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
    >
      <View className="px-6 pt-12">
        <Animated.View entering={FadeInDown.duration(500)}>
          <Text className="text-2xl font-semibold text-blue-500">
            Biblioteca de Bienestar
          </Text>

          <Text className="mt-2 text-[15px] leading-5 text-slate-500">
            Explora herramientas y conocimientos diseñados para acompañarte en
            tu camino hacia una mejor salud mental.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          className="mt-7 flex-row items-center rounded-2xl bg-white px-4 shadow-md"
        >
          <Ionicons name="search-outline" size={27} color="#7C8799" />

          <TextInput
            placeholder="¿Qué tema te gustaría explorar hoy?"
            placeholderTextColor="#A0A7B4"
            className="ml-3 flex-1 py-4 text-[14px] text-slate-700"
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          className="mb-5 mt-8 flex-row items-center justify-between"
        >
          <Text className="text-xl font-medium text-slate-800">Categorías</Text>

          <Text className="text-sm text-blue-500">Ver más</Text>
        </Animated.View>

        <View className="flex-row flex-wrap justify-between gap-y-5">
          {categorias.map((categoria, index) => (
            <Animated.View
              key={categoria.id}
              entering={FadeInDown.delay(250 + index * 80).duration(450)}
              className="w-[48%]"
            >
              <CategoriaCard
                titulo={categoria.titulo}
                onPress={() => abrirCategoria(categoria.id)}
              />
            </Animated.View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
