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
//Importamos nuestros componentes
import Logo from '@/components/ui/Logo_izq';//Importamos componente logo izq
import Button from '@/components/ui/Button';

export default function InstitucionCodigoPantalla() {
  const router = useRouter();

  // Funcion para cerrar y regresar
  const regresar = () => {
    router.back();
  };

  //Funcion para activar el escaneer QR
  const escanearQR = () => {
    console.log('Activar camara para encaneo QR');
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

        {/*Tarjeta de escaner QR*/}
        <View style={styles.tarjetaQR}>
          {/*Recuadro gris donde se vera la camara */}
          <View style={styles.cuadroCamara}/>
          {/*Boton para activar scaner */}
          <Button
          title='Escanear un Codigo QR'
          variant='primary'
          onPress={escanearQR}
          style={styles.botonEscanear}/>

          <Text style={styles.textoIndicacion}>
            Coloca el código QR frente a tu cámara
          </Text>
        </View>

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

  /* Card de QR */
  tarjetaQR: {
    backgroundColor: '#f5f8fd',
    borderRadius: 40,
    padding: 20,
    alignItems: 'center',
    borderWidth: 10,
    borderColor: '#f2f6fa',
    // Sombra suave estilo tarjeta
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 6,
  },
  cuadroCamara: {
    width: '100%',
    height: 280,
    backgroundColor: '#dae0e7',
    borderRadius: 20,
    marginBottom: 20,
  },
  botonEscanear: {
    width: '100%',
    marginBottom: 15,
  },
  textoIndicacion: {
    fontSize: 16,
    fontWeight: '300',
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
    textAlign: 'center',
  },
});