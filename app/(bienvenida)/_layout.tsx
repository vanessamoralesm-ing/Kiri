import React from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { Stack } from 'expo-router';

export default function BienvenidaLayout() {
  return (
    // Contenedor principal que lleva la imagen de fondo para las pantallas de esta seccion
    <ImageBackground
      source={require('@/assets/images/fondo_kiri2.jpeg')}
      style={styles.imagenFondo}
      resizeMode="cover"
    >
      {/* Capa transparente de las pantallas*/}
      <View style={styles.capaContenedora}>
        <Stack
          screenOptions={{
            headerShown: false, // Oculta la barra nativa
            animation: 'slide_from_right', // Transicion suave entre pantallas
            contentStyle: { backgroundColor: 'transparent' }, //Permite ver la imagen de fondo
          }}
        >
          {/* PANTALLA PRINCIPAL DE BIENVENIDA */}
          <Stack.Screen name="index" />
        </Stack>
      </View>
    </ImageBackground>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  imagenFondo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  capaContenedora: {
    flex: 1,
  },
});