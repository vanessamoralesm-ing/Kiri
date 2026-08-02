import React from 'react';
import { Image, StyleSheet, ImageStyle, StyleProp } from 'react-native';

// Propiedades que aceptará nuestro componente
interface LogoProps {
  ancho?: number;           // Ancho opcional (por defecto será 100)
  alto?: number;            // Alto opcional (por defecto será 40)
  estilo?: StyleProp<ImageStyle>; // Estilos adicionales por si necesitas moverlo
}

export default function Logo({
  ancho = 130,
  alto = 100,
  estilo,
}: LogoProps) {
  return (
    <Image
      source={require('../../assets/images/splash-icon.png')}
      style={[{ width: ancho, height: alto }, estilo]}
      resizeMode="contain"
    />
  );
}
