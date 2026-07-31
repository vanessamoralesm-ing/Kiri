import React from 'react';
import {
  TouchableOpacity, // Componente para detectar el toque del usuario
  Text,             // Para renderizar el texto "Google"
  StyleSheet,       // Para definir los estilos visuales
  Image,            // Para renderizar el icono de Google (si decides agregarlo)
} from 'react-native';

// Definimos las propiedades props que aceptara nuestro boton de Google
interface GoogleButtonProps {
  onPress: () => void; // Funcion que se ejecutara al presionar el boton
  text?: string;   
}

export default function GoogleButton({
  onPress,
  text = 'Google',     // Aqui ponemos que por defecto dira google
}: GoogleButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}    // Suaviza la opacidad al presionar
      onPress={onPress}      // Ejecuta la funcion enviada por props
      style={styles.googleButton}
    >
      {/*Icono de google para que sala dentro del boton */}
      <Image source={require('../../assets/images/google_icon.png')} style={styles.icon} />
      
      <Text style={styles.googleButtonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Estilo del contenedor del boton de Google
  googleButton: {
    width: '100%',            // Ocupa todo el ancho del contenedor padre
    height: 52,               // Altura con los inputs
    backgroundColor: '#F8FAFC', // Fondo blanco limpio
    borderWidth: 1.5,         // Borde suave
    borderColor: '#dfe8f5',   // Gris claro para el borde
    borderRadius: 16,         // Bordes redondeados modernos
    flexDirection: 'row',     // Prepara el espacio en fila por si agregamos el icono
    justifyContent: 'center',  // Centra el contenido horizontalmente
    alignItems: 'center',      // Centra el contenido verticalmente
    
    // Sombras ligeras para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    
    // Sombra para Android
    elevation: 4,//Se ajustan debajo del boton
  },
  
  // Estilo del texto dentro del boton
  googleButtonText: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#334155',          // Gris oscuro para contraste suave
  },

  // Estilo para el icono de Google
  icon: {
    width: 24,
    height: 35,
    marginRight: 10,
  },
});