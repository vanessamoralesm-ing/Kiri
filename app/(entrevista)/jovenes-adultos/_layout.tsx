import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";

export default function JovenesAdultosLayout() {
  return (
    <View style={styles.pantalla}>
      <ImageBackground
        source={require("@/assets/images/fondo_kiri2.jpeg")}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />

      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
});