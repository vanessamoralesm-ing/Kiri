import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  actual: number;
  total: number;
  tituloModulo?: string;
}

export default function ProgresoEntrevista({ actual, total, tituloModulo }: Props) {
  const porcentaje = total > 0 ? Math.round((actual / total) * 100) : 0;

  return (
    <View style={styles.contenedor}>
      <View style={styles.informacion}>
        <View>
          {tituloModulo && (
            <Text style={styles.modulo}>{tituloModulo}</Text>
          )}
          <Text style={styles.pregunta}>
            Pregunta {actual} de {total}
          </Text>
        </View>

        <Text style={styles.porcentaje}>{porcentaje}% completado</Text>
      </View>

      <View style={styles.barra}>
        <View
          style={[
            styles.barraActiva,
            { width: `${Math.min(porcentaje, 100)}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { marginBottom: 20 },
  informacion: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 },
  modulo: { fontSize: 14, color: "#4F8EF7", fontFamily: "Nunito-Bold", marginBottom: 3 },
  pregunta: { fontSize: 13, color: "#707C8F", fontFamily: "Nunito-SemiBold" },
  porcentaje: { fontSize: 13, color: "#4F8EF7", fontFamily: "Nunito-Bold" },
  barra: { width: "100%", height: 7, borderRadius: 20, backgroundColor: "#E5EAF1", overflow: "hidden" },
  barraActiva: { height: "100%", backgroundColor: "#6C8FF0", borderRadius: 20 },
});