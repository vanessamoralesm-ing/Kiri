import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Platform, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo_izq";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// PANTALLA
// ==========================================================

export default function BienvenidaEntrevista() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");
  const borderColor = useThemeColor({}, "border");
  const dividerColor = useThemeColor({}, "divider");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const textMutedColor = useThemeColor({}, "textMuted");
  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");
  const secondaryColor = useThemeColor({}, "secondary");
  const secondarySoftColor = useThemeColor({}, "secondarySoft");
  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

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

  const paddingTop = esEscritorio ? 28 : Math.max(insets.top + 8, 16);

  const paddingBottom = esEscritorio ? 48 : Math.max(insets.bottom + 32, 42);

  const paddingTarjeta = esEscritorio ? 36 : esTablet ? 30 : 22;

  // ========================================================
  // NAVEGACIÓN
  // ========================================================

  const continuar = () => {
    router.push("/(entrevista)/rango_edad");
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
              CONTENIDO
          ================================================== */}

          <View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: maxWidthContenido,
              alignSelf: "center",

              justifyContent: esEscritorio ? "center" : "flex-start",

              marginTop: esEscritorio ? 20 : 14,
            }}
          >
            <View
              style={{
                width: "100%",

                borderWidth: 1,
                borderRadius: esEscritorio ? 30 : 24,

                borderColor,

                padding: paddingTarjeta,

                backgroundColor: surfaceColor,

                ...(Platform.OS === "web"
                  ? ({
                    boxShadow: "0px 6px 22px rgba(0,0,0,0.05)",
                  } as any)
                  : {}),

                ...(Platform.OS === "ios"
                  ? {
                    shadowColor: "#000000",

                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },

                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                  }
                  : {}),

                ...(Platform.OS === "android"
                  ? {
                    elevation: 3,
                  }
                  : {}),
              }}
            >
              {/* ==================================================
                  HERO
              ================================================== */}

              <View
                style={{
                  flexDirection: esEscritorio ? "row" : "column",

                  alignItems: esEscritorio ? "center" : "flex-start",

                  gap: esEscritorio ? 34 : 0,
                }}
              >
                {/* ==================================================
                    TEXTO
                ================================================== */}

                <View
                  style={{
                    flex: esEscritorio ? 1 : undefined,

                    width: esEscritorio ? undefined : "100%",

                    minWidth: 0,
                  }}
                >
                  {/* ETIQUETA */}

                  <View
                    style={{
                      alignSelf: "flex-start",

                      paddingHorizontal: 13,
                      paddingVertical: 7,

                      borderRadius: 999,

                      backgroundColor: primarySoftColor,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 13,
                        color: primaryColor,
                      }}
                    >
                      Tu espacio de bienestar
                    </Text>
                  </View>

                  {/* TÍTULO */}

                  <Text
                    style={{
                      marginTop: 18,

                      maxWidth: esEscritorio ? 650 : undefined,

                      fontFamily: "Nunito-Bold",

                      fontSize: esEscritorio ? 32 : esTablet ? 29 : 26,

                      lineHeight: esEscritorio ? 40 : esTablet ? 36 : 33,

                      color: textColor,
                    }}
                  >
                    Tu bienestar emocional comienza con un pequeño paso.
                  </Text>

                  {/* DESCRIPCIÓN */}

                  <Text
                    style={{
                      marginTop: 18,

                      fontFamily: "Nunito-Medium",

                      fontSize: esEscritorio ? 16 : 15,

                      lineHeight: esEscritorio ? 25 : 23,

                      color: textSecondaryColor,
                    }}
                  >
                    Nos alegra que hayas decidido dedicar un momento para cuidar
                    de ti. En Kiri encontrarás un espacio seguro donde podrás
                    comprender mejor tus emociones, fortalecer hábitos
                    saludables y descubrir herramientas que te acompañen en tu
                    bienestar.
                  </Text>

                  <Text
                    style={{
                      marginTop: 14,

                      fontFamily: "Nunito-Medium",

                      fontSize: esEscritorio ? 16 : 15,

                      lineHeight: esEscritorio ? 25 : 23,

                      color: textSecondaryColor,
                    }}
                  >
                    Antes de comenzar, queremos conocerte un poco más para
                    ofrecerte una experiencia adaptada a tu etapa de vida.
                  </Text>
                </View>

                {/* ==================================================
                    MASCOTA
                ================================================== */}

                <View
                  style={{
                    width: esEscritorio ? 270 : "100%",

                    flexShrink: 0,

                    alignItems: "center",
                    justifyContent: "center",

                    marginTop: esEscritorio ? 0 : 22,

                    paddingVertical: esEscritorio ? 10 : 4,
                  }}
                >
                  <View
                    style={{
                      width: esEscritorio ? 230 : esTablet ? 190 : 160,

                      height: esEscritorio ? 230 : esTablet ? 190 : 160,

                      borderRadius: esEscritorio ? 60 : 48,

                      alignItems: "center",
                      justifyContent: "center",

                      backgroundColor: primarySoftColor,
                    }}
                  >
                    <Image
                      source={require("@/assets/images/mascota.png")}
                      resizeMode="contain"
                      style={{
                        width: esEscritorio ? 210 : esTablet ? 175 : 150,

                        height: esEscritorio ? 210 : esTablet ? 175 : 150,
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* ==================================================
                  BLOQUES INFERIORES
              ================================================== */}

              <View
                style={{
                  marginTop: esEscritorio ? 30 : 24,

                  flexDirection: esEscritorio ? "row" : "column",

                  gap: esEscritorio ? 16 : 14,
                }}
              >
                {/* INFORMACIÓN */}

                <View
                  style={{
                    flex: esEscritorio ? 1 : undefined,

                    minHeight: esEscritorio ? 120 : undefined,

                    padding: 16,

                    borderWidth: 1,
                    borderRadius: 18,

                    borderColor,

                    flexDirection: "row",
                    alignItems: "flex-start",

                    backgroundColor: surfaceSecondaryColor,
                  }}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,

                      flexShrink: 0,

                      borderRadius: 14,

                      alignItems: "center",
                      justifyContent: "center",

                      backgroundColor: primarySoftColor,
                    }}
                  >
                    <Ionicons
                      name="heart-outline"
                      size={22}
                      color={primaryColor}
                    />
                  </View>

                  <Text
                    style={{
                      flex: 1,

                      marginLeft: 12,

                      fontFamily: "Nunito-Medium",

                      fontSize: 14,
                      lineHeight: 21,

                      color: textSecondaryColor,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        color: textColor,
                      }}
                    >
                      Recuerda:{" "}
                    </Text>
                    no buscamos juzgarte ni diagnosticarte; queremos acompañarte
                    en el camino hacia un mayor bienestar.
                  </Text>
                </View>

                {/* PRIVACIDAD */}

                <View
                  style={{
                    flex: esEscritorio ? 1 : undefined,

                    minHeight: esEscritorio ? 120 : undefined,

                    padding: 16,

                    borderWidth: 1,
                    borderRadius: 18,

                    borderColor,

                    flexDirection: "row",
                    alignItems: "flex-start",

                    backgroundColor: surfaceColor,
                  }}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,

                      flexShrink: 0,

                      borderRadius: 14,

                      alignItems: "center",
                      justifyContent: "center",

                      backgroundColor: secondarySoftColor,
                    }}
                  >
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={22}
                      color={secondaryColor}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      marginLeft: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Bold",
                        fontSize: 14,
                        color: textColor,
                      }}
                    >
                      Tu información es importante
                    </Text>

                    <Text
                      style={{
                        marginTop: 5,

                        fontFamily: "Nunito-Medium",

                        fontSize: 13,
                        lineHeight: 19,

                        color: textMutedColor,
                      }}
                    >
                      Responde con tranquilidad y de la manera más sincera
                      posible.
                    </Text>
                  </View>
                </View>
              </View>

              {/* ==================================================
                  SEPARADOR
              ================================================== */}

              <View
                style={{
                  height: 1,

                  marginTop: 24,

                  backgroundColor: dividerColor,
                }}
              />

              {/* ==================================================
                  BOTÓN
              ================================================== */}

              <View
                style={{
                  width: "100%",

                  marginTop: 22,

                  alignItems: esEscritorio ? "flex-end" : "stretch",
                }}
              >
                <View
                  style={{
                    width: esEscritorio ? 280 : "100%",
                  }}
                >
                  <Button
                    title="Continuar"
                    variant="primary"
                    onPress={continuar}
                    style={{
                      minHeight: 56,
                      borderRadius: 16,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
