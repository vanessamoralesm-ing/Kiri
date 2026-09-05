import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
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

import {
  OpcionEmocion,
} from "@/components/diario/OpcionEmocion";

import {
  CampoPreguntaDiario,
} from "@/components/diario/CampoPreguntaDiario";

import Button from "@/components/ui/Button";

import {
  useAuth,
} from "@/services/authProvider";

import {
  guardarDiarioEmocionalService,
  obtenerEmocionesAutorregistro,
} from "@/services/diario/autorregistro.service";

import {
  EmocionAutorregistro,
} from "@/types/diario";


// Emojis usados solamente para la interfaz.
const EMOJIS_EMOCIONES: Record<string, string> = {
  Alegría: "😊",
  Tristeza: "😢",
  Ansiedad: "😰",
  Miedo: "😨",
  Enojo: "😡",
  Calma: "😌",
  Frustración: "😤",
  Culpa: "😔",
  Vergüenza: "😳",
  Esperanza: "🌱",
};


export default function NuevoAutorregistro() {
  const router =
    useRouter();

  const insets =
    useSafeAreaInsets();

  const {
    width,
  } =
    useWindowDimensions();

  const {
    user,
  } =
    useAuth();

  const {
    plantilla,
    origen,
  } =
    useLocalSearchParams<{
      plantilla?: string;
      origen?: string;
    }>();


  const [
    guardando,
    setGuardando,
  ] =
    useState(false);

  const [
    cargandoEmociones,
    setCargandoEmociones,
  ] =
    useState(true);

  const [
    emociones,
    setEmociones,
  ] =
    useState<EmocionAutorregistro[]>([]);

  const [
    idEmocion,
    setIdEmocion,
  ] =
    useState("");

  const [
    motivo,
    setMotivo,
  ] =
    useState("");

  const [
    reaccion,
    setReaccion,
  ] =
    useState("");

  const [
    ideaUtil,
    setIdeaUtil,
  ] =
    useState("");


  // Responsive.
  const esTelefono =
    width < 768;

  const esTablet =
    width >= 768 &&
    width < 1100;

  const esWeb =
    width >= 1100;


  // Ancho máximo de toda la pantalla.
  const maxWidthContenido =
    esWeb
      ? 980
      : esTablet
        ? 860
        : undefined;


  // El card superior y las emociones no necesitan ocupar
  // todo el ancho disponible en web.
  const maxWidthSeccionPrincipal =
    esWeb
      ? 760
      : undefined;


  const paddingHorizontal =
    esTelefono
      ? 16
      : 24;


  // Cantidad de emociones por fila.
  const columnasEmociones =
    esTelefono
      ? 3
      : esTablet
        ? 4
        : 5;


  const gapEmociones =
    esTelefono
      ? 12
      : 14;


  // En web el grid se limita a 760px.
  const anchoGridEmociones =
    Math.min(
      width - paddingHorizontal * 2,
      esWeb
        ? 760
        : esTablet
          ? 760
          : width - paddingHorizontal * 2
    );


  const anchoTarjetaEmocion =
    useMemo(
      () => {
        const espacioTotal =
          gapEmociones *
          (
            columnasEmociones - 1
          );

        return (
          anchoGridEmociones -
          espacioTotal
        ) /
        columnasEmociones;
      },
      [
        anchoGridEmociones,
        columnasEmociones,
        gapEmociones,
      ]
    );


  useEffect(() => {
    const cargarEmociones =
      async () => {
        try {
          setCargandoEmociones(
            true
          );

          const data =
            await obtenerEmocionesAutorregistro();

          setEmociones(
            data
          );
        } catch (error: any) {
          Alert.alert(
            "Error",
            error.message ||
              "No se pudieron cargar las emociones."
          );
        } finally {
          setCargandoEmociones(
            false
          );
        }
      };

    cargarEmociones();
  }, []);


  const regresar =
    () => {
      router.replace({
        pathname:
          "/diario/nuevo" as never,

        params: {
          origen,
        },
      });
    };


  const guardarRegistro =
    async () => {
      if (
        !user?.id
      ) {
        Alert.alert(
          "Error",
          "No se encontró una sesión de usuario activa."
        );

        return;
      }

      if (
        !idEmocion
      ) {
        Alert.alert(
          "Atención",
          "Por favor selecciona una emoción antes de guardar."
        );

        return;
      }

      try {
        setGuardando(
          true
        );

        await guardarDiarioEmocionalService({
          idUsuario:
            user.id,

          idEmocion,

          motivo,

          reaccion,

          ideaUtil,
        });

        Alert.alert(
          "¡Éxito!",
          "Tu diario ha sido guardado correctamente.",
          [
            {
              text:
                "OK",

              onPress:
                regresar,
            },
          ]
        );
      } catch (error: any) {
        Alert.alert(
          "Error al guardar",
          error.message ||
            "Ocurrió un error inesperado."
        );
      } finally {
        setGuardando(
          false
        );
      }
    };


  if (
    plantilla !==
    "emocional"
  ) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FBFF] px-6">
        <Text className="text-center font-nunito-bold text-xl text-gray-700">
          Plantilla no disponible
        </Text>
      </View>
    );
  }


  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F8FBFF]"
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : Platform.OS === "android"
            ? "height"
            : undefined
      }
      keyboardVerticalOffset={
        Platform.OS === "ios"
          ? insets.top
          : 0
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop:
            esTelefono
              ? 12
              : 24,

          paddingBottom:
            Math.max(
              insets.bottom + 130,
              150
            ),
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Contenedor general */}
        <View
          style={{
            width:
              "100%",

            maxWidth:
              maxWidthContenido,

            alignSelf:
              "center",

            paddingHorizontal,
          }}
        >
          {/* Encabezado */}
          <Animated.View
            entering={
              FadeInDown.duration(
                400
              )
            }
            className="mb-6 flex-row items-center justify-between"
          >
            <Pressable
              onPress={
                regresar
              }
              style={{
                width:
                  48,

                height:
                  48,

                borderRadius:
                  17,

                backgroundColor:
                  "#FFFFFF",

                borderWidth:
                  1,

                borderColor:
                  "#E8EDF4",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color="#1E3A5F"
              />
            </Pressable>


            <View className="flex-1 px-4">
              <Text
                className={`font-nunito-bold text-[#4F8EF7] ${
                  esTelefono
                    ? "text-[28px]"
                    : "text-[30px]"
                }`}
              >
                Diario Emocional
              </Text>

              <Text className="mt-1 font-nunito-medium text-[16px] text-[#9096A3]">
                Tu espacio seguro para expresar lo que sientes
              </Text>
            </View>


            <Pressable
              style={{
                width:
                  48,

                height:
                  48,

                borderRadius:
                  17,

                backgroundColor:
                  "#FFFFFF",

                borderWidth:
                  1,

                borderColor:
                  "#E8EDF4",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={23}
                color="#243B63"
              />
            </Pressable>
          </Animated.View>


          {/* CARD: ¿Cómo te sientes hoy? */}
          <Animated.View
            entering={
              FadeInDown
                .delay(100)
                .duration(500)
            }
            style={{
              width:
                "100%",

              maxWidth:
                maxWidthSeccionPrincipal,

              minHeight:
                esTelefono
                  ? 185
                  : 205,

              alignSelf:
                "center",

              marginBottom:
                32,

              paddingHorizontal:
                esTelefono
                  ? 24
                  : 30,

              paddingVertical:
                esTelefono
                  ? 24
                  : 28,

              borderRadius:
                28,

              backgroundColor:
                "#E9F1FF",

              borderWidth:
                1,

              borderColor:
                "#D5E3FA",

              overflow:
                "hidden",

              shadowColor:
                "#315B9A",

              shadowOffset: {
                width:
                  0,

                height:
                  5,
              },

              shadowOpacity:
                0.08,

              shadowRadius:
                12,

              elevation:
                2,
            }}
          >
            {/* Decoraciones */}
            <View
              style={{
                position:
                  "absolute",

                width:
                  150,

                height:
                  150,

                borderRadius:
                  75,

                backgroundColor:
                  "#D9E5FF",

                right:
                  -25,

                top:
                  -40,
              }}
            />

            <View
              style={{
                position:
                  "absolute",

                width:
                  140,

                height:
                  140,

                borderRadius:
                  70,

                backgroundColor:
                  "#E8DFFF",

                right:
                  90,

                bottom:
                  -55,
              }}
            />

            <View
              style={{
                position:
                  "absolute",

                width:
                  120,

                height:
                  120,

                borderRadius:
                  60,

                backgroundColor:
                  "#F7E0EF",

                left:
                  -45,

                bottom:
                  -50,
              }}
            />


            {/* Texto */}
            <View
              style={{
                width:
                  esTelefono
                    ? "58%"
                    : "62%",
              }}
            >
              <Text
                className={`font-nunito-bold text-[#2D3748] ${
                  esTelefono
                    ? "text-[23px] leading-7"
                    : "text-[25px] leading-8"
                }`}
              >
                ¿Cómo te{"\n"}sientes hoy?
              </Text>

              <Text
                className={`mt-3 font-nunito-medium text-[#61718E] ${
                  esTelefono
                    ? "text-[16px] leading-5"
                    : "text-[16px] leading-6"
                }`}
              >
                Reconocer tus emociones es el primer paso para
                entenderte mejor.
              </Text>
            </View>


            {/* Ilustración */}
            <View
              style={{
                position:
                  "absolute",

                right:
                  esTelefono
                    ? 20
                    : 30,

                bottom:
                  24,

                width:
                  esTelefono
                    ? 115
                    : 125,

                height:
                  esTelefono
                    ? 115
                    : 125,

                borderRadius:
                  30,

                backgroundColor:
                  "#7EA8EE",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                transform: [
                  {
                    rotate:
                      "-5deg",
                  },
                ],
              }}
            >
              <View
                style={{
                  width:
                    65,

                  height:
                    85,

                  borderRadius:
                    14,

                  backgroundColor:
                    "#5E8FE4",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >
                <Ionicons
                  name="heart"
                  size={34}
                  color="#FFFFFF"
                />
              </View>

              <View
                style={{
                  position:
                    "absolute",

                  right:
                    -8,

                  bottom:
                    18,

                  width:
                    16,

                  height:
                    32,

                  borderRadius:
                    10,

                  backgroundColor:
                    "#365FAD",
                }}
              />
            </View>
          </Animated.View>


          {/* Selección de emoción */}
          <Animated.View
            entering={
              FadeInDown
                .delay(200)
                .duration(500)
            }
            style={{
              width:
                "100%",

              maxWidth:
                esWeb
                  ? 760
                  : undefined,

              alignSelf:
                "center",

              marginBottom:
                28,
            }}
          >
            <Text className="mb-1 font-nunito-bold text-[20px] text-[#2D3748]">
              ¿Cómo me siento hoy?
            </Text>

            <Text className="mb-5 font-nunito-medium text-[14px] leading-5 text-[#7A89A3]">
              Elige la emoción que mejor representa cómo te sientes.
            </Text>


            {cargandoEmociones ? (
              <Text className="font-nunito-medium text-[14px] text-[#7A89A3]">
                Cargando emociones...
              </Text>
            ) : emociones.length === 0 ? (
              <Text className="font-nunito-medium text-[14px] text-[#7A89A3]">
                No hay emociones disponibles.
              </Text>
            ) : (
              <View
                style={{
                  flexDirection:
                    "row",

                  flexWrap:
                    "wrap",

                  gap:
                    gapEmociones,
                }}
              >
                {emociones.map(
                  item => (
                    <OpcionEmocion
                      key={
                        item.id_emocion
                      }
                      nombre={
                        item.nombre
                      }
                      emoji={
                        EMOJIS_EMOCIONES[
                          item.nombre
                        ] ?? "💭"
                      }
                      seleccionada={
                        idEmocion ===
                        item.id_emocion
                      }
                      ancho={
                        anchoTarjetaEmocion
                      }
                      onPress={() =>
                        setIdEmocion(
                          item.id_emocion
                        )
                      }
                    />
                  )
                )}
              </View>
            )}
          </Animated.View>


          {/* Preguntas */}
          <Animated.View
            entering={
              FadeInDown
                .delay(300)
                .duration(500)
            }
            style={{
              width:
                "100%",

              maxWidth:
                esWeb
                  ? 760
                  : undefined,

              alignSelf:
                "center",
            }}
          >
            <CampoPreguntaDiario
              titulo="¿Qué me hizo sentir así?"
              valor={motivo}
              onChangeText={setMotivo}
              placeholder="Cuéntanos qué ocurrió..."
            />

            <CampoPreguntaDiario
              titulo="¿Cómo reaccioné?"
              valor={reaccion}
              onChangeText={setReaccion}
              placeholder="¿Qué hiciste o cómo respondiste?"
            />

            <CampoPreguntaDiario
              titulo="Una idea útil"
              valor={ideaUtil}
              onChangeText={setIdeaUtil}
              placeholder="¿Qué te gustaría recordar de esta experiencia?"
            />
          </Animated.View>


          {/* Guardar */}
          <Animated.View
            entering={
              FadeInDown
                .delay(400)
                .duration(500)
            }
            style={{
              width:
                "100%",

              maxWidth:
                esWeb
                  ? 760
                  : undefined,

              alignSelf:
                "center",
            }}
            className="mt-3"
          >
            <Button
              title={
                guardando
                  ? "Guardando..."
                  : "Guardar registro"
              }
              onPress={
                guardarRegistro
              }
              disabled={
                guardando ||
                cargandoEmociones
              }
            />
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}