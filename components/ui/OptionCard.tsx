
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
  onPress: () => void;           // Acción al tocar el botón
}

export default function OptionCard({
  title,
  description,
  imageSource,
  onPress,
}: OptionCardProps) {
  return (
    <View style={styles.cardContainer}>
      
      {/* 1. BOLITA CIRCULAR CON LA IMAGEN */}
      <View style={styles.avatarCircle}>
        <Image
          source={imageSource}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      </View>

      {/* 2. TÍTULO DE LA OPCIÓN */}
      <Text style={styles.cardTitle}>{title}</Text>

      {/* 3. DESCRIPCIÓN */}
      <Text style={styles.cardDescription}>{description}</Text>

      {/* 4. BOTÓN CONTINUAR CON FLECHA */}
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    
    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    
    // Sombra para Android
    elevation: 3,
  },

  // Círculo gris de fondo para la imagen
  avatarCircle: {
    width: 110,
    height: 110,
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

  // Título de la opción (Azul Kiri)
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4685F6',
    textAlign: 'center',
    marginBottom: 8,
  },

  // Descripción gris
  cardDescription: {
    fontSize: 15,
    fontFamily: 'Nunito-Medium',
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 8,
    marginBottom: 20,
  },

  // Botón con color azul degradado/sólido
  continueButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#6A9CFD', // Azul brillante relajante
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Texto del botón
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
  },
});