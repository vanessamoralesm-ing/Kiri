import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Se importan componentes reutilizables
import Logo from '@/components/ui/Logo_izq';

export default function RangoEdadPantalla() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContenedor}>
      <View style={styles.contenedor}>
        {/* Cabecera con el logo */}
        <View style={styles.cabecera}>
          <Logo />
        </View>

        {/* Sección de títulos principales */}
        <View style={styles.seccionTitulo}>
          <Text style={styles.titulo}>¿Cuál es tu Rango de Edad?</Text>
          <Text style={styles.subtitulo}>
            Esto nos ayuda a ofrecerte una mejor experiencia
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Estilos base de la pantalla
const styles = StyleSheet.create({
  scrollContenedor: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  contenedor: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
  },

  /* Cabecera */
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -20,
  },

  /* Textos de encabezado */
  seccionTitulo: {
    alignItems: 'center',
    marginVertical: 15,
  },
  titulo: {
    fontSize: 35,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4F8EF7',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitulo: {
    fontSize: 18,
    fontFamily: 'Nunito-Medium',
    color: '#5B7083',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
});