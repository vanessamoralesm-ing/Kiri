import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo_izq";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { crearEntrevista } from "@/services/entrevista/entrevistaService";

type RangoEdad = "nino" | "adolescente" | "adulto";

const OPCIONES_EDAD = [
  {
    id: "nino" as RangoEdad,
    titulo: "Niño",
    subtitulo: "6 - 11 años",
    imagen: require("@/assets/images/kid_edad.png"),
  },
  {
    id: "adolescente" as RangoEdad,
    titulo: "Adolescente",
    subtitulo: "12 - 17 años",
    imagen: require("@/assets/images/joven_edad.png"),
  },
  {
    id: "adulto" as RangoEdad,
    titulo: "Adulto",
    subtitulo: "18 años en adelante",
    imagen: require("@/assets/images/adulto_edad.png"),
  },
];

export default function RangoEdadPantalla() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

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
  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  // ========================================================
  // ESTADOS
  // ========================================================

  const [opcionSeleccionada, setOpcionSeleccionada] =
    useState<RangoEdad | null>(null);

  const [cargando, setCargando] = useState(false);

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const paddingHorizontal = esEscritorio
    ? PADDING_RESPONSIVE.escritorio
    : esTablet
      ? PADDING_RESPONSIVE.tablet
      : PADDING_RESPONSIVE.telefono;

  const maxWidthPantalla = esEscritorio
    ? MAX_WIDTHS.dashboard
    : esTablet
      ? MAX_WIDTHS.contenido
      : undefined;

  const maxWidthContenido = esEscritorio ? 1050 : esTablet ? 760 : undefined;

  const paddingTop = esEscritorio ? 28 : Math.max(insets.top + 8, 18);

  const paddingBottom = esEscritorio ? 48 : Math.max(insets.bottom + 28, 40);

  // ========================================================
  // CONTINUAR
  // ========================================================

  const manejarContinuar = async () => {
    if (!opcionSeleccionada || cargando) {
      return;
    }

    // Entrevista para niños
    if (opcionSeleccionada === "nino") {
      router.replace("/(entrevista)/ninos/kids_entrv");

      return;
    }

    // Entrevista para adolescentes y adultos
    try {
      setCargando(true);

      const entrevista = await crearEntrevista();

      router.replace(
        `/(entrevista)/jovenes-adultos/${entrevista.id_entrevista}/generales`,
      );
    } catch (error) {
      console.error("Error creando entrevista:", error);

      Alert.alert(
        "No pudimos iniciar la entrevista",
        error instanceof Error
          ? error.message
          : "Ocurrió un problema inesperado. Inténtalo nuevamente.",
      );
    } finally {
      setCargando(false);
    }
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <SafeAreaView
      edges={[]}
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop,
          paddingBottom,
        }}
      >
        <View
          style={{
            flex: 1,

            width: "100%",
            maxWidth: maxWidthPantalla,

            alignSelf: "center",

            paddingHorizontal,
          }}
        >
          {/* ==================================================
              CABECERA
          ================================================== */}

          <View
            style={{
              minHeight: 58,

              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Logo />
          </View>

          {/* ==================================================
              ENCABEZADO
          ================================================== */}

          <View
            style={{
              width: "100%",
              maxWidth: 720,

              alignSelf: "center",

              alignItems: "center",

              marginTop: esEscritorio ? 26 : 18,

              marginBottom: esEscritorio ? 30 : 24,
            }}
          >
            <View
              style={{
                width: esEscritorio ? 62 : 54,

                height: esEscritorio ? 62 : 54,

                borderRadius: esEscritorio ? 20 : 17,

                alignItems: "center",
                justifyContent: "center",

                backgroundColor: primarySoftColor,
              }}
            >
              <Ionicons
                name="people-outline"
                size={esEscritorio ? 29 : 25}
                color={primaryColor}
              />
            </View>

            <Text
              style={{
                marginTop: 15,

                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 34 : esTablet ? 30 : 27,

                lineHeight: esEscritorio ? 42 : 35,

                textAlign: "center",

                color: primaryColor,
              }}
            >
              ¿Cuál es tu rango de edad?
            </Text>

            <Text
              style={{
                marginTop: 8,

                maxWidth: 620,

                fontFamily: "Nunito-Medium",

                fontSize: esEscritorio ? 16 : 15,

                lineHeight: esEscritorio ? 23 : 21,

                textAlign: "center",

                color: textSecondaryColor,
              }}
            >
              Esto nos ayuda a ofrecerte una experiencia adaptada a tu etapa de
              vida.
            </Text>
          </View>

          {/* ==================================================
              OPCIONES
          ================================================== */}

          <View
            style={{
              width: "100%",
              maxWidth: maxWidthContenido,

              alignSelf: "center",

              flexDirection: esEscritorio ? "row" : "column",

              gap: esEscritorio ? 18 : 14,
            }}
          >
            {OPCIONES_EDAD.map((opcion) => {
              const seleccionada = opcionSeleccionada === opcion.id;

              return (
                <Pressable
                  key={opcion.id}
                  disabled={cargando}
                  onPress={() => setOpcionSeleccionada(opcion.id)}
                  style={({ pressed }) => ({
                    flex: esEscritorio ? 1 : undefined,

                    width: esEscritorio ? undefined : "100%",

                    minHeight: esEscritorio ? 255 : 118,

                    padding: esEscritorio ? 22 : 16,

                    borderWidth: seleccionada ? 2 : 1,

                    borderRadius: esEscritorio ? 24 : 20,

                    borderColor: seleccionada ? primaryColor : borderColor,

                    flexDirection: esEscritorio ? "column" : "row",

                    alignItems: "center",

                    justifyContent: esEscritorio ? "center" : "flex-start",

                    backgroundColor: seleccionada
                      ? primarySoftColor
                      : pressed
                        ? surfaceSecondaryColor
                        : surfaceColor,

                    opacity: cargando ? 0.65 : pressed ? 0.86 : 1,

                    ...(Platform.OS === "web"
                      ? ({
                        boxShadow: seleccionada
                          ? "0px 6px 18px rgba(79,142,247,0.12)"
                          : "0px 3px 10px rgba(0,0,0,0.04)",
                      } as any)
                      : {}),

                    ...(Platform.OS === "ios"
                      ? {
                        shadowColor: "#000000",

                        shadowOffset: {
                          width: 0,
                          height: 3,
                        },

                        shadowOpacity: 0.05,
                        shadowRadius: 7,
                      }
                      : {}),

                    ...(Platform.OS === "android"
                      ? {
                        elevation: seleccionada ? 3 : 1,
                      }
                      : {}),
                  })}
                >
                  {/* IMAGEN */}

                  <View
                    style={{
                      width: esEscritorio ? 125 : 78,

                      height: esEscritorio ? 125 : 78,

                      flexShrink: 0,

                      borderRadius: esEscritorio ? 38 : 24,

                      alignItems: "center",
                      justifyContent: "center",

                      backgroundColor: seleccionada
                        ? surfaceColor
                        : surfaceSecondaryColor,
                    }}
                  >
                    <Image
                      source={opcion.imagen}
                      resizeMode="contain"
                      style={{
                        width: esEscritorio ? 110 : 68,

                        height: esEscritorio ? 110 : 68,
                      }}
                    />
                  </View>

                  {/* TEXTO */}

                  <View
                    style={{
                      flex: esEscritorio ? undefined : 1,

                      minWidth: 0,

                      marginLeft: esEscritorio ? 0 : 16,

                      marginTop: esEscritorio ? 16 : 0,

                      alignItems: esEscritorio ? "center" : "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",

                        fontSize: esEscritorio ? 21 : 18,

                        color: textColor,

                        textAlign: esEscritorio ? "center" : "left",
                      }}
                    >
                      {opcion.titulo}
                    </Text>

                    <Text
                      style={{
                        marginTop: 4,

                        fontFamily: "Nunito-Medium",

                        fontSize: esEscritorio ? 14 : 13,

                        color: textSecondaryColor,

                        textAlign: esEscritorio ? "center" : "left",
                      }}
                    >
                      {opcion.subtitulo}
                    </Text>
                  </View>

                  {/* CHECK */}

                  {seleccionada && (
                    <View
                      style={{
                        position: esEscritorio ? "absolute" : "relative",

                        top: esEscritorio ? 14 : undefined,

                        right: esEscritorio ? 14 : undefined,

                        marginLeft: esEscritorio ? 0 : 10,

                        width: 30,
                        height: 30,

                        borderRadius: 15,

                        alignItems: "center",
                        justifyContent: "center",

                        backgroundColor: primaryColor,
                      }}
                    >
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={textOnPrimaryColor}
                      />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* ==================================================
              AYUDA
          ================================================== */}

          <View
            style={{
              width: "100%",
              maxWidth: maxWidthContenido,

              alignSelf: "center",

              marginTop: esEscritorio ? 24 : 20,

              padding: 14,

              borderWidth: 1,
              borderRadius: 16,

              borderColor,

              flexDirection: "row",
              alignItems: "flex-start",

              backgroundColor: surfaceColor,
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,

                flexShrink: 0,

                borderRadius: 12,

                alignItems: "center",
                justifyContent: "center",

                backgroundColor: primarySoftColor,
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={21}
                color={primaryColor}
              />
            </View>

            <Text
              style={{
                flex: 1,

                marginLeft: 11,

                fontFamily: "Nunito-Medium",

                fontSize: 13,
                lineHeight: 19,

                color: textMutedColor,
              }}
            >
              Selecciona la opción que corresponde a tu edad actual. Esto nos
              permitirá dirigir la entrevista al formato más adecuado para ti.
            </Text>
          </View>

          {/* ==================================================
              BOTÓN
          ================================================== */}

          <View
            style={{
              width: "100%",
              maxWidth: maxWidthContenido,

              alignSelf: "center",

              marginTop: esEscritorio ? 28 : 24,

              alignItems: esEscritorio ? "flex-end" : "stretch",
            }}
          >
            {cargando && (
              <View
                style={{
                  marginBottom: 10,

                  flexDirection: "row",
                  alignItems: "center",

                  gap: 8,
                }}
              >
                <ActivityIndicator size="small" color={primaryColor} />

                <Text
                  style={{
                    fontFamily: "Nunito-Medium",

                    fontSize: 13,

                    color: textSecondaryColor,
                  }}
                >
                  Preparando entrevista...
                </Text>
              </View>
            )}

            <View
              style={{
                width: esEscritorio ? 300 : "100%",
              }}
            >
              <Button
                title={cargando ? "Preparando entrevista..." : "Continuar"}
                variant="primary"
                onPress={manejarContinuar}
                disabled={!opcionSeleccionada || cargando}
                style={{
                  minHeight: 56,
                  borderRadius: 16,

                  opacity: !opcionSeleccionada || cargando ? 0.55 : 1,
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
