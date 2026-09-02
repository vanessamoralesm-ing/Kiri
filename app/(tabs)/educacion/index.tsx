import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import CategoriaCard from "../../../components/educacion/CategoriaCard";

// Categorías que después podrán obtenerse desde Supabase.
const categorias = [
  {
    id: "Ansiedad",
    titulo: "Ansiedad",
    imagen: require("../../../assets/images_educacion/ansiedad_kiri.png"),
  },
  {
    id: "Autoestima",
    titulo: "Autoestima",
    imagen: require("../../../assets/images_educacion/autoestima_kiri.png"),
  },
  {
    id: "Estres",
    titulo: "Estrés",
    imagen: require("../../../assets/images_educacion/kiri_estres.png"),
  },
  {
    id: "Procrastinacion",
    titulo: "Procrastinación",
    imagen: require("../../../assets/images_educacion/procrastinacion_kiri.png"),
  },
  {
    id: "Soledad",
    titulo: "Soledad",
    imagen: require("../../../assets/images_educacion/kiri_solito.png"),
  },
  {
    id: "Depresion",
    titulo: "Depresión",
    imagen: require("../../../assets/images_educacion/depresion_kiri.png"),
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
        <View>
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
        </View>

        {/* Buscador de contenido. */}
        <View className="mt-7 flex-row items-center rounded-2xl bg-white px-4 shadow-md">
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
        </View>

        {/* Título de las categorías. */}
        <View className="mb-5 mt-8">
          <Text
            className="text-[20px] text-slate-800"
            style={{
              fontFamily: "Nunito-Bold",
            }}
          >
            Explora por categoría
          </Text>

          <Text
            className="mt-1 text-[15px] text-slate-400"
            style={{
              fontFamily: "Nunito-SemiBold",
            }}
          >
            Selecciona el tema sobre el que quieras aprender.
          </Text>
        </View>

        {/* Tarjetas de categorías. */}
        <View className="flex-row flex-wrap justify-between gap-y-7">
          {categorias.map((categoria) => (
            <View
              key={categoria.id}
              className="w-[48%]"
            >
              <CategoriaCard
                titulo={categoria.titulo}
                imagen={categoria.imagen}
                onPress={() => abrirCategoria(categoria.id)}
              />
            </View>
          ))}
        </View>

        {/* Mensaje final de orientación. */}
        <View className="mt-10 rounded-[22px] bg-white p-5 shadow-sm">
          <View className="flex-row items-start">

            <View className="h-11 w-11 items-center justify-center rounded-full bg-blue-50">
              <Ionicons
                name="leaf-outline"
                size={22}
                color="#4F8CFF"
              />
            </View>

            <View className="ml-4 flex-1">
              <Text
                className="text-[18px] text-slate-800"
                style={{
                  fontFamily: "Nunito-Bold",
                }}
              >
                Explora a tu ritmo
              </Text>

              <Text
                className="mt-1 text-[16px] leading-5 text-slate-500"
                style={{
                  fontFamily: "Nunito-Medium",
                  textAlign: "justify",
                }}
              >
                Cada categoría contiene información, mitos, realidades y
                lecturas relacionadas para ayudarte a comprender mejor cada
                tema.
              </Text>
            </View>

          </View>
        </View>

      </View>
    </ScrollView>
  );
}