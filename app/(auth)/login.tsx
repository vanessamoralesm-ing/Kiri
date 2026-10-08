import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import Button from "@/components/ui/Button";
import GoogleButton from "@/components/ui/GoogleButton";
import Input from "@/components/ui/Input";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/services/authProvider";
import { validateLogin } from "@/utils/validations";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const primaryColor = useThemeColor({}, "primary");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limpiarError = () => setError(null);

  const handleLogin = async () => {
    if (submitting) return;

    setError(null);

    const firstError = Object.values(
      validateLogin(email, password),
    ).find(Boolean);

    if (firstError) {
      setError(firstError);
      return;
    }

    try {
      setSubmitting(true);
      await signIn(email.trim(), password);
    } catch (err) {
      console.error("Error iniciando sesión:", err);

      const mensaje =
        err instanceof Error
          ? err.message
          : "No se pudo iniciar sesión. Intenta de nuevo.";

      const normalizado = mensaje.toLowerCase();

      if (normalizado.includes("invalid login credentials")) {
        setError("Correo o contraseña incorrectos.");
      } else if (normalizado.includes("email not confirmed")) {
        setError(
          "Debes confirmar tu correo electrónico antes de iniciar sesión.",
        );
      } else {
        setError(mensaje);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {/* Responsive: columna en móvil; desde md, paneles en fila. */}
        <View className="min-h-screen w-full flex-1 flex-col gap-6 bg-background p-3 md:flex-row md:gap-8 md:p-8 lg:p-12">
          {/* PANEL VISUAL */}
          <View className="relative h-72 w-full items-center justify-center overflow-hidden rounded-3xl bg-surface md:h-auto md:flex-1">
            <View className="absolute -left-16 -top-20 h-44 w-44 rounded-full bg-accent-soft" />
            <View className="absolute -bottom-20 -right-16 h-40 w-40 rounded-full bg-secondary-soft" />
            <View className="absolute right-12 top-1/3 h-4 w-4 rounded-full bg-accent" />

            {/* Responsive: logo aumenta progresivamente. */}
            <Image
              source={require("../../assets/images/splash-icon.png")}
              contentFit="contain"
              className="absolute left-6 top-4 h-28 w-28 md:h-36 md:w-36 lg:h-40 lg:w-40"
            />

            {/* Responsive: mascota compacta en móvil y mayor desde md/lg. */}
            <View className="aspect-square w-3/5 max-w-md items-center justify-center rounded-full bg-accent-soft">
              <Image
                source={require("../../assets/images/mascota.png")}
                contentFit="contain"
                className="h-40 w-40 md:h-64 md:w-64 lg:h-80 lg:w-80"
              />
            </View>
          </View>

          {/* PANEL FORMULARIO */}
          <View className="w-full items-center justify-center px-4 py-6 md:flex-1 md:px-8 md:py-10">
            <View className="w-full max-w-lg">
              {/* Responsive: título 3xl en móvil y 4xl desde md. */}
              <Text className="mb-2 text-center font-nunito-bold text-3xl text-primary md:text-4xl">
                Bienvenido de nuevo
              </Text>

              <Text className="mb-8 text-center font-nunito-medium text-base text-text md:text-lg">
                Tu santuario emocional te espera.
              </Text>

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
                  <Pressable
                    hitSlop={8}
                    onPress={() =>
                      console.log("Recuperar contraseña")
                    }
                  >
                    <Text className="font-nunito-semibold text-sm text-primary">
                      ¿Olvidaste tu contraseña?
                    </Text>
                  </Pressable>
                }
                rightIcon={
                  <Pressable
                    hitSlop={8}
                    onPress={() =>
                      setMostrarPassword((actual) => !actual)
                    }
                  >
                    <Ionicons
                      name={mostrarPassword ? "eye-off" : "eye"}
                      size={22}
                      className="text-text-secondary"
                    />
                  </Pressable>
                }
              />

              {error && (
                <Text className="mb-3 text-center font-nunito-medium text-sm text-danger">
                  {error}
                </Text>
              )}

              <View className="mt-2">
                <Button
                  title={
                    submitting
                      ? "Ingresando..."
                      : "Iniciar Sesión"
                  }
                  variant="primary"
                  onPress={handleLogin}
                  disabled={submitting}
                />
              </View>

              {submitting && (
                <ActivityIndicator
                  className="mt-3"
                  color={primaryColor}
                />
              )}

              <View className="my-6 flex-row items-center">
                <View className="h-px flex-1 bg-divider" />

                <Text className="mx-4 font-nunito-medium text-sm text-text-muted">
                  o continúa con
                </Text>

                <View className="h-px flex-1 bg-divider" />
              </View>

              <GoogleButton
                onPress={() =>
                  console.log(
                    "Login con Google — pendiente de implementar",
                  )
                }
              />

              <View className="mt-8 flex-row flex-wrap items-center justify-center">
                <Text className="font-nunito-medium text-base text-text">
                  ¿Aún no tienes una cuenta?{" "}
                </Text>

                <Pressable
                  hitSlop={8}
                  onPress={() =>
                    router.push("/(auth)/modo_acceso")
                  }
                >
                  <Text className="font-nunito-semibold text-base text-primary">
                    Regístrate ahora
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}