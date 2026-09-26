import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo_izq";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// PANTALLA
// ==========================================================

export default function InstitucionCodigoPantalla() {
  const router = useRouter();

  const { width } = useWindowDimensions();

  const [codigo, setCodigo] = useState("");

  // ========================================================
  // TEMA
  // ========================================================

  const colorScheme = useColorScheme();
  const esOscuro = colorScheme === "dark";

  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const textMutedColor = useThemeColor({}, "textMuted");

  const primaryColor = useThemeColor({}, "primary");
  const primarySoftColor = useThemeColor({}, "primarySoft");

  const secondaryColor = useThemeColor({}, "secondary");
  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  const inputBackgroundColor = useThemeColor({}, "inputBackground");
  const inputBorderColor = useThemeColor({}, "inputBorder");
  const placeholderColor = useThemeColor({}, "placeholder");

  const borderColor = useThemeColor({}, "border");

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const esTelefono = width < 768;
  const esEscritorio = width >= 1100;

  const anchoMaximo = esEscritorio ? 720 : 560;

  const alturaCamara = esTelefono ? 210 : 260;

  // ========================================================
  // ACCIONES
  // ========================================================

  function regresar() {
    router.back();
  }

  function escanearQR() {
    // Pendiente: integrar el escáner de códigos QR.
    console.log("Activar cámara para escaneo QR");
  }

  function verificarCodigo() {
    const codigoLimpio = codigo.trim();

    if (!codigoLimpio) {
      if (Platform.OS === "web") {
        alert("Por favor, ingresa el código de tu institución.");
      } else {
        Alert.alert(
          "Código requerido",
          "Por favor, ingresa el código de tu institución.",
        );
      }

      return;
    }

    console.log("Código a verificar:", codigoLimpio);

    // Pendiente: validar el código en la base de datos.
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <StatusBar
        style={esOscuro ? "light" : "dark"}
        backgroundColor={backgroundColor}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",

            paddingHorizontal: esTelefono ? 18 : 32,
            paddingTop: esTelefono ? 16 : 28,
            paddingBottom: 36,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: anchoMaximo,
              alignSelf: "center",
            }}
          >
            {/* ==============================================
                CABECERA
            ============================================== */}

            <View
              style={{
                width: "100%",
                minHeight: 64,

                marginBottom: 18,

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  minWidth: 0,
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <Logo />
              </View>

              <Pressable
                onPress={regresar}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Cerrar acceso institucional"
                style={({ pressed }) => ({
                  width: 42,
                  height: 42,

                  marginLeft: 12,

                  flexShrink: 0,

                  borderRadius: 14,

                  alignItems: "center",
                  justifyContent: "center",

                  opacity: pressed ? 0.7 : 1,

                  backgroundColor: pressed
                    ? surfaceSecondaryColor
                    : "transparent",
                })}
              >
                <Ionicons name="close" size={26} color={textSecondaryColor} />
              </Pressable>
            </View>

            {/* ==============================================
                TÍTULO
            ============================================== */}

            <View
              style={{
                width: "100%",
                alignItems: "center",

                marginBottom: 24,

                gap: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito-Bold",

                  fontSize: esTelefono ? 27 : 35,
                  lineHeight: esTelefono ? 35 : 44,

                  color: primaryColor,
                  textAlign: "center",
                }}
              >
                Acceso Institucional
              </Text>

              <Text
                style={{
                  maxWidth: 480,

                  fontFamily: "Nunito-Medium",

                  fontSize: esTelefono ? 15 : 18,
                  lineHeight: esTelefono ? 22 : 26,

                  color: textSecondaryColor,
                  textAlign: "center",
                }}
              >
                Vincula tu cuenta con tu centro educativo para recibir ayuda
                personalizada.
              </Text>
            </View>

            {/* ==============================================
                TARJETA QR
            ============================================== */}

            <View
              style={{
                width: "100%",

                padding: 16,

                borderRadius: 24,

                borderWidth: 1,
                borderColor,

                backgroundColor: surfaceColor,

                alignItems: "center",

                gap: 14,

                ...(Platform.OS === "web"
                  ? ({
                    boxShadow: esOscuro
                      ? "0px 4px 18px rgba(0,0,0,0.22)"
                      : "0px 4px 16px rgba(0,0,0,0.06)",
                  } as any)
                  : {}),

                ...(Platform.OS === "android"
                  ? {
                    elevation: 3,
                  }
                  : {}),

                ...(Platform.OS === "ios"
                  ? {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: esOscuro ? 0.18 : 0.06,
                    shadowRadius: 12,
                  }
                  : {}),
              }}
            >
              {/* ÁREA QR */}

              <View
                style={{
                  width: "100%",
                  height: alturaCamara,

                  borderRadius: 18,

                  alignItems: "center",
                  justifyContent: "center",

                  gap: 10,

                  backgroundColor: surfaceSecondaryColor,
                }}
              >
                <Ionicons
                  name="scan-outline"
                  size={esTelefono ? 48 : 58}
                  color={primaryColor}
                />

                <Text
                  style={{
                    fontFamily: "Nunito-Medium",
                    fontSize: 13,
                    color: textMutedColor,
                  }}
                >
                  Área de escaneo QR
                </Text>
              </View>

              {/* BOTÓN ESCANEAR */}

              <Button
                title="Escanear un código QR"
                variant="primary"
                onPress={escanearQR}
                style={{
                  width: "100%",
                }}
              />

              {/* INDICACIÓN */}

              <Text
                style={{
                  fontFamily: "Nunito-Medium",
                  fontSize: 13,
                  lineHeight: 19,

                  color: textSecondaryColor,
                  textAlign: "center",
                }}
              >
                Coloca el código QR frente a tu cámara.
              </Text>
            </View>

            {/* ==============================================
                SEPARADOR
            ============================================== */}

            <View
              style={{
                width: "100%",

                marginVertical: 24,

                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: borderColor,
                }}
              />

              <Text
                style={{
                  marginHorizontal: 12,

                  fontFamily: "Nunito-SemiBold",
                  fontSize: esTelefono ? 11 : 13,
                  letterSpacing: 0.4,

                  color: textSecondaryColor,
                  textAlign: "center",
                }}
              >
                O INGRESA EL CÓDIGO
              </Text>

              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: borderColor,
                }}
              />
            </View>

            {/* ==============================================
                CÓDIGO DE INSTITUCIÓN
            ============================================== */}

            <View
              style={{
                width: "100%",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  marginBottom: 10,

                  fontFamily: "Nunito-Bold",
                  fontSize: 15,

                  color: textColor,
                }}
              >
                Código de Institución
              </Text>

              <TextInput
                value={codigo}
                onChangeText={setCodigo}
                placeholder="Ej.: KIRI-2026-EDU"
                placeholderTextColor={placeholderColor}
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={verificarCodigo}
                accessibilityLabel="Código de Institución"
                style={{
                  width: "100%",
                  minHeight: 56,

                  paddingHorizontal: 16,
                  paddingVertical: 12,

                  borderWidth: 1,
                  borderColor: inputBorderColor,

                  borderRadius: 14,

                  backgroundColor: inputBackgroundColor,

                  color: textColor,

                  fontFamily: "Nunito-Medium",
                  fontSize: 15,
                }}
              />
            </View>

            {/* ==============================================
                VERIFICAR INSTITUCIÓN
            ============================================== */}

            <Button
              title="Verificar Institución"
              variant="primary"
              onPress={verificarCodigo}
              style={{
                width: "100%",
                marginTop: 4,
                backgroundColor: secondaryColor,
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
