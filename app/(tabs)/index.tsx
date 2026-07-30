import { Image } from 'expo-image';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import { useState } from 'react';



type Tarea = {
  id: string;
  texto: string;
  completada: boolean;
};

export default function HomeScreen() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [texto, setTexto] = useState("");

  const agregarTarea = () => {
    if(texto.trim() === '') return;
    setTareas([...tareas, {
      id: Date.now().toString(),
      texto,
      completada: false
    }]);
    setTexto('');
  };

  const toggleTarea = (id: string) => {
    setTareas(tareas.map(t =>
      t.id === id? { ...t, completada: !t.completada}:t
    ));
  };

  const eliminarTarea = (id: string) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      
      <Text>Mis Tareas</Text>
      <View>
        <TextInput
          placeholder="Agregar una nueva tarea"
          value={texto}
          onChangeText={setTexto}
        />
      </View>
    </KeyboardAvoidingView>);
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#F5F5F5',
    paddingTop: 60,
    paddingHorizontal: 20,
  }
})
