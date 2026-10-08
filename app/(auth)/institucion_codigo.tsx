import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo_izq";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import { cn } from "@/utils/cn";

export default function InstitucionCodigoPantalla() {
  const router = useRouter();
  const { isDarkMode } = useThemeMode();
  const [codigo, setCodigo] = useState("");

  const escanearQR = () => {
    // Pendiente: integrar el escáner QR.
    console.log("Activar cámara para escaneo QR");
  };

  const verificarCodigo = () => {
    const codigoLimpio = codigo.trim();

    if (!codigoLimpio) {
      const mensaje = "Por favor, ingresa el código de tu institución.";

      if (Platform.OS === "web") alert(mensaje);
      else Alert.alert("Código requerido", mensaje);

      return;
    }

    // Pendiente: validar el código contra Supabase.
    console.log("Código a verificar:", codigoLimpio);
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      className="flex-1 bg-background"
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          // Responsive:
          // móvil usa px-4/py-6;
          // desde md aumenta el espacio a px-8/py-8.
          contentContainerClassName="grow items-center px-4 py-6 md:px-8 md:py-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Responsive:
              en móvil ocupa todo el ancho disponible;
              en pantallas grandes se limita con max-w-2xl. */}
          <View className="w-full max-w-2xl">
            <View className="mb-5 min-h-16 w-full flex-row items-center justify-between">
              <View className="min-w-0 flex-1 items-start justify-center">
                <Logo />
              </View>

               <Pressable
                onPress={() => router.back()}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Cerrar acceso institucional"
                className="ml-3 h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-secondary"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Ionicons
                  name="close"
                  size={26}
                  className="text-text-secondary"
                />
              </Pressable>
            </View>

            <View className="mb-6 items-center gap-2">
              {/* Responsive:
                  text-3xl en móvil;
                  text-4xl desde md. */}
              <Text className="text-center font-nunito-bold text-3xl text-primary md:text-4xl">
                Acceso Institucional
              </Text>

              {/* Responsive:
                  text-base en móvil;
                  text-lg desde md. */}
              <Text className="max-w-lg text-center font-nunito-medium text-base leading-6 text-text-secondary md:text-lg">
                Vincula tu cuenta con tu centro educativo para recibir ayuda
                personalizada.
              </Text>
            </View>

            <View className="w-full items-center gap-4 rounded-3xl border border-border bg-surface p-4">
              {/* Responsive:
                  área QR h-52 en móvil;
                  h-64 desde md. */}
              <View className="h-52 w-full items-center justify-center gap-3 rounded-2xl bg-surface-secondary md:h-64">
                <Ionicons
                  name="scan-outline"
                  size={56}
                  className="text-primary"
                />

                <Text className="font-nunito-medium text-sm text-text-muted">
                  Área de escaneo QR
                </Text>
              </View>

              <View className="w-full">
                <Button
                  title="Escanear un código QR"
                  variant="primary"
                  onPress={escanearQR}
                />
              </View>

              <Text className="text-center font-nunito-medium text-sm leading-5 text-text-secondary">
                Coloca el código QR frente a tu cámara.
              </Text>
            </View>

            <View className="my-6 w-full flex-row items-center">
              <View className="h-px flex-1 bg-border" />

              {/* Responsive:
                  text-xs en móvil;
                  text-sm desde md. */}
              <Text className="mx-3 text-center font-nunito-semibold text-xs text-text-secondary md:text-sm">
                O INGRESA EL CÓDIGO
              </Text>

              <View className="h-px flex-1 bg-border" />
            </View>

            <Input
              label="Código de Institución"
              placeholder="Ej.: KIRI-2026-EDU"
              value={codigo}
              onChangeText={setCodigo}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={verificarCodigo}
              accessibilityLabel="Código de Institución"
            />

            <View className="mt-1 w-full">
              <Button
                title="Verificar Institución"
                variant="primary"
                onPress={verificarCodigo}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}