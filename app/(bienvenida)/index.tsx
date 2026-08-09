import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

// IMPORTAMOS COMPONENTES REUTILIZABLES
import Logo from '@/components/ui/Logo_izq';
import Button from '@/components/ui/Button';

export default function BienvenidaPantalla() {
  const router = useRouter();

  // Funcion para avanzar a la pantalla rango edad
  const irARangoEdad = () => {
    console.log('Navegando a rango edad');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContenedor}>
      <View style={styles.contenedor}>
        
        {/* Cabezera con logo*/}
        <View style={styles.cabecera}>
          <Logo />
        </View>

        {/* Tarjeta blanca donde esta el contenido */}
        <View style={styles.tarjetaBienvenida}>
          
          {/*Avatar de kiri*/}
          <Image
            source={require('@/assets/images/mascota.png')}
            style={styles.imagenAvatar}
            resizeMode="contain"
          />

          {/*Titulo principal*/}
          <Text style={styles.titulo}>
            Tu bienestar emocional comienza con un pequeño paso.
          </Text>

          {/*Parrafos con informacion*/}
          <Text style={styles.parrafo}>
            Nos alegra que hayas decidido dedicar un momento para cuidar de ti.
            En Kiri encontrarás un espacio seguro donde podrás comprender mejor
            tus emociones, fortalecer hábitos saludables y descubrir herramientas
            que te acompañen en tu crecimiento personal.
          </Text>

          <Text style={styles.parrafo}>
            Antes de comenzar, queremos conocerte un poco más para ofrecerte una
            experiencia adaptada a tus necesidades y objetivos.
          </Text>

          {/*Mensaje que va despues de los parrafos*/}
          <Text style={styles.parrafoDestacado}>
            <Text style={styles.textoNegrita}>Recuerda: </Text>
            No buscamos juzgarte ni diagnosticarte; queremos acompañarte en el
            camino hacia un mayor bienestar.
          </Text>

        </View>

        {/*Boton de avanzar*/}
        <Button
          title="Comenzar mi experiencia  ➔"
          variant="primary"
          onPress={irARangoEdad}
          style={styles.botonComenzar}
        />

      </View>
    </ScrollView>
  );
}

//Estilos
const styles = StyleSheet.create({
  scrollContenedor: {
    flexGrow: 1,
  },
  contenedor: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },

  /*Cabezera del logo*/
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  /* Tarjeta blanca*/
  tarjetaBienvenida: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    marginTop: 10,
    marginBottom: 20,
    position: 'relative', // Permite posicionar el avatar arriba a la derecha
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  /*Avatar de kiri*/
  imagenAvatar: {
    width: 100,
    height: 200,
    marginTop: -80,
    position: 'absolute',
    top: 15,
    right: 15,
  },

  /*Textos*/
  titulo: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#2D3748',
    lineHeight: 28,
    marginBottom: 16,
    paddingRight: 55, // Espacio para no chocar con el avatar
  },
  parrafo: {
    fontSize: 18,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
    textAlign: 'justify',
    lineHeight: 22,
    marginBottom: 14,
  },
  parrafoDestacado: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
    textAlign: 'justify',
    lineHeight: 22,
  },
  textoNegrita: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#1E293B',
  },

  /*Boton*/
  botonComenzar: {
    height: 54,
    marginBottom: 40,
  },
});