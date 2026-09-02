import React from "react";

import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import TarjetaPlantillaAutorregistro from "@/components/diario/TarjetaPlantillaAutorregistro";

export default function NuevoAutorregistroScreen() {
  // Obtiene los espacios seguros del dispositivo.
  // Nos ayuda especialmente con la parte inferior.
  const insets =
    useSafeAreaInsets();

  // Regresa a la pantalla anterior.
  const regresar = () => {
    router.back();
  };

  // Abre la plantilla seleccionada.
  const seleccionarPlantilla = (
    plantilla: string
  ) => {
    router.push(
      `/diario/nuevo/${plantilla}` as never
    );
  };

  return (
    <View
      className="
        flex-1
        bg-[#F8FAFC]
      "
    >
      <ScrollView
        // Hace que el ScrollView ocupe todo
        // el espacio disponible de la pantalla.
        className="flex-1"

        // Oculta la barra lateral de desplazamiento.
        showsVerticalScrollIndicator={false}

        // Permite tocar elementos aun cuando
        // posteriormente existan campos de texto.
        keyboardShouldPersistTaps="handled"

        // Espacio interno de todo el contenido.
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,

          // Dejamos espacio suficiente porque
          // la barra de navegación inferior
          // se dibuja encima del contenido.
          paddingBottom: Math.max(
            insets.bottom + 110,
            130
          ),
        }}
      >
        {/* =====================================================
            ENCABEZADO
        ====================================================== */}

        <View
          className="
            flex-row
            items-center
          "
        >
          <Pressable
            onPress={regresar}
            hitSlop={10}
            className="
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-white
              active:opacity-70
            "
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#475569"
            />
          </Pressable>

          <Text
            className="
              ml-3
              font-nunito-semibold
              text-[18px]
              text-[#1E293B]
            "
          >
            Nuevo Registro
          </Text>
        </View>


        {/* =====================================================
            PRESENTACIÓN
        ====================================================== */}

        <Animated.View
          entering={
            FadeInDown
              .duration(400)
          }
          className="
            mt-6
            rounded-[24px]
            bg-[#EAF2FF]
            p-5
          "
        >
          {/* Icono */}
          <View
            className="
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-[#D8E7FF]
            "
          >
            <Ionicons
              name="journal-outline"
              size={25}
              color="#3478F6"
            />
          </View>

          {/* Pregunta principal */}
          <Text
            className="
              mt-4
              font-nunito-bold
              text-[21px]
              text-[#1E293B]
            "
          >
            ¿Qué quieres registrar hoy?
          </Text>

          {/* Explicación */}
          <Text
            className="
              mt-2
              font-nunito-medium
              text-[14px]
              leading-[20px]
              text-[#64748B]
            "
          >
            Elige el tipo de autorregistro que mejor se adapte
            a lo que deseas explorar en este momento.
          </Text>
        </Animated.View>


        {/* =====================================================
            PLANTILLAS DISPONIBLES
        ====================================================== */}

        <Animated.View
          entering={
            FadeInDown
              .delay(100)
              .duration(400)
          }
          className="mt-6"
        >
          <Text
            className="
              mb-4
              font-nunito-semibold
              text-[16px]
              text-[#334155]
            "
          >
            Autorregistros disponibles
          </Text>


          {/* Diario emocional */}
          <TarjetaPlantillaAutorregistro
            titulo="Diario emocional"
            descripcion="Reconoce cómo te sentiste, qué ocurrió y qué pensamientos estuvieron presentes."
            icono="heart-outline"
            color="#3478F6"
            fondoIcono="#E8F1FF"
            onPress={() =>
              seleccionarPlantilla(
                "emocional"
              )
            }
          />


          {/* Observando pensamientos */}
          <TarjetaPlantillaAutorregistro
            titulo="Observando mis pensamientos"
            descripcion="Explora una situación, tus sentimientos, pensamientos y la forma en que reaccionaste."
            icono="bulb-outline"
            color="#8B5CF6"
            fondoIcono="#F1EAFF"
            onPress={() =>
              seleccionarPlantilla(
                "pensamientos"
              )
            }
          />


          {/* ABC */}
          <TarjetaPlantillaAutorregistro
            titulo="Autorregistro ABC"
            descripcion="Relaciona una situación con tus pensamientos, emociones y respuestas."
            icono="git-branch-outline"
            color="#16A965"
            fondoIcono="#E5F8EE"
            onPress={() =>
              seleccionarPlantilla(
                "abc"
              )
            }
          />
        </Animated.View>


        {/* =====================================================
            MENSAJE DE APOYO
        ====================================================== */}

        <Animated.View
          entering={
            FadeInDown
              .delay(200)
              .duration(400)
          }
          className="
            mt-2
            flex-row
            items-start
            rounded-[20px]
            bg-[#FFF7E8]
            p-4
          "
        >
          <View
            className="
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-[#FFE9BE]
            "
          >
            <Ionicons
              name="information-circle-outline"
              size={21}
              color="#D98B16"
            />
          </View>

          <Text
            className="
              ml-3
              flex-1
              font-nunito-medium
              text-[13px]
              leading-[19px]
              text-[#7C6543]
            "
          >
            No existe una forma correcta o incorrecta de hacerlo.
            Elige el autorregistro que mejor represente lo que
            necesitas explorar hoy.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}