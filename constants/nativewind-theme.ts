import { vars } from "nativewind";
import { Colors } from "@/constants/theme";

const createNativeWindTheme = (colors: typeof Colors.light) =>
  vars({
    "--primary": colors.primary,
    "--secondary": colors.secondary,
    "--accent": colors.accent,

    "--background": colors.background,
    "--surface": colors.surface,
    "--surface-secondary": colors.surfaceSecondary,
    "--card": colors.card,
    "--card-border": colors.cardBorder,

    "--text": colors.text,
    "--text-secondary": colors.textSecondary,
    "--text-muted": colors.textMuted,
    "--text-on-primary": colors.textOnPrimary,

    "--border": colors.border,
    "--divider": colors.divider,

    "--input-background": colors.inputBackground,
    "--input-border": colors.inputBorder,
    "--placeholder": colors.placeholder,

    "--icon": colors.icon,

    "--success": colors.success,
    "--warning": colors.warning,
    "--danger": colors.danger,
    "--info": colors.info,

    "--disabled": colors.disabled,

    "--primary-soft": colors.primarySoft,
    "--secondary-soft": colors.secondarySoft,
    "--accent-soft": colors.accentSoft,

    "--overlay": colors.overlay,
  });

export const NativeWindTheme = {
  light: createNativeWindTheme(Colors.light),
  dark: createNativeWindTheme(Colors.dark),
};
