import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";

import { Image, Platform, Pressable, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

// ==========================================================
// COMPONENTE
// ==========================================================

export default function AppHeader() {
  const router = useRouter();

  const { dark: isDarkMode } = useTheme();

  const { esEscritorio } = useResponsiveLayout();

  // ========================================================
  // TEMA
  // ========================================================

  const surfaceColor = useThemeColor({}, "surface");

  const borderColor = useThemeColor({}, "border");

  const primaryColor = useThemeColor({}, "primary");

  const textColor = useThemeColor({}, "text");

  // ========================================================
  // UI
  // ========================================================

  return (
    <View
      style={{
        width: "100%",

        height: esEscritorio ? 72 : 100,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: esEscritorio ? "flex-end" : "space-between",

        paddingHorizontal: esEscritorio ? 28 : 20,

        backgroundColor: surfaceColor,

        borderBottomWidth: 1,

        borderBottomColor: borderColor,

        ...Platform.select({
          web: {
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.03)",
          },
        }),
      }}
    >
      {/* ==================================================
          LOGO
          SOLO MÓVIL Y TABLET
      ================================================== */}

      {!esEscritorio && (
        <Image
          source={
            isDarkMode
              ? require("../../assets/images/splash-icon-ps.png")
              : require("../../assets/images/splash-icon.png")
          }
          resizeMode="contain"
          style={{
            width: 115,
            height: 65,
          }}
        />
      )}

      {/* ==================================================
          PERFIL
      ================================================== */}

      <Pressable
        onPress={() => router.push("/(tabs)/perfil")}
        style={({ pressed }) => ({
          width: 44,
          height: 44,

          borderRadius: 22,

          alignItems: "center",

          justifyContent: "center",

          borderWidth: 1,

          borderColor,

          backgroundColor: pressed ? borderColor : surfaceColor,

          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Ionicons
          name="person-outline"
          size={24}
          color={esEscritorio ? textColor : primaryColor}
        />
      </Pressable>
    </View>
  );
}
