import React, { useState } from "react";
import { StyleProp, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { cn } from "@/utils/cn";

interface InputProps extends TextInputProps {
  label: string;
  rightLabel?: React.ReactNode;
  rightIcon?: React.ReactNode;
  estiloContenedor?: StyleProp<ViewStyle>;
  containerClassName?: string;
  inputClassName?: string;
  forceLight?: boolean;
}

export default function Input({
  label,
  rightLabel,
  rightIcon,
  estiloContenedor,
  containerClassName,
  inputClassName,
  className,
  style,
  placeholderTextColor,
  onFocus,
  onBlur,
  forceLight = false,
  ...props
}: InputProps) {
  const [enfocado, setEnfocado] = useState(false);
  const esOscuro = useColorScheme() === "dark";
  const colores = forceLight ? Colors.light : esOscuro ? Colors.dark : Colors.light;

  return (
    <View style={estiloContenedor} className={cn("mb-5 w-full", containerClassName)}>
      <View className="mb-2 flex-row items-center justify-between gap-2">
        <Text
          className={cn("shrink font-nunito-semibold text-base", !forceLight && "text-text")}
          style={forceLight ? { color: Colors.light.text } : undefined}
        >
          {label}
        </Text>

        {rightLabel}
      </View>

      <View
        className={cn(
          "relative min-h-14 w-full flex-row items-center overflow-hidden rounded-2xl bg-input",
          enfocado ? "border-2 border-primary" : "border border-input-border",
        )}
        style={
          forceLight
            ? {
                backgroundColor: Colors.light.inputBackground,
                borderColor: enfocado ? Colors.light.primary : Colors.light.inputBorder,
              }
            : undefined
        }
      >
        <TextInput
          accessibilityLabel={label}
          {...props}
          className={cn(
            "h-14 min-w-0 flex-1 px-4 py-2 font-nunito-medium text-base text-text",
            className,
            inputClassName,
          )}
          style={[
            forceLight ? { color: Colors.light.text } : undefined,
            rightIcon ? { paddingRight: 52 } : undefined,
            style,
          ]}
          placeholderTextColor={placeholderTextColor ?? colores.placeholder}
          selectionColor={colores.primary}
          onFocus={(e) => {
            setEnfocado(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setEnfocado(false);
            onBlur?.(e);
          }}
        />

        {rightIcon && (
          <View className="absolute bottom-0 right-3 top-0 w-7 items-center justify-center">
            {rightIcon}
          </View>
        )}
      </View>
    </View>
  );
}
