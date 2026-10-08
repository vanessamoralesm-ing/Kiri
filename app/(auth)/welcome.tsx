import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/fondo_kiri.png.jpeg")}
      resizeMode="cover"
      className="flex-1"
    >
      {/* Capa visual usando el color semántico del tema. */}
      <View className="absolute inset-0 bg-background opacity-60" />

      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="grow items-center justify-center px-5 py-6 md:px-9 md:py-8 lg:px-12"
        >
          {/* Responsive:
              móvil ocupa todo el ancho;
              desde md se limita y aparece como tarjeta. */}
          <View className="w-full max-w-6xl flex-col items-center gap-3 md:flex-row md:gap-6 md:rounded-3xl md:border md:border-border md:bg-surface md:p-8 lg:gap-8 lg:p-12">
            {/* PANEL VISUAL
                Responsive:
                móvil ocupa todo el ancho;
                desde md comparte la mitad del espacio. */}
            <View className="w-full items-center justify-center md:min-h-96 md:flex-1">
              {/* Responsive:
                  logo compacto en móvil;
                  aumenta desde md y lg. */}
              <Image
                source={require("../../assets/images/logo_secundario.png")}
                contentFit="contain"
                className="mb-2 h-12 w-28 md:mb-4 md:h-16 md:w-36 lg:h-20 lg:w-44"
              />

              {/* Responsive:
                  círculo y mascota pequeños en móvil;
                  crecen progresivamente en tablet/escritorio. */}
              <View className="aspect-square w-1/2 max-w-sm items-center justify-center rounded-full bg-accent-soft md:w-3/4">
                <Image
                  source={require("../../assets/images/mascota.png")}
                  contentFit="contain"
                  className="h-40 w-40 md:h-64 md:w-64 lg:h-80 lg:w-80"
                />
              </View>
            </View>

            {/* PANEL DE CONTENIDO
                Responsive:
                móvil debajo de la ilustración;
                desde md aparece a la derecha. */}
            <View className="w-full items-center justify-center md:min-h-96 md:flex-1">
              {/* Responsive:
                  título 3xl en móvil;
                  4xl desde md. */}
              <Text className="text-center font-nunito-bold text-3xl text-text md:text-4xl">
                Bienvenido a{" "}
                <Text className="text-primary">
                  Kiri
                </Text>
              </Text>

              <View className="mb-4 mt-3 h-1 w-14 rounded-full bg-accent" />

              {/* Responsive:
                  subtítulo aumenta desde md. */}
              <Text className="max-w-lg text-center font-nunito-semibold text-lg leading-7 text-primary md:text-xl">
                Cuidar de tu salud mental es un acto de fortaleza
              </Text>

              <Text className="mt-3 max-w-lg text-center font-nunito-medium text-sm leading-6 text-text-secondary md:text-base">
                En Kiri encontrarás herramientas para conocerte mejor,
                comprender tus emociones y desarrollar hábitos que favorezcan
                tu bienestar.
              </Text>

              <Text className="mb-4 mt-2 text-center font-nunito-medium text-sm text-text-secondary md:text-base">
                Nunca estarás{" "}
                <Text className="font-nunito-bold text-secondary">
                  solo
                </Text>{" "}
                en este proceso.
              </Text>

              <View className="mt-2 w-full max-w-md">
                <Button
                  title="Comenzar"
                  variant="primary"
                  onPress={() => router.push("/(auth)/modo_acceso")}
                />

                <View className="my-4 flex-row items-center">
                  <View className="h-px flex-1 bg-divider" />

                  <Text className="mx-4 font-nunito-medium text-sm text-text-muted">
                    o
                  </Text>

                  <View className="h-px flex-1 bg-divider" />
                </View>

                <Button
                  title="¿Ya tienes una cuenta? Iniciar sesión"
                  variant="secondary"
                  onPress={() => router.push("/(auth)/login")}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}