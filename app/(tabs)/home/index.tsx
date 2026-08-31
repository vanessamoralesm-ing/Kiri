import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { TarjetaModulo } from '@/components/ui/TarjetaModulo';
import { TarjetaRecomendacion } from '@/components/ui/TarjetaRecomendacion';
import { EncabezadoHome } from '@/components/ui/EncabezadoHome';
import { useResumenBienestar } from '@/hooks/useResumenBienestar';

const COLORES_RECOMENDACION = [
  { fondo: 'bg-purple-100', icono: '#8B5CF6' },
  { fondo: 'bg-emerald-100', icono: '#10B981' },
  { fondo: 'bg-blue-100', icono: '#4F8EF7' },
  { fondo: 'bg-amber-100', icono: '#F59E0B' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { resumen } = useResumenBienestar();

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Encabezado avatar */}
        <EncabezadoHome />

        {/* Racha emocional */}
        <View className="bg-blue-500 rounded-3xl p-5 mb-4 shadow-md">
          <Text style={{ fontFamily: 'Nunito-SemiBold', fontSize: 16 }} className="text-blue-100 text-xs">
            Racha emocional
          </Text>

          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row items-baseline">
              <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 35, fontWeight: '700' }} className="text-white text-4xl">5</Text>
              <Text style={{ fontFamily: 'Nunito-Medium', fontSize: 12, fontWeight: '400' }} className="text-white text-xs ml-1">días</Text>
            </View>

            <View className="flex-row gap-1">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((dia, index) => (
                <View key={index} className={`w-8 h-8 rounded-full items-center justify-center ${index < 5 ? 'bg-emerald-400' : 'bg-blue-300/50'}`}>
                  <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 16, fontWeight: '700' }} className="text-white">{dia}</Text>
                </View>
              ))}
            </View>

            <Ionicons name="flame" size={26} color="#FFFFFF" />
          </View>

          <Text style={{ fontFamily: 'Nunito-Medium', fontSize: 12, fontWeight: '400' }} className="text-blue-100 text-xs text-right mt-2">
            ¡Sigue así!
          </Text>
        </View>

        {/* Mi progreso */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => console.log('Ir a Mi Progreso')} className="bg-emerald-500 rounded-3xl p-4 flex-row items-center justify-between mb-5 shadow-md">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-white/20 rounded-full mr-3 items-center justify-center" />
            <View>
              <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 16, fontWeight: '700' }} className="text-white">Mi Progreso</Text>
              <Text style={{ fontFamily: 'Nunito-Medium', fontSize: 12, fontWeight: '400' }} className="text-emerald-100 text-xs">0 insignias - 0 retos completados</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Módulos de ingreso rápido */}
        <View className="flex-row flex-wrap justify-between mb-4">
          <TarjetaModulo titulo="Nuevo Registro en Diario" nombreIcono="book-outline" onPress={() => router.push('/(tabs)/diario')} />
          <TarjetaModulo titulo="Test y Cuestionarios" nombreIcono="document-text-outline" onPress={() => router.push('/(tabs)/cuestionarios')} />
          <TarjetaModulo titulo="Ir a Foro Comunitario" nombreIcono="megaphone-outline" onPress={() => console.log('Ir a Foro')} />
          <TarjetaModulo titulo="Entrevista de Bienestar" nombreIcono="heart-outline" onPress={() => router.push('/(tabs)/entrevistas')} />
          <TarjetaModulo titulo="Técnicas Complementarias" nombreIcono="clipboard-outline" onPress={() => console.log('Ir a Técnicas Complementarias')} />
        </View>

        {/* Plan recomendado */}
        <View className="mb-12 px-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 16, fontWeight: '700', color: '#2D3748' }} className="text-slate-800 text-lg">
              Plan recomendado
            </Text>

            {resumen?.id_entrevista && resumen.actividades.length > 0 && (
              <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/entrevistas/[id]/plan', params: { id: resumen.id_entrevista } })}>
                <Text style={{ fontFamily: 'Nunito-SemiBold', fontSize: 12, fontWeight: '400' }} className="text-blue-500 text-xs">Ver más</Text>
              </TouchableOpacity>
            )}
          </View>

          {resumen?.actividades?.length ? (
            resumen.actividades.slice(0, 4).map((actividad, index) => {
              const color = COLORES_RECOMENDACION[index % COLORES_RECOMENDACION.length];
              return (
                <TarjetaRecomendacion
                  key={actividad.codigo}
                  titulo={actividad.titulo}
                  descripcion={actividad.descripcion}
                  nombreIcono={actividad.icono as keyof typeof Ionicons.glyphMap}
                  colorFondo={color.fondo}
                  colorIcono={color.icono}
                  colorTextoFlecha={color.icono}
                  onPress={() => router.push({ pathname: '/(tabs)/entrevistas/[id]/plan', params: { id: resumen.id_entrevista } })}
                />
              );
            })
          ) : (
            <TarjetaRecomendacion
              titulo="Realiza tu entrevista de bienestar"
              descripcion="Completa tu evaluación para recibir un plan personalizado."
              nombreIcono="heart-outline"
              colorFondo="bg-blue-100"
              colorIcono="#4F8EF7"
              colorTextoFlecha="#4F8EF7"
              onPress={() => router.push('/(tabs)/entrevistas')}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}