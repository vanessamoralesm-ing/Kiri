import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import CategoriaCard from "../../../components/educacion/CategoriaCard";
import LecturaRecomendadaCard from "../../../components/educacion/LecturaRecomendadaCard";
import MitoRealidadCard from "../../../components/educacion/MitoRealidadCard";

// Categorías que después podrán obtenerse desde Supabase.
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
  // Abre la categoría seleccionada utilizando su id en la ruta dinámica.
  const abrirCategoria = (id: string) => {
    router.push(`/educacion/${id}` as any);
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 130,
      }}
    >
      <View className="px-6 pt-12">

        {/* Encabezado principal de Psicoeducación. */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <Text
            className="text-[24px] text-blue-500"
            style={{
              fontFamily: "Nunito-Bold",
            }}
          >
            Biblioteca de Bienestar
          </Text>

          <Text
            className="mt-2 text-[15px] leading-5 text-slate-500"
            style={{
              fontFamily: "Nunito-Medium",
            }}
          >
            Explora herramientas y conocimientos diseñados para acompañarte en
            tu camino hacia una mejor salud mental.
          </Text>
        </Animated.View>

        {/* Buscador de contenido de Psicoeducación. */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          className="mt-7 flex-row items-center rounded-2xl bg-white px-4 shadow-md"
        >
          <Ionicons
            name="search-outline"
            size={27}
            color="#7C8799"
          />

          <TextInput
            placeholder="¿Qué tema te gustaría explorar hoy?"
            placeholderTextColor="#A0A7B4"
            className="ml-3 flex-1 py-4 text-[14px] text-slate-700"
            style={{
              fontFamily: "Nunito-Medium",
            }}
          />
        </Animated.View>

        {/* Título de la sección de categorías. */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          className="mb-5 mt-8 flex-row items-center justify-between"
        >
          <Text
            className="text-[20px] text-slate-800"
            style={{
              fontFamily: "Nunito-SemiBold",
            }}
          >
            Categorías
          </Text>

          <Pressable>
            <Text
              className="text-[13px] text-blue-500"
              style={{
                fontFamily: "Nunito-SemiBold",
              }}
            >
              Ver más
            </Text>
          </Pressable>
        </Animated.View>

        {/* Tarjetas de las categorías principales. */}
        <View className="flex-row flex-wrap justify-between gap-y-7">
          {categorias.map((categoria, index) => (
            <Animated.View
              key={categoria.id}
              entering={FadeInDown
                .delay(250 + index * 80)
                .duration(450)}
              className="w-[48%]"
            >
              <CategoriaCard
                titulo={categoria.titulo}
                onPress={() => abrirCategoria(categoria.id)}
              />
            </Animated.View>
          ))}
        </View>

        {/* Sección de Mitos y Realidades. */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          className="mb-5 mt-10"
        >
          <View className="mb-5 flex-row items-center justify-between">
            <Text
              className="text-[20px] text-slate-800"
              style={{
                fontFamily: "Nunito-SemiBold",
              }}
            >
              Mitos y Realidades
            </Text>

            <Pressable>
              <Text
                className="text-[13px] text-blue-500"
                style={{
                  fontFamily: "Nunito-SemiBold",
                }}
              >
                Ver más
              </Text>
            </Pressable>
          </View>

          <MitoRealidadCard />
        </Animated.View>

        {/* Sección de lecturas recomendadas. */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          className="mt-6"
        >
          <View className="mb-5 flex-row items-center justify-between">
            <Text
              className="text-[20px] text-slate-800"
              style={{
                fontFamily: "Nunito-SemiBold",
              }}
            >
              Lecturas recomendadas
            </Text>

            <Pressable>
              <Text
                className="text-[13px] text-blue-500"
                style={{
                  fontFamily: "Nunito-SemiBold",
                }}
              >
                Ver todas
              </Text>
            </Pressable>
          </View>

          <LecturaRecomendadaCard
            categoria="Emociones"
            tiempo="8 min de lectura"
            titulo="Inteligencia Emocional"
            descripcion="Aprende a reconocer, comprender y gestionar tus emociones para mejorar tu bienestar y tus relaciones."
          />

          <LecturaRecomendadaCard
            categoria="Bienestar"
            tiempo="6 min de lectura"
            titulo="Aprender a cuidar de ti"
            descripcion="Descubre pequeñas acciones que puedes incorporar en tu día a día para cuidar de tu bienestar emocional."
          />
        </Animated.View>
      </View>
    </ScrollView>
  );
}