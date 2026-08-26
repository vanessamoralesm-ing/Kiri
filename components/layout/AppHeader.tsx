import React from "react";
import { View, Pressable } from "react-native";

import Logo from "@/components/ui/Logo_izq";

export default function AppHeader() {
  return (
    <View className="w-full flex-row items-center justify-between border-b border-gray-200 bg-['#F8FAFC'] px-5 py-2">
      
      {/* Logo de Kiri */}
      <Logo />

      {/* Perfil temporal sin imagen */}
      <Pressable>
        <View className="h-12 w-12 rounded-full bg-gray-300" />
      </Pressable>

    </View>
  );
}