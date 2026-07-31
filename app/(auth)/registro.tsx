import React, { useState } from 'react';//Importamos useState
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Input from '@/components/ui/Input';//Importamos el componente Input que se reutilizara en esta parte

export default function RegisterScreen() {
  const router = useRouter();

  //Estados que se guardaran los datos es decir las variables
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [aceptoCondi, setAceptoCondi] = useState('false');

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        {/*Logo de la app*/}
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={styles.logoTop}
          resizeMode="contain"
        />

        {/*Titulo y subtitulo de la pantalla registro*/}
        <Text style={styles.title}>Únete a Kiri</Text>
        <Text style={styles.subtitle}>
          Tu refugio emocional comienza hoy
        </Text>
        {/* CONTENEDOR DEL FORMULARIO */}
        <View style={styles.formContainer}>
          
          {/*Nombre completo*/}
          <Input
            label="Nombre completo"
            placeholder="EJ: Ana García"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />

          {/*Correo Electronico*/}
          <Input
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/*Contraseña*/}
          <Input
            label="Contraseña"
            placeholder="********"
            value={contraseña}
            onChangeText={setContraseña}
            secureTextEntry
          />

          {/*Confirmar Contraseña*/}
          <Input
            label="Confirmar Contraseña"
            placeholder="********"
            value={confirmar}
            onChangeText={setConfirmar}
            secureTextEntry
          />
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 10,
    paddingBottom: 30,
  },
  logoTop: {
    width: 200,
    height: 200,
    marginTop: -40,
    marginBottom: -45,
  },
  title: {
    fontSize: 35,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4685F6',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Medium',
    fontWeight: '400',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 25,
  },

  /* Estilo del contenedor formulario */
  formContainer: {
    width: '100%',
  },
});