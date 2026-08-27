import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { EncabezadoHome } from '@/components/ui/EncabezadoHome';
import { TarjetaModulo } from '@/components/ui/TarjetaModulo';
import { TarjetaRecomendacion } from '@/components/ui/TarjetaRecomendacion';
//import { useAuth } from '@/services/authProvider';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1 px-4 pt-2"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/*Encabezado avatar*/}
        <EncabezadoHome/>

        {/*Racha emocional*/}
        <View className="bg-blue-500 rounded-3xl p-5 mb-4 shadow-md">
          <Text style={{ fontFamily: 'Nunito-SemiBold', fontSize: 16 }}
            className="text-blue-100 text-xs">
            Racha emocional
          </Text>

          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row items-baseline">
              <Text style={{ fontFamily: 'Nunito-Bold', fontSize:35, fontWeight: '700'}} 
                className="text-white text-4xl">5</Text>
              <Text style={{ fontFamily: 'Nunito-Medium', fontSize:12, fontWeight:'400'}} 
                className="text-white text-xs ml-1">
                días
              </Text>
            </View>

            <View className="flex-row gap-1">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((dia, index) => (
                <View
                  key={index}
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    index < 5 ? 'bg-emerald-400' : 'bg-blue-300/50'
                  }`}
                >
                  <Text style={{ fontFamily: 'Nunito-Bold', fontSize:16, fontWeight: '700' }} 
                    className="text-white">
                    {dia}
                  </Text>
                </View>
              ))}
            </View>

            <Ionicons name="flame" size={26} color="#FFFFFF" />
          </View>

          <Text style={{ fontFamily: 'Nunito-Medium', fontSize:12, fontWeight:'400' }} 
            className="text-blue-100 text-xs text-right mt-2">
            ¡Sigue así!
          </Text>
        </View>

        {/*Cuadro mi progreso*/}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => console.log('Ir a Mi Progreso')}
          className="bg-emerald-500 rounded-3xl p-4 flex-row items-center justify-between mb-5 shadow-md"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-white/20 rounded-full mr-3 items-center justify-center" />

            <View>
              <Text style={{ fontFamily: 'Nunito-Bold', fontSize:16, fontWeight: '700' }} 
                className="text-white">
                Mi Progreso
              </Text>

              <Text style={{ fontFamily: 'Nunito-Medium', fontSize:12, fontWeight:'400' }} 
                className="text-emerald-100 text-xs">
                0 insignias - 0 retos completados
              </Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/*Seccion de Modulos de ingreso rapido*/}
        <View className="flex-row flex-wrap justify-between mb-4">
          <TarjetaModulo
            titulo="Nuevo Registro en Diario"
            nombreIcono="book-outline"
            onPress={() => router.push('/(tabs)/diario')}
          />

          <TarjetaModulo
            titulo="Test y Cuestionarios"
            nombreIcono="document-text-outline"
            onPress={() => router.push('/(tabs)/cuestionarios')}
          />

          <TarjetaModulo
            titulo="Ir a Foro Comunitario"
            nombreIcono="megaphone-outline"
            onPress={() => console.log('Ir a Foro')}
          />

          <TarjetaModulo
            titulo="Plan Recomendado"
            nombreIcono="clipboard-outline"
            onPress={() => console.log('Ir a Plan')}
          />
        </View>

        {/*Seccion para ti hoy*/}
        <View className="mb-12 px-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text style={{ fontFamily: 'Nunito-Bold', fontSize:16, fontWeight: '700', color: '#2D3748'}} 
              className="text-slate-800 text-lg">
              Para ti hoy
            </Text>

            <TouchableOpacity>
              <Text style={{ fontFamily: 'Nunito-SemiBold', fontSize:12, fontWeight:'400'}} 
                className="text-blue-500 text-xs">
                Ver más
              </Text>
            </TouchableOpacity>
          </View>

          <TarjetaRecomendacion
            titulo="Ejercicio de Respiración"
            tiempo="5 min"
            descripcion="Reduce el estrés y centra tu mente."
            nombreIcono="body-outline"
            colorFondo="bg-purple-100"
            colorIcono="#8B5CF6"
            colorTextoFlecha="#8B5CF6"
            onPress={() =>
              console.log('Ir a Ejercicio de Respiración')
            }
          />

          <TarjetaRecomendacion
            titulo="Lectura Recomendada"
            tiempo="7 min"
            descripcion="Pequeñas ideas para una mente tranquila."
            nombreIcono="leaf-outline"
            colorFondo="bg-emerald-100"
            colorIcono="#10B981"
            colorTextoFlecha="#10B981"
            onPress={() =>
              console.log('Ir a Lectura Recomendada')
            }
          />

          <TarjetaRecomendacion
            titulo="Música Relajante"
            tiempo="12 min"
            descripcion="Relaja tu cuerpo y libera tensiones."
            nombreIcono="headset-outline"
            colorFondo="bg-blue-100"
            colorIcono="#4F8EF7"
            colorTextoFlecha="#4F8EF7"
            onPress={() =>
              console.log('Ir a Música Relajante')
            }
          />

          <TarjetaRecomendacion
            titulo="Reto del Día"
            descripcion="Reflexiona sobre tres cosas positivas que viviste hoy."
            nombreIcono="happy-outline"
            colorFondo="bg-amber-100"
            colorIcono="#F59E0B"
            colorTextoFlecha="#F59E0B"
            onPress={() => console.log('Ir a Reto del Día')}
          />
        </View>
      </ScrollView>
    </View>
  );
}