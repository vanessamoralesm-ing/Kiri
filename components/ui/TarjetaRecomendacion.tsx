import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Definimos las propiedades que recibira cada tarjeta de recomendacion
interface TarjetaRecomendacionProps {
  titulo: string;
  tiempo?: string; // Opcional, por si alguna tarjeta como Reto no lleva tiempo
  descripcion: string;
  nombreIcono: keyof typeof Ionicons.glyphMap;
  colorFondo: string;  // Clase de NativeWind para el fondo 'bg-purple-50'
  colorIcono: string;  // Hexadecimal para el color del icono '#8B5CF6'
  colorTextoFlecha: string; // Hexadecimal para la flecha
  onPress: () => void;
}

export const TarjetaRecomendacion = ({
  titulo,
  tiempo,
  descripcion,
  nombreIcono,
  colorFondo,
  colorIcono,
  colorTextoFlecha,
  onPress,
}: TarjetaRecomendacionProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      // Contenedor principal de la tarjeta en horizontal (icono a la izquierda, textos al centro)
     className={`${colorFondo} w-[100%] self-center p-5 rounded-2xl mb-3.5 flex-row items-center justify-between border border-black/5 shadow-sm`}
    >
      <View className="flex-row items-center flex-1 mr-2">
        {/* Icono representativo a la izquierda */}
        <View className="mr-4 items-center justify-center">
          <Ionicons name={nombreIcono} size={40} color={colorIcono} />
        </View>

        {/* Textos: Titulo, tiempo y descripcion */}
        <View className="flex-1">
          {/* Titulo */}
          <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 16, fontWeight: '700', color: '#2D3748' }}>
            {titulo}
          </Text>

          {tiempo && (
            <Text className="text-slate-400 text-s font-nunito-semibold my-0.5">
              {tiempo}
            </Text>
          )}

          <Text className="text-slate-500 font-nunito-semibold text-s leading-4 mt-0.5">
            {descripcion}
          </Text>
        </View>
      </View>

      {/* Flecha a la derecha */}
      <Ionicons name="arrow-forward" size={20} color={colorTextoFlecha} />
    </TouchableOpacity>
  );
};