import React, { useState } from "react";

import {
  ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
  Text, TouchableOpacity, View
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Button from "@/components/ui/Button";
import GoogleButton from "@/components/ui/GoogleButton";
import Input from "@/components/ui/Input";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useAuth } from "@/services/authProvider";
import { validateLogin } from "@/utils/validations";

export default function LoginScreen() {
  const router = useRouter();

  const { signIn } = useAuth();

  const { width, esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ======================================================
  // ESTADOS DEL FORMULARIO
  // ======================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // ======================================================
  // ESTADOS DEL PROCESO
  // ======================================================

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ======================================================
  // LIMPIAR ERROR
  // ======================================================

  const limpiarError = () => {
    if (error) {
      setError(null);
    }
  };

  // ======================================================
  // INICIAR SESIÓN
  // ======================================================

  const handleLogin = async () => {
    setError(null);

    const validationErrors = validateLogin(email, password);

    const firstError = Object.values(validationErrors).find(Boolean);

    if (firstError) {
      setError(firstError);
      return;
    }

    try {
      setSubmitting(true);

      await signIn(email.trim(), password);
    } catch (err: any) {
      console.error("Error iniciando sesión:", err);

      const message = err?.message?.toLowerCase?.() ?? "";

      if (message.includes("invalid login credentials")) {
        setError("Correo o contraseña incorrectos.");
      } else if (message.includes("email not confirmed")) {
        setError(
          "Debes confirmar tu correo electrónico antes de iniciar sesión.",
        );
      } else {
        setError(
          err?.message ?? "No se pudo iniciar sesión. Intenta de nuevo.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // NAVEGACIÓN
  // ======================================================

  const handleGoToRegister = () => {
    router.push("/(auth)/modo_acceso");
  };

  const handleForgotPassword = () => {
    console.log("Recuperar contraseña");
  };

  // ======================================================
  // VALORES RESPONSIVE
  // ======================================================

  const paddingPagina = esEscritorio ? 48 : esTablet ? 32 : 12;

  const maxWidthFormulario = esEscritorio ? 480 : esTablet ? 460 : undefined;

  const tamanoTitulo = esEscritorio ? 38 : esTablet ? 34 : 30;

  /*
   * El panel visual se mantiene igual.
   * Únicamente adaptamos tamaños para que quepa correctamente
   * dentro del ancho disponible en cada dispositivo.
   */
  const tamanoLogo = esEscritorio ? 150 : esTablet ? 135 : 135;

  const tamanoIlustracion = esEscritorio
    ? Math.min(width * 0.32, 430)
    : esTablet
      ? Math.min(width * 0.38, 350)
      : Math.min(width * 0.82, 350);

  // ======================================================
  // UI
  // ======================================================

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.page,
            {
              flexDirection: esTelefono ? "column" : "row",

              padding: paddingPagina,

              gap: esTelefono ? 24 : 32,
            },
          ]}
        >
          {/* ==================================================
              PANEL VISUAL
          ================================================== */}

          <View
            style={[
              styles.visualPanel,
              {
                flex: esTelefono ? undefined : esEscritorio ? 1.1 : 1,

                width: esTelefono ? "100%" : undefined,
              },
            ]}
          >
            {/* LOGO */}

            <Image
              source={require("../../assets/images/splash-icon.png")}
              style={{
                width: tamanoLogo,
                height: tamanoLogo,
              }}
              resizeMode="contain"
            />

            {/* DECORACIÓN SUPERIOR */}

            <View style={styles.decorativeCircleTop} />

            <View style={styles.decorativeDot} />

            {/* ILUSTRACIÓN / MASCOTA */}

            <View style={styles.illustrationBackground}>
              <Image
                source={require("../../assets/images/mascota.png")}
                style={{
                  width: tamanoIlustracion,

                  height: tamanoIlustracion,
                }}
                resizeMode="contain"
              />
            </View>

            <View style={styles.decorativeCircleBottom} />
          </View>

          {/* ==================================================
              PANEL DEL FORMULARIO
          ================================================== */}

          <View
            style={[
              styles.formPanel,
              {
                flex: esTelefono ? undefined : 1,

                width: esTelefono ? "100%" : undefined,

                paddingHorizontal: esTelefono ? 24 : 32,

                paddingVertical: esTelefono ? 24 : 40,
              },
            ]}
          >
            <View
              style={[
                styles.formContent,
                {
                  maxWidth: maxWidthFormulario,
                },
              ]}
            >
              {/* ==================================================
                  ENCABEZADO
              ================================================== */}

              <Text
                style={[
                  styles.title,
                  {
                    fontSize: tamanoTitulo,

                    lineHeight: tamanoTitulo + 7,
                  },
                ]}
              >
                Bienvenido de nuevo
              </Text>

              <Text style={styles.subtitle}>
                Tu santuario emocional te espera.
              </Text>

              {/* ==================================================
                  FORMULARIO
              ================================================== */}

              <View style={styles.formContainer}>
                {/* CORREO */}

                <Input
                  label="Correo Electrónico"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    limpiarError();
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                />

                {/* CONTRASEÑA */}

                <Input
                  label="Contraseña"
                  placeholder="********"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    limpiarError();
                  }}
                  secureTextEntry={!mostrarPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  rightLabel={
                    <TouchableOpacity onPress={handleForgotPassword}>
                      <Text style={styles.forgotPasswordText}>
                        ¿Olvidaste tu contraseña?
                      </Text>
                    </TouchableOpacity>
                  }
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => setMostrarPassword((current) => !current)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={mostrarPassword ? "eye-off" : "eye"}
                        size={22}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  }
                />

                {/* ERROR */}

                {error && <Text style={styles.errorText}>{error}</Text>}

                {/* LOGIN */}

                <Button
                  title={submitting ? "Ingresando..." : "Iniciar Sesión"}
                  variant="primary"
                  onPress={handleLogin}
                  disabled={submitting}
                  style={styles.loginBtn}
                />

                {submitting && (
                  <ActivityIndicator style={styles.spinner} color="#4F8EF7" />
                )}

                {/* ==================================================
                    SEPARADOR
                ================================================== */}

                <View style={styles.dividerContainer}>
                  <View style={styles.line} />

                  <Text style={styles.dividerText}>o continúa con</Text>

                  <View style={styles.line} />
                </View>

                {/* GOOGLE */}

                <GoogleButton
                  onPress={() =>
                    console.log("Login con Google — pendiente de implementar")
                  }
                />
              </View>

              {/* ==================================================
                  REGISTRO
              ================================================== */}

              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                  ¿Aún no tienes una cuenta?{" "}
                </Text>

                <TouchableOpacity onPress={handleGoToRegister}>
                  <Text style={styles.registerLink}>Regístrate ahora</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ==========================================================
// ESTILOS
// ==========================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  page: {
    flex: 1,
    width: "100%",
    minHeight: "100%",
    backgroundColor: "#F8FAFC",
  },

  // ======================================================
  // PANEL VISUAL
  // ======================================================

  visualPanel: {
    position: "relative",

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",

    backgroundColor: "#FFFFFF",

    borderRadius: 28,

    minHeight: 620,
  },

  illustrationBackground: {
    alignItems: "center",
    justifyContent: "center",

    width: "78%",
    aspectRatio: 1,

    maxWidth: 470,

    borderRadius: 999,

    backgroundColor: "#F2EFFF",
  },

  decorativeCircleTop: {
    position: "absolute",

    width: 180,
    height: 180,

    borderRadius: 999,

    backgroundColor: "#F0EDFF",

    top: -90,
    left: -70,
  },

  decorativeCircleBottom: {
    position: "absolute",

    width: 160,
    height: 160,

    borderRadius: 999,

    backgroundColor: "#E2F4EA",

    bottom: -80,
    right: -60,
  },

  decorativeDot: {
    position: "absolute",

    width: 16,
    height: 16,

    borderRadius: 8,

    backgroundColor: "#B8A8F8",

    top: "30%",
    right: "12%",
  },

  // ======================================================
  // PANEL FORMULARIO
  // ======================================================

  formPanel: {
    alignItems: "center",
    justifyContent: "center",
  },

  formContent: {
    width: "100%",
    alignSelf: "center",
  },

  title: {
    width: "100%",

    fontFamily: "Nunito-Bold",

    fontWeight: "700",

    color: "#4F8EF7",

    textAlign: "center",

    marginBottom: 8,
  },

  subtitle: {
    width: "100%",

    fontSize: 17,

    fontFamily: "Nunito-Medium",

    fontWeight: "400",

    color: "#2D3748",

    textAlign: "center",

    marginBottom: 32,
  },

  formContainer: {
    width: "100%",
  },

  forgotPasswordText: {
    fontSize: 14,

    fontFamily: "Nunito-SemiBold",

    fontWeight: "600",

    color: "#4F8EF7",
  },

  errorText: {
    color: "#E53E3E",

    fontSize: 14,

    fontFamily: "Nunito-Medium",

    marginBottom: 10,

    textAlign: "center",
  },

  loginBtn: {
    marginTop: 10,
  },

  spinner: {
    marginTop: 12,
  },

  dividerContainer: {
    flexDirection: "row",

    alignItems: "center",

    width: "100%",

    marginVertical: 24,
  },

  line: {
    flex: 1,

    height: 1,

    backgroundColor: "#CBD5E1",
  },

  dividerText: {
    marginHorizontal: 15,

    fontSize: 14,

    fontFamily: "Nunito-Medium",

    color: "#64748B",
  },

  footerContainer: {
    flexDirection: "row",

    flexWrap: "wrap",

    alignItems: "center",

    justifyContent: "center",

    marginTop: 30,
  },

  footerText: {
    fontSize: 15,

    fontFamily: "Nunito-Medium",

    color: "#2D3748",
  },

  registerLink: {
    fontSize: 15,

    fontFamily: "Nunito-SemiBold",

    fontWeight: "600",

    color: "#4F8EF7",
  },
});
