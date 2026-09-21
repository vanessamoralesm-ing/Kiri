import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
}: ButtonProps) {
  const primaryColor = useThemeColor({}, "primary");

  const textOnPrimaryColor = useThemeColor({}, "textOnPrimary");

  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.buttonBase,

        {
          backgroundColor: isPrimary ? primaryColor : "transparent",

          borderColor: primaryColor,

          opacity: disabled ? 0.55 : 1,
        },

        !isPrimary && {
          borderWidth: 2,
        },

        style,
      ]}
    >
      <Text
        style={[
          styles.textBase,

          {
            color: isPrimary ? textOnPrimaryColor : primaryColor,
          },

          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    width: "100%",

    minHeight: 56,

    borderRadius: 18,

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 20,

    paddingVertical: 14,

    marginVertical: 8,
  },

  textBase: {
    fontSize: 18,

    fontFamily: "Nunito-Bold",

    textAlign: "center",
  },
});
