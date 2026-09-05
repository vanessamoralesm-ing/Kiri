import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
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

import {
  OpcionEmocion,
} from "@/components/diario/OpcionEmocion";

import {
  CampoPreguntaDiario,
} from "@/components/diario/CampoPreguntaDiario";

import Button from "@/components/ui/Button";

import {
  actualizarDiarioEmocionalService,
  obtenerDetalleRegistro,
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


export default function EditarRegistroScreen() {
  const router =
    useRouter();

  const insets =
    useSafeAreaInsets();

  const {
    width,
  } =
    useWindowDimensions();

  const {
    id,
  } =
    useLocalSearchParams<{
      id: string;
    }>();


  const [
    cargando,
    setCargando,
  ] =
    useState(true);

  const [
    guardando,
    setGuardando,
  ] =
    useState(false);

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


  const maxWidthContenido =
    esWeb
      ? 980
      : esTablet
        ? 860
        : undefined;


  const maxWidthFormulario =
    esWeb
      ? 760
      : undefined;


  const paddingHorizontal =
    esTelefono
      ? 16
      : 24;


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
    if (
      !id
    ) {
      return;
    }

    const cargarDatos =
      async () => {
        try {
          setCargando(
            true
          );

          const [
            detalle,
            emocionesBD,
          ] =
            await Promise.all([
              obtenerDetalleRegistro(
                id
              ),

              obtenerEmocionesAutorregistro(),
            ]);

          if (
            !detalle
          ) {
            Alert.alert(
              "Error",
              "No se pudo encontrar el registro solicitado."
            );

            return;
          }

          setEmociones(
            emocionesBD
          );

          // Mantiene seleccionada la emoción actual.
          setIdEmocion(
            detalle.idEmocion
          );

          setMotivo(
            detalle.motivo
          );

          setReaccion(
            detalle.reaccion
          );

          setIdeaUtil(
            detalle.ideaUtil
          );
        } catch (error: any) {
          Alert.alert(
            "Error",
            error.message ||
              "No se pudo cargar el registro."
          );
        } finally {
          setCargando(
            false
          );
        }
      };

    cargarDatos();
  }, [
    id,
  ]);


  const guardarCambios =
    async () => {
      if (
        !id
      ) {
        Alert.alert(
          "Error",
          "No se encontró el registro."
        );

        return;
      }

      if (
        !idEmocion
      ) {
        Alert.alert(
          "Atención",
          "El registro no tiene una emoción seleccionada."
        );

        return;
      }

      try {
        setGuardando(
          true
        );

        await actualizarDiarioEmocionalService({
          idRegistro:
            id,

          idEmocion,

          motivo,

          reaccion,

          ideaUtil,
        });

        Alert.alert(
          "¡Actualizado!",
          "El registro ha sido modificado.",
          [
            {
              text:
                "OK",

              onPress:
                () =>
                  router.back(),
            },
          ]
        );
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message ||
            "Ocurrió un error al actualizar."
        );
      } finally {
        setGuardando(
          false
        );
      }
    };


  if (
    cargando
  ) {
    return (
      <View
        className="flex-1 items-center justify-center bg-[#F8FBFF]"
      >
        <ActivityIndicator
          size="large"
          color="#4F8EF7"
        />
      </View>
    );
  }


  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F8FBFF]"
      behavior={
        Platform.OS ===
        "ios"
          ? "padding"
          : Platform.OS ===
            "android"
            ? "height"
            : undefined
      }
      keyboardVerticalOffset={
        Platform.OS ===
        "ios"
          ? insets.top
          : 0
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingTop:
            esTelefono
              ? 12
              : 24,

          paddingBottom:
            Math.max(
              insets.bottom + 100,
              120
            ),
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
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
          <View
            className="mb-6 flex-row items-center justify-between"
          >
            <Pressable
              onPress={() =>
                router.back()
              }
              className="h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-white"
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color="#1E3A5F"
              />
            </Pressable>

            <Text
              className={`font-nunito-bold text-[#4F8EF7] ${
                esTelefono
                  ? "text-[22px]"
                  : "text-[26px]"
              }`}
            >
              Editar Registro
            </Text>

            <View
              className="w-11"
            />
          </View>


          {/* Selección de emoción */}
          <View
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
            className="mb-7"
          >
            <Text
              className="mb-4 font-nunito-bold text-[20px] text-[#2D3748]"
            >
              ¿Cómo te sentías?
            </Text>


            {emociones.length ===
            0 ? (
              <Text
                className="font-nunito-medium text-sm text-[#7A89A3]"
              >
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
          </View>


          {/* Preguntas */}
          <View
            style={{
              width:
                "100%",

              maxWidth:
                maxWidthFormulario,

              alignSelf:
                "center",
            }}
          >
            <CampoPreguntaDiario
              titulo="¿Qué me hizo sentir así?"
              valor={
                motivo
              }
              onChangeText={
                setMotivo
              }
              placeholder="Cuéntanos qué ocurrió..."
            />

            <CampoPreguntaDiario
              titulo="¿Cómo reaccioné?"
              valor={
                reaccion
              }
              onChangeText={
                setReaccion
              }
              placeholder="¿Qué hiciste o cómo respondiste?"
            />

            <CampoPreguntaDiario
              titulo="Una idea útil"
              valor={
                ideaUtil
              }
              onChangeText={
                setIdeaUtil
              }
              placeholder="¿Qué te gustaría recordar de esta experiencia?"
            />
          </View>


          {/* Botón guardar */}
          <View
            style={{
              width:
                "100%",

              maxWidth:
                maxWidthFormulario,

              alignSelf:
                "center",
            }}
            className="mt-3"
          >
            <Button
              title={
                guardando
                  ? "Guardando..."
                  : "Guardar cambios"
              }
              onPress={
                guardarCambios
              }
              disabled={
                guardando
              }
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}