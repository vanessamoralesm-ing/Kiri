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
    paddingTop: 50,                   // Margen superior para despegarlo de arriba
    paddingBottom: 30,                // Margen inferior
  },
  // Estilo especifico para el logo pequeñito de arriba
  logoTop: {
    width: 160,                       // Ancho en pixeles del logo
    height: 100,                       // Alto en pixeles del logo
    marginBottom: 20,                 // Separacion con el siguiente elemento
  },
  // Caza o caja contenedora para la imagen de la mascota
  imageContainer: {
    width: 220,                       // Ancho del contenedor
    height: 240,                      // Alto del contenedor
    justifyContent: 'center',         // Centra la imagen verticalmente adentro
    alignItems: 'center',             // Centra la imagen horizontalmente adentro
    marginBottom: 15,                 // Separacion con el texto que le agregaremos abajo
  },
  // Estilo de la imagen del avatar
  mascotImage: {
    width: '100%',                    // Toma todo el ancho de su caja (220px)
    height: '100%',                   // Toma todo el alto de su caja (220px)
  },
});