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
import Button from '@/components/ui/Button';//Importamos Button
import GoogleButton from '@/components/ui/GoogleButton'; //Importamos el Boton de google

export default function RegisterScreen() {
  const router = useRouter();

  //Funcion para navegar al login
  const irALogin = () => {
    router.push('/(auth)/login');
  };
  //Estados que se guardaran los datos es decir las variables
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [aceptoCondi, setAceptoCondi] = useState(false);//Definimos que sera una variable booleana

  //Funcion para crear la cuenta

  const registrar =() =>{
    if(!aceptoCondi){
      alert('Debes de aceptar los Terminos y Condiciones de Kiri para continuar.');
      return;
    }
    console.log('Datos de registro:',{nombre, correo, contraseña});
    //Aqui se hara la conexion con la base de datos pero ya queda una pequeña funcion de guardado
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
            placeholder="Ej: Maricarmen"
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

          {/* Checkbox de terminos y condiciones*/}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.checkbox,
                aceptoCondi && styles.checkboxActive,
              ]}
              onPress={() => setAceptoCondi(!aceptoCondi)}
            >
              {aceptoCondi && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <Text style={styles.termsText}>
              Acepto los{' '}
              <Text
                style={styles.linkText}
                onPress={() => console.log('Ver Términos')}
              >
                Términos y Condiciones
              </Text>{' '}
              y la{' '}
              <Text
                style={styles.linkText}
                onPress={() => console.log('Ver Privacidad')}
              >
                Política de Privacidad
              </Text>{' '} de Kiri.
            </Text>
          </View>

          {/* Boton crear cuenta */}
          <Button
            title="Crear Cuenta"
            variant="primary"
            onPress={registrar}
            style={styles.registroBoton}
          />

          {/*Separador */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>o regístrate con</Text>
            <View style={styles.line} />
          </View>

          {/*Boton de google*/}
          <GoogleButton
            onPress={() => console.log('Registro con Google')}
          />

          {/*Enlace a iniciar sesion pie de pagina*/}
        <View style={styles.pieContenedor}>
          <Text style={styles.pieTexto}>
            ¿Ya tienes una cuenta?{' '}
          </Text>
          <TouchableOpacity onPress={irALogin}>
            <Text style={styles.enlaceIngreso}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>

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
    marginBottom: -58,
  },
  title: {
    fontSize: 35,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#4F8EF7',
    textAlign: 'center',
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Medium',
    fontWeight: '400',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 20,
  },

  /* Estilo del contenedor formulario */
  formContainer: {
    width: '100%',
  },

  /* Estilo del checkbox de condiciones */
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: -6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#4F8EF7',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
    backgroundColor: '#F8FAFC',
  },
  checkboxActive: {
    backgroundColor: '#4F8EF7',
  },
  checkmark: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
    lineHeight: 16,
  },
  linkText: {
    color: '#4F8EF7',
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
  },

  //Estilo de registrobuton crear cuenta
  registroBoton: {
    marginTop: -5,
  },

  /* Separador*/
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 5,
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

  //Estilo de Pie de pagina para link de iniciar sesion
  pieContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  pieTexto: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#2D3748',
  },
  enlaceIngreso: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: '600',
    color: '#4F8EF7',
  },
  
});