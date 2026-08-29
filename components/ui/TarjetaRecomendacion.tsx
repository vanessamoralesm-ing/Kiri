import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useColorScheme,
} from "@/hooks/use-color-scheme";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// PROPS
// ==========================================================

interface TarjetaRecomendacionProps {
  titulo: string;

  tiempo?: string;

  descripcion: string;

  nombreIcono:
    keyof typeof Ionicons.glyphMap;

  // Clase NativeWind usada en modo claro.
  // Ejemplo:
  // bg-purple-100
  // bg-blue-100
  // bg-emerald-100
  colorFondo: string;

  colorIcono: string;

  colorTextoFlecha: string;

  onPress: () => void;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export const TarjetaRecomendacion = ({
  titulo,
  tiempo,
  descripcion,
  nombreIcono,
  colorFondo,
  colorIcono,
  colorTextoFlecha,
  onPress,
}: TarjetaRecomendacionProps) => {

  // ========================================================
  // TEMA
  // ========================================================

  const colorScheme =
    useColorScheme();

  const esOscuro =
    colorScheme === "dark";


  const surfaceColor =
    useThemeColor(
      {},
      "surface"
    );

  const borderColor =
    useThemeColor(
      {},
      "border"
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


  // ========================================================
  // UI
  // ========================================================

  return (
    <TouchableOpacity
      activeOpacity={0.8}

      onPress={onPress}

      className={`
        ${!esOscuro ? colorFondo : ""}
        w-[100%]
        self-center
        p-5
        rounded-2xl
        mb-3.5
        flex-row
        items-center
        justify-between
      `}

      style={{
        backgroundColor:
          esOscuro
            ? surfaceColor
            : undefined,

        borderWidth: 1,

        borderColor:
          borderColor,

        shadowColor:
          "#000000",

        shadowOffset: {
          width: 0,
          height: 2,
        },

        shadowOpacity:
          esOscuro
            ? 0.2
            : 0.08,

        shadowRadius:
          4,

        elevation:
          2,
      }}
    >

      {/* ===================================================
          CONTENIDO PRINCIPAL
      =================================================== */}

      <View
        className="
          flex-row
          items-center
          flex-1
          mr-2
        "
      >

        {/* =================================================
            ICONO
        ================================================= */}

        <View
          className="
            mr-4
            items-center
            justify-center
          "
        >
          <Ionicons
            name={nombreIcono}
            size={40}
            color={colorIcono}
          />
        </View>


        {/* =================================================
            TEXTOS
        ================================================= */}

        <View className="flex-1">

          {/* Título */}

          <Text
            style={{
              fontFamily:
                "Nunito-Bold",

              fontSize:
                16,

              lineHeight:
                21,

              color:
                textColor,
            }}
          >
            {titulo}
          </Text>


          {/* Tiempo */}

          {tiempo && (
            <Text
              style={{
                marginVertical:
                  2,

                fontFamily:
                  "Nunito-SemiBold",

                fontSize:
                  13,

                lineHeight:
                  17,

                color:
                  textMutedColor,
              }}
            >
              {tiempo}
            </Text>
          )}


          {/* Descripción */}

          <Text
            style={{
              marginTop:
                2,

              fontFamily:
                "Nunito-SemiBold",

              fontSize:
                13,

              lineHeight:
                18,

              color:
                textSecondaryColor,
            }}
          >
            {descripcion}
          </Text>

        </View>

      </View>


      {/* ===================================================
          FLECHA
      =================================================== */}

      <Ionicons
        name="arrow-forward"
        size={20}
        color={colorTextoFlecha}
      />

    </TouchableOpacity>
  );
};