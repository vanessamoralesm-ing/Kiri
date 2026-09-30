import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";

import {
  ScrollView,
  Text,
  View,
} from "react-native";

import CategoriaCard from "@/components/educacion/CategoriaCard";
import EncabezadoCard from "@/components/educacion/EncabezadoCard";
import SearchBar from "@/components/ui/SearchBar";

import { useThemeColor } from "@/hooks/use-theme-color";


// ==========================================================
// CATEGORÍAS
// ==========================================================

const categorias = [
  {
    id: "Ansiedad",
    titulo: "Ansiedad",
    imagen: require(
      "../../../assets/images_educacion/ansiedad_kiri.png"
    ),
  },
  {
    id: "Autoestima",
    titulo: "Autoestima",
    imagen: require(
      "../../../assets/images_educacion/autoestima_kiri.png"
    ),
  },
  {
    id: "Estres",
    titulo: "Estrés",
    imagen: require(
      "../../../assets/images_educacion/kiri_estres.png"
    ),
  },
  {
    id: "Procrastinacion",
    titulo: "Procrastinación",
    imagen: require(
      "../../../assets/images_educacion/procrastinacion_kiri.png"
    ),
  },
  {
    id: "Soledad",
    titulo: "Soledad",
    imagen: require(
      "../../../assets/images_educacion/kiri_solito.png"
    ),
  },
  {
    id: "Depresion",
    titulo: "Depresión",
    imagen: require(
      "../../../assets/images_educacion/depresion_kiri.png"
    ),
  },
];


// ==========================================================
// EDUCACIÓN
// ==========================================================

export default function EducacionScreen() {

  // ========================================================
  // ESTADOS
  // ========================================================

  const [busqueda, setBusqueda] = useState("");


  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const backgroundColor = useThemeColor(
    {},
    "background"
  );

  const textColor = useThemeColor(
    {},
    "text"
  );

  const textSecondaryColor = useThemeColor(
    {},
    "textSecondary"
  );

  const textMutedColor = useThemeColor(
    {},
    "textMuted"
  );

  const primaryColor = useThemeColor(
    {},
    "primary"
  );

  const primarySoftColor = useThemeColor(
    {},
    "primarySoft"
  );

  const borderColor = useThemeColor(
    {},
    "border"
  );


  // ========================================================
  // NORMALIZAR TEXTO
  // ========================================================

  function normalizarTexto(texto: string) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }


  // ========================================================
  // FILTRO DE CATEGORÍAS
  // ========================================================

  const categoriasFiltradas = useMemo(() => {
    const texto = normalizarTexto(
      busqueda
    );

    if (!texto) {
      return categorias;
    }

    return categorias.filter((categoria) =>
      normalizarTexto(
        categoria.titulo
      ).includes(texto)
    );
  }, [busqueda]);


  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  function abrirCategoria(id: string) {
    router.push(
      `/educacion/${id}` as any
    );
  }


  // ========================================================
  // UI
  // ========================================================

  return (
    <ScrollView
      className="flex-1"
      style={{
        backgroundColor,
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 130,
      }}
    >

      {/* ==================================================
          ENCABEZADO
          ================================================== */}

      <EncabezadoCard
        imagen={require(
          "../../../assets/images_educacion/kiri_lee_edu_horiz.png"
        )}
        titulo="Biblioteca de Bienestar"
        subtitulo="Conoce, aprende y descubre herramientas para tu bienestar emocional."
      />


      <View className="px-6">

        {/* ==================================================
            BUSCADOR
            ================================================== */}

        <View className="mt-6">

          <SearchBar
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="¿Qué te gustaría explorar hoy?"
          />

        </View>


        {/* ==================================================
            TÍTULO DE CATEGORÍAS
            ================================================== */}

        <View className="mb-5 mt-8">

          <Text
            className="font-nunito-bold text-xl"
            style={{
              color: textColor,
            }}
          >
            Explora por categoría
          </Text>

          <Text
            className="mt-1 font-nunito-semibold text-[15px]"
            style={{
              color: textMutedColor,
            }}
          >
            Selecciona el tema sobre el que quieras aprender.
          </Text>

        </View>


        {/* ==================================================
            TARJETAS DE CATEGORÍAS
            ================================================== */}

        <View className="flex-row flex-wrap justify-between gap-y-7">

          {categoriasFiltradas.map(
            (categoria) => (

              <View
                key={categoria.id}
                className="w-[48%] items-center justify-center"
              >

                <CategoriaCard
                  titulo={
                    categoria.titulo
                  }
                  imagen={
                    categoria.imagen
                  }
                  onPress={() =>
                    abrirCategoria(
                      categoria.id
                    )
                  }
                />

              </View>

            )
          )}

        </View>


        {/* ==================================================
            MENSAJE FINAL DE ORIENTACIÓN
            ================================================== */}

        <View
          className="mt-10 rounded-[22px] border p-5"
          style={{
            borderColor,
            backgroundColor: "#F0F9FF",

            shadowColor: "#000000",

            shadowOffset: {
              width: 0,
              height: 2,
            },

            shadowOpacity: 0.06,
            shadowRadius: 5,
            elevation: 2,
          }}
        >

          <View className="flex-row items-start">

            {/* ICONO */}

            <View
              className="h-11 w-11 items-center justify-center rounded-full"
              style={{
                backgroundColor:
                  primarySoftColor,
              }}
            >

              <Ionicons
                name="leaf-outline"
                size={22}
                color={primaryColor}
              />

            </View>


            {/* TEXTO */}

            <View className="ml-4 flex-1">

              <Text
                className="font-nunito-bold text-base"
                style={{
                  color: textColor,
                }}
              >
                Explora a tu ritmo
              </Text>

              <Text
                className="mt-1 text-justify font-nunito-semibold text-sm leading-5"
                style={{
                  color:
                    textSecondaryColor,
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