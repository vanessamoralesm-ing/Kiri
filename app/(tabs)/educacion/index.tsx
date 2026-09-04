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

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// CATEGORÍAS
// ==========================================================

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

// ==========================================================
// EDUCACIÓN
// ==========================================================

export default function EducacionScreen() {
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

  const inputBackgroundColor = useThemeColor(
    {},
    "inputBackground"
  );

  const inputBorderColor = useThemeColor(
    {},
    "inputBorder"
  );

  const placeholderColor = useThemeColor(
    {},
    "placeholder"
  );

  const iconColor = useThemeColor(
    {},
    "icon"
  );

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
      style={{
        flex: 1,
        backgroundColor,
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 130,
      }}
    >
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 48,
        }}
      >
        {/* ENCABEZADO */}

        <View>
          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: 24,
              color: primaryColor,
            }}
          >
            Biblioteca de Bienestar
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontFamily: "Nunito-Medium",
              fontSize: 15,
              lineHeight: 20,
              color: textSecondaryColor,
            }}
          >
            Explora herramientas y conocimientos diseñados para acompañarte en
            tu camino hacia una mejor salud mental.
          </Text>
        </View>

        {/* BUSCADOR */}

        <View
          style={{
            marginTop: 28,
            minHeight: 56,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: inputBorderColor,
            backgroundColor: inputBackgroundColor,
            shadowColor: "#000000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Ionicons
            name="search-outline"
            size={27}
            color={iconColor}
          />

          <TextInput
            placeholder="¿Qué tema te gustaría explorar hoy?"
            placeholderTextColor={placeholderColor}
            selectionColor={primaryColor}
            style={{
              flex: 1,
              marginLeft: 12,
              paddingVertical: 16,
              fontFamily: "Nunito-Medium",
              fontSize: 14,
              color: textColor,
            }}
          />
        </View>

        {/* TÍTULO DE CATEGORÍAS */}

        <View
          style={{
            marginTop: 32,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Nunito-Bold",
              fontSize: 20,
              color: textColor,
            }}
          >
            Explora por categoría
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontFamily: "Nunito-SemiBold",
              fontSize: 15,
              color: textMutedColor,
            }}
          >
            Selecciona el tema sobre el que quieras aprender.
          </Text>
        </View>

        {/* TARJETAS DE CATEGORÍAS */}

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: 28,
          }}
        >
          {categorias.map((categoria) => (
            <View
              key={categoria.id}
              style={{
                width: "48%",
              }}
            >
              <CategoriaCard
                titulo={categoria.titulo}
                imagen={categoria.imagen}
                onPress={() =>
                  abrirCategoria(categoria.id)
                }
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}