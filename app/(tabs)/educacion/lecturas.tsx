import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import LecturaRecomendadaCard from "../../../components/educacion/LecturaRecomendadaCard";

// Datos temporales. Más adelante estos datos vendrán desde Supabase.
const lecturas = [
  {
    id: "que-es-la-ansiedad",
    categoria: "Ansiedad",
    tiempo: "5 min de lectura",
    titulo: "¿Qué es la ansiedad?",
    descripcion:
      "Conoce qué es la ansiedad, por qué aparece y cómo puede manifestarse en diferentes situaciones.",
  },
  {
    id: "reconocer-ansiedad",
    categoria: "Ansiedad",
    tiempo: "7 min de lectura",
    titulo: "Cómo reconocer la ansiedad",
    descripcion:
      "Aprende a identificar algunas señales físicas, emocionales y conductuales relacionadas con la ansiedad.",
  },
  {
    id: "comprender-autoestima",
    categoria: "Autoestima",
    tiempo: "6 min de lectura",
    titulo: "Comprendiendo la autoestima",
    descripcion:
      "Conoce qué es la autoestima y cómo puede influir en la manera en que pensamos y actuamos.",
  },
  {
    id: "fortalecer-autoestima",
    categoria: "Autoestima",
    tiempo: "7 min de lectura",
    titulo: "Cómo fortalecer tu autoestima",
    descripcion:
      "Descubre pequeñas acciones que pueden ayudarte a construir una relación más saludable contigo.",
  },
  {
    id: "comprender-estres",
    categoria: "Estrés",
    tiempo: "5 min de lectura",
    titulo: "Comprendiendo el estrés",
    descripcion:
      "Conoce por qué aparece el estrés y cuáles son algunas de las señales más comunes.",
  },
  {
    id: "manejar-estres",
    categoria: "Estrés",
    tiempo: "8 min de lectura",
    titulo: "Estrategias para manejar el estrés",
    descripcion:
      "Conoce algunas estrategias que pueden ayudarte a afrontar situaciones estresantes.",
  },
  {
    id: "entender-procrastinacion",
    categoria: "Procrastinación",
    tiempo: "6 min de lectura",
    titulo: "¿Por qué procrastinamos?",
    descripcion:
      "Comprende algunas de las razones que pueden llevarnos a posponer nuestras responsabilidades.",
  },
  {
    id: "evitar-procrastinacion",
    categoria: "Procrastinación",
    tiempo: "7 min de lectura",
    titulo: "Pequeños pasos para dejar de procrastinar",
    descripcion:
      "Aprende estrategias sencillas para comenzar tus tareas y organizar mejor tu tiempo.",
  },
  {
    id: "comprender-soledad",
    categoria: "Soledad",
    tiempo: "5 min de lectura",
    titulo: "Comprendiendo la soledad",
    descripcion:
      "Conoce las diferencias entre estar solo y experimentar sentimientos de soledad.",
  },
  {
    id: "conexiones-saludables",
    categoria: "Soledad",
    tiempo: "7 min de lectura",
    titulo: "Construyendo conexiones saludables",
    descripcion:
      "Descubre algunas formas de fortalecer nuestras relaciones y crear vínculos significativos.",
  },
];

const categorias = [
  "Todas",
  "Ansiedad",
  "Autoestima",
  "Estrés",
  "Procrastinación",
  "Soledad",
  "Depresión",
];

