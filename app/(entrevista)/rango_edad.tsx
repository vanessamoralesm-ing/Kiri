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

// ==========================================================
// TIPOS
// ==========================================================

type RangoEdad = "nino" | "adolescente" | "adulto";

// ==========================================================
// OPCIONES
// ==========================================================

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

// ==========================================================
// PANTALLA
// ==========================================================

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

  const maxWidthContenido = esEscritorio ? 1050 : esTablet ? 760 : 560;

  const paddingTop = esEscritorio ? 28 : Math.max(insets.top + 12, 24);

  const paddingBottom = esEscritorio ? 48 : Math.max(insets.bottom + 28, 40);

  const tarjetasHorizontales = !esEscritorio;

  const anchoImagen = esEscritorio ? 118 : esTelefono ? 74 : 88;

  const altoImagen = anchoImagen;

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
        style={{
          flex: 1,
          width: "100%",
        }}
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
              LOGOTIPO
          ================================================== */}

          <View
            style={{
              width: "100%",

              minHeight: esEscritorio ? 66 : 54,

              flexDirection: "row",

              alignItems: "center",

              justifyContent: "flex-start",
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

              marginTop: esEscritorio ? 26 : esTablet ? 22 : 18,

              marginBottom: esEscritorio ? 30 : esTablet ? 26 : 22,
            }}
          >
            {/* ICONO */}

            <View
              style={{
                width: esEscritorio ? 64 : esTelefono ? 54 : 60,

                height: esEscritorio ? 64 : esTelefono ? 54 : 60,

                borderRadius: esEscritorio ? 20 : 17,

                alignItems: "center",

                justifyContent: "center",

                backgroundColor: primarySoftColor,
              }}
            >
              <Ionicons
                name="people-outline"
                size={esEscritorio ? 30 : 26}
                color={primaryColor}
              />
            </View>

            {/* TÍTULO */}

            <Text
              style={{
                width: "100%",

                marginTop: esTelefono ? 12 : 16,

                fontFamily: "Nunito-Bold",

                fontSize: esEscritorio ? 34 : esTablet ? 30 : 25,

                lineHeight: esEscritorio ? 42 : esTablet ? 38 : 33,

                textAlign: "center",

                color: primaryColor,
              }}
            >
              ¿Cuál es tu rango de edad?
            </Text>

            {/* DESCRIPCIÓN */}

            <Text
              style={{
                width: "100%",

                maxWidth: 620,

                marginTop: 9,

                fontFamily: "Nunito-Medium",

                fontSize: esEscritorio ? 16 : 14,

                lineHeight: esEscritorio ? 24 : 21,

                textAlign: "center",

                color: textSecondaryColor,
              }}
            >
              Esto nos ayuda a ofrecerte una experiencia adaptada a tu etapa de
              vida.
            </Text>
          </View>

          {/* ==================================================
              OPCIONES DE EDAD
          ================================================== */}

          <View
            style={{
              width: "100%",

              maxWidth: maxWidthContenido,

              alignSelf: "center",

              flexDirection: tarjetasHorizontales ? "column" : "row",

              alignItems: "stretch",

              gap: esEscritorio ? 18 : 12,
            }}
          >
            {OPCIONES_EDAD.map((opcion) => {
              const seleccionada = opcionSeleccionada === opcion.id;

              return (
                <Pressable
                  key={opcion.id}
                  disabled={cargando}
                  onPress={() => setOpcionSeleccionada(opcion.id)}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: seleccionada,
                    disabled: cargando,
                  }}
                  accessibilityLabel={`${opcion.titulo}, ${opcion.subtitulo}`}
                  style={({ pressed }) => ({
                    width: esEscritorio ? undefined : "100%",

                    flex: esEscritorio ? 1 : undefined,

                    borderRadius: esEscritorio ? 24 : 18,

                    overflow: "hidden",

                    opacity: cargando ? 0.65 : pressed ? 0.82 : 1,

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
                  {/* Superficie visual separada del Pressable */}

                  <View
                    style={{
                      width: "100%",

                      minHeight: esEscritorio ? 255 : esTelefono ? 106 : 120,

                      padding: esEscritorio ? 20 : esTelefono ? 13 : 16,

                      borderWidth: seleccionada ? 2 : 1,

                      borderColor: seleccionada ? primaryColor : borderColor,

                      borderRadius: esEscritorio ? 24 : 18,

                      flexDirection: tarjetasHorizontales ? "row" : "column",

                      alignItems: "center",

                      justifyContent: esEscritorio ? "center" : "flex-start",

                      backgroundColor: seleccionada
                        ? primarySoftColor
                        : surfaceColor,
                    }}
                  >
                    {/* ======================================
                        IMAGEN
                    ====================================== */}

                    <View
                      style={{
                        width: anchoImagen,

                        height: altoImagen,

                        flexShrink: 0,

                        borderRadius: esEscritorio ? 34 : 19,

                        alignItems: "center",

                        justifyContent: "center",

                        overflow: "hidden",

                        backgroundColor: seleccionada
                          ? surfaceColor
                          : surfaceSecondaryColor,
                      }}
                    >
                      <Image
                        source={opcion.imagen}
                        resizeMode="contain"
                        style={{
                          width: anchoImagen - 8,

                          height: altoImagen - 8,
                        }}
                      />
                    </View>

                    {/* ======================================
                        INFORMACIÓN
                    ====================================== */}

                    <View
                      style={{
                        flex: tarjetasHorizontales ? 1 : undefined,

                        minWidth: 0,

                        marginLeft: tarjetasHorizontales
                          ? esTelefono
                            ? 13
                            : 16
                          : 0,

                        marginTop: esEscritorio ? 16 : 0,

                        alignItems: esEscritorio ? "center" : "flex-start",

                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito-Bold",

                          fontSize: esEscritorio ? 21 : esTelefono ? 17 : 19,

                          lineHeight: esEscritorio ? 28 : 24,

                          textAlign: esEscritorio ? "center" : "left",

                          color: textColor,
                        }}
                      >
                        {opcion.titulo}
                      </Text>

                      <Text
                        style={{
                          marginTop: 4,

                          fontFamily: "Nunito-Medium",

                          fontSize: esEscritorio ? 14 : 13,

                          lineHeight: 19,

                          textAlign: esEscritorio ? "center" : "left",

                          color: textSecondaryColor,
                        }}
                      >
                        {opcion.subtitulo}
                      </Text>
                    </View>

                    {/* ======================================
                        INDICADOR
                    ====================================== */}

                    {esEscritorio ? (
                      seleccionada && (
                        <View
                          style={{
                            position: "absolute",

                            top: 14,

                            right: 14,

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
                      )
                    ) : (
                      <View
                        style={{
                          width: 30,

                          height: 30,

                          marginLeft: 8,

                          flexShrink: 0,

                          borderRadius: 15,

                          alignItems: "center",

                          justifyContent: "center",

                          backgroundColor: seleccionada
                            ? primaryColor
                            : surfaceSecondaryColor,
                        }}
                      >
                        <Ionicons
                          name={seleccionada ? "checkmark" : "chevron-forward"}
                          size={seleccionada ? 18 : 19}
                          color={
                            seleccionada ? textOnPrimaryColor : primaryColor
                          }
                        />
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* ==================================================
              INFORMACIÓN DE AYUDA
          ================================================== */}

          <View
            style={{
              width: "100%",

              maxWidth: maxWidthContenido,

              alignSelf: "center",

              marginTop: esEscritorio ? 24 : 18,

              padding: esTelefono ? 13 : 16,

              borderWidth: 1,

              borderRadius: 16,

              borderColor,

              flexDirection: "row",

              alignItems: "center",

              backgroundColor: surfaceColor,
            }}
          >
            {/* ICONO */}

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

            {/* TEXTO */}

            <View
              style={{
                flex: 1,

                minWidth: 0,

                marginLeft: 12,

                justifyContent: "center",
              }}
            >
              <Text
                style={{
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
          </View>

          {/* ==================================================
              BOTÓN CONTINUAR
          ================================================== */}

          <View
            style={{
              width: "100%",

              maxWidth: maxWidthContenido,

              alignSelf: "center",

              marginTop: esEscritorio ? 28 : 22,

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
