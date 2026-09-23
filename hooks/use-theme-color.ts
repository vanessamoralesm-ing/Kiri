import { Colors } from "@/constants/theme";
import { useThemeMode } from "@/contexts/ThemeModeContext";

export function useThemeColor(
  props: {
    light?: string;
    dark?: string;
  },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
): string {
  const { themeMode } = useThemeMode();

  const colorFromProps = props[themeMode];

  return colorFromProps ?? Colors[themeMode][colorName];
}
