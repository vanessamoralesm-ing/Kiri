import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";

export default function RegistroExitosoScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{
    email?: string | string[];
  }>();

  const correo = Array.isArray(email) ? email[0] : email;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="grow justify-center px-4 py-8 md:px-8 lg:py-12"
      >
        {/* Responsive:
            móvil ocupa todo el ancho disponible;
            desde md se convierte visualmente en una tarjeta centrada. */}
        <View className="w-full max-w-xl self-center items-center md:rounded-3xl md:border md:border-border md:bg-surface md:p-8 md:shadow-sm">
          {/* Responsive: logo ligeramente mayor desde md. */}
          <Image
            source={require("../../assets/images/splash-icon.png")}
            contentFit="contain"
            className="mb-4 h-20 w-32 md:h-24 md:w-36"
          />

          {/* Responsive: icono aumenta desde md. */}
          <View className="mb-5 h-20 w-20 items-center justify-center rounded-3xl bg-primary-soft md:h-24 md:w-24">
            <Ionicons
              name="mail-outline"
              size={38}
              className="text-primary"
            />
          </View>

          {/* Responsive: título 2xl en móvil y 3xl desde md. */}
          <Text className="text-center font-nunito-bold text-2xl text-primary md:text-3xl">
            ¡Revisa tu correo!
          </Text>

          <Text className="mt-2 max-w-md text-center font-nunito-medium text-base leading-6 text-text-secondary">
            Hemos enviado un enlace de confirmación a:
          </Text>

          {correo && (
            <View className="mt-4 w-full rounded-xl border border-primary bg-primary-soft px-4 py-3">
              {/* Responsive: texto normal en móvil y ligeramente mayor desde md. */}
              <Text
                selectable
                className="text-center font-nunito-semibold text-sm leading-5 text-primary md:text-base"
              >
                {correo}
              </Text>
            </View>
          )}

          <Text className="mt-5 max-w-lg text-center font-nunito-medium text-base leading-6 text-text-secondary">
            Revisa tu bandeja de entrada y confirma tu cuenta para continuar
            usando Kiri.
          </Text>

          <View className="mt-6 w-full flex-row items-start gap-3 rounded-2xl border border-border bg-surface-secondary p-4">
            <View className="h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
              <Ionicons
                name="bulb-outline"
                size={20}
                className="text-primary"
              />
            </View>

            <Text className="flex-1 font-nunito-medium text-sm leading-5 text-text-secondary">
              Si no encuentras el mensaje, revisa también tu carpeta de spam o
              correo no deseado.
            </Text>
          </View>

          <View className="mt-7 w-full">
            <Button
              title="Ir a iniciar sesión"
              variant="primary"
              onPress={() => router.replace("/(auth)/login")}
            />
          </View>

          <View className="mt-5 max-w-md flex-row items-start justify-center gap-2">
            <Ionicons
              name="information-circle-outline"
              size={17}
              className="mt-0.5 text-icon"
            />

            <Text className="flex-1 text-center font-nunito-medium text-xs leading-5 text-text-muted">
              Una vez confirmado tu correo podrás iniciar sesión con tu cuenta.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}