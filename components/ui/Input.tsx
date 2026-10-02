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

import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

// ==========================================================
// PROPIEDADES
// ==========================================================

interface InputProps extends TextInputProps {
  label: string;
  rightLabel?: React.ReactNode;
  rightIcon?: React.ReactNode;
  estiloContenedor?: StyleProp<ViewStyle>;
  forceLight?: boolean;
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
  forceLight = false,
  ...props
}: InputProps) {
  // ========================================================
  // ESTADO
  // ========================================================

  const [enfocado, setEnfocado] = useState(false);

  // ========================================================
  // TEMA
  // ========================================================

  const themeTextColor = useThemeColor({}, "text");
  const themeTextSecondaryColor = useThemeColor({}, "textSecondary");
  const themeInputBackgroundColor = useThemeColor({}, "inputBackground");
  const themeInputBorderColor = useThemeColor({}, "inputBorder");
  const themePlaceholderColor = useThemeColor({}, "placeholder");
  const themePrimaryColor = useThemeColor({}, "primary");

  // ========================================================
  // COLORES
  // ========================================================

  const textColor = forceLight
    ? Colors.light.text
    : themeTextColor;

  const textSecondaryColor = forceLight
    ? Colors.light.textSecondary
    : themeTextSecondaryColor;

  const inputBackgroundColor = forceLight
    ? Colors.light.inputBackground
    : themeInputBackgroundColor;

  const inputBorderColor = forceLight
    ? Colors.light.inputBorder
    : themeInputBorderColor;

  const placeholderColor = forceLight
    ? Colors.light.placeholder
    : themePlaceholderColor;

  const primaryColor = forceLight
    ? Colors.light.primary
    : themePrimaryColor;

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
          placeholderTextColor={
            placeholderTextColor ?? placeholderColor
          }
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

        {rightIcon && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
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