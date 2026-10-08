import React from "react";

import { Platform, Text, TextInput, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

interface CampoPreguntaDiarioProps {
  titulo: string;

  valor: string;

  onChangeText: (texto: string) => void;

  placeholder: string;
  minHeight?: number;
}

export function CampoPreguntaDiario({
  titulo,
  valor,
  onChangeText,
  placeholder,
  minHeight = 110,
}: CampoPreguntaDiarioProps) {
  // ======================================================
  // TEMA
  // ======================================================

  const textColor = useThemeColor({}, "text");

  const inputBackgroundColor = useThemeColor({}, "inputBackground");

  const inputBorderColor = useThemeColor({}, "inputBorder");

  const placeholderColor = useThemeColor({}, "placeholder");

  // ======================================================
  // UI
  // ======================================================

  return (
    <View
      style={{
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          marginBottom: 8,

          fontFamily: "Nunito-Bold",

          fontSize: 20,

          color: textColor,
        }}
      >
        {titulo}
      </Text>

      <TextInput
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        multiline
        textAlignVertical="top"
        style={[
          {
            minHeight: minHeight,

            paddingHorizontal: 16,

            paddingVertical: 12,

            borderRadius: 16,

            borderWidth: 2,

            borderColor: inputBorderColor,

            backgroundColor: inputBackgroundColor,

            fontFamily: "Nunito-Medium",

            fontSize: 16,

            color: textColor,
          },

          Platform.OS === "web"
            ? ({
                resize: "none",
              } as any)
            : undefined,
        ]}
      />
    </View>
  );
}
