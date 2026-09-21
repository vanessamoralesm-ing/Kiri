import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";

import { MAX_WIDTHS, PADDING_RESPONSIVE } from "@/constants/responsive";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export default function RegistroExitosoScreen() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ==========================================================
  // PARÁMETROS
  // ==========================================================

  const { email } = useLocalSearchParams<{
    email?: string | string[];
  }>();

  const correo = Array.isArray(email) ? email[0] : email;

  // ==========================================================
  // TEMA
  // ==========================================================

  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const borderColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const textMutedColor = useThemeColor({}, "textMuted");
  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");
  const iconColor = useThemeColor({}, "icon");

  // ==========================================================
  // RESPONSIVE
  // ==========================================================

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

  const maxWidthTarjeta = esEscritorio ? 560 : esTablet ? 520 : undefined;

  const paddingTop = esEscritorio ? 48 : Math.max(insets.top + 18, 28);

  const paddingBottom = esEscritorio ? 48 : Math.max(insets.bottom + 28, 40);

  // ==========================================================
  // ACCIONES
  // ==========================================================

  const irALogin = () => {
    router.replace("/(auth)/login");
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor,
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: maxWidthTarjeta,
            alignItems: "center",

            paddingHorizontal: esTelefono ? 0 : 28,

            paddingVertical: esEscritorio ? 32 : 24,

            borderRadius: esTelefono ? 0 : 26,

            borderWidth: esTelefono ? 0 : 1,

            borderColor,

            backgroundColor: esTelefono ? "transparent" : surfaceColor,

            ...(Platform.OS === "web" && !esTelefono
              ? ({
                boxShadow: "0px 6px 20px rgba(0,0,0,0.05)",
              } as any)
              : {}),

            ...(Platform.OS === "ios" && !esTelefono
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

            ...(Platform.OS === "android" && !esTelefono
              ? {
                elevation: 3,
              }
              : {}),
          }}
        >
          {/* ==================================================
              LOGO
          ================================================== */}

          <Image
            source={require("../../assets/images/splash-icon.png")}
            resizeMode="contain"
            style={{
              width: esEscritorio ? 150 : esTablet ? 140 : 128,

              height: esEscritorio ? 100 : esTablet ? 94 : 86,

              marginBottom: 14,
            }}
          />

          {/* ==================================================
              ICONO
          ================================================== */}

          <View
            style={{
              width: esEscritorio ? 86 : 78,

              height: esEscritorio ? 86 : 78,

              borderRadius: esEscritorio ? 28 : 25,

              alignItems: "center",
              justifyContent: "center",

              backgroundColor: primarySoftColor,

              marginBottom: 20,
            }}
          >
            <Ionicons
              name="mail-outline"
              size={esEscritorio ? 40 : 36}
              color={primaryColor}
            />
          </View>

          {/* ==================================================
              TÍTULO
          ================================================== */}

          <Text
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esEscritorio ? 30 : esTablet ? 28 : 26,

              lineHeight: esEscritorio ? 38 : 34,

              textAlign: "center",

              color: primaryColor,
            }}
          >
            ¡Revisa tu correo!
          </Text>

          {/* ==================================================
              SUBTÍTULO
          ================================================== */}

          <Text
            style={{
              maxWidth: 440,

              marginTop: 10,

              fontFamily: "Nunito-Medium",

              fontSize: esEscritorio ? 16 : 15,

              lineHeight: 23,

              textAlign: "center",

              color: textSecondaryColor,
            }}
          >
            Hemos enviado un enlace de confirmación a:
          </Text>

          {/* ==================================================
              CORREO
          ================================================== */}

          {correo && (
            <View
              style={{
                width: "100%",

                marginTop: 14,

                paddingHorizontal: 16,
                paddingVertical: 13,

                borderWidth: 1,
                borderRadius: 14,

                borderColor: primaryColor,
                backgroundColor: primarySoftColor,
              }}
            >
              <Text
                selectable
                style={{
                  fontFamily: "Nunito-SemiBold",

                  fontSize: esTelefono ? 14 : 15,

                  lineHeight: 21,

                  textAlign: "center",

                  color: primaryColor,
                }}
              >
                {correo}
              </Text>
            </View>
          )}

          {/* ==================================================
              DESCRIPCIÓN
          ================================================== */}

          <Text
            style={{
              maxWidth: 470,

              marginTop: 20,

              fontFamily: "Nunito-Medium",

              fontSize: 15,
              lineHeight: 23,

              textAlign: "center",

              color: textSecondaryColor,
            }}
          >
            Revisa tu bandeja de entrada y confirma tu cuenta para continuar
            usando Kiri.
          </Text>

          {/* ==================================================
              INFORMACIÓN
          ================================================== */}

          <View
            style={{
              width: "100%",

              marginTop: 22,

              padding: 16,

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
              <Ionicons name="bulb-outline" size={20} color={primaryColor} />
            </View>

            <Text
              style={{
                flex: 1,

                marginLeft: 12,

                fontFamily: "Nunito-Medium",

                fontSize: 13,
                lineHeight: 20,

                color: textSecondaryColor,
              }}
            >
              Si no encuentras el mensaje, revisa también tu carpeta de spam o
              correo no deseado.
            </Text>
          </View>

          {/* ==================================================
              BOTÓN
          ================================================== */}

          <View
            style={{
              width: "100%",
              marginTop: 26,
            }}
          >
            <Button
              title="Ir a iniciar sesión"
              variant="primary"
              onPress={irALogin}
            />
          </View>

          {/* ==================================================
              MENSAJE FINAL
          ================================================== */}

          <View
            style={{
              marginTop: 18,

              flexDirection: "row",
              alignItems: "flex-start",

              justifyContent: "center",

              maxWidth: 450,
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={17}
              color={iconColor}
              style={{
                marginTop: 1,
                marginRight: 6,
              }}
            />

            <Text
              style={{
                flex: 1,

                fontFamily: "Nunito-Medium",

                fontSize: 12,
                lineHeight: 18,

                textAlign: "center",

                color: textMutedColor,
              }}
            >
              Una vez confirmado tu correo podrás iniciar sesión con tu cuenta.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
