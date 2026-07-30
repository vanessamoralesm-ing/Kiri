import React from 'react';
//importaremos componentes basicos de React Native que usaremos
import {
  View, //Este funciona como un div para agrupar elementos
  Image, //Permite renderizar imagenes
  Text, //Agregamos texto
  StyleSheet, //Crear estilos visuales CSS
  ScrollView, //Permite que la pantalla tenga desplazamiento hacia abajo
} from 'react-native';

export default function WelcomeScreen() {

  return (
    //ScrollView nos ayuda a que el contenido no se corte en pantallas pequeñas
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      {/*View principal que centramos y le daremos padding a todo el contenido*/}
      <View style={styles.container}>
        
        {/*Codigo para el logo de la parte de superior de la pantalla */}
        <Image
          //Cargamos la imagen desde la carpeta de assets
          source={require('../../assets/images/logo_secundario.png')}
          //aplicamos el tamaño definido en los estilos
          style={styles.logoTop}
          //Ajustamos la imagen para que encaje sin deformarse
          resizeMode="contain"
        />

        {/*Ilustracion del avatar de kiri, Ese contenedor estaran las dimensiones fijas del avatar*/}
        <View style={styles.imageContainer}>
          <Image
           //cargamos la imagen de la mascota de la app
            source={require('../../assets/images/mascota.png')} // Cambia al nombre de tu imagen
            //Ocupa el 100% de su contenedor padre
            style={styles.mascotImage}
            //mantiene la proporcion de la imagen
            resizeMode="contain"
          />
        </View>

        {/*TITULO PRINCIPAL DE BIENVENIDA --- */}
        {/* Texto principal que contiene todo el titulo */}
        <Text style={styles.title}>
          Bienvenido a <Text style={styles.titleBlue}>Kiri</Text>
        </Text>

        {/*Agregando una linea decorativa debajo del titulo*/}
        <View style={styles.divider}></View>

        {/*SUBTITULO--- */}
        <Text style={styles.subtitle}>Cuidar de tu salud mental es un acto de fortaleza</Text>
        {/*Parrafo descriptivo de la app--- */}
        <Text style={styles.description}>
          En Kiri encontrarás herramientas para conocerte mejor, comprender tus emociones y desarrollar hábitos
          que favorezcan tu bienestar.
        </Text>

        {/*Texto de acompañamiento*/}
        <Text style={styles.footerText}>
          Nunca estarás <Text style={styles.greenText}>solo</Text> en este proceso.
        </Text>

      </View>
    </ScrollView>
  );
}

//Apartado de estilos para el logo y la mascota
const styles = StyleSheet.create({
  // Estilo para el ScrollView: hace que ocupe todo el alto disponible
  scrollContainer: {
    flexGrow: 1,                      // Permite que se estire al maximo
    backgroundColor: '#F8FAFC',      // Color de fondo claro para la pantalla
  },
  // Contenedor interno que alinea las cosas
  container: {
    flex: 1,                          // Toma todo el espacio dentro del scroll
    alignItems: 'center',             // Centra los elementos horizontalmente
    paddingHorizontal: 28,           // Margen interno a los lados (izq y der)
    paddingTop: 35,                   // Margen superior para despegarlo de arriba
    paddingBottom: 30,                // Margen inferior
  },
  // Estilo especifico para el logo pequeñito de arriba
  logoTop: {
    width: 160,                       // Ancho en pixeles del logo
    height: 90,                       // Alto en pixeles del logo
    marginBottom: 3,                 // Separacion con el siguiente elemento
  },
  // Caza o caja contenedora para la imagen de la mascota
  imageContainer: {
    width: 240,                       // Ancho del contenedor
    height: 220,                      // Alto del contenedor
    justifyContent: 'center',         // Centra la imagen verticalmente adentro
    alignItems: 'center',             // Centra la imagen horizontalmente adentro
    marginBottom: 10,                 // Separacion con el texto que le agregaremos abajo
  },
  // Estilo de la imagen del avatar
  mascotImage: {
    width: '100%',                    // Toma todo el ancho de su caja (220px)
    height: '100%',                   // Toma todo el alto de su caja (220px)
  },

  /*Estilos del Titulo y Linea Decorativa */
  title:{
    fontSize:40,
    fontWeight: '700',
    fontFamily: 'Nunito-Bold', //Fuente principal que llevara kiri
    color: '#2D3748', //Color para el texto de Bienvenida de Kiri
    textAlign: 'center',
  },

  titleBlue: {
    color: '#4F8EF7'//Color propio de la app kiri
  },
  divider: {
    width: 40,                      // Ancho de la linea decorativa
    height: 4,                      // Grosor de la linea
    backgroundColor: '#B8A8F8',     // Color morado pastel
    borderRadius: 5,                // Redondea las puntas de la linea
    marginVertical: 11,             // Margen arriba y abajo para dar aire
  },

  /* Estilo del Subtitulo*/
  subtitle:{
    fontSize:25, //Tamaño de fuente
    color:'#4F8EF7', //Color azul de kiri
    fontWeight: '600', //negrita
    fontFamily: 'Nunito-SemiBold', //Tipografia Nunito Semibold
    textAlign: 'center', //centrad horizontal
    lineHeight: 30, //Interlineado para que el texto no se vea muy pegado
    marginBottom:10, //Margen inferior para el bloque proximo
  },
  /* Estilo de la Descripcion de la app*/
  description:{
    fontSize:18,
    fontWeight:'400',
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 8,
  },

  /* Estilo texto de acompañamiento*/
  footerText: {
    fontSize:18, // Tamaño de lectura comodo
    fontFamily: 'Nunito-Medium', // Tipografía suave
    color: '#2D3748', //color base de kiri en parrafos
    textAlign: 'center',
    marginBottom: 28, // Espacio amplio antes de los botones
  },

  greenText: {
    color: '#7BBF9A', //color verde relajante para hacer distintivo a la palabra
    fontWeight: '700', //negrita para dar enfasis
    fontFamily: 'Ninito-Medium',
  },
});