export default function LecturasScreen() {
  // Recibe la categoría si llegamos desde una categoría específica.
  const { categoria } = useLocalSearchParams<{
    categoria?: string;
  }>();

  const [busqueda, setBusqueda] = useState("");

  // Si viene una categoría desde la pantalla anterior, la dejamos seleccionada.
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    categoria || "Todas"
  );

  // Filtra las lecturas por categoría y por lo escrito en el buscador.
  const lecturasFiltradas = useMemo(() => {
    return lecturas.filter((lectura) => {
      const coincideCategoria =
        categoriaSeleccionada === "Todas" ||
        lectura.categoria === categoriaSeleccionada;

      const textoBusqueda = busqueda.toLowerCase().trim();

      const coincideBusqueda =
        textoBusqueda.length === 0 ||
        lectura.titulo.toLowerCase().includes(textoBusqueda) ||
        lectura.descripcion.toLowerCase().includes(textoBusqueda) ||
        lectura.categoria.toLowerCase().includes(textoBusqueda);

      return coincideCategoria && coincideBusqueda;
    });
  }, [busqueda, categoriaSeleccionada]);

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 130,
      }}
    >
      <View className="px-6 pt-12">
        {/* Botón para volver a la pantalla anterior. */}
        <Pressable
          onPress={() => router.back()}
          className="mb-5 h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#475569"
          />
        </Pressable>

        {/* Encabezado de la pantalla. */}
        <Animated.View entering={FadeInDown.duration(450)}>
          <Text
            className="text-[27px] text-slate-800"
            style={{
              fontFamily: "Nunito-Bold",
            }}
          >
            Lecturas recomendadas
          </Text>

          <Text
            className="mt-2 text-[15px] leading-6 text-slate-500"
            style={{
              fontFamily: "Nunito-Medium",
            }}
          >
            Explora contenidos sobre bienestar emocional y encuentra lecturas
            relacionadas con los temas que más te interesan.
          </Text>
        </Animated.View>

        {/* Buscador de lecturas. */}
        <Animated.View
          entering={FadeInDown.delay(80).duration(450)}
          className="mt-6 flex-row items-center rounded-2xl bg-white px-4 shadow-sm"
        >
          <Ionicons
            name="search-outline"
            size={21}
            color="#94A3B8"
          />

          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar una lectura..."
            placeholderTextColor="#94A3B8"
            className="ml-3 flex-1 py-4 text-[15px] text-slate-700"
            style={{
              fontFamily: "Nunito-Medium",
            }}
          />

          {busqueda.length > 0 && (
            <Pressable onPress={() => setBusqueda("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color="#CBD5E1"
              />
            </Pressable>
          )}
        </Animated.View>

        {/* Filtros por categoría. */}
        <Animated.View
          entering={FadeInDown.delay(140).duration(450)}
          className="mt-6"
        >
          <Text
            className="mb-3 text-[17px] text-slate-800"
            style={{
              fontFamily: "Nunito-SemiBold",
            }}
          >
            Categorías
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex-row gap-3 pr-6">
              {categorias.map((item) => {
                const estaSeleccionada =
                  categoriaSeleccionada === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setCategoriaSeleccionada(item)}
                    className={`rounded-full px-4 py-2.5 ${
                      estaSeleccionada
                        ? "bg-blue-500"
                        : "bg-white"
                    }`}
                  >
                    <Text
                      className={`text-[13px] ${
                        estaSeleccionada
                          ? "text-white"
                          : "text-slate-600"
                      }`}
                      style={{
                        fontFamily: "Nunito-SemiBold",
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Encabezado de resultados. */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(450)}
          className="mb-5 mt-8 flex-row items-end justify-between"
        >
          <View className="flex-1 pr-3">
            <Text
              className="text-[20px] text-slate-800"
              style={{
                fontFamily: "Nunito-SemiBold",
              }}
            >
              {categoriaSeleccionada === "Todas"
                ? "Todas las lecturas"
                : categoriaSeleccionada}
            </Text>

            <Text
              className="mt-1 text-[13px] text-slate-400"
              style={{
                fontFamily: "Nunito-Medium",
              }}
            >
              {lecturasFiltradas.length}{" "}
              {lecturasFiltradas.length === 1
                ? "lectura encontrada"
                : "lecturas encontradas"}
            </Text>
          </View>
        </Animated.View>

        {/* Resultados encontrados. */}
        {lecturasFiltradas.length > 0 ? (
          lecturasFiltradas.map((lectura) => (
            <LecturaRecomendadaCard
              key={lectura.id}
              categoria={lectura.categoria}
              tiempo={lectura.tiempo}
              titulo={lectura.titulo}
              descripcion={lectura.descripcion}
              onPress={() => {
                console.log(
                  "Lectura seleccionada:",
                  lectura.id
                );
              }}
            />
          ))
        ) : (
          <View className="mt-8 items-center rounded-[22px] bg-white px-6 py-10">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Ionicons
                name="book-outline"
                size={29}
                color="#94A3B8"
              />
            </View>

            <Text
              className="mt-4 text-center text-[17px] text-slate-700"
              style={{
                fontFamily: "Nunito-SemiBold",
              }}
            >
              No encontramos lecturas
            </Text>

            <Text
              className="mt-2 text-center text-[14px] leading-5 text-slate-400"
              style={{
                fontFamily: "Nunito-Medium",
              }}
            >
              Intenta buscar otro tema o selecciona una categoría diferente.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}