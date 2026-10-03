import React from "react";

import { StyleSheet, TextInput, View } from "react-native";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// PROPS
// ==========================================================

interface CampoRespuestaProps {
  valor: string;

  onChangeText: (texto: string) => void;

  tipo?: "texto" | "numero";

  placeholder?: string;

  disabled?: boolean;

  maxLength?: number;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function CampoRespuesta({
  valor,
  onChangeText,
  tipo = "texto",
  placeholder,
  disabled = false,
  maxLength,
}: CampoRespuestaProps) {
  const { esTelefono, esTablet, esEscritorio } = useResponsiveLayout();

  // ========================================================
  // COLORES DEL TEMA
  // ========================================================

  const inputBackgroundColor = useThemeColor({}, "inputBackground");

  const inputBorderColor = useThemeColor({}, "inputBorder");

  const textColor = useThemeColor({}, "text");

  const placeholderColor = useThemeColor({}, "placeholder");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const primaryColor = useThemeColor({}, "primary");

  // ========================================================
  // CAMBIO DE VALOR
  // ========================================================

  function manejarCambio(texto: string) {
    if (tipo === "numero") {
      onChangeText(texto.replace(/\D/g, ""));

      return;
    }

    onChangeText(texto);
  }

  // ========================================================
  // RESPONSIVE
  // ========================================================

  const minHeightTexto = esEscritorio ? 150 : esTablet ? 140 : 120;

  const alturaNumero = esEscritorio ? 60 : 56;

  const fontSize = esEscritorio ? 16 : 15;

  // ========================================================
  // UI
  // ========================================================

  return (
    <View style={styles.contenedor}>
      <TextInput
        value={valor}

        onChangeText={manejarCambio}

        editable={!disabled}

        maxLength={maxLength}

        placeholder={
          placeholder ??
          (tipo === "numero"
            ? "Escribe una cantidad..."
            : "Escribe tu respuesta...")
        }

        placeholderTextColor={placeholderColor}

        selectionColor={primaryColor}

        cursorColor={primaryColor}

        keyboardType={tipo === "numero" ? "number-pad" : "default"}

        multiline={tipo === "texto"}

        textAlignVertical={tipo === "texto" ? "top" : "center"}

        returnKeyType={tipo === "numero" ? "done" : "default"}

        style={[
          styles.campo,

          {
            backgroundColor: disabled
              ? surfaceSecondaryColor
              : inputBackgroundColor,

            borderColor: inputBorderColor,

            color: textColor,

            fontSize,
          },

          tipo === "texto" && {
            minHeight: minHeightTexto,

            paddingTop: 15,

            paddingBottom: 15,

            lineHeight: 22,
          },

          tipo === "numero" && {
            height: alturaNumero,
          },

          disabled && styles.campoDeshabilitado,
        ]}
      />
    </View>
  );
}

// ==========================================================
// ESTILOS
// ==========================================================

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",
  },

  campo: {
    width: "100%",

    borderWidth: 1.5,

    borderRadius: 16,

    paddingHorizontal: 17,

    fontFamily: "Nunito-Medium",
  },

  campoDeshabilitado: {
    opacity: 0.6,
  },
});
