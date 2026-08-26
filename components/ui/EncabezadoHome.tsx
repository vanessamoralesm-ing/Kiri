import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useAuth } from '@/services/authProvider'; // Ajusta a la ruta real de tu authProvider

export function EncabezadoHome() {
  const { profile, user } = useAuth();

  // Prioridad: 1. Nombre preferido, 2. Primer nombre, 3. Email/Usuario por defecto
  const nombreUsuario =
    profile?.nombre_preferido ||
    profile?.nombres?.split(' ')[0] ||
    user?.user_metadata?.nombres ||
    'Usuario';

  return (
    <View style={styles.contenedorSimple}>
      {/* Texto*/}
      <View style={styles.bloqueTexto}>
        <Text style={styles.saludo}>Hola, {nombreUsuario}</Text>
        <Text style={styles.cita}>“La Paz Comienza Con Una Sonrisa”</Text>
      </View>

      {/* Avatar kiri*/}
      <View style={styles.contenedorAvatar}>
        <Image
          source={require('@/assets/images/mascota.png')}
          style={styles.imagenAvatar}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorSimple: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  bloqueTexto: {
    flex: 1,
  },
  saludo: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 30,
    color: '#2D3748',
  },
  cita: {
    fontFamily: 'Nunito-Medium',
    fontWeight:'400',
    fontSize: 14,
    color: '#2D3748',
    marginTop: 2,
  },
  contenedorAvatar: {
    width: 80,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  imagenAvatar: {
    width: '100%',
    height: '100%',
  },
});