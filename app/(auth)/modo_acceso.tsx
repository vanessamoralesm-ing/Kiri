
import { useRouter } from 'expo-router'; //Hook para navegar entre pantallas
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from '../../components/ui/Button'; //Importamos nuestro componente reusable
import OptionCard from '../../components/ui/OptionCard'; //Importamos nuestro componente reusable los card


export default function AccessTypeScreen() {
  const router = useRouter();

  //Acciones de las tarjetas
  //Funcion para continuar como Usuario Independiente e ir al registro
  const handleIndependetUser = () => {
    router.push('/(auth)/registro'); //Redirige al registro
  };

  //Funcion para continuar como usuario de una Institucion Educativa
  const handleEducationalInstitution = () => {
    router.push('/(auth)/institucion_codigo');//Redirige al flujo de codigo de la institucion
  };

  //Funcion para crear un panel administrativo para una comunidad
  const handleAdminInstitucion = () => {
    router.push('/(auth)/registro_institucion');
  };

  //Accion para ir al login
  //Funcion para redirigir al inicio de sesion
  const irLogin = () => {
    router.push('/(auth)/login'); //Ajusta la ruta al login
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        {/* Logo principal y secundario */}
        <Image
          source={require('../../assets/images/logo_secundario.png')}
          style={styles.logoTop}
          resizeMode="contain"
        />

        {/*TITULO PRINCIPAL*/}
        <Text style={styles.title}>¿Cómo accederás?</Text>

        {/*SUBTITULO */}
        <Text style={styles.subtitle}>
          Selecciona una opción para comenzar.
        </Text>
        
        {/*Agregamos un card para el modo de elegir entrar en la app*/}
        {/*Card de Usuario Independiente*/}
        <OptionCard
        title='Usuario Independiente'
        description='Cuida tu bienestar emocional con herramientas personalizadas.'
        imageSource={require('../../assets/images/usuario.png')} onPress={handleIndependetUser}>
        </OptionCard>

        {/*Card de el usuario pertenece a una Institucion*/}
        <OptionCard
        title='Institucion Educativa'
        description='Accede con el código de tu colegio o universidad.'
        imageSource={require('../../assets/images/institucion_user.png')} onPress={handleEducationalInstitution}>
        </OptionCard>

        {/*Card Soy una institucion*/}
        <OptionCard
        title='Soy Institucion'
        description='Quiero crear un panel para mi comunidad.'
        imageSource={require('../../assets/images/institucion.png')} onPress={handleAdminInstitucion}>
        </OptionCard>

        {/*Reutilizamos el componente Button*/}
        <Button
        title='¿Ya tienes una cuenta? Iniciar Sesión'
        variant='secondary'
        onPress={irLogin}>
        </Button>

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
    alignItems: 'center', //se centra los elementos horizontal
    paddingHorizontal: 28, // Margen interno a los lados (izq y der)
    paddingTop: 30, // Margen superior para despegarlo de arriba
    paddingBottom: 25, // Margen inferior para el siguiente elemento
  },
  // Estilo especifico para el logo pequeñito de arriba
  logoTop: {
    width: 160,                       // Ancho en pixeles del logo
    height: 100,                       // Alto en pixeles del logo
    marginBottom: -11,                 // Separacion con el siguiente elemento
  },
  //Estilo para el titulo
  title: {
    fontSize: 35,
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  //Estilo para subtitulo
  subtitle: {
    fontSize: 22,
    fontFamily: 'Nunito-Medium',
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
});