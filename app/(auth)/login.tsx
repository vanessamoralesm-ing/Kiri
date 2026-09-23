import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GoogleButton from '@/components/ui/GoogleButton';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/services/authProvider';
import { validateLogin } from '@/utils/validations';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  // ESTADOS DEL FORMULARIO
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // ESTADOS DEL PROCESO
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // LIMPIAR ERROR
  const limpiarError = () => {
    if (error) setError(null);
  };

  // INICIAR SESIÓN
  const handleLogin = async () => {
    setError(null);

    // VALIDACIONES
    const validationErrors = validateLogin(email, password);
    const firstError = Object.values(validationErrors).find(Boolean);
    if (firstError) {
      setError(firstError);
      return;
    }

    // LOGIN SUPABASE
    try {
      setSubmitting(true);
      await signIn(email.trim(), password);
    } catch (err: any) {
      console.error('Error iniciando sesión:', err);
      const message = err?.message?.toLowerCase?.() ?? '';
      if (message.includes('invalid login credentials')) {
        setError('Correo o contraseña incorrectos.');
      } else if (message.includes('email not confirmed')) {
        setError('Debes confirmar tu correo electrónico antes de iniciar sesión.');
      } else {
        setError(err?.message ?? 'No se pudo iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // IR AL REGISTRO
  const handleGoToRegister = () => router.push('/(auth)/modo_acceso');

  // RECUPERAR CONTRASEÑA
  const handleForgotPassword = () => {
    // Pendiente: agregar resetPassword al AuthProvider y crear pantalla de recuperación
    console.log('Recuperar contraseña');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* LOGO */}
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={styles.logoTop}
          resizeMode="contain"
        />

        {/* TÍTULO */}
        <Text style={styles.title}>Bienvenido de nuevo</Text>
        <Text style={styles.subtitle}>Tu santuario emocional te espera.</Text>

        {/* FORMULARIO */}
        <View style={styles.formContainer}>
          {/* CORREO */}
          <Input
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              limpiarError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />

          {/* CONTRASEÑA */}
          <Input
            label="Contraseña"
            placeholder="********"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              limpiarError();
            }}
            secureTextEntry={!mostrarPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password"
            rightLabel={
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            }
            rightIcon={
              <TouchableOpacity
                onPress={() => setMostrarPassword(!mostrarPassword)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={mostrarPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="#64748B"
                />
              </TouchableOpacity>
            }
          />

          {/* ERROR */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* BOTÓN LOGIN */}
          <Button
            title={submitting ? 'Ingresando...' : 'Iniciar Sesión'}
            variant="primary"
            onPress={handleLogin}
            disabled={submitting}
            style={styles.loginBtn}
          />

          {submitting && <ActivityIndicator style={styles.spinner} color="#4F8EF7" />}

          {/* SEPARADOR */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>o continúa con</Text>
            <View style={styles.line} />
          </View>

          {/* GOOGLE */}
          <GoogleButton
            onPress={() => console.log('Login con Google — pendiente de implementar')}
          />
        </View>

        {/* REGISTRO */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>¿Aún no tienes una cuenta? </Text>
          <TouchableOpacity onPress={handleGoToRegister}>
            <Text style={styles.registerLink}>Regístrate ahora</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 30,
  },
  logoTop: {
    width: 200,
    height: 200,
    marginTop: -40,
    marginBottom: -40,
  },
  title: {
    fontSize: 35,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4F8EF7',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Medium',
    fontWeight: '400',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 35,
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    color: '#4F8EF7',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginBtn: {
    marginTop: 10,
  },
  spinner: {
    marginTop: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#2D3748',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
  },
  registerLink: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    color: '#4F8EF7',
  },
});