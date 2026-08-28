import {
  DarkTheme,
  DefaultTheme,
  Theme,
} from "@react-navigation/native";

import {
  Platform,
} from "react-native";


// ==========================================================
// COLORES OFICIALES DE KIRI
// ==========================================================

export const BrandColors = {
  primary: "#4F8EF7",
  secondary: "#7BBF9A",
  accent: "#B8A8F8",

  mistWhite: "#F8FAFC",
  darkGray: "#2D3748",
};


// ==========================================================
// PALETA GENERAL
// ==========================================================

export const Colors = {

  // ========================================================
  // MODO CLARO
  // ========================================================

  light: {

    // Marca
    primary: "#4F8EF7",
    secondary: "#7BBF9A",
    accent: "#B8A8F8",

    // Fondos
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceSecondary: "#F1F5F9",
    card: "#FFFFFF",

    // Textos
    text: "#2D3748",
    textSecondary: "#64748B",
    textMuted: "#94A3B8",
    textOnPrimary: "#FFFFFF",

    // Bordes
    border: "#E2E8F0",
    divider: "#E5E7EB",

    // Inputs
    inputBackground: "#FFFFFF",
    inputBorder: "#CBD5E1",
    placeholder: "#94A3B8",

    // Iconos
    icon: "#64748B",

    // Navegación
    tabBar: "#FFFFFF",
    tabIconDefault: "#5A6677",
    tabIconSelected: "#4F8EF7",

    // Estados
    success: "#7BBF9A",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#4F8EF7",

    // Deshabilitados
    disabled: "#CBD5E1",

    // Fondos suaves de marca
    primarySoft: "#EAF2FF",
    secondarySoft: "#E6F4EC",
    accentSoft: "#F0ECFF",

    // Compatibilidad Expo
    tint: "#4F8EF7",

    // Overlay
    overlay: "rgba(45, 55, 72, 0.40)",
  },


  // ========================================================
  // MODO OSCURO
  // ========================================================

  dark: {

    // Marca
    // Se mantienen los colores oficiales de Kiri
    primary: "#4F8EF7",
    secondary: "#7BBF9A",
    accent: "#B8A8F8",

    // Fondos
    background: "#0F172A",
    surface: "#1E293B",
    surfaceSecondary: "#263449",
    card: "#1E293B",

    // Textos
    text: "#F8FAFC",
    textSecondary: "#CBD5E1",
    textMuted: "#94A3B8",
    textOnPrimary: "#FFFFFF",

    // Bordes
    border: "#334155",
    divider: "#334155",

    // Inputs
    inputBackground: "#1E293B",
    inputBorder: "#475569",
    placeholder: "#94A3B8",

    // Iconos
    icon: "#CBD5E1",

    // Navegación
    tabBar: "#172033",
    tabIconDefault: "#94A3B8",
    tabIconSelected: "#4F8EF7",

    // Estados
    success: "#7BBF9A",
    warning: "#FBBF24",
    danger: "#F87171",
    info: "#4F8EF7",

    // Deshabilitados
    disabled: "#475569",

    // Fondos suaves de marca
    primarySoft: "#1B3155",
    secondarySoft: "#1D3A31",
    accentSoft: "#312E58",

    // Compatibilidad Expo
    tint: "#4F8EF7",

    // Overlay
    overlay: "rgba(0, 0, 0, 0.65)",
  },
};


// ==========================================================
// TEMA CLARO PARA REACT NAVIGATION
// ==========================================================

export const KiriLightTheme: Theme = {
  ...DefaultTheme,

  dark: false,

  colors: {
    ...DefaultTheme.colors,

    primary:
      Colors.light.primary,

    background:
      Colors.light.background,

    card:
      Colors.light.surface,

    text:
      Colors.light.text,

    border:
      Colors.light.border,

    notification:
      Colors.light.accent,
  },
};


// ==========================================================
// TEMA OSCURO PARA REACT NAVIGATION
// ==========================================================

export const KiriDarkTheme: Theme = {
  ...DarkTheme,

  dark: true,

  colors: {
    ...DarkTheme.colors,

    primary:
      Colors.dark.primary,

    background:
      Colors.dark.background,

    card:
      Colors.dark.surface,

    text:
      Colors.dark.text,

    border:
      Colors.dark.border,

    notification:
      Colors.dark.accent,
  },
};


// ==========================================================
// FUENTES
// ==========================================================

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },

  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },

  web: {
    sans:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",

    serif:
      "Georgia, 'Times New Roman', serif",

    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",

    mono:
      "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});