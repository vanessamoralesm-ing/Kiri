import React, { useState } from "react";

import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// PROPIEDADES
// ==========================================================

interface InputProps extends TextInputProps {
  label: string;

  rightLabel?: React.ReactNode;

  rightIcon?: React.ReactNode;

  estiloContenedor?: StyleProp<ViewStyle>;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function Input({
  label,
  rightLabel,
  rightIcon,
  estiloContenedor,
  style,
  placeholderTextColor,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  // ========================================================
  // ESTADO
  // ========================================================

  const [enfocado, setEnfocado] = useState(false);

  // ========================================================
  // TEMA
  // ========================================================

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const inputBackgroundColor = useThemeColor({}, "inputBackground");

  const inputBorderColor = useThemeColor({}, "inputBorder");

  const placeholderColor = useThemeColor({}, "placeholder");

  const primaryColor = useThemeColor({}, "primary");

  // ========================================================
  // UI
  // ========================================================

  return (
    <View style={[styles.container, estiloContenedor]}>
      {/* ==================================================
          ETIQUETA
      ================================================== */}

      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.label,
            {
              color: textColor,
            },
          ]}
        >
          {label}
        </Text>

        {rightLabel}
      </View>

      {/* ==================================================
          CAMPO
      ================================================== */}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: inputBackgroundColor,

            borderColor: enfocado ? primaryColor : inputBorderColor,

            borderWidth: enfocado ? 2 : 1,
          },
        ]}
      >
        <TextInput
          {...props}
          style={[
            styles.input,
            {
              color: textColor,

              paddingRight: rightIcon ? 52 : 16,
            },
            style,
          ]}
          placeholderTextColor={placeholderTextColor ?? placeholderColor}
          selectionColor={primaryColor}
          onFocus={(event) => {
            setEnfocado(true);

            onFocus?.(event);
          }}
          onBlur={(event) => {
            setEnfocado(false);

            onBlur?.(event);
          }}
        />

        {/* ==================================================
            ICONO DERECHO
        ================================================== */}

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
    </View>
  );
}

// ==========================================================
// ESTILOS
// ==========================================================

const styles = StyleSheet.create({
  container: {
    width: "100%",

    marginBottom: 20,
  },

  labelContainer: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    gap: 10,

    marginBottom: 9,
  },

  label: {
    flexShrink: 1,

    fontSize: 15,

    lineHeight: 21,

    fontFamily: "Nunito-SemiBold",
  },

  inputContainer: {
    width: "100%",

    minHeight: 54,

    position: "relative",

    borderRadius: 14,

    flexDirection: "row",

    alignItems: "center",

    overflow: "hidden",
  },

  input: {
    flex: 1,

    minWidth: 0,

    height: 54,

    paddingHorizontal: 16,

    paddingVertical: 10,

    fontSize: 15,

    fontFamily: "Nunito-Medium",
  },

  rightIcon: {
    position: "absolute",

    right: 14,

    top: 0,

    bottom: 0,

    width: 28,

    alignItems: "center",

    justifyContent: "center",
  },
});
