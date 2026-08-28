import {
  useTheme,
} from "@react-navigation/native";

import {
  Colors,
} from "@/constants/theme";


export function useThemeColor(
  props: {
    light?: string;
    dark?: string;
  },

  colorName:
    keyof typeof Colors.light &
    keyof typeof Colors.dark
) {

  const {
    dark,
  } =
    useTheme();


  const theme:
    "light" | "dark" =
      dark
        ? "dark"
        : "light";


  const colorFromProps =
    props[theme];


  if (colorFromProps) {
    return colorFromProps;
  }


  return Colors[theme][colorName];
}