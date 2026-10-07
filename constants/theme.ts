import { Platform } from "react-native";

export const BrandColors = {
  primary: "#4F8EF7",
  secondary: "#7BBF9A",
  accent: "#B8A8F8",
  mistWhite: "#F8FAFC",
  darkGray: "#2D3748",
};

export const Colors = {
  light: {
    primary: BrandColors.primary,
    secondary: BrandColors.secondary,
    accent: BrandColors.accent,

    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceSecondary: "#F1F5F9",
    card: "#FFFFFF",
    cardBorder: "#CBD5E1",

    text: "#2D3748",
    textSecondary: "#64748B",
    textMuted: "#94A3B8",
    textOnPrimary: "#FFFFFF",

    border: "#E2E8F0",
    divider: "#E5E7EB",

    inputBackground: "#FFFFFF",
    inputBorder: "#CBD5E1",
    placeholder: "#94A3B8",

    icon: "#64748B",

    tabBar: "#FFFFFF",
    tabIconDefault: "#5A6677",
    tabIconSelected: BrandColors.primary,

    success: "#7BBF9A",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: BrandColors.primary,

    disabled: "#CBD5E1",

    primarySoft: "#EAF2FF",
    secondarySoft: "#E6F4EC",
    accentSoft: "#F0ECFF",

    tint: BrandColors.primary,
    overlay: "rgba(45, 55, 72, 0.40)",
  },

  dark: {
    primary: BrandColors.primary,
    secondary: BrandColors.secondary,
    accent: BrandColors.accent,

    background: "#0F172A",
    surface: "#1E293B",
    surfaceSecondary: "#263449",
    card: "#1E293B",
    cardBorder: "#475569",

    text: "#F8FAFC",
    textSecondary: "#CBD5E1",
    textMuted: "#94A3B8",
    textOnPrimary: "#FFFFFF",

    border: "#334155",
    divider: "#334155",

    inputBackground: "#1E293B",
    inputBorder: "#475569",
    placeholder: "#94A3B8",

    icon: "#CBD5E1",

    tabBar: "#172033",
    tabIconDefault: "#94A3B8",
    tabIconSelected: BrandColors.primary,

    success: "#7BBF9A",
    warning: "#FBBF24",
    danger: "#F87171",
    info: BrandColors.primary,

    disabled: "#475569",

    primarySoft: "#1B3155",
    secondarySoft: "#1D3A31",
    accentSoft: "#312E58",

    tint: BrandColors.primary,
    overlay: "rgba(0, 0, 0, 0.65)",
  },
};

const KiriFonts = {
  regular: {
    fontFamily: "Nunito-Medium",
    fontWeight: "400" as const,
  },
  medium: {
    fontFamily: "Nunito-SemiBold",
    fontWeight: "500" as const,
  },
  bold: {
    fontFamily: "Nunito-Bold",
    fontWeight: "700" as const,
  },
  heavy: {
    fontFamily: "Nunito-Bold",
    fontWeight: "800" as const,
  },
};

export const KiriLightTheme = {
  dark: false,
  colors: {
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.accent,
  },
  fonts: KiriFonts,
};

export const KiriDarkTheme = {
  dark: true,
  colors: {
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.accent,
  },
  fonts: KiriFonts,
};

export const Fonts = Platform.select({
  ios: {
    sans: "Nunito-Medium",
    serif: "Nunito-Medium",
    rounded: "Nunito-Medium",
    mono: "Menlo",
  },
  default: {
    sans: "Nunito-Medium",
    serif: "Nunito-Medium",
    rounded: "Nunito-Medium",
    mono: "monospace",
  },
  web: {
    sans: "Nunito-Medium, sans-serif",
    serif: "Nunito-Medium, serif",
    rounded: "Nunito-Medium, sans-serif",
    mono: "monospace",
  },
});