import React from "react";

import {
  Text,
  View,
} from "react-native";

import {
  useThemeColor,
} from "@/hooks/use-theme-color";


export default function DiarioScreen() {

  const backgroundColor =
    useThemeColor(
      {},
      "background"
    );

  const textColor =
    useThemeColor(
      {},
      "text"
    );


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor,
      }}
    >
      <Text
        style={{
          fontFamily: "Nunito-Bold",
          fontSize: 18,
          color: textColor,
        }}
      >
        Modulo Diario
      </Text>
    </View>
  );
}