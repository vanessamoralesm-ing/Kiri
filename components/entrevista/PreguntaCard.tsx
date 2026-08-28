import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  codigo?: string;
  pregunta: string;
  descripcion?: string;
  opcional?: boolean;
  children?: React.ReactNode;
}

export default function PreguntaCard({
  codigo,
  pregunta,
  descripcion,
  opcional = false,
  children,
}: Props) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.encabezadoPregunta}>
        {codigo ? (
          <View style={styles.codigo}>
            <Text style={styles.codigoTexto}>{codigo}</Text>
          </View>
        ) : (
          <View />
        )}

        {opcional && (
          <View style={styles.opcional}>
            <Text style={styles.opcionalTexto}>Opcional</Text>
          </View>
        )}
      </View>

      <Text style={styles.pregunta}>{pregunta}</Text>

      {descripcion && (
        <Text style={styles.descripcion}>{descripcion}</Text>
      )}

      <View style={styles.respuestas}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: { width: "100%", backgroundColor: "rgba(255,255,255,0.97)", borderRadius: 26, borderWidth: 1, borderColor: "#E9EDF3", paddingHorizontal: 22, paddingTop: 24, paddingBottom: 28, shadowColor: "#778397", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 9, elevation: 4 },
  encabezadoPregunta: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 17 },
  codigo: { minWidth: 43, minHeight: 32, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#EEF2FF" },
  codigoTexto: { color: "#6478D9", fontSize: 13, fontFamily: "Nunito-Bold" },
  opcional: { backgroundColor: "#F3F4F6", paddingHorizontal: 11, paddingVertical: 6, borderRadius: 15, marginLeft: 10 },
  opcionalTexto: { fontSize: 12, color: "#7A8495", fontFamily: "Nunito-SemiBold" },
  pregunta: { width: "100%", fontSize: 22, lineHeight: 30, color: "#273448", fontFamily: "Nunito-Bold" },
  descripcion: { width: "100%", fontSize: 14, lineHeight: 21, color: "#788296", fontFamily: "Nunito-Medium", marginTop: 10 },
  respuestas: { width: "100%", marginTop: 28 },
});