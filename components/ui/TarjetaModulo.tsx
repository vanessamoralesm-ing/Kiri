import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importamos Ionicons desde Expo

// Definimos los datos que recibira cada tarjeta
interface TarjetaModuloProps {
  titulo: string;
  nombreIcono: keyof typeof Ionicons.glyphMap; // Tipo TypeScript estricto para nombres de Ionicons
  onPress: () => void;
}

export const TarjetaModulo = ({ titulo, nombreIcono, onPress }: TarjetaModuloProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      // w-[48%]: Para crear la cuadricula de 2 columnas
      // Se agrego clases de sombra personalizadas para un efecto mas "negrito" y definido
      className="w-[48%] bg-white p-4 rounded-3xl shadow-sm shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-slate-100 items-center justify-center my-2"
    >
      {/* Fondo azul claro para el contenedor del icono */}
      <View className="bg-blue-50 p-4 rounded-2xl mb-3">
        <Ionicons name={nombreIcono} size={30} color="#4F8EF7" />
      </View>

      {/* Titulo de la tarjeta con fuente Nunito SemiBold */}
      <Text className="text-slate-700 text-center font-nunito-semibold text-s leading-tight">
        {titulo}
      </Text>
    </TouchableOpacity>
  );
};