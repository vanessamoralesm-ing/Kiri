import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo_izq";
import { crearEntrevista } from "@/services/entrevista/entrevistaService";

type RangoEdad = "nino" | "adolescente" | "adulto";

const OPCIONES_EDAD = [
  {
    id: "nino" as RangoEdad,
    titulo: "Niño",
    subtitulo: "6 - 11 años",
    imagen: require("@/assets/images/kid_edad.png"),
  },
  {
    id: "adolescente" as RangoEdad,
    titulo: "Adolescente",
    subtitulo: "12 - 17 años",
    imagen: require("@/assets/images/joven_edad.png"),
  },
  {
    id: "adulto" as RangoEdad,
    titulo: "Adulto",
    subtitulo: "18 años en adelante",
    imagen: require("@/assets/images/adulto_edad.png"),
  },
];

export default function RangoEdadPantalla() {
  const router = useRouter();
  const [opcionSeleccionada, setOpcionSeleccionada] =
    useState<RangoEdad | null>(null);
  const [cargando, setCargando] = useState(false);

  const manejarContinuar = async () => {
    if (!opcionSeleccionada || cargando) return;

    // Entrevista para niños
    if (opcionSeleccionada === "nino") {
      router.replace("/(entrevista)/ninos/kids_entrv");
      return;
    }

    // Entrevista para adolescentes y adultos
    try {
      setCargando(true);

      const entrevista = await crearEntrevista();

      router.replace(
        `/(entrevista)/jovenes-adultos/${entrevista.id_entrevista}/generales`,
      );
    } catch (error) {
      console.error("Error creando entrevista:", error);

      Alert.alert(
        "No pudimos iniciar la entrevista",
        error instanceof Error
          ? error.message
          : "Ocurrió un problema inesperado. Inténtalo nuevamente.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contenedor}>
          <View style={styles.cabecera}>
            <Logo />
          </View>

          <View style={styles.seccionTitulo}>
            <Text style={styles.titulo}>¿Cuál es tu rango de edad?</Text>
            <Text style={styles.subtitulo}>
              Esto nos ayuda a ofrecerte una experiencia adaptada a tu etapa de
              vida.
            </Text>
          </View>

          <View style={styles.contenedorTarjetas}>
            {OPCIONES_EDAD.map((opcion) => {
              const seleccionada = opcionSeleccionada === opcion.id;

              return (
                <TouchableOpacity
                  key={opcion.id}
                  activeOpacity={0.8}
                  disabled={cargando}
                  onPress={() => setOpcionSeleccionada(opcion.id)}
                  style={[
                    styles.tarjeta,
                    seleccionada && styles.tarjetaSeleccionada,
                  ]}
                >
                  <Image
                    source={opcion.imagen}
                    style={styles.imagenOpcion}
                    resizeMode="contain"
                  />

                  <View style={styles.infoTexto}>
                    <Text style={styles.tituloOpcion}>{opcion.titulo}</Text>
                    <Text style={styles.subtituloOpcion}>
                      {opcion.subtitulo}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.zonaBoton}>
            {cargando && (
              <ActivityIndicator
                size="small"
                color="#4F8EF7"
                style={styles.cargando}
              />
            )}

            <Button
              title={cargando ? "Preparando entrevista..." : "Continuar ➔"}
              variant="primary"
              onPress={manejarContinuar}
              disabled={!opcionSeleccionada || cargando}
              style={[
                styles.botonContinuar,
                (!opcionSeleccionada || cargando) && styles.botonDeshabilitado,
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: "transparent" },
  scroll: { flexGrow: 1 },
  contenedor: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
  },

  cabecera: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

  seccionTitulo: { alignItems: "center", marginTop: 15, marginBottom: 25 },
  titulo: {
    fontSize: 34,
    lineHeight: 42,
    fontFamily: "Nunito-Bold",
    color: "#4F8EF7",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 17,
    lineHeight: 24,
    fontFamily: "Nunito-Medium",
    color: "#5B7083",
    textAlign: "center",
    paddingHorizontal: 15,
  },

  contenedorTarjetas: { gap: 18, marginBottom: 35 },

  tarjeta: {
    minHeight: 105,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: "#E8EDF4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  tarjetaSeleccionada: { borderColor: "#4F8EF7", backgroundColor: "#F0F5FF" },
  imagenOpcion: { width: 65, height: 70, marginRight: 16 },
  infoTexto: { flex: 1 },
  tituloOpcion: {
    fontSize: 20,
    fontFamily: "Nunito-Bold",
    color: "#2D3748",
    marginBottom: 4,
  },
  subtituloOpcion: {
    fontSize: 16,
    fontFamily: "Nunito-Medium",
    color: "#64748B",
  },

  zonaBoton: { marginTop: "auto" },
  cargando: { marginBottom: 10 },
  botonContinuar: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#4F8EF7",
    marginBottom: 20,
  },
  botonDeshabilitado: { opacity: 0.6 },
});
