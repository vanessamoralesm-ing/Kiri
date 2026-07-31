import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../components/ui/Button'; // Importamos nuestro boton reutilizable
import Input from '../../components/ui/Input';   // Importamos el input reutilizable
import GoogleButton from '@/components/ui/GoogleButton';

export default function LoginScreen() {
  const router = useRouter();

  // Estados locales para guardar lo que escribe el usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Funcion para manejar el inicio de sesion
  const handleLogin = () => {
    console.log('Iniciar sesión con:', email, password);
    // Aqui conectaremos con el backend mas adelante
  };

  // Funcion para redirigir al registro
  const handleGoToRegister = () => {
    router.push('/(auth)/modo_acceso');//Lo lleva de vuelta a la pantalla modo acceso
  };

  // Funcion para recuperar contraseña
  const handleForgotPassword = () => {
    console.log('Recuperar contraseña');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        {/*Logo de la app*/}
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={styles.logoTop}
          resizeMode="contain"
        />

        {/*Titulo de Bienvenida de inicio de sesion*/}
        <Text style={styles.title}>Bienvenido de nuevo</Text>
        <Text style={styles.subtitle}>
          Tu santuario emocional te espera.
        </Text>

        {/*Formulario*/}
        <View style={styles.formContainer}>
          
          {/* Campo Correo Electronico */}
          <Input
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Campo Contraseña */}
          <Input
            label="Contraseña"
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Oculta los caracteres de la contraseña
            rightLabel={
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            }
          />

          {/* Boton Principal Reutilizado */}
          <Button
            title="Iniciar Sesión"
            variant="primary"
            onPress={handleLogin}
            style={styles.loginBtn}
          />

          {/* Separador visual */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>o continúa con</Text>
            <View style={styles.line} />
          </View>

          {/* Boton de Iniciar Sesion con Google */}
          <GoogleButton
            onPress={() => console.log('Login con Google')}
          />

        </View>

        {/* Seccion para registrarse si aun no lo ha hecho */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            ¿Aún no tienes una cuenta?{' '}
          </Text>
          <TouchableOpacity onPress={handleGoToRegister}>
            <Text style={styles.registerLink}>Regístrate ahora</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',    // Mismo fondo claro suave de toda la app
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,//padding de ambos input
    paddingTop: 20,
    paddingBottom: 30,
  },
  logoTop: {
    width: 200,
    height: 200,
    marginTop: -40,//ELeva el logo hacia arriba
    marginBottom: -40, //Reduce el espacio sobrante debajo del logo
  },
  title: {
    fontSize: 35,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4685F6',               // Azul principal Kiri
    textAlign: 'center',
    marginBottom: 8,//Despliegue del titulo y el parrafo
  },
  //Estilo para pequeño parrafo despues de Bienvenido de nuevo
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Medium',
    fontWeight: '400',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 35, //Espacio amplio antes del siguiente componente
  },

  /*CONTENEDOR DEL FORMULARIO*/
  //Los input correo y contrasenia
  formContainer: {
    width: '100%',
  },
  //Letras de olvidaste tu contrasenia
  forgotPasswordText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    color: '#4685F6',
  },
  loginBtn: {
    marginTop: 10,// Margin del espacio del button abajo
  },

  /*Estilo del separador*/
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

  /**/
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
    color: '#4685F6',
  },
});