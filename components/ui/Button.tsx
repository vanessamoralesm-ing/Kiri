import React, { createContext, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import { cn } from "@/utils/cn";
import { useThemeColor } from "@/hooks/use-theme-color";

type ButtonSize = "sm" | "md";
export const ButtonSizeContext = createContext<ButtonSize>("md");

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconClassName?: string;
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size,
  disabled = false,
  loading = false,
  icon,
  iconClassName,
  className,
  textClassName,
  style,
  textStyle,
}: ButtonProps) {
  const defaultSize = useContext(ButtonSizeContext);
  const compact = (size ?? defaultSize) === "sm";
  const primary = variant === "primary";
  const color = useThemeColor({}, primary ? "textOnPrimary" : "primary");
  const bloqueado = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityState={{ disabled: bloqueado, busy: loading }}
      aria-busy={loading}
      style={style}
      className={cn(
        "w-full items-center justify-center",
        compact ? "my-1 min-h-10 rounded-xl px-4 py-2" : "my-2 min-h-14 rounded-2xl px-5 py-3",
        primary ? "bg-primary" : "border-2 border-primary",
        (icon || loading) && "flex-row gap-2",
        bloqueado && "opacity-50",
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        icon && (
          <Ionicons
            name={icon}
            size={compact ? 18 : 20}
            className={cn(primary ? "text-text-on-primary" : "text-primary", iconClassName)}
          />
        )
      )}
      <Text
        style={textStyle}
        className={cn(
          "text-center font-nunito-bold",
          compact ? "text-sm" : "text-lg",
          primary ? "text-text-on-primary" : "text-primary",
          textClassName,
        )}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
