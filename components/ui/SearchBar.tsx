import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, TextInput, View, ViewStyle } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { cn } from "@/utils/cn";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar...",
  accessibilityLabel,
  className,
  style,
}: Props) {
  const esOscuro = useColorScheme() === "dark";
  const colores = esOscuro ? Colors.dark : Colors.light;

  return (
    <View
      style={style}
      className={cn(
        "h-14 flex-row items-center rounded-xl border border-input-border bg-input px-3",
        className,
      )}
    >
      <Ionicons name="search-outline" size={22} className="text-icon" />

      <TextInput
        accessibilityLabel={accessibilityLabel ?? placeholder}
        accessibilityRole="search"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colores.placeholder}
        selectionColor={colores.primary}
        returnKeyType="search"
        clearButtonMode="while-editing"
        className="ml-3 flex-1 font-nunito-medium text-sm text-text"
      />
    </View>
  );
}