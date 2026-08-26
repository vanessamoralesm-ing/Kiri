import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EntrevistaHeaderProps {
  onBack: () => void;
}

export default function EntrevistaHeader({ onBack }: EntrevistaHeaderProps) {
  return (
    <View style={styles.encabezado}>
      <Pressable
        onPress={onBack}
        hitSlop={10}
        style={({ pressed }) => [
          styles.botonRegresar,
          pressed && styles.botonPresionado,
        ]}
      >
        <Ionicons name="arrow-back" size={27} color="#135CE4" />
      </Pressable>

      <Image
        source={require("@/assets/images_kids/logo_horizontal.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  encabezado: { height: 64, flexDirection: "row", alignItems: "center" },
  botonRegresar: { width: 42, height: 42, justifyContent: "center", alignItems: "center", borderRadius: 21 },
  botonPresionado: { opacity: 0.7 },
  logo: { width: 100, height: 55, marginLeft: 3 },
});