import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import React, {
  useMemo,
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

import EncabezadoCard from "@/components/educacion/EncabezadoCard";
import LecturaRecomendadaCard from "@/components/educacion/LecturaRecomendadaCard";
import SearchBar from "@/components/ui/SearchBar";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// LECTURAS
// ==========================================================

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


// ==========================================================
// CATEGORÍAS
// ==========================================================

const categorias = [
  "Todas",
  "Ansiedad",
  "Autoestima",
  "Estrés",
  "Procrastinación",
  "Soledad",
  "Depresión",
];


// ==========================================================
// COMPONENTE
// ==========================================================

export default function LecturasScreen() {

  // Obtiene la categoría enviada desde la pantalla anterior
  const {
    categoria,
  } = useLocalSearchParams<{
    categoria?: string;
  }>();


  // ========================================================
  // ESTADOS
  // ========================================================

  const [
    busqueda,
    setBusqueda,
  ] = useState("");

  const [
    categoriaSeleccionada,
    setCategoriaSeleccionada,
  ] = useState(
    categoria || "Todas"
  );


  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const backgroundColor =
    useThemeColor(
      {},
      "background"
    );

  const surfaceColor =
    useThemeColor(
      {},
      "surface"
    );

  const surfaceSecondaryColor =
    useThemeColor(
      {},
      "surfaceSecondary"
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

  const textMutedColor =
    useThemeColor(
      {},
      "textMuted"
    );

  const primaryColor =
    useThemeColor(
      {},
      "primary"
    );

  const primarySoftColor =
    useThemeColor(
      {},
      "primarySoft"
    );

  const borderColor =
    useThemeColor(
      {},
      "border"
    );

  const textOnPrimaryColor =
    useThemeColor(
      {},
      "textOnPrimary"
    );


  // ========================================================
  // NORMALIZAR TEXTO
  // ========================================================

  // Permite buscar con o sin tildes
  function normalizarTexto(
    texto: string
  ) {
    return texto
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .trim();
  }


  // ========================================================
  // FILTRAR LECTURAS
  // ========================================================

  const lecturasFiltradas =
    useMemo(() => {

      const textoBusqueda =
        normalizarTexto(
          busqueda
        );

      return lecturas.filter(
        (lectura) => {

          const coincideCategoria =
            categoriaSeleccionada ===
              "Todas" ||
            lectura.categoria ===
              categoriaSeleccionada;

          const coincideBusqueda =
            textoBusqueda.length === 0 ||
            normalizarTexto(
              lectura.titulo
            ).includes(
              textoBusqueda
            ) ||
            normalizarTexto(
              lectura.descripcion
            ).includes(
              textoBusqueda
            ) ||
            normalizarTexto(
              lectura.categoria
            ).includes(
              textoBusqueda
            );

          return (
            coincideCategoria &&
            coincideBusqueda
          );
        }
      );

    }, [
      busqueda,
      categoriaSeleccionada,
    ]);


  // ========================================================
  // UI
  // ========================================================

  return (
    <ScrollView
      className="flex-1"
      style={{
        backgroundColor,
      }}
      showsVerticalScrollIndicator={
        false
      }
      contentContainerStyle={{
        paddingBottom: 130,
      }}
    >

      {/* ==================================================
          BOTÓN VOLVER
          ================================================== */}

      <View className="px-6 pt-6">

        <Pressable
          onPress={() =>
            router.back()
          }
          className="h-11 w-11 items-center justify-center rounded-full border"
          style={({
            pressed,
          }) => ({
            borderColor,

            backgroundColor:
              surfaceColor,

            opacity:
              pressed
                ? 0.7
                : 1,

            shadowColor:
              "#000000",

            shadowOffset: {
              width: 0,
              height: 2,
            },

            shadowOpacity:
              0.06,

            shadowRadius:
              4,

            elevation:
              2,
          })}
        >

          <Ionicons
            name="arrow-back"
            size={23}
            color={
              textSecondaryColor
            }
          />

        </Pressable>

      </View>


      {/* ==================================================
          ENCABEZADO
          ================================================== */}

      <Animated.View
        entering={
          FadeInDown
            .duration(450)
        }
      >

        <EncabezadoCard
          imagen={require(
            "../../../assets/images_educacion/kiri_lee_bibliot_horiz.png"
          )}
          titulo="Biblioteca"
          subtitulo="Explora contenidos sobre bienestar emocional."
        />

      </Animated.View>


      <View className="px-6">

        {/* ==================================================
            BUSCADOR
            ================================================== */}

        <Animated.View
          entering={
            FadeInDown
              .delay(80)
              .duration(450)
          }
          className="mt-6"
        >

          <SearchBar
            value={
              busqueda
            }
            onChangeText={
              setBusqueda
            }
            placeholder="Buscar una lectura..."
          />

        </Animated.View>


        {/* ==================================================
            CATEGORÍAS
            ================================================== */}

        <Animated.View
          entering={
            FadeInDown
              .delay(140)
              .duration(450)
          }
          className="mt-6"
        >

          <Text
            className="mb-3 font-nunito-bold text-lg"
            style={{
              color:
                textColor,
            }}
          >
            Categorías
          </Text>


          {/* Scroll horizontal de categorías */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingRight: 24,
            }}
          >

            <View className="flex-row gap-3">

              {categorias.map(
                (item) => {

                  const estaSeleccionada =
                    categoriaSeleccionada ===
                    item;

                  return (

                    <Pressable
                      key={
                        item
                      }
                      onPress={() =>
                        setCategoriaSeleccionada(
                          item
                        )
                      }
                      className="rounded-full px-5 py-3"
                      style={({
                        pressed,
                      }) => ({
                        borderWidth: 1,

                        borderColor:
                          estaSeleccionada
                            ? primaryColor
                            : borderColor,

                        backgroundColor:
                          estaSeleccionada
                            ? primaryColor
                            : primarySoftColor,

                        opacity:
                          pressed
                            ? 0.75
                            : 1,

                        shadowColor:
                          "#000000",

                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },

                        shadowOpacity:
                          estaSeleccionada
                            ? 0.08
                            : 0.03,

                        shadowRadius: 3,

                        elevation:
                          estaSeleccionada
                            ? 2
                            : 0,
                      })}
                    >

                      <Text
                        className="font-nunito-semibold text-[13px]"
                        style={{
                          color:
                            estaSeleccionada
                              ? textOnPrimaryColor
                              : textSecondaryColor,
                        }}
                      >
                        {item}
                      </Text>

                    </Pressable>

                  );
                }
              )}

            </View>

          </ScrollView>

        </Animated.View>


        {/* ==================================================
            ENCABEZADO DE RESULTADOS
            ================================================== */}

        <Animated.View
          entering={
            FadeInDown
              .delay(200)
              .duration(450)
          }
          className="mb-5 mt-8"
        >

          <Text
            className="font-nunito-bold text-xl"
            style={{
              color:
                textColor,
            }}
          >
            {categoriaSeleccionada ===
            "Todas"
              ? "Todas las lecturas"
              : categoriaSeleccionada}
          </Text>


          <Text
            className="mt-1 font-nunito-medium text-[13px]"
            style={{
              color:
                textMutedColor,
            }}
          >
            {lecturasFiltradas.length}{" "}
            {lecturasFiltradas.length ===
            1
              ? "lectura encontrada"
              : "lecturas encontradas"}
          </Text>

        </Animated.View>


        {/* ==================================================
            RESULTADOS
            ================================================== */}

        {lecturasFiltradas.length >
        0 ? (

          /* Grid de dos columnas */

          <View className="flex-row flex-wrap justify-between gap-y-5">

            {lecturasFiltradas.map(
              (
                lectura,
                index
              ) => (

                <Animated.View
                  key={
                    lectura.id
                  }
                  entering={
                    FadeInDown
                      .delay(
                        240 +
                          index *
                            50
                      )
                      .duration(
                        400
                      )
                  }
                  className="w-[48%] items-center"
                >

                  <LecturaRecomendadaCard
                    titulo={
                      lectura.titulo
                    }
                    index={
                      index
                    }
                    onPress={() => {

                      console.log(
                        "Lectura seleccionada:",
                        lectura.id
                      );

                    }}
                  />

                </Animated.View>

              )
            )}

          </View>

        ) : (

          /* Estado sin resultados */

          <Animated.View
            entering={
              FadeInDown
                .duration(350)
            }
            className="mt-5 items-center rounded-[22px] border px-6 py-10"
            style={{
              borderColor,

              backgroundColor:
                surfaceColor,
            }}
          >

            <View
              className="h-16 w-16 items-center justify-center rounded-full"
              style={{
                backgroundColor:
                  surfaceSecondaryColor,
              }}
            >

              <Ionicons
                name="book-outline"
                size={29}
                color={
                  textMutedColor
                }
              />

            </View>


            <Text
              className="mt-4 text-center font-nunito-semibold text-[17px]"
              style={{
                color:
                  textColor,
              }}
            >
              No encontramos lecturas
            </Text>


            <Text
              className="mt-2 text-center font-nunito-medium text-sm leading-5"
              style={{
                color:
                  textMutedColor,
              }}
            >
              Intenta buscar otro tema o selecciona una categoría diferente.
            </Text>

          </Animated.View>

        )}

      </View>

    </ScrollView>
  );
}