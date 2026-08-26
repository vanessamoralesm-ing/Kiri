import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  texto: string;
  seleccionada: boolean;
  onPress: () => void;
}

export default function OpcionRespuesta({ texto, seleccionada, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "rgba(94, 140, 233, 0.10)" }}
      style={({ pressed }) => [
        styles.opcion,
        seleccionada && styles.opcionSeleccionada,
        pressed && styles.opcionPresionada,
      ]}
    >
      <View style={[styles.radio, seleccionada && styles.radioSeleccionado]}>
        {seleccionada && <View style={styles.radioInterno} />}
      </View>

      <Text style={[styles.texto, seleccionada && styles.textoSeleccionado]}>
        {texto}
      </Text>

      <View style={styles.zonaCheck}>
        {seleccionada && (
          <Ionicons name="checkmark-circle" size={21} color="#5E8CE9" />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  opcion: { width: "100%", minHeight: 57, flexDirection: "row", alignItems: "center", backgroundColor: "#FBFCFE", borderWidth: 1.5, borderColor: "#E2E7EE", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 11 },
  opcionSeleccionada: { backgroundColor: "#F1F5FF", borderColor: "#6C91E9" },
  opcionPresionada: { opacity: 0.85 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#A9B2BF", alignItems: "center", justifyContent: "center", marginRight: 13, flexShrink: 0 },
  radioSeleccionado: { borderColor: "#5E8CE9" },
  radioInterno: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#5E8CE9" },
  texto: { flex: 1, flexShrink: 1, fontSize: 15, lineHeight: 21, color: "#3E4A5D", fontFamily: "Nunito-SemiBold", marginRight: 8 },
  textoSeleccionado: { color: "#315FAF" },
  zonaCheck: { width: 24, minWidth: 24, alignItems: "center", justifyContent: "center", flexShrink: 0 },
});