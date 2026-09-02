import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import LecturaRecomendadaCard from "../../../../components/educacion/LecturaRecomendadaCard";

// Datos temporales de cada categoría. Después estos datos vendrán desde Supabase.
const contenidoCategorias = {
  Ansiedad: {
    titulo: "Ansiedad",

    descripcion:
      "Conoce más sobre la ansiedad, aprende a identificarla y descubre herramientas que pueden ayudarte a comprender mejor lo que sientes.",

    mito:
      "“Sentir ansiedad significa que algo está mal conmigo.”",

    realidad:
      "La ansiedad puede ser una respuesta normal ante situaciones de preocupación, incertidumbre o peligro. Puede convertirse en un problema cuando aparece de manera intensa, frecuente o comienza a afectar las actividades de la vida diaria.",

    lecturas: [
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
    ],
  },

  Autoestima: {
    titulo: "Autoestima",

    descripcion:
      "Descubre cómo la manera en que te percibes puede influir en tus emociones, decisiones y relaciones.",

    mito:
      "“Tener buena autoestima significa sentirse seguro todo el tiempo.”",

    realidad:
      "Tener una autoestima saludable no significa sentirse bien en todo momento. También implica reconocer nuestras fortalezas y dificultades, aceptar que podemos equivocarnos y aprender a tratarnos con respeto.",

    lecturas: [
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
    ],
  },

  Estres: {
    titulo: "Estrés",

    descripcion:
      "Aprende qué es el estrés, cómo puede manifestarse y qué podemos hacer para manejarlo de una manera más saludable.",

    mito:
      "“Todo el estrés es malo y debemos evitarlo por completo.”",

    realidad:
      "El estrés es una respuesta natural del organismo ante determinadas situaciones. En algunos momentos puede ayudarnos a reaccionar y adaptarnos, pero cuando se mantiene durante mucho tiempo puede afectar nuestro bienestar.",

    lecturas: [
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
    ],
  },

  Procrastinacion: {
    titulo: "Procrastinación",

    descripcion:
      "Comprende por qué algunas veces dejamos nuestras responsabilidades para después y cómo podemos empezar a cambiar este hábito.",

    mito:
      "“Las personas procrastinan simplemente porque son perezosas.”",

    realidad:
      "La procrastinación puede estar relacionada con diferentes factores, como el miedo a equivocarse, sentirse abrumado, la falta de motivación o la dificultad para organizar una tarea.",

    lecturas: [
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
    ],
  },

  Soledad: {
    titulo: "Soledad",

    descripcion:
      "Conoce mejor qué significa sentirse solo y cómo podemos fortalecer nuestros vínculos y nuestro bienestar emocional.",

    mito:
      "“Estar solo y sentirse solo significan exactamente lo mismo.”",

    realidad:
      "Una persona puede disfrutar de momentos a solas sin sentirse sola. La soledad emocional aparece cuando sentimos que nuestras necesidades de conexión o compañía no están siendo satisfechas.",

    lecturas: [
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
    ],
  },
};

export default function CategoriaScreen() {
  // Obtiene el id de la categoría seleccionada desde la ruta.
  const { id } = useLocalSearchParams<{ id: string }>();

  // Busca la información correspondiente a la categoría seleccionada.
  const categoria =
    contenidoCategorias[id as keyof typeof contenidoCategorias];

  // Si la categoría no existe, mostramos un mensaje sencillo.
  if (!categoria) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Text
          className="text-center text-[18px] text-slate-700"
          style={{
            fontFamily: "Nunito-SemiBold",
          }}
        >
          No encontramos esta categoría.
        </Text>

        <Pressable
          onPress={() => router.replace("/(tabs)/educacion" as any)}
          className="mt-5 rounded-xl bg-blue-500 px-5 py-3"
        >
          <Text
            className="text-white"
            style={{
              fontFamily: "Nunito-SemiBold",
            }}
          >
            Volver a Educación
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 130,
      }}
    >
      <View className="px-6 pt-12">

        {/* Regresa directamente a la pantalla principal de Educación. */}
        <Pressable
          onPress={() => router.replace("/(tabs)/educacion" as any)}
          className="mb-5 h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#475569"
          />
        </Pressable>

        {/* Nombre y descripción de la categoría seleccionada. */}
        <Animated.View entering={FadeInDown.duration(450)}>
          <Text
            className="text-[26px] text-blue-500"
            style={{
              fontFamily: "Nunito-Bold",
            }}
          >
            {categoria.titulo}
          </Text>

          <Text
            className="mt-2 text-[15px] leading-6 text-slate-500"
            style={{
              fontFamily: "Nunito-Medium",
              textAlign: "justify",
            }}
          >
            {categoria.descripcion}
          </Text>
        </Animated.View>

        {/* Sección de Mitos y Realidades de la categoría. */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(450)}
          className="mt-9"
        >
          <Text
            className="mb-5 text-[20px] text-slate-800"
            style={{
              fontFamily: "Nunito-SemiBold",
            }}
          >
            Mitos y Realidades
          </Text>

          <View className="rounded-[22px] bg-white p-4 shadow-md">

            {/* Mito de la categoría. */}
            <View className="rounded-[18px] bg-[#F3EEFF] p-4">
              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                  <Ionicons
                    name="bulb-outline"
                    size={22}
                    color="#7C6EE6"
                  />
                </View>

                <Text
                  className="ml-3 text-[13px] uppercase tracking-wide text-[#7466D9]"
                  style={{
                    fontFamily: "Nunito-Bold",
                  }}
                >
                  Mito
                </Text>
              </View>

              <Text
                className="mt-4 text-[16px] leading-6 text-slate-800"
                style={{
                  fontFamily: "Nunito-SemiBold",
                }}
              >
                {categoria.mito}
              </Text>
            </View>

            {/* Realidad de la categoría. */}
            <View className="mt-4 rounded-[18px] bg-[#EAF8F4] p-4">
              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={23}
                    color="#5BC4AD"
                  />
                </View>

                <Text
                  className="ml-3 text-[13px] uppercase tracking-wide text-[#49A994]"
                  style={{
                    fontFamily: "Nunito-Bold",
                  }}
                >
                  Realidad
                </Text>
              </View>

              <Text
                className="mt-4 text-[14px] leading-6 text-slate-600"
                style={{
                  fontFamily: "Nunito-Medium",
                  textAlign: "justify",
                }}
              >
                {categoria.realidad}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Lecturas recomendadas relacionadas con la categoría. */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(450)}
          className="mt-10"
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

            {/* Más adelante este botón mostrará todas las lecturas relacionadas. */}
            <Pressable
              onPress={() =>
              router.push({
                pathname: "/(tabs)/educacion/lecturas",
                params: {
                  categoria: categoria.titulo,
                },
              } as any)
            }
          >
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

          {categoria.lecturas.map((lectura) => (
            <LecturaRecomendadaCard
              key={lectura.id}
              categoria={lectura.categoria}
              tiempo={lectura.tiempo}
              titulo={lectura.titulo}
              descripcion={lectura.descripcion}
            />
          ))}
        </Animated.View>
      </View>
    </ScrollView>
  );
}