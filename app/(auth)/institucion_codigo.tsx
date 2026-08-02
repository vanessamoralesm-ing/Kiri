import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Logo from '@/components/ui/Logo_izq';//Importamos componente logo izq

export default function InstitucionCodigoPantalla() {
  const router = useRouter();

  // Funcion para cerrar y regresar
  const regresar = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContenedor}>
      <View style={styles.contenedor}>
        
        {/* Cabezera Logo izq y boton x*/}
        <View style={styles.cabecera}>
          <Logo/>{/*Se llama al componente logo izq */}

          <TouchableOpacity onPress={regresar} activeOpacity={0.7}>
            <Text style={styles.botonCerrar}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Apartado de titulo y subtitulo*/}
        <Text style={styles.titulo}>Acceso Institucional</Text>
        <Text style={styles.subtitulo}>
          Vincula tu cuenta con tu centro educativo para recibir ayuda personalizada
        </Text>

      </View>
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
  scrollContenedor: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },
  contenedor: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 30,
  },

  /*Boton x en el encabezado*/
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -10,
  },
  botonCerrar: {
    fontSize: 22,
    color: '#64748B',
    fontWeight: 'bold',
    padding: 5,
  },

  /* Textos de encabezado */
  titulo: {
    fontSize: 35,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4F8EF7',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 18,
    fontFamily: 'Nunito-Medium',
    fontWeight: '400',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 25,
  },
});