import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Se importan componentes reutilizables
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo_izq";

// Estructura de datos para las opciones de edad
const Opciones_edad = [
  {
    id: "ninio",
    titulo: "Niño",
    subtitulo: "6 - 12 años",
    imagen: require("@/assets/images/kid_edad.png"),
  },
  {
    id: "adolescente",
    titulo: "Adolescente",
    subtitulo: "12 - 18 años",
    imagen: require("@/assets/images/joven_edad.png"),
  },
  {
    id: "adulto",
    titulo: "Adulto",
    subtitulo: "18 en adelante",
    imagen: require("@/assets/images/adulto_edad.png"),
  },
];

export default function RangoEdadPantalla() {
  const router = useRouter();

  // Estado local donde guarda la opcion seleccionada ya sea niño, adolescente o adulto
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(
    null,
  );

  // Funcion para continuar en la siguiente pantalla
  const manejarContinuar = () => {
    if (opcionSeleccionada) {
      console.log("Rango de edad seleccionado:", opcionSeleccionada);
      router.push("/(bienvenida)/kids_entrv");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContenedor}>
      <View style={styles.contenedor}>
        {/* Cabecera con el logo */}
        <View style={styles.cabecera}>
          <Logo />
        </View>

        {/* Seccion de titulos principales */}
        <View style={styles.seccionTitulo}>
          <Text style={styles.titulo}>¿Cuál es tu Rango de Edad?</Text>
          <Text style={styles.subtitulo}>
            Esto nos ayuda a ofrecerte una mejor experiencia
          </Text>
        </View>

        {/* Listado de tarjetas de seleccion */}
        <View style={styles.contenedorTarjetas}>
          {Opciones_edad.map((opcion) => {
            //el map nos permite recorrer el arreglo para luego devolver un nuevo arreglo con nuevos datos
            const estaSeleccionada = opcionSeleccionada === opcion.id;

            return (
              <TouchableOpacity
                key={opcion.id}
                activeOpacity={0.8}//Este le da opacidad al card de cada opcion cuando es seleccionado
                onPress={() => setOpcionSeleccionada(opcion.id)}
                style={[
                  styles.tarjeta,
                  estaSeleccionada && styles.tarjetaSeleccionada,
                ]}
              >
                {/*Estas son las imagenes de las opciones*/}
                <Image
                  source={opcion.imagen}
                  style={styles.imagenOpcion}
                  resizeMode="contain"
                />

                {/* Textos de la opcion */}
                <View style={styles.infoTexto}>
                  <Text style={styles.tituloOpcion}>{opcion.titulo}</Text>
                  <Text style={styles.subtituloOpcion}>{opcion.subtitulo}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Boton de avanzar */}
        <Button
          title="Continuar ➔"
          variant="primary"
          onPress={manejarContinuar}
          disabled={!opcionSeleccionada}
          style={[
            styles.botonContinuar,
            !opcionSeleccionada && styles.botonDeshabilitado, //Para esto fue que agreamos en el componente button el StyleProp para que aceptara este tipo de datos.
          ]}
        />
      </View>
    </ScrollView>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({
  scrollContenedor: {
    flexGrow: 1,
    backgroundColor: "transparent",
  },
  contenedor: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    justifyContent: "space-between",
  },

  /* Cabecera */
  cabecera: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -20,
  },

  /*Textos de encabezado*/
  seccionTitulo: {
    alignItems: "center",
    marginVertical: 15,
  },
  titulo: {
    fontSize: 35,
    fontFamily: "Nunito-Bold",
    fontWeight: "700",
    color: "#4F8EF7",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitulo: {
    fontSize: 18,
    fontFamily: "Nunito-Medium",
    color: "#5B7083",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
  },

  /* Contenedor de tarjetas */
  contenedorTarjetas: {
    gap: 20,
    marginVertical: 10,
    marginBottom: 130,
  },
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",//color de la sombra del card de cada opcion
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tarjetaSeleccionada: {
    borderColor: "#4F8EF7",
    backgroundColor: "#F0F5FF",
  },

  /* Contenido de cada tarjeta */
  imagenOpcion: {
    width: 65,
    height: 70,
    marginRight: 16,
  },
  infoTexto: {
    flex: 1,
  },
  tituloOpcion: {
    fontSize: 20,
    fontFamily: "Nunito-Bold",
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 4,
  },
  subtituloOpcion: {
    fontSize: 16,
    fontFamily: "Nunito-Medium",
    color: "#64748B",
  },

  /*Boton*/
  botonContinuar: {
    backgroundColor: "#4F8EF7",
    borderRadius: 16,
    height: 54,
    marginTop: "auto",
    marginBottom: 50,
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
});
