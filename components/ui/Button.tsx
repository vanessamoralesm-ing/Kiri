import React from 'react';
import {
  TouchableOpacity, // Componente tactil que cambia la opacidad al presionar
  Text,             // Para renderizar el texto del boton
  StyleSheet,       // Para los estilos
  ViewStyle,        // Tipo de TypeScript para validar estilos de contenedor
  TextStyle,        // Tipo de TypeScript para validar estilos de texto
  StyleProp,        //Con este acepta un objeto de estilo ya no se queda solo con uno
} from 'react-native';

// Definimos las propiedades (props) que aceptara nuestro botón
interface ButtonProps {
  title: string;                   // El texto que mostrará el boton
  onPress: () => void;             // La funcion que se ejecuta al presionar
  variant?: 'primary' | 'secondary'; // Variante de diseño: relleno azul o solo borde
  style?: StyleProp<ViewStyle>;              // Permite objetos y arreglos de estilos
  disabled?: boolean; //Permite deshabiliar el boton
}

export default function Button({
  title,
  onPress,
  variant = 'primary',             // Por defecto será azul (primary)
  style,
  disabled = false, //Por defecto lo ponemos en falso
}: ButtonProps) {
  // Determinamos que estilos aplicar segun la variante recibida
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      activeOpacity={0.8} // Reduce suavemente la opacidad al tocar
      onPress={onPress}   // Ejecuta la accion asignada
      disabled={disabled} //Evita click cuando esta deshabilitado
      style={[
        styles.buttonBase,                     // Estilo base (alto, ancho, bordes)
        isPrimary ? styles.primaryButton : styles.secondaryButton, // Color segun variante
        style,                                 // Estilos personalizados opcionales
      ]}
    >
      <Text
        style={[
          styles.textBase,                     // Estilo base de texto (fuente, tamaño)
          isPrimary ? styles.primaryText : styles.secondaryText, // Color de texto
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Estilo común para todos los botones
  buttonBase: {
    width: '100%',                 // Ocupa todo el ancho disponible
    height: 56,                    // Altura comoda
    borderRadius: 18,              // Bordes completamente redondeados
    justifyContent: 'center',       // Centra el texto verticalmente
    alignItems: 'center',           // Centra el texto horizontalmente
    marginVertical: 8,             // Separación vertical entre botones
  },
  
  // Variante Principal (Boton Azul)
  primaryButton: {
    backgroundColor: '#4F8EF7',    // Azul distintivo de Kiri
  },
  
  // Variante Secundaria (Boton con Borde)
  secondaryButton: {
    backgroundColor: 'transparent', // Fondo transparente
    borderWidth: 2,                // Grosor del borde
    borderColor: '#4F8EF7',        // Borde azul de Kiri
  },

  // Estilo comun de texto
  textBase: {
    fontSize: 18,                  // Tamaño de letra legible
    fontWeight: '700',             // Negrita
    fontFamily: 'Nunito-Bold',      // Tipografia de la app
  },

  // Color de texto para el botón principal
  primaryText: {
    color: '#F8FAFC',              // Texto blanco
  },

  // Color de texto para el botón secundario
  secondaryText: {
    color: '#4F8EF7',              // Texto azul
  },
});