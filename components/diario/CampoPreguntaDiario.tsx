import React from "react";
import { Text, TextInput, View } from "react-native";

interface CampoPreguntaDiarioProps {
  titulo: string;
  valor: string;
  onChangeText: (texto: string) => void;
  placeholder: string;
}

export function CampoPreguntaDiario({
  titulo,
  valor,
  onChangeText,
  placeholder,
}: CampoPreguntaDiarioProps) {
  return (
    <View className="mb-5">
      <Text className="mb-2 font-nunito-bold text-[20px] text-[#2D3748]">
        {titulo}
      </Text>

      <TextInput
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        className="min-h-[110px] rounded-2xl border-2 border-gray-100 bg-white px-4 py-3 font-nunito-medium text-base text-gray-700"
      />
    </View>
  );
}