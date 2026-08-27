import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface CampoRespuestaProps {
  valor: string;
  onChangeText: (texto: string) => void;
  tipo?: "texto" | "numero";
  placeholder?: string;
  disabled?: boolean;
}

export default function CampoRespuesta({
  valor,
  onChangeText,
  tipo = "texto",
  placeholder,
  disabled = false,
}: CampoRespuestaProps) {
  function manejarCambio(texto: string) {
    if (tipo === "numero") {
      onChangeText(texto.replace(/\D/g, ""));
      return;
    }
    onChangeText(texto);
  }

  return (
    <View style={styles.contenedor}>
      <TextInput
        value={valor}
        onChangeText={manejarCambio}
        editable={!disabled}
        placeholder={placeholder ?? (tipo === "numero" ? "Escribe una cantidad..." : "Escribe tu respuesta...")}
        placeholderTextColor="#9AA5B5"
        keyboardType={tipo === "numero" ? "number-pad" : "default"}
        multiline={tipo === "texto"}
        textAlignVertical={tipo === "texto" ? "top" : "center"}
        style={[
          styles.campo,
          tipo === "texto" && styles.campoTexto,
          tipo === "numero" && styles.campoNumero,
          disabled && styles.campoDeshabilitado,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { width: "100%" },
  campo: { width: "100%", borderWidth: 1.5, borderColor: "#DDE4EE", borderRadius: 16, backgroundColor: "#FBFCFE", paddingHorizontal: 17, fontSize: 16, fontFamily: "Nunito-Medium", color: "#354156" },
  campoTexto: { minHeight: 130, paddingTop: 15, paddingBottom: 15, lineHeight: 22 },
  campoNumero: { height: 58 },
  campoDeshabilitado: { opacity: 0.6, backgroundColor: "#F1F3F6" },
});