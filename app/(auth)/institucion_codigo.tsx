import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
//Importamos nuestros componentes reutilizables
import Logo from '@/components/ui/Logo_izq';//Importamos componente logo izq
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function InstitucionCodigoPantalla() {
  const router = useRouter();
  //Declarando variable para el codigo
  const [codigo, setCodigo] = useState('');
  // Funcion para cerrar y regresar
  const regresar = () => {
    router.back();
  };

  //Funcion para activar el escaneer QR
  const escanearQR = () => {
    console.log('Activar camara para encaneo QR');
  };

  //Funcion hecha ya para luego conectar con backend
  const verificarCodigo = () => {
    if (!codigo.trim()) {
      alert('Por favor, ingrese el codigo de tu institucion.');
      return;
    }
    console.log('Codigo a verificar:', codigo);
    //Aqui se hara la validacion la base de datos que conectaremos
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

        {/*Separador*/}
        <View style={styles.divisorContenedor}>
          <View style={styles.linea} />
          <Text style={styles.textoDivisor}>O INGRESA EL CÓDIGO</Text>
          <View style={styles.linea} />
        </View>

        {/*texto*/}
        <Input //input importado reutilizado
          label="Código de Institución"
          placeholder="EJ: KIRI-2026-EDU"
          value={codigo}
          onChangeText={setCodigo}
          autoCapitalize="characters"
          estiloContenedor={styles.bloqueInput}//Estilo del input
        />

        {/* Boton secundario verificar institucion*/}
        <Button
          title="Verificar Institución"
          variant="primary"
          onPress={verificarCodigo}
          style={styles.botonVerificar}
        />

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
    paddingTop: 5,
    paddingBottom: 30,
  },

  /*Boton x en el encabezado*/
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -25,
  },
  botonCerrar: {
    fontSize: 25,
    color: '#64748B',
    fontWeight: 'bold',
    padding: 5,
    marginTop: 20,
  },

  /* Textos de encabezado */
  titulo: {
    fontSize: 35,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4F8EF7',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 18,
    fontFamily: 'Nunito-Medium',
    fontWeight: '400',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 13,
  },

  /* Card de QR */
  tarjetaQR: {
    backgroundColor: '#f5f8fd',
    borderRadius: 40,
    padding: 5,
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
    width: '90%',
    height: 300,
    backgroundColor: '#dae0e7',
    borderRadius: 20,
    marginBottom: 15,
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
  /* SEPARADOR */
  divisorContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    marginTop:15,
    width: '100%',
  },
  linea: {
    flex: 1,
    height: 1,//grosor
    backgroundColor: '#2D3748',
  },
  textoDivisor: {
    marginHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
    letterSpacing: 0.5,//espacio entre las letras
  },

  /* Boton de verificacion*/
  botonVerificar: {
    marginTop: -10,
    backgroundColor: '#7BBF9A', // Tono verde relajante acorde a Kiri
  },
  bloqueInput: {
    marginTop: -15, //Ajusta este valor negativo para subirlo tanto como quieras
  },
});