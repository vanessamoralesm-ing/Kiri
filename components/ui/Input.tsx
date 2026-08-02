import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

// Definimos las propiedades que recibira nuestro Input
interface InputProps extends TextInputProps {
  label: string;                // Texto de la etiqueta
  rightLabel?: React.ReactNode; // Enlace u opcion a la derecha
  estiloContenedor?: StyleProp<ViewStyle>;
}

export default function Input({
  label,
  rightLabel,
  estiloContenedor,//Recibimos la propiedad
  style,
  ...props                     
}: InputProps) {
  return (
    <View style={[styles.container, estiloContenedor]}>
      {/*Encabezado del Input*/}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {rightLabel && rightLabel}
      </View>

      {/* Campo de texto de entrada */}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#8491a3" // Color gris suave para el placeholder
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,              // Separacion entre campos de texto
  },
  labelContainer: {
    flexDirection: 'row',          // Alinea el label y el rightLabel en la misma linea
    justifyContent: 'space-between', // Separa el label a la izquierda y el rightLabel a la derecha
    alignItems: 'center',
    marginBottom: 8,               // Espacio entre la etiqueta y el cuadro de texto
  },
  label: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    fontWeight: '500',
    color: '#2D3748',          
  },
  input: {
    width: '100%',
    height: 52,                    // Altura ideal para escribir cómodamente
    backgroundColor: '#e0e6fc',    // Fondo lila
    borderRadius: 14,              // Bordes suaves
    paddingHorizontal: 16,         // Espacio interno a los lados
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
  },
});