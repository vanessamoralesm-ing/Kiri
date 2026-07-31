
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';

// Definimos las propiedades (props) que recibe la tarjeta
interface OptionCardProps {
  title: string;                 // Título de la tarjeta
  description: string;           // Descripción corta
  imageSource: ImageSourcePropType; // Imagen de la bolita
  onPress: () => void;           // Accion al tocar el boton
}

export default function OptionCard({
  title,
  description,
  imageSource,
  onPress,
}: OptionCardProps) {
  return (
    <View style={styles.cardContainer}>
      
      {/* Circulo de la imagen */}
      <View style={styles.avatarCircle}>
        <Image
          source={imageSource}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      </View>

      {/* Titulo de la opcion */}
      <Text style={styles.cardTitle}>{title}</Text>

      {/* Descripcion*/}
      <Text style={styles.cardDescription}>{description}</Text>

      {/* Boton de continuar */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.continueButton}
      >
        <Text style={styles.buttonText}>Continuar  →</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor principal de la tarjeta blanca con sombra suave
  cardContainer: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginBottom: 16,
    
    // Sombras para iOS
    shadowColor: '#2D3748',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    
    // Sombra para Android
    elevation: 20, //Le das mas volumen a la sombra
  },

  // Circulo gris de fondo para la imagen
  avatarCircle: {
    width: 120,//ancho
    height: 120, //Alto
    borderRadius: 55,           // Hace que sea perfectamente circular
    backgroundColor: '#E2E8F0', // Color base gris neutro mientras carga o si la imagen tiene transparencias
    overflow: 'hidden',         // Recorta la imagen en forma circular
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Imagen ajustada dentro del círculo
  avatarImage: {
    width: '100%',
    height: '100%',
  },

  // Titulo de la opcion (Azul Kiri)
  cardTitle: {
    fontSize: 22,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '700',
    color: '#4F8EF7',
    textAlign: 'center',
    marginBottom: 2,
  },

  // Descripcion de cada tarjeta
  cardDescription: {
    fontSize: 15,
    fontFamily: 'Nunito-Medium',
    fontWeight: '400',//Negrita
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
    marginBottom: 16,
  },

  // Boton con color azul degradado
  continueButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#B8A8F8', // Color morado degradado
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Texto del boton
  buttonText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
  },
});