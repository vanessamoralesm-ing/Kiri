
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function AccessTypeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        {/* Logo principal y secundario */}
        <Image
          source={require('../../assets/images/logo_secundario.png')}
          style={styles.logoTop}
          resizeMode="contain"
        />

        {/*TITULO PRINCIPAL*/}
        <Text style={styles.title}>¿Cómo accederás?</Text>

        {/*SUBTITULO */}
        <Text style={styles.subtitle}>
          Selecciona una opción para comenzar.
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    alignItems: 'center', //se centra los elementos horizontal
    paddingHorizontal: 24, // Margen interno a los lados (izq y der)
    paddingTop: 50, // Margen superior para despegarlo de arriba
    paddingBottom: 30, // Margen inferior para el siguiente elemento
  },
  // Estilo especifico para el logo pequeñito de arriba
  logoTop: {
    width: 160,                       // Ancho en pixeles del logo
    height: 100,                       // Alto en pixeles del logo
    marginBottom: -11,                 // Separacion con el siguiente elemento
  },
  title: {
    fontSize: 40,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Medium',
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
});