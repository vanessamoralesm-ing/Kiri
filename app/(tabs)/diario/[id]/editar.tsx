import React, { useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OpcionEmocion } from "@/components/diario/OpcionEmocion";

import { CampoPreguntaDiario } from "@/components/diario/CampoPreguntaDiario";

import Button from "@/components/ui/Button";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

import {
  actualizarDiarioEmocionalService,
  obtenerDetalleRegistro,
  obtenerEmocionesAutorregistro,
} from "@/services/diario/autorregistro.service";

import { EmocionAutorregistro } from "@/types/diario";

// ==========================================================
// EMOJIS
// ==========================================================

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

// ==========================================================
// COMPONENTE
// ==========================================================

export default function EditarRegistroScreen() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  // ========================================================
  // ESTADO
  // ========================================================

  const [cargando, setCargando] = useState(true);

  const [guardando, setGuardando] = useState(false);

  const [emociones, setEmociones] = useState<EmocionAutorregistro[]>([]);

  const [idEmocion, setIdEmocion] = useState("");

  const [motivo, setMotivo] = useState("");

  const [reaccion, setReaccion] = useState("");

  const [ideaUtil, setIdeaUtil] = useState("");

  const [anchoGridEmociones, setAnchoGridEmociones] = useState(0);

  // ========================================================
  // TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidthContenido = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  const maxWidthFormulario = esEscritorio
    ? 820
    : esTablet
      ? MAX_WIDTHS.formulario
      : undefined;

  const columnasEmociones = esEscritorio ? 5 : esTablet ? 4 : 3;

  const gapEmociones = esEscritorio ? 14 : 12;

  const anchoTarjetaEmocion = useMemo(() => {
    if (anchoGridEmociones <= 0) {
      return 0;
    }

    const espacioTotal = gapEmociones * (columnasEmociones - 1);

    return (anchoGridEmociones - espacioTotal) / columnasEmociones;
  }, [anchoGridEmociones, columnasEmociones, gapEmociones]);

  const paddingTop = esEscritorio ? 28 : esTablet ? 22 : 14;

  const paddingBottom = esEscritorio ? 64 : Math.max(insets.bottom + 100, 120);

  // ========================================================
  // CARGAR DATOS
  // ========================================================

  useEffect(() => {
    if (!id) {
      return;
    }

    const cargarDatos = async () => {
      try {
        setCargando(true);

        const [detalle, emocionesBD] = await Promise.all([
          obtenerDetalleRegistro(id),

          obtenerEmocionesAutorregistro(),
        ]);

        if (!detalle) {
          Alert.alert("Error", "No se pudo encontrar el registro solicitado.");

          return;
        }

        setEmociones(emocionesBD);

        setIdEmocion(detalle.idEmocion);

        setMotivo(detalle.motivo);

        setReaccion(detalle.reaccion);

        setIdeaUtil(detalle.ideaUtil);
      } catch (error: any) {
        Alert.alert("Error", error.message || "No se pudo cargar el registro.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  // ========================================================
  // GUARDAR CAMBIOS
  // ========================================================

  const guardarCambios = async () => {
    if (!id) {
      Alert.alert("Error", "No se encontró el registro.");

      return;
    }

    if (!idEmocion) {
      Alert.alert("Atención", "El registro no tiene una emoción seleccionada.");

      return;
    }

    try {
      setGuardando(true);

      await actualizarDiarioEmocionalService({
        idRegistro: id,

        idEmocion,

        motivo,

        reaccion,

        ideaUtil,
      });

      Alert.alert("¡Actualizado!", "El registro ha sido modificado.", [
        {
          text: "OK",

          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Ocurrió un error al actualizar.");
    } finally {
      setGuardando(false);
    }
  };

  // ========================================================
  // MEDIR GRID DE EMOCIONES
  // ========================================================

  const medirGridEmociones = (event: LayoutChangeEvent) => {
    const nuevoAncho = event.nativeEvent.layout.width;

    if (Math.abs(nuevoAncho - anchoGridEmociones) > 1) {
      setAnchoGridEmociones(nuevoAncho);
    }
  };

  // ========================================================
  // CARGANDO
  // ========================================================

  if (cargando) {
    return (
      <View
        style={{
          flex: 1,

          alignItems: "center",

          justifyContent: "center",

          backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color={primaryColor} />

        <Text
          style={{
            marginTop: 12,

            fontFamily: "Nunito-Medium",

            fontSize: 14,

            color: textMutedColor,
          }}
        >
          Cargando registro...
        </Text>
      </View>
    );
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,

        backgroundColor,
      }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : Platform.OS === "android"
            ? "height"
            : undefined
      }
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop,

          paddingBottom,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* ==================================================
            CONTENEDOR PRINCIPAL
        ================================================== */}

        <View
          style={{
            width: "100%",

            maxWidth: maxWidthContenido,

            alignSelf: "center",

            paddingHorizontal,
          }}
        >
          {/* ==================================================
              ENCABEZADO
          ================================================== */}

          <View
            style={{
              width: "100%",

              maxWidth: maxWidthFormulario,

              alignSelf: "center",

              marginBottom: esEscritorio ? 30 : 24,

              flexDirection: "row",

              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              style={({ pressed }) => ({
                width: 46,

                height: 46,

                flexShrink: 0,

                borderRadius: 15,

                borderWidth: 1,

                borderColor,

                alignItems: "center",

                justifyContent: "center",

                backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,
              })}
            >
              <Ionicons name="arrow-back" size={21} color={textColor} />
            </Pressable>

            <View
              style={{
                flex: 1,

                minWidth: 0,

                paddingHorizontal: 16,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esEscritorio ? 30 : esTablet ? 27 : 24,

                  color: primaryColor,
                }}
              >
                Editar registro
              </Text>

              {!esTelefono && (
                <Text
                  style={{
                    marginTop: 3,

                    fontFamily: "Nunito-Medium",

                    fontSize: 14,

                    color: textMutedColor,
                  }}
                >
                  Actualiza la información de tu autorregistro.
                </Text>
              )}
            </View>

            {/* Conserva simetría visual en móvil */}

            {esTelefono && (
              <View
                style={{
                  width: 46,

                  height: 46,
                }}
              />
            )}
          </View>

          {/* ==================================================
              SELECCIÓN DE EMOCIÓN
          ================================================== */}

          <View
            style={{
              width: "100%",

              maxWidth: maxWidthFormulario,

              alignSelf: "center",

              marginBottom: 30,

              padding: esEscritorio ? 24 : esTablet ? 22 : 0,

              borderRadius: esEscritorio || esTablet ? 22 : 0,

              borderWidth: esEscritorio || esTablet ? 1 : 0,

              borderColor,

              backgroundColor:
                esEscritorio || esTablet ? surfaceColor : "transparent",
            }}
          >
            <Text
              style={{
                marginBottom: 4,

                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 21 : 20,

                color: textColor,
              }}
            >
              ¿Cómo te sentías?
            </Text>

            <Text
              style={{
                marginBottom: 20,

                fontFamily: "Nunito-Medium",

                fontSize: 14,

                lineHeight: 20,

                color: textSecondaryColor,
              }}
            >
              Selecciona la emoción que representa mejor cómo te sentías en ese
              momento.
            </Text>

            {emociones.length === 0 ? (
              <View
                style={{
                  padding: 20,

                  borderRadius: 18,

                  borderWidth: 1,

                  borderColor,

                  backgroundColor: surfaceColor,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",

                    fontFamily: "Nunito-Medium",

                    fontSize: 14,

                    color: textSecondaryColor,
                  }}
                >
                  No hay emociones disponibles.
                </Text>
              </View>
            ) : (
              <View
                onLayout={medirGridEmociones}
                style={{
                  width: "100%",

                  flexDirection: "row",

                  flexWrap: "wrap",

                  gap: gapEmociones,
                }}
              >
                {emociones.map((item) => (
                  <OpcionEmocion
                    key={item.id_emocion}
                    nombre={item.nombre}
                    emoji={EMOJIS_EMOCIONES[item.nombre] ?? "💭"}
                    seleccionada={idEmocion === item.id_emocion}
                    ancho={anchoTarjetaEmocion}
                    onPress={() => setIdEmocion(item.id_emocion)}
                  />
                ))}
              </View>
            )}
          </View>

          {/* ==================================================
              PREGUNTAS
          ================================================== */}

          <View
            style={{
              width: "100%",

              maxWidth: maxWidthFormulario,

              alignSelf: "center",

              padding: esEscritorio ? 24 : esTablet ? 22 : 0,

              borderRadius: esEscritorio || esTablet ? 22 : 0,

              borderWidth: esEscritorio || esTablet ? 1 : 0,

              borderColor,

              backgroundColor:
                esEscritorio || esTablet ? surfaceColor : "transparent",
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
          </View>

          {/* ==================================================
              BOTÓN GUARDAR
          ================================================== */}

          <View
            style={{
              width: "100%",

              maxWidth: maxWidthFormulario,

              alignSelf: "center",

              marginTop: 18,
            }}
          >
            <Button
              title={guardando ? "Guardando..." : "Guardar cambios"}
              onPress={guardarCambios}
              disabled={guardando}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
