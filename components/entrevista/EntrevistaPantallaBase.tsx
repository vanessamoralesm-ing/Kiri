import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import EntrevistaHeader from "./EntrevistaHeader";
import ProgresoEntrevista from "./ProgresoEntrevista";
import PreguntaCard from "./PreguntaCard";
import OpcionRespuesta from "./OpcionRespuesta";
import CampoRespuesta from "./CampoRespuesta";
import { PreguntaEntrevista } from "@/types/entrevista";
import { obtenerDescripcionPregunta } from "@/utils/entrevistaHelpers";

interface Props {
  cargando: boolean;
  guardando: boolean;
  errorPantalla: string | null;
  onReintentar: () => void;
  onBack: () => void;
  onContinuar: () => void;
  tituloModulo: string;
  indiceActual: number;
  totalPreguntas: number;
  preguntaActual?: PreguntaEntrevista;
  opcionesSeleccionadas: string[];
  onSeleccionarOpcion: (idOpcion: string) => void;
  textoRespuesta: string;
  onChangeTextoRespuesta: (text: string) => void;
  numeroRespuesta: string;
  onChangeNumeroRespuesta: (text: string) => void;
  esValida: boolean;
  headerBanner?: React.ReactNode;
}

export default function EntrevistaPantallaBase({
  cargando,
  guardando,
  errorPantalla,
  onReintentar,
  onBack,
  onContinuar,
  tituloModulo,
  indiceActual,
  totalPreguntas,
  preguntaActual,
  opcionesSeleccionadas,
  onSeleccionarOpcion,
  textoRespuesta,
  onChangeTextoRespuesta,
  numeroRespuesta,
  onChangeNumeroRespuesta,
  esValida,
  headerBanner,
}: Props) {
  if (cargando) {
    return (
      <SafeAreaView style={styles.pantalla}>
        <View style={styles.centroPantalla}>
          <ActivityIndicator size="large" color="#4F8EF7" />
          <Text style={styles.textoCargando}>Preparando esta sección...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorPantalla || !preguntaActual) {
    return (
      <SafeAreaView style={styles.pantalla}>
        <View style={styles.centroPantalla}>
          <Ionicons name="alert-circle-outline" size={50} color="#7795DC" />
          <Text style={styles.tituloError}>No pudimos cargar esta sección</Text>
          <Text style={styles.descripcionError}>
            {errorPantalla ?? "No encontramos preguntas disponibles."}
          </Text>
          <Pressable style={styles.botonReintentar} onPress={onReintentar}>
            <Text style={styles.textoReintentar}>Intentar nuevamente</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.contenedor}>
        <EntrevistaHeader onBack={onBack} />
        <ProgresoEntrevista
          actual={indiceActual + 1}
          total={totalPreguntas}
          tituloModulo={tituloModulo}
        />

        {headerBanner}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContenido}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <PreguntaCard
            codigo={preguntaActual.codigo}
            pregunta={preguntaActual.enunciado}
            descripcion={obtenerDescripcionPregunta(preguntaActual)}
            opcional={!preguntaActual.obligatoria}
          >
            {(preguntaActual.tipo_pregunta === "opcion_unica" ||
              preguntaActual.tipo_pregunta === "opcion_multiple" ||
              preguntaActual.tipo_pregunta === "escala") &&
              preguntaActual.opciones.map((opcion) => (
                <OpcionRespuesta
                  key={opcion.id_opcion}
                  texto={opcion.descripcion}
                  seleccionada={opcionesSeleccionadas.includes(opcion.id_opcion)}
                  onPress={() => onSeleccionarOpcion(opcion.id_opcion)}
                />
              ))}

            {preguntaActual.tipo_pregunta === "texto" && (
              <CampoRespuesta
                valor={textoRespuesta}
                onChangeText={onChangeTextoRespuesta}
                tipo="texto"
                placeholder="Escribe tu respuesta..."
              />
            )}

            {preguntaActual.tipo_pregunta === "numero" && (
              <CampoRespuesta
                valor={numeroRespuesta}
                onChangeText={onChangeNumeroRespuesta}
                tipo="numero"
                placeholder="Escribe una cantidad..."
              />
            )}
          </PreguntaCard>
        </ScrollView>

        <View style={styles.zonaBoton}>
          <Pressable
            onPress={onContinuar}
            disabled={guardando || !esValida}
            style={({ pressed }) => [
              styles.botonContinuar,
              (guardando || !esValida) && styles.botonDeshabilitado,
              pressed && styles.botonPresionado,
            ]}
          >
            {guardando ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.textoBoton}>
                  {indiceActual === totalPreguntas - 1 ? "Finalizar sección" : "Siguiente"}
                </Text>
                <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: "transparent" },
  contenedor: { flex: 1, paddingHorizontal: 18, paddingBottom: 15 },
  scroll: { flex: 1 },
  scrollContenido: { flexGrow: 1, paddingBottom: 15 },
  centroPantalla: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 35 },
  textoCargando: { marginTop: 14, fontSize: 15, fontFamily: "Nunito-SemiBold", color: "#6B778A" },
  tituloError: { marginTop: 15, fontSize: 20, fontFamily: "Nunito-Bold", color: "#273448", textAlign: "center" },
  descripcionError: { marginTop: 9, fontSize: 14, lineHeight: 21, fontFamily: "Nunito-Medium", color: "#778296", textAlign: "center" },
  botonReintentar: { marginTop: 22, backgroundColor: "#6594F4", paddingHorizontal: 25, paddingVertical: 13, borderRadius: 15 },
  textoReintentar: { color: "#FFFFFF", fontFamily: "Nunito-Bold", fontSize: 14 },
  zonaBoton: { paddingTop: 10 },
  botonContinuar: { minHeight: 55, borderRadius: 16, backgroundColor: "#6594F4", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, paddingHorizontal: 20 },
  botonDeshabilitado: { backgroundColor: "#B9C4D4" },
  botonPresionado: { opacity: 0.88 },
  textoBoton: { fontSize: 16, color: "#FFFFFF", fontFamily: "Nunito-Bold" },
});