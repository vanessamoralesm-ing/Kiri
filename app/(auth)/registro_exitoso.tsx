import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '@/components/ui/Button';

export default function RegistroExitosoScreen() {
  const router = useRouter();

  // OBTENER CORREO DESDE registro.tsx
  const { email } = useLocalSearchParams<{ email?: string }>();

  // IR AL LOGIN
  const irALogin = () => {
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* LOGO */}
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={styles.logoTop}
          resizeMode="contain"
        />

        {/* ICONO CORREO */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✉️</Text>
        </View>

        {/* TÍTULO */}
        <Text style={styles.title}>¡Revisa tu correo!</Text>

        {/* MENSAJE */}
        <Text style={styles.subtitle}>
          Hemos enviado un enlace de confirmación a:
        </Text>

        {/* CORREO DEL USUARIO */}
        {email && (
          <View style={styles.emailContainer}>
            <Text style={styles.email}>{email}</Text>
          </View>
        )}

        {/* INSTRUCCIONES */}
        <Text style={styles.description}>
          Revisa tu bandeja de entrada y confirma tu cuenta para continuar usando Kiri.
        </Text>

        {/* AVISO */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Si no encuentras el mensaje, revisa también tu carpeta de spam o correo no deseado.
          </Text>
        </View>

        {/* BOTÓN LOGIN */}
        <View style={styles.buttonContainer}>
          <Button
            title="Ir a iniciar sesión"
            variant="primary"
            onPress={irALogin}
          />
        </View>

        {/* MENSAJE FINAL */}
        <Text style={styles.footerText}>
          Una vez confirmado tu correo podrás iniciar sesión con tu cuenta.
        </Text>
      </View>
    </ScrollView>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoTop: {
    width: 190,
    height: 190,
    marginTop: -45,
    marginBottom: -55,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 42,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4F8EF7',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  emailContainer: {
    width: '100%',
    backgroundColor: '#E8F1FF',
    borderWidth: 1,
    borderColor: '#B9D4FF',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginBottom: 22,
  },
  email: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    color: '#4F8EF7',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 22,
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 28,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#718096',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
  },
